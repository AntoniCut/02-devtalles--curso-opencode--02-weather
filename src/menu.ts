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

const LINE = "═".repeat(41);

function printMenu(data: AppData): void {
  console.log(LINE);
  console.log("         WEATHER CLI");
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${data.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitLabel(data.unit)})`);
  console.log("  9. Salir");
  console.log(LINE);
}

function printCityList(data: AppData): void {
  data.cities.forEach((c, i) => {
    const def = c.id === data.defaultCityId ? " (default)" : "";
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
    console.log("No hay ciudad default. Usa la opción 5 para establecer una.");
    await pause();
    return;
  }
  const city = findCityById(data, data.defaultCityId);
  if (city === undefined) {
    console.log("La ciudad default no existe en tu lista. Establece una nueva con la opción 5.");
    await pause();
    return;
  }
  const info = await fetchWeatherInfo(city, data.unit);
  if (info === null) {
    console.log("No se pudo obtener el clima.");
  } else {
    printWeather(info);
  }
  await pause();
}

async function optionAll(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log("No tienes ciudades guardadas. Usa la opción 3 para agregar una.");
    await pause();
    return;
  }
  console.log("Clima de todas las ciudades:");
  for (const city of data.cities) {
    const info = await fetchWeatherInfo(city, data.unit);
    if (info === null) {
      console.log(`No se pudo obtener el clima de ${city.name}.`);
    } else {
      printWeather(info);
    }
  }
  await pause();
}

async function optionSearchAndAdd(data: AppData): Promise<void> {
  console.log("");
  const name = await askQuestion("  Nombre de la ciudad: ");
  if (name.length === 0) {
    console.log("Operación cancelada.");
    await pause();
    return;
  }
  const results = await searchCities(name);
  if (results.length === 0) {
    console.log("No se encontraron ciudades con ese nombre.");
    await pause();
    return;
  }
  console.log("\nResultados encontrados:\n");
  results.forEach((r, i) => {
    const parts = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}`);
  });
  const sel = await askQuestion("\n  Selecciona una ciudad (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, results.length);
  if (idx === null) {
    console.log("Selección inválida o cancelada.");
    await pause();
    return;
  }
  const r = results[idx];
  if (r === undefined) {
    console.log("Selección inválida.");
    await pause();
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
    console.log(`Ciudad "${city.name}" agregada.`);
  } else {
    console.log(`"${city.name}" ya está en tu lista.`);
  }
  await pause();
}

async function optionRemove(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log("No tienes ciudades guardadas.");
    await pause();
    return;
  }
  console.log("Tus ciudades:\n");
  printCityList(data);
  const sel = await askQuestion("\n  Selecciona una ciudad para eliminar (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, data.cities.length);
  if (idx === null) {
    console.log("Selección inválida o cancelada.");
    await pause();
    return;
  }
  const city = data.cities[idx];
  if (city === undefined) {
    console.log("Selección inválida.");
    await pause();
    return;
  }
  removeCity(data, city.id);
  saveData(data);
  console.log(`Ciudad "${city.name}" eliminada.`);
  await pause();
}

async function optionSetDefault(data: AppData): Promise<void> {
  console.log("");
  if (data.cities.length === 0) {
    console.log("No tienes ciudades guardadas. Usa la opción 3 para agregar una.");
    await pause();
    return;
  }
  console.log("Tus ciudades:\n");
  printCityList(data);
  const sel = await askQuestion("\n  Selecciona una ciudad como default (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, data.cities.length);
  if (idx === null) {
    console.log("Selección inválida o cancelada.");
    await pause();
    return;
  }
  const city = data.cities[idx];
  if (city === undefined) {
    console.log("Selección inválida.");
    await pause();
    return;
  }
  setDefault(data, city.id);
  saveData(data);
  console.log(`"${city.name}" es ahora la ciudad default.`);
  await pause();
}

async function optionSettings(data: AppData): Promise<void> {
  console.log("");
  toggleUnit(data);
  saveData(data);
  console.log(`Unidad cambiada a ${unitLabel(data.unit)}.`);
  await pause();
}

export async function runMenu(): Promise<void> {
  const data = loadData();
  let running = true;
  while (running) {
    console.clear();
    printMenu(data);
    const choice = await askQuestion("  Selecciona una opción: ");
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
        console.log("¡Hasta pronto!");
        break;
      default:
        console.log("Opción no válida.");
        await pause();
        break;
    }
  }
  closeInput();
}