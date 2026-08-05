/*
    *  -------------------------------------------------  *
    *  -----  weather.ts  --  /src/api/weather.ts  -----  *
    *  -------------------------------------------------  *
*/

import type { DailyForecastResponse, ForecastResponse } from "../types/Weather.ts";
import type { Unit } from "../types/Settings.ts";
import { FORECAST_URL } from "../utils/constants.ts";


/**
 * ------------------------------------------------------
 * -----  `getForecast(latitude, longitude, unit)`  -----
 * ------------------------------------------------------
 * - Obtiene el clima actual de una coordenada con la unidad indicada.
 */

export const getForecast = async (
    latitude: number,
    longitude: number,
    unit: Unit,
): Promise<ForecastResponse | null> => {
    const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=${unit}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return null;
        }
        return (await res.json()) as ForecastResponse;
    } catch {
        return null;
    }
};


/**
 * -----------------------------------------------------------
 * -----  `getDailyForecast(latitude, longitude, unit)`  -----
 * -----------------------------------------------------------
 * - Obtiene el pronóstico diario de 7 días para una coordenada.
 */
export const getDailyForecast = async (
    latitude: number,
    longitude: number,
    unit: Unit,
): Promise<DailyForecastResponse | null> => {
    const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&forecast_days=7&temperature_unit=${unit}&timezone=auto`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return null;
        }
        return (await res.json()) as DailyForecastResponse;
    } catch {
        return null;
    }
};