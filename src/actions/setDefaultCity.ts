/*
    *  -------------------------------------------------------------------  *
    *  -----  setDefaultCity.ts  --  /src/actions/setDefaultCity.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import type { AppData } from "../types/Settings.ts";
import { setDefault, saveData } from "../storage/settingsStorage.ts";
import { pause } from "../presentation/input.ts";
import { printDefaultCitySet } from "../presentation/output.ts";
import { promptCitySelection, requireSavedCitiesForDefault } from "./listCities.ts";


/**
 * ------------------------------------------
 * -----  `setDefaultCityAction(data)`  -----
 * ------------------------------------------
 * - Pide selección y establece la ciudad default.
 */

export const setDefaultCityAction = async (data: AppData): Promise<void> => {
    if (!requireSavedCitiesForDefault(data)) {
        return;
    }
    const city = promptCitySelection(data, "Selecciona una ciudad como default (número) o Enter para cancelar: ");
    if (city === null) {
        pause();
        return;
    }
    setDefault(data, city.id);
    saveData(data);
    printDefaultCitySet(city.name);
    pause();
};