import type { AppData } from "../types/Settings.ts";
import type { WeatherInfo, WeeklyForecast } from "../types/Weather.ts";
import type { GeocodingResult } from "../types/Geocoding.ts";
import type { City } from "../types/City.ts";
import { cyan, bold, green, red, yellow, dim } from "../utils/colors.ts";
import { MENU_WIDTH } from "../utils/constants.ts";
import { compactDate, formatLocation, unitSymbol } from "../utils/format.ts";

const LINE = cyan("═".repeat(MENU_WIDTH));

export function printMenu(data: AppData, unitLabel: string): void {
  console.log(LINE);
  console.log(bold(cyan("         WEATHER CLI")));
  console.log(LINE);
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${data.cities.length})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  6. Pronóstico 7 días"));
  console.log(dim("  7. Not Found - Implementar en el futuro"));
  console.log(cyan(`  8. Ajustes (${unitLabel})`));
  console.log(cyan("  9. Salir"));
  console.log(LINE);
}

export function printCityList(data: AppData): void {
  data.cities.forEach((c, i) => {
    const def = c.id === data.defaultCityId ? cyan(" (default)") : "";
    const parts = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}${def}`);
  });
}

export function printGeocodingResults(results: GeocodingResult[]): void {
  console.log(cyan("\nResultados encontrados:\n"));
  results.forEach((r, i) => {
    const parts = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}`);
  });
}

export function printWeather(info: WeatherInfo): void {
  const label = unitSymbol(info.unit);
  const location = formatLocation(info.city);
  console.log("");
  console.log(cyan(`  Clima de: ${location}`));
  console.log(cyan(`   ${info.weatherDescription}`));
  console.log(`   Temperatura:  ${bold(yellow(`${info.temperature}${label}`))} (sensación ${bold(yellow(`${info.apparentTemperature}${label}`))})`);
  console.log(dim(`   Humedad:      ${info.humidity}%`));
  console.log(dim(`   Viento:       ${info.windSpeed} km/h`));
  console.log("");
}

export function printWeeklyForecast(weekly: WeeklyForecast): void {
  const label = unitSymbol(weekly.unit);
  const location = formatLocation(weekly.city);
  console.log("");
  console.log(cyan(`  Pronóstico 7 días: ${location}`));
  console.log(cyan(`  ${"Fecha".padEnd(12)}${"Día".padEnd(11)}${"Clima".padEnd(22)}${"Máx".padEnd(8)}${"Mín".padEnd(8)}${"Lluvia".padEnd(8)}Viento`));
  for (const day of weekly.days) {
    const fecha = compactDate(day.date).padEnd(12);
    const dia = day.dayName.padEnd(11);
    const clima = day.weatherDescription.padEnd(22);
    const mx = bold(yellow(`${day.tempMax}${label}`.padEnd(8)));
    const mn = dim(`${day.tempMin}${label}`.padEnd(8));
    const lluvia = (day.precipitationProbability !== null ? `${day.precipitationProbability}%` : "-").padEnd(8);
    const viento = day.windMax !== null ? `${day.windMax} km/h` : "-";
    console.log(`  ${fecha}${dia}${clima}${mx}${mn}${lluvia}${viento}`);
  }
  console.log("");
}

export function printNoDefaultCity(): void {
  console.log(yellow("No hay ciudad default. Usa la opción 5 para establecer una."));
}

export function printDefaultCityMissing(): void {
  console.log(yellow("La ciudad default no existe en tu lista. Establece una nueva con la opción 5."));
}

export function printWeatherFetchError(): void {
  console.log(red("No se pudo obtener el clima."));
}

export function printCityWeatherFetchError(cityName: string): void {
  console.log(red(`No se pudo obtener el clima de ${cityName}.`));
}

export function printNoSavedCities(): void {
  console.log(yellow("No tienes ciudades guardadas. Usa la opción 3 para agregar una."));
}

export function printNoSavedCitiesShort(): void {
  console.log(yellow("No tienes ciudades guardadas."));
}

export function printAllCitiesHeader(): void {
  console.log(cyan("Clima de todas las ciudades:"));
}

export function printYourCitiesHeader(): void {
  console.log(cyan("Tus ciudades:\n"));
}

export function printInvalidSelection(): void {
  console.log(red("Selección inválida o cancelada."));
}

export function printInvalidSelectionOnly(): void {
  console.log(red("Selección inválida."));
}

export function printForecastFetchError(): void {
  console.log(red("No se pudo obtener el pronóstico."));
}

export function printOperationCancelled(): void {
  console.log(dim("Operación cancelada."));
}

export function printNoGeocodingResults(): void {
  console.log(red("No se encontraron ciudades con ese nombre."));
}

export function printCityAdded(cityName: string): void {
  console.log(green(`Ciudad "${cityName}" agregada.`));
}

export function printCityAlreadyExists(cityName: string): void {
  console.log(yellow(`"${cityName}" ya está en tu lista.`));
}

export function printCityRemoved(cityName: string): void {
  console.log(green(`Ciudad "${cityName}" eliminada.`));
}

export function printDefaultCitySet(cityName: string): void {
  console.log(green(`"${cityName}" es ahora la ciudad default.`));
}

export function printUnitChanged(unitLabel: string): void {
  console.log(green(`Unidad cambiada a ${unitLabel}.`));
}

export function printInvalidOption(): void {
  console.log(red("Opción no válida."));
}

export function printGoodbye(): void {
  console.log(cyan("¡Hasta pronto!"));
}

export function printTtyRequired(): void {
  console.error(red("Esta aplicación es de consola y requiere una terminal interactiva."));
  console.error(red("Ejecútala desde una terminal:  ./out/weather"));
}

export function printNetworkError(status: number): void {
  console.log(red(`✗ Error de red (${status}). Intenta de nuevo.`));
}

export function printGeocodingConnectionError(err: unknown): void {
  console.log(red("✗ No se pudo conectar con el servicio de geocoding:"), err);
}

export function printForecastConnectionError(err: unknown): void {
  console.log(red("✗ No se pudo conectar con el servicio de pronóstico:"), err);
}
