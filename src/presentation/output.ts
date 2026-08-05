/*
    *  --------------------------------------------------------  *
    *  -----  output.ts  --  /src/presentation/output.ts  -----  *
    *  --------------------------------------------------------  *
*/


import type { AppData } from "../types/Settings.ts";
import type { WeatherInfo, WeeklyForecast } from "../types/Weather.ts";
import type { GeocodingResult } from "../types/Geocoding.ts";
import { cyan, bold, green, red, yellow, dim } from "../utils/colors.ts";
import { MENU_WIDTH } from "../utils/constants.ts";
import { compactDate, formatLocation, unitSymbol } from "../utils/format.ts";

const LINE = cyan("═".repeat(MENU_WIDTH));


/**
 * ------------------------------------------
 * -----  `printMenu(data, unitLabel)`  -----
 * ------------------------------------------
 * - Imprime el menú principal con la unidad actual.
 */

export const printMenu = (data: AppData, unitLabel: string): void => {
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
};


/**
 * -----------------------------------
 * -----  `printCityList(data)`  -----
 * -----------------------------------
 * - Imprime la lista de ciudades guardadas numeradas.
 */

export const printCityList = (data: AppData): void => {
  data.cities.forEach((c, i) => {
    const def = c.id === data.defaultCityId ? cyan(" (default)") : "";
    const parts = [c.name, c.admin1, c.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}${def}`);
  });
};


/**
 * ----------------------------------------------
 * -----  `printGeocodingResults(results)`  -----
 * ----------------------------------------------
 * - Imprime los resultados de búsqueda de ciudades numerados.
 */

export const printGeocodingResults = (results: GeocodingResult[]): void => {
  console.log(cyan("\nResultados encontrados:\n"));
  results.forEach((r, i) => {
    const parts = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    console.log(`  ${i + 1}. ${parts}`);
  });
};


/**
 * ----------------------------------
 * -----  `printWeather(info)`  -----
 * ----------------------------------
 * - Imprime el clima actual de una ciudad con colores.
 */

export const printWeather = (info: WeatherInfo): void => {
  const label = unitSymbol(info.unit);
  const location = formatLocation(info.city);
  console.log("");
  console.log(cyan(`  Clima de: ${location}`));
  console.log(cyan(`   ${info.weatherDescription}`));
  console.log(`   Temperatura:  ${bold(yellow(`${info.temperature}${label}`))} (sensación ${bold(yellow(`${info.apparentTemperature}${label}`))})`);
  console.log(dim(`   Humedad:      ${info.humidity}%`));
  console.log(dim(`   Viento:       ${info.windSpeed} km/h`));
  console.log("");
};


/**
 * -------------------------------------------
 * -----  `printWeeklyForecast(weekly)`  -----
 * -------------------------------------------
 * - Imprime la tabla de pronóstico de 7 días con colores.
 */

export const printWeeklyForecast = (weekly: WeeklyForecast): void => {
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
};


/**
 * ------------------------------------
 * -----  `printNoDefaultCity()`  -----
 * ------------------------------------
 * - Avisa que no hay ciudad default.
 */

export const printNoDefaultCity = (): void => {
  console.log(yellow("No hay ciudad default. Usa la opción 5 para establecer una."));
};

/**
 * -----------------------------------------
 * -----  `printDefaultCityMissing()`  -----
 * -----------------------------------------
 * - Avisa que la ciudad default no existe en la lista.
 */

export const printDefaultCityMissing = (): void => {
  console.log(yellow("La ciudad default no existe en tu lista. Establece una nueva con la opción 5."));
};


/**
 * ----------------------------------------
 * -----  `printWeatherFetchError()`  -----
 * ----------------------------------------
 * - Avisa que no se pudo obtener el clima.
 */
export const printWeatherFetchError = (): void => {
  console.log(red("No se pudo obtener el clima."));
};


/**
 * ----------------------------------------------------
 * -----  `printCityWeatherFetchError(cityName)`  -----
 * ----------------------------------------------------
 * - Avisa que no se pudo obtener el clima de una ciudad concreta.
 */

export const printCityWeatherFetchError = (cityName: string): void => {
  console.log(red(`No se pudo obtener el clima de ${cityName}.`));
};


/**
 * ------------------------------------
 * -----  `printNoSavedCities()`  -----
 * ------------------------------------
 * - Avisa que no hay ciudades y sugiere agregar una.
 */

export const printNoSavedCities = (): void => {
  console.log(yellow("No tienes ciudades guardadas. Usa la opción 3 para agregar una."));
};


/**
 * -----------------------------------------
 * -----  `printNoSavedCitiesShort()`  -----
 * -----------------------------------------
 * - Avisa que no hay ciudades guardadas.
 */

export const printNoSavedCitiesShort = (): void => {
  console.log(yellow("No tienes ciudades guardadas."));
};


/**
 * --------------------------------------
 * -----  `printAllCitiesHeader()`  -----
 * --------------------------------------
 * - Imprime la cabecera del clima de todas las ciudades.
 */

export const printAllCitiesHeader = (): void => {
  console.log(cyan("Clima de todas las ciudades:"));
};


/**
 * ---------------------------------------
 * -----  `printYourCitiesHeader()`  -----
 * ---------------------------------------
 * - Imprime la cabecera de la lista de tus ciudades.
 */

export const printYourCitiesHeader = (): void => {
  console.log(cyan("Tus ciudades:\n"));
};


/**
 * ---------------------------------------
 * -----  `printInvalidSelection()`  -----
 * ---------------------------------------
 * - Avisa selección inválida o cancelada.
 */

export const printInvalidSelection = (): void => {
  console.log(red("Selección inválida o cancelada."));
};


/**
 * -------------------------------------------
 * -----  `printInvalidSelectionOnly()`  -----
 * -------------------------------------------
 * - Avisa selección inválida.
 */

export const printInvalidSelectionOnly = (): void => {
  console.log(red("Selección inválida."));
};


/**
 * -----------------------------------------
 * -----  `printForecastFetchError()`  -----
 * -----------------------------------------
 * - Avisa que no se pudo obtener el pronóstico.
 */

export const printForecastFetchError = (): void => {
  console.log(red("No se pudo obtener el pronóstico."));
};


/**
 * -----------------------------------------
 * -----  `printOperationCancelled()`  -----
 * -----------------------------------------
 * - Avisa que la operación fue cancelada.
 */

export const printOperationCancelled = (): void => {
  console.log(dim("Operación cancelada."));
};


/**
 * -----------------------------------------
 * -----  `printNoGeocodingResults()`  -----
 * -----------------------------------------
 * - Avisa que no se encontraron ciudades.
 */

export const printNoGeocodingResults = (): void => {
  console.log(red("No se encontraron ciudades con ese nombre."));
};


/**
 * ----------------------------------------
 * -----  `printCityAdded(cityName)`  -----
 * ----------------------------------------
 * - Confirma que la ciudad fue agregada.
 */

export const printCityAdded = (cityName: string): void => {
  console.log(green(`Ciudad "${cityName}" agregada.`));
};


/**
 * ------------------------------------------------
 * -----  `printCityAlreadyExists(cityName)`  -----
 * ------------------------------------------------
 * - Avisa que la ciudad ya estaba en la lista.
 */

export const printCityAlreadyExists = (cityName: string): void => {
  console.log(yellow(`"${cityName}" ya está en tu lista.`));
};


/**
 * ------------------------------------------
 * -----  `printCityRemoved(cityName)`  -----
 * ------------------------------------------
 * - Confirma que la ciudad fue eliminada.
 */

export const printCityRemoved = (cityName: string): void => {
  console.log(green(`Ciudad "${cityName}" eliminada.`));
};


/**
 * ---------------------------------------------
 * -----  `printDefaultCitySet(cityName)`  -----
 * ---------------------------------------------
 * - Confirma que la ciudad es ahora la default.
 */

export const printDefaultCitySet = (cityName: string): void => {
  console.log(green(`"${cityName}" es ahora la ciudad default.`));
};


/**
 * -------------------------------------------
 * -----  `printUnitChanged(unitLabel)`  -----
 * -------------------------------------------
 * - Confirma el cambio de unidad.
 */

export const printUnitChanged = (unitLabel: string): void => {
  console.log(green(`Unidad cambiada a ${unitLabel}.`));
};


/**
 * ------------------------------------
 * -----  `printInvalidOption()`  -----
 * ------------------------------------
 * - Avisa opción no válida.
 */

export const printInvalidOption = (): void => {
  console.log(red("Opción no válida."));
};


/**
 * ------------------------------
 * -----  `printGoodbye()`  -----
 * ------------------------------
 * - Imprime el mensaje de despedida.
 */

export const printGoodbye = (): void => {
  console.log(cyan("¡Hasta pronto!"));
};


/**
 * ----------------------------------
 * -----  `printTtyRequired()`  -----
 * ----------------------------------
 * - Avisa que se requiere una terminal interactiva.
 */

export const printTtyRequired = (): void => {
  console.error(red("Esta aplicación es de consola y requiere una terminal interactiva."));
  console.error(red("Ejecútala desde una terminal:  ./out/weather"));
};


/**
 * -----------------------------------------
 * -----  `printNetworkError(status)`  -----
 * -----------------------------------------
 * - Avisa de error de red con el código HTTP.
 */

export const printNetworkError = (status: number): void => {
  console.log(red(`✗ Error de red (${status}). Intenta de nuevo.`));
};


/**
 * --------------------------------------------------
 * -----  `printGeocodingConnectionError(err)`  -----
 * --------------------------------------------------
 * - Avisa de fallo de conexión con el servicio de geocoding.
 */

export const printGeocodingConnectionError = (err: unknown): void => {
  console.log(red("✗ No se pudo conectar con el servicio de geocoding:"), err);
};


/**
 * -------------------------------------------------
 * -----  `printForecastConnectionError(err)`  -----
 * -------------------------------------------------
 * - Avisa de fallo de conexión con el servicio de pronóstico.
 */

export const printForecastConnectionError = (err: unknown): void => {
  console.log(red("✗ No se pudo conectar con el servicio de pronóstico:"), err);
};