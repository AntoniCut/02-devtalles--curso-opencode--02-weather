export interface City {
  id: string;
  name: string;
  country: string;
  admin1: string;
  latitude: number;
  longitude: number;
}

export type Unit = "celsius" | "fahrenheit";

export interface AppData {
  defaultCityId: string | null;
  cities: City[];
  unit: Unit;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  error?: boolean;
  reason?: string;
}

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