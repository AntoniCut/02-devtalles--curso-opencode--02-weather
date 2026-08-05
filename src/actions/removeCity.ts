/*
    *  -----------------------------------------------------------  *
    *  -----  removeCity.ts  --  /src/actions/removeCity.ts  -----  *
    *  -----------------------------------------------------------  *
*/

import type { AppData } from "../types/Settings.ts";
import { removeCity } from "../storage/citiesStorage.ts";
import { saveData } from "../storage/settingsStorage.ts";
import { pause } from "../presentation/input.ts";
import { printCityRemoved, printNoSavedCitiesShort } from "../presentation/output.ts";
import { promptCitySelection } from "./listCities.ts";


/**
 * --------------------------------------
 * -----  `removeCityAction(data)`  -----
 * --------------------------------------
 * - Pide selección y elimina una ciudad de la lista.
 */

export const removeCityAction = async (data: AppData): Promise<void> => {
    console.log("");
    if (data.cities.length === 0) {
        printNoSavedCitiesShort();
        pause();
        return;
    }
    const city = promptCitySelection(data, "Selecciona una ciudad para eliminar (número) o Enter para cancelar: ");
    if (city === null) {
        pause();
        return;
    }
    removeCity(data, city.id);
    saveData(data);
    printCityRemoved(city.name);
    pause();
};