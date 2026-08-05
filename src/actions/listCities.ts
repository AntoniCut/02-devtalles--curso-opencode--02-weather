/*
    *  -----------------------------------------------------------  *
    *  -----  listCities.ts  --  /src/actions/listCities.ts  -----  *
    *  -----------------------------------------------------------  *
*/

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


/**
 * --------------------------------
 * -----  `listCities(data)`  -----
 * --------------------------------
 * - Lista las ciudades guardadas o avisa si no hay.
 */

export const listCities = (data: AppData): void => {
    console.log("");
    if (data.cities.length === 0) {
        printNoSavedCitiesShort();
        return;
    }
    printYourCitiesHeader();
    printCityList(data);
};


/**
 * -----------------------------------------------------
 * -----  `promptCitySelection(data, promptText)`  -----
 * -----------------------------------------------------
 * - Muestra la lista y pide al usuario que seleccione una ciudad.
 */

export const promptCitySelection = (
    data: AppData,
    promptText: string,
): City | null => {
    printYourCitiesHeader();
    printCityList(data);
    const sel = askQuestion(`\n  ${promptText}`);
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
};

/**
 * ----------------------------------------
 * -----  `requireSavedCities(data)`  -----
 * ----------------------------------------
 * - Comprueba que hay ciudades guardadas (sin encabezado).
 */
export const requireSavedCities = (data: AppData): boolean => {
    if (data.cities.length === 0) {
        printNoSavedCities();
        pause();
        return false;
    }
    return true;
};

/**
 * --------------------------------------------------
 * -----  `requireSavedCitiesForDefault(data)`  -----
 * --------------------------------------------------
 * - Comprueba que hay ciudades guardadas (con encabezado).
 */
export const requireSavedCitiesForDefault = (data: AppData): boolean => {
    console.log("");
    if (data.cities.length === 0) {
        printNoSavedCities();
        pause();
        return false;
    }
    return true;
};

/**
 * ------------------------------------
 * -----  `getDefaultCity(data)`  -----
 * ------------------------------------
 * - Devuelve la ciudad default o null si no hay.
 */
export const getDefaultCity = (data: AppData): City | null => {
    if (data.defaultCityId === null) {
        return null;
    }
    return findCityById(data, data.defaultCityId) ?? null;
};