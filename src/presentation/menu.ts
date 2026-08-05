/*
    *  ----------------------------------------------------  *
    *  -----  menu.ts  --  /src/presentation/menu.ts  -----  *
    *  ----------------------------------------------------  *
*/


import type { AppData } from "../types/Settings.ts";
import { loadData, unitLabel } from "../storage/settingsStorage.ts";
import { askQuestion, closeInput, pause } from "./input.ts";

import {
    printGoodbye,
    printInvalidOption,
    printMenu,
    printTtyRequired,
} from "./output.ts";

import { getDefaultCityWeather, getAllCitiesWeather } from "../actions/getWeather.ts";
import { getWeeklyForecastAction } from "../actions/getWeeklyForecast.ts";
import { addCityAction } from "../actions/addCity.ts";
import { removeCityAction } from "../actions/removeCity.ts";
import { setDefaultCityAction } from "../actions/setDefaultCity.ts";
import { toggleSettingsAction } from "../actions/toggleSettings.ts";


/**
 * -------------------------
 * -----  `runMenu()`  -----
 * -------------------------
 * - Bucle principal del menú de la CLI.
 */

export const runMenu = async (): Promise<void> => {
    if (!process.stdin.isTTY) {
        printTtyRequired();
        process.exit(1);
    }
    const data = loadData();
    let running = true;
    while (running) {
        console.clear();
        printMenu(data, unitLabel(data.unit));
        const choice = askQuestion("  Selecciona una opción: ");
        switch (choice) {
            case "1":
                await getDefaultCityWeather(data);
                break;
            case "2":
                await getAllCitiesWeather(data);
                break;
            case "3":
                await addCityAction(data);
                break;
            case "4":
                await removeCityAction(data);
                break;
            case "5":
                await setDefaultCityAction(data);
                break;
            case "6":
                await getWeeklyForecastAction(data);
                break;
            case "8":
                await toggleSettingsAction(data);
                break;
            case "9":
                running = false;
                printGoodbye();
                break;
            default:
                printInvalidOption();
                pause();
                break;
        }
    }
    closeInput();
};