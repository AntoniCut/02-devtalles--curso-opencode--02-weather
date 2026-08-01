import type { AppData } from "../types/Settings.ts";
import { pause } from "../presentation/input.ts";
import { printForecastFetchError, printNoSavedCities, printWeeklyForecast } from "../presentation/output.ts";
import { buildWeeklyForecast } from "./getWeather.ts";
import { promptCitySelection } from "./listCities.ts";

export async function getWeeklyForecastAction(data: AppData): Promise<void> {
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
}
