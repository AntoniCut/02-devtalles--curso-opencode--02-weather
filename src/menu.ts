import type { AppData, City } from "./types.ts";
import {
  loadData,
  saveData,
  addCity,
  removeCity,
  setDefault,
  toggleUnit,
  findCityById,
  cityIdFromName,
  unitLabel,
} from "./storage/store.ts";
import { searchCities } from "./api/geocoding.ts";
import { fetchWeatherInfo, printWeather } from "./weather.ts";
import { askQuestion, pause, closeInput } from "./input.ts";
import { cyan, bold, green, red, yellow, dim } from "./colors.ts";

const LINE = cyan("═".repeat(41));

function printMenu(data: AppData): void {
  console.log(LINE);
  console.log(bold(cyan("         WEATHER CLI")));
  console.log(LINE);
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${data.cities.length})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(dim("  6. Not Found - Implementar en el futuro"));
  console.log(dim("  7. Not Found - Implementar en el futuro"));
  console.log(cyan(`  8. Ajustes (${unitLabel(data.unit)})`));
  console.log(cyan("  9. Salir"));
  console.log(LINE);
}

function printCityList(data: AppData): void {
  data.cities.forEach((c, i) => {
    const def = c.id === data.defaultCityId ? cyan(" (default)") : "";
    const parts = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}${def}`);
  });
}

function parseSelection(raw: string, max: number): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n)) return null;
  const idx = n - 1;
  if (idx < 0 || idx >= max) return null;
  return idx;
}

async function optionDefault(data: AppData): Promise<void> {
  console.log("");
  if (data.defaultCityId === null) {
    console.log(yellow("No hay ciudad default. Usa la opción 5 para establecer una."));
    pause();
    return;
  }
  const city = findCityById(data, data.defaultCityId);
  if (city === undefined) {
    console.log(yellow("La ciudad default no existe en tu lista. Establece una nueva con la opción 5."));
    pause();
    return;
  }
  const info = await fetchWeatherInfo(city, data.unit);
  if (info === null) {
    console.log(red("No se pudo obtener el clima."));
  } else {
    printWeather(info);
  }
  pause();
}

async function optionAll(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log(yellow("No tienes ciudades guardadas. Usa la opción 3 para agregar una."));
    pause();
    return;
  }
  console.log(cyan("Clima de todas las ciudades:"));
  for (const city of data.cities) {
    const info = await fetchWeatherInfo(city, data.unit);
    if (info === null) {
      console.log(red(`No se pudo obtener el clima de ${city.name}.`));
    } else {
      printWeather(info);
    }
  }
  pause();
}

async function optionSearchAndAdd(data: AppData): Promise<void> {
  console.log("");
  const name = askQuestion("  Nombre de la ciudad: ");
  if (name.length === 0) {
    console.log(dim("Operación cancelada."));
    pause();
    return;
  }
  const results = await searchCities(name);
  if (results.length === 0) {
    console.log(red("No se encontraron ciudades con ese nombre."));
    pause();
    return;
  }
  console.log(cyan("\nResultados encontrados:\n"));
  results.forEach((r, i) => {
    const parts = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}`);
  });
  const sel = askQuestion("\n  Selecciona una ciudad (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, results.length);
  if (idx === null) {
    console.log(red("Selección inválida o cancelada."));
    pause();
    return;
  }
  const r = results[idx];
  if (r === undefined) {
    console.log(red("Selección inválida."));
    pause();
    return;
  }
  const city: City = {
    id: cityIdFromName(r.name, r.latitude, r.longitude),
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  };
  const added = addCity(data, city);
  if (added) {
    saveData(data);
    console.log(green(`Ciudad "${city.name}" agregada.`));
  } else {
    console.log(yellow(`"${city.name}" ya está en tu lista.`));
  }
  pause();
}

async function optionRemove(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log(yellow("No tienes ciudades guardadas."));
    pause();
    return;
  }
  console.log(cyan("Tus ciudades:\n"));
  printCityList(data);
  const sel = askQuestion("\n  Selecciona una ciudad para eliminar (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, data.cities.length);
  if (idx === null) {
    console.log(red("Selección inválida o cancelada."));
    pause();
    return;
  }
  const city = data.cities[idx];
  if (city === undefined) {
    console.log(red("Selección inválida."));
    pause();
    return;
  }
  removeCity(data, city.id);
  saveData(data);
  console.log(green(`Ciudad "${city.name}" eliminada.`));
  pause();
}

async function optionSetDefault(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log(yellow("No tienes ciudades guardadas. Usa la opción 3 para agregar una."));
    pause();
    return;
  }
  console.log(cyan("Tus ciudades:\n"));
  printCityList(data);
  const sel = askQuestion("\n  Selecciona una ciudad como default (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, data.cities.length);
  if (idx === null) {
    console.log(red("Selección inválida o cancelada."));
    pause();
    return;
  }
  const city = data.cities[idx];
  if (city === undefined) {
    console.log(red("Selección inválida."));
    pause();
    return;
  }
  setDefault(data, city.id);
  saveData(data);
  console.log(green(`"${city.name}" es ahora la ciudad default.`));
  pause();
}

async function optionSettings(data: AppData): Promise<void> {
  console.log("");
  toggleUnit(data);
  saveData(data);
  console.log(green(`Unidad cambiada a ${unitLabel(data.unit)}.`));
  pause();
}

export async function runMenu(): Promise<void> {
  if (!process.stdin.isTTY) {
    console.error(red("Esta aplicación es de consola y requiere una terminal interactiva."));
    console.error(red("Ejecútala desde una terminal:  ./out/weather"));
    process.exit(1);
  }
  const data = loadData();
  let running = true;
  while (running) {
    console.clear();
    printMenu(data);
    const choice = askQuestion("  Selecciona una opción: ");
    switch (choice) {
      case "1":
        await optionDefault(data);
        break;
      case "2":
        await optionAll(data);
        break;
      case "3":
        await optionSearchAndAdd(data);
        break;
      case "4":
        await optionRemove(data);
        break;
      case "5":
        await optionSetDefault(data);
        break;
      case "8":
        await optionSettings(data);
        break;
      case "9":
        running = false;
        console.log(cyan("¡Hasta pronto!"));
        break;
      default:
        console.log(red("Opción no válida."));
        pause();
        break;
    }
  }
  closeInput();
}