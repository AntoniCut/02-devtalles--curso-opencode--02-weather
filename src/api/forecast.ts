import type { ForecastResponse, DailyForecastResponse, Unit } from "../types.ts";
import { red } from "../colors.ts";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function getForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
): Promise<ForecastResponse | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=${unit}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(red(`✗ Error de red (${res.status}). Intenta de nuevo.`));
      return null;
    }
    return (await res.json()) as ForecastResponse;
  } catch (err) {
    console.log(red("✗ No se pudo conectar con el servicio de pronóstico:"), err);
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
      console.log(red(`✗ Error de red (${res.status}). Intenta de nuevo.`));
      return null;
    }
    return (await res.json()) as DailyForecastResponse;
  } catch (err) {
    console.log(red("✗ No se pudo conectar con el servicio de pronóstico:"), err);
    return null;
  }
}

export function weatherCodeDescription(code: number): string {
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
}