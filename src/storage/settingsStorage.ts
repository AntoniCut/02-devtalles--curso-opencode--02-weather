/*
    *  ---------------------------------------------------------------------  *
    *  -----  settingsStorage.ts  --  /src/storage/settingsStorage.ts  -----  *
    *  ---------------------------------------------------------------------  *
*/


import type { AppData, Unit } from "../types/Settings.ts";
import type { City } from "../types/City.ts";
import { yellow, red } from "../utils/colors.ts";
import { homedir } from "node:os";
import { join } from "node:path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const getLegacyDataFile = (): string => join(homedir(), ".weather-cli", "data.json");

const getDataDir = (): string =>
  join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "weather-cli");

const getDataFile = (): string => join(getDataDir(), "data.json");


/**
 * ---------------------------------
 * -----  `parseAppData(raw)`  -----
 * ---------------------------------
 * - Parsea el JSON del archivo de datos hacia AppData con valores seguros por defecto.
 */

const parseAppData = (raw: string): AppData => {
  const parsed = JSON.parse(raw) as Partial<AppData>;
  return {
    defaultCityId: parsed.defaultCityId ?? null,
    cities: Array.isArray(parsed.cities) ? (parsed.cities as City[]) : [],
    unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
  };
};


/**
 * -----------------------------------
 * -----  `migrateLegacyData()`  -----
 * -----------------------------------
 * - Migra el archivo legacy ~/.weather-cli/data.json a la ruta XDG si hace falta.
 */

const migrateLegacyData = (): void => {
  if (existsSync(getDataFile()) || !existsSync(getLegacyDataFile())) {
    return;
  }
  try {
    if (!existsSync(getDataDir())) {
      mkdirSync(getDataDir(), { recursive: true });
    }
    const raw = readFileSync(getLegacyDataFile(), "utf-8");
    writeFileSync(getDataFile(), raw, "utf-8");
  } catch {
    //  -----  si falla la migración, loadData usará valores por defecto  -----
  }
};


/**
 * --------------------------------
 * -----  `getDefaultData()`  -----
 * --------------------------------
 * - Devuelve la estructura AppData vacía por defecto.
 */

export const getDefaultData = (): AppData => {
  return {
    defaultCityId: null,
    cities: [],
    unit: "celsius",
  };
};


/**
 * --------------------------
 * -----  `loadData()`  -----
 * --------------------------
 * - Carga los datos persistentes desde disco (con migración legacy).
 */

export const loadData = (): AppData => {
  migrateLegacyData();
  try {
    if (!existsSync(getDataFile())) {
      return getDefaultData();
    }
    const raw = readFileSync(getDataFile(), "utf-8");
    return parseAppData(raw);
  } catch {
    console.log(yellow("⚠ Aviso: no se pudo leer el archivo de datos. Se usarán valores por defecto."));
    return getDefaultData();
  }
};


/**
 * ------------------------------
 * -----  `saveData(data)`  -----
 * ------------------------------
 * - Persiste los datos en disco creando el directorio si no existe.
 */

export const saveData = (data: AppData): void => {
  try {
    if (!existsSync(getDataDir())) {
      mkdirSync(getDataDir(), { recursive: true });
    }
    writeFileSync(getDataFile(), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.log(red("⚠ Error al guardar los datos:"), err);
  }
};


/**
 * ------------------------------------
 * -----  `setDefault(data, id)`  -----
 * ------------------------------------
 * - Establece la ciudad default por id.
 */

export const setDefault = (data: AppData, id: string): void => {
  data.defaultCityId = id;
};


/**
 * --------------------------------
 * -----  `toggleUnit(data)`  -----
 * --------------------------------
 * - Alterna la unidad entre Celsius y Fahrenheit.
 */

export const toggleUnit = (data: AppData): void => {
  data.unit = data.unit === "celsius" ? "fahrenheit" : "celsius";
};


/**
 * -------------------------------
 * -----  `unitLabel(unit)`  -----
 * -------------------------------
 * - Devuelve la etiqueta legible de la unidad (°C / °F).
 */

export const unitLabel = (unit: Unit): string => {
  return unit === "celsius" ? "°C" : "°F";
};