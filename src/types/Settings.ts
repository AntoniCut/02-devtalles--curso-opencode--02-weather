/*
    *  -----------------------------------------------------  *
    *  -----  Settings.ts  --  /src/types/Settings.ts  -----  *
    *  -----------------------------------------------------  *
*/

import type { City } from "./City.ts";

export type Unit = "celsius" | "fahrenheit";

export interface AppData {
  defaultCityId: string | null;
  cities: City[];
  unit: Unit;
}