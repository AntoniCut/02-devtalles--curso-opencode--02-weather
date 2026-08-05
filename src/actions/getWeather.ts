/*
    *  -----------------------------------------------------------  *
    *  -----  getWeather.ts  --  /src/actions/getWeather.ts  -----  *
    *  -----------------------------------------------------------  *
*/

import type { AppData } from "../types/Settings.ts";
import type { WeatherInfo, DayForecast, WeeklyForecast } from "../types/Weather.ts";
import type { City } from "../types/City.ts";
import { getForecast, getDailyForecast } from "../api/weather.ts";
import { dayNameFromDate, weatherCodeDescription } from "../utils/format.ts";
import { pause } from "../presentation/input.ts";
import {
    printAllCitiesHeader,
    printDefaultCityMissing,
    printNoDefaultCity,
    printNoSavedCities,
    printWeather,
    printWeatherFetchError,
    printCityWeatherFetchError,
} from "../presentation/output.ts";
import { getDefaultCity, requireSavedCities } from "./listCities.ts";

/**
 * --------------------------------------------
 * -----  `buildWeatherInfo(city, unit)`  -----
 * --------------------------------------------
 * - Obtiene el clima actual y construye el WeatherInfo de una ciudad.
 */
export const buildWeatherInfo = async (
    city: City,
    unit: AppData["unit"],
): Promise<WeatherInfo | null> => {
    const data = await getForecast(city.latitude, city.longitude, unit);
    if (data === null || data.current === undefined) {
        return null;
    }
    const current = data.current;
    return {
        city,
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        weatherDescription: weatherCodeDescription(current.weather_code),
        unit,
    };
};

/**
 * -------------------------------------------
 * -----  `getDefaultCityWeather(data)`  -----
 * -------------------------------------------
 * - Muestra el clima de la ciudad default guardada.
 */
export const getDefaultCityWeather = async (data: AppData): Promise<void> => {
    console.log("");
    if (data.defaultCityId === null) {
        printNoDefaultCity();
        pause();
        return;
    }
    const city = getDefaultCity(data);
    if (city === null) {
        printDefaultCityMissing();
        pause();
        return;
    }
    const info = await buildWeatherInfo(city, data.unit);
    if (info === null) {
        printWeatherFetchError();
    } else {
        printWeather(info);
    }
    pause();
};

/**
 * -----------------------------------------
 * -----  `getAllCitiesWeather(data)`  -----
 * -----------------------------------------
 * - Muestra el clima de todas las ciudades guardadas.
 */
export const getAllCitiesWeather = async (data: AppData): Promise<void> => {
    console.log("");
    if (data.cities.length === 0) {
        printNoSavedCities();
        pause();
        return;
    }
    printAllCitiesHeader();
    for (const city of data.cities) {
        const info = await buildWeatherInfo(city, data.unit);
        if (info === null) {
            printCityWeatherFetchError(city.name);
        } else {
            printWeather(info);
        }
    }
    pause();
};

/**
 * -----------------------------------------------
 * -----  `buildWeeklyForecast(city, unit)`  -----
 * -----------------------------------------------
 * - Obtiene y construye el pronóstico semanal de una ciudad.
 */
export const buildWeeklyForecast = async (
    city: City,
    unit: AppData["unit"],
): Promise<WeeklyForecast | null> => {
    const data = await getDailyForecast(city.latitude, city.longitude, unit);
    if (data === null || data.daily === undefined) {
        return null;
    }
    const daily = data.daily;
    const days: DayForecast[] = [];
    for (let i = 0; i < daily.time.length; i++) {
        const date = daily.time[i];
        const code = daily.weather_code[i];
        const max = daily.temperature_2m_max[i];
        const min = daily.temperature_2m_min[i];
        const precip = daily.precipitation_probability_max?.[i];
        const wind = daily.wind_speed_10m_max?.[i];
        if (date === undefined || code === undefined || max === undefined || min === undefined) {
            continue;
        }
        days.push({
            date,
            dayName: dayNameFromDate(date),
            weatherCode: code,
            weatherDescription: weatherCodeDescription(code),
            tempMax: max,
            tempMin: min,
            precipitationProbability: precip ?? null,
            windMax: wind ?? null,
            unit,
        });
    }
    return { city, days, unit };
};