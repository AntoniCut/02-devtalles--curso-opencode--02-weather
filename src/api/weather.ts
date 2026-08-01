import type { DailyForecastResponse, ForecastResponse } from "../types/Weather.ts";
import type { Unit } from "../types/Settings.ts";
import { FORECAST_URL } from "../utils/constants.ts";

export async function getForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
): Promise<ForecastResponse | null> {
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
}

export async function getDailyForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
): Promise<DailyForecastResponse | null> {
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
}
