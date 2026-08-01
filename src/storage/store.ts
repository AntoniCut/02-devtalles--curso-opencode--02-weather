import type { AppData, City, Unit } from "../types.ts";
import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const DATA_DIR = join(homedir(), ".weather-cli");
const DATA_FILE = join(DATA_DIR, "data.json");

export function getDefaultData(): AppData {
  return {
    defaultCityId: null,
    cities: [],
    unit: "celsius",
  };
}

export function loadData(): AppData {
  try {
    if (!existsSync(DATA_FILE)) {
      return getDefaultData();
    }
    const raw = readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      defaultCityId: parsed.defaultCityId ?? null,
      cities: Array.isArray(parsed.cities) ? (parsed.cities as City[]) : [],
      unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    console.log("⚠ Aviso: no se pudo leer el archivo de datos. Se usarán valores por defecto.");
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.log("⚠ Error al guardar los datos:", err);
  }
}

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

export function setDefault(data: AppData, id: string): void {
  data.defaultCityId = id;
}

export function toggleUnit(data: AppData): void {
  data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
}

export function unitLabel(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}