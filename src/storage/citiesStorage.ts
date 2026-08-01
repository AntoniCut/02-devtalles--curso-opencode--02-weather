import type { AppData } from "../types/Settings.ts";
import type { City } from "../types/City.ts";

export function cityIdFromName(name: string, lat: number, lon: number): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `${slug}-${lat}-${lon}`;
}

export function findCityById(data: AppData, id: string): City | undefined {
  return data.cities.find((c) => c.id === id);
}

export function addCity(data: AppData, city: City): boolean {
  if (data.cities.some((c) => c.id === city.id)) {
    return false;
  }
  data.cities.push(city);
  return true;
}

export function removeCity(data: AppData, id: string): void {
  data.cities = data.cities.filter((c) => c.id !== id);
  if (data.defaultCityId === id) {
    data.defaultCityId = null;
  }
}
