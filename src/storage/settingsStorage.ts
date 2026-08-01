import type { AppData, Unit } from "../types/Settings.ts";
import type { City } from "../types/City.ts";
import { yellow, red } from "../utils/colors.ts";
import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const LEGACY_DATA_FILE = join(homedir(), ".weather-cli", "data.json");
const DATA_DIR = join(
  process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"),
  "weather-cli",
);
const DATA_FILE = join(DATA_DIR, "data.json");

function parseAppData(raw: string): AppData {
  const parsed = JSON.parse(raw) as Partial<AppData>;
  return {
    defaultCityId: parsed.defaultCityId ?? null,
    cities: Array.isArray(parsed.cities) ? (parsed.cities as City[]) : [],
    unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
  };
}

function migrateLegacyData(): void {
  if (existsSync(DATA_FILE) || !existsSync(LEGACY_DATA_FILE)) {
    return;
  }
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    const raw = readFileSync(LEGACY_DATA_FILE, "utf-8");
    writeFileSync(DATA_FILE, raw, "utf-8");
  } catch {
    // Si falla la migración, loadData usará valores por defecto.
  }
}

export function getDefaultData(): AppData {
  return {
    defaultCityId: null,
    cities: [],
    unit: "celsius",
  };
}

export function loadData(): AppData {
  migrateLegacyData();
  try {
    if (!existsSync(DATA_FILE)) {
      return getDefaultData();
    }
    const raw = readFileSync(DATA_FILE, "utf-8");
    return parseAppData(raw);
  } catch {
    console.log(yellow("⚠ Aviso: no se pudo leer el archivo de datos. Se usarán valores por defecto."));
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
    console.log(red("⚠ Error al guardar los datos:"), err);
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
