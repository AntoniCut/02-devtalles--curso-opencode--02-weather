/*
    *  -------------------------------------------------------------------  *
    *  -----  toggleSettings.ts  --  /src/actions/toggleSettings.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import type { AppData } from "../types/Settings.ts";
import { toggleUnit, saveData, unitLabel } from "../storage/settingsStorage.ts";
import { pause } from "../presentation/input.ts";
import { printUnitChanged } from "../presentation/output.ts";


/**
 * ------------------------------------------
 * -----  `toggleSettingsAction(data)`  -----
 * ------------------------------------------
 * - Alterna la unidad de temperatura y la persiste.
 */

export const toggleSettingsAction = async (data: AppData): Promise<void> => {
    console.log("");
    toggleUnit(data);
    saveData(data);
    printUnitChanged(unitLabel(data.unit));
    pause();
};