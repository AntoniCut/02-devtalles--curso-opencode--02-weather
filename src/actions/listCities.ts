import type { AppData } from "../types/Settings.ts";
import type { City } from "../types/City.ts";
import { findCityById } from "../storage/citiesStorage.ts";
import { askQuestion, parseSelection, pause } from "../presentation/input.ts";
import {
  printCityList,
  printInvalidSelection,
  printInvalidSelectionOnly,
  printNoSavedCities,
  printNoSavedCitiesShort,
  printYourCitiesHeader,
} from "../presentation/output.ts";

export function listCities(data: AppData): void {
  console.log("");
  if (data.cities.length === 0) {
    printNoSavedCitiesShort();
    return;
  }
  printYourCitiesHeader();
  printCityList(data);
}

export function promptCitySelection(
  data: AppData,
  prompt: string,
): City | null {
  printYourCitiesHeader();
  printCityList(data);
  const sel = askQuestion(`\n  ${prompt}`);
  const idx = parseSelection(sel, data.cities.length);
  if (idx === null) {
    printInvalidSelection();
    return null;
  }
  const city = data.cities[idx];
  if (city === undefined) {
    printInvalidSelectionOnly();
    return null;
  }
  return city;
}

export function requireSavedCities(data: AppData): boolean {
  if (data.cities.length === 0) {
    printNoSavedCities();
    pause();
    return false;
  }
  return true;
}

export function requireSavedCitiesForDefault(data: AppData): boolean {
  console.log("");
  if (data.cities.length === 0) {
    printNoSavedCities();
    pause();
    return false;
  }
  return true;
}

export function getDefaultCity(data: AppData): City | null {
  if (data.defaultCityId === null) {
    return null;
  }
  return findCityById(data, data.defaultCityId) ?? null;
}
