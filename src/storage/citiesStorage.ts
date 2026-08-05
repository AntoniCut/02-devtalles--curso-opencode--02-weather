/*
    *  -----------------------------------------------------------------  *
    *  -----  citiesStorage.ts  --  /src/storage/citiesStorage.ts  -----  *
    *  -----------------------------------------------------------------  *
*/


import type { AppData } from "../types/Settings.ts";
import type { City } from "../types/City.ts";


/**
 * ----------------------------------------------
 * -----  `cityIdFromName(name, lat, lon)`  -----
 * ----------------------------------------------
 * - Construye un id determinista para una ciudad a partir del nombre y coordenadas.
 */

export const cityIdFromName = (name: string, lat: number, lon: number): string => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `${slug}-${lat}-${lon}`;
};


/**
 * --------------------------------------
 * -----  `findCityById(data, id)`  -----
 * --------------------------------------
 * - Busca una ciudad guardada por su id.
 */

export const findCityById = (data: AppData, id: string): City | undefined => {
  return data.cities.find((c) => c.id === id);
};


/**
 * -----------------------------------
 * -----  `addCity(data, city)`  -----
 * -----------------------------------
 * - Agrega una ciudad si no existe previamente; devuelve false si ya estaba.
 */

export const addCity = (data: AppData, city: City): boolean => {
  if (data.cities.some((c) => c.id === city.id)) {
    return false;
  }
  data.cities.push(city);
  return true;
};


/**
 * ------------------------------------
 * -----  `removeCity(data, id)`  -----
 * ------------------------------------
 * - Elimina una ciudad por id y limpia la default si era esa.
 */

export const removeCity = (data: AppData, id: string): void => {
  data.cities = data.cities.filter((c) => c.id !== id);
  if (data.defaultCityId === id) {
    data.defaultCityId = null;
  }
};
