/*
    *  -------------------------------------------------------------------------  *
    *  -----  getWeeklyForecast.ts  --  /src/actions/getWeeklyForecast.ts  -----  *
    *  -------------------------------------------------------------------------  *
*/

import type { AppData } from "../types/Settings.ts";
import { pause } from "../presentation/input.ts";
import { printForecastFetchError, printNoSavedCities, printWeeklyForecast } from "../presentation/output.ts";
import { buildWeeklyForecast } from "./getWeather.ts";
import { promptCitySelection } from "./listCities.ts";

/**
 * ---------------------------------------------
 * -----  `getWeeklyForecastAction(data)`  -----
 * ---------------------------------------------
 * - Pide selección y muestra el pronóstico de 7 días de una ciudad.
 */

export const getWeeklyForecastAction = async (data: AppData): Promise<void> => {
  console.log("");
  if (data.cities.length === 0) {
    printNoSavedCities();
    pause();
    return;
  }
  const city = promptCitySelection(data, "Selecciona una ciudad (número) o Enter para cancelar: ");
  if (city === null) {
    pause();
    return;
  }
  const weekly = await buildWeeklyForecast(city, data.unit);
  if (weekly === null) {
    printForecastFetchError();
  } else {
    printWeeklyForecast(weekly);
  }
  pause();
};