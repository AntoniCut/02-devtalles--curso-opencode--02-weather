/*
    *  -------------------------------------------------  *
    *  -----  format.ts  --  /src/utils/format.ts  -----  *
    *  -------------------------------------------------  *
*/


import type { City } from "../types/City.ts";
import type { Unit } from "../types/Settings.ts";

const SPANISH_DAYS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];


/**
 * ----------------------------------------
 * -----  `dayNameFromDate(dateStr)`  -----
 * ----------------------------------------
 * - Devuelve el nombre del día en español para la fecha dada.
 */

export const dayNameFromDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  const idx = d.getDay();
  const name = SPANISH_DAYS[idx];
  return name ?? dateStr;
};


/**
 * ------------------------------------
 * -----  `compactDate(dateStr)`  -----
 * ------------------------------------
 * - Formatea la fecha como dd/mm.
 */

export const compactDate = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};


/**
 * ------------------------------------
 * -----  `formatLocation(city)`  -----
 * ------------------------------------
 * - Concatena nombre, región y país de la ciudad.
 */

export const formatLocation = (city: City): string => {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
};


/**
 * --------------------------------
 * -----  `unitSymbol(unit)`  -----
 * --------------------------------
 * - Devuelve el símbolo de unidad (°C / °F).
 */

export const unitSymbol = (unit: Unit): string => {
  return unit === "celsius" ? "°C" : "°F";
};


/**
 * --------------------------------------------
 * -----  `weatherCodeDescription(code)`  -----
 * --------------------------------------------
 * - Traduce el código de clima de OpenMeteo a una descripción en español.
 */

export const weatherCodeDescription = (code: number): string => {
  const map: Record<number, string> = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    56: "Llovizna helada ligera",
    57: "Llovizna helada intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nieve ligera",
    73: "Nieve moderada",
    75: "Nieve intensa",
    77: "Granos de nieve",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos violentos",
    85: "Chubascos de nieve ligeros",
    86: "Chubascos de nieve intensos",
    95: "Tormenta",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo intenso",
  };
  return map[code] ?? "Desconocido";
};
