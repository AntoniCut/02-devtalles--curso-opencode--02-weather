import type { City } from "./City.ts";
import type { Unit } from "./Settings.ts";

export interface ForecastCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface ForecastResponse {
  current?: ForecastCurrent;
  error?: boolean;
  reason?: string;
}

export interface ForecastDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
}

export interface DailyForecastResponse {
  daily?: ForecastDaily;
  error?: boolean;
  reason?: string;
}

export interface WeatherInfo {
  city: City;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  unit: Unit;
}

export interface DayForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number | null;
  windMax: number | null;
  unit: Unit;
}

export interface WeeklyForecast {
  city: City;
  days: DayForecast[];
  unit: Unit;
}