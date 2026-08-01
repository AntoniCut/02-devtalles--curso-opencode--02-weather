import type { AppData } from "../types/Settings.ts";
import type { City } from "../types/City.ts";
import { searchCities } from "../api/geocoding.ts";
import { addCity, cityIdFromName } from "../storage/citiesStorage.ts";
import { saveData } from "../storage/settingsStorage.ts";
import { askQuestion, parseSelection, pause } from "../presentation/input.ts";
import {
  printCityAdded,
  printCityAlreadyExists,
  printGeocodingResults,
  printInvalidSelection,
  printInvalidSelectionOnly,
  printNoGeocodingResults,
  printOperationCancelled,
} from "../presentation/output.ts";

export async function addCityAction(data: AppData): Promise<void> {
  console.log("");
  const name = askQuestion("  Nombre de la ciudad: ");
  if (name.length === 0) {
    printOperationCancelled();
    pause();
    return;
  }
  const results = await searchCities(name);
  if (results.length === 0) {
    printNoGeocodingResults();
    pause();
    return;
  }
  printGeocodingResults(results);
  const sel = askQuestion("\n  Selecciona una ciudad (número) o Enter para cancelar: ");
  const idx = parseSelection(sel, results.length);
  if (idx === null) {
    printInvalidSelection();
    pause();
    return;
  }
  const r = results[idx];
  if (r === undefined) {
    printInvalidSelectionOnly();
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
    printCityAdded(city.name);
  } else {
    printCityAlreadyExists(city.name);
  }
  pause();
}
