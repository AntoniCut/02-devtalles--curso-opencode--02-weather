import type { City, Unit, WeatherInfo, WeeklyForecast, DayForecast } from "./types.ts";
import { getForecast, getDailyForecast, weatherCodeDescription } from "./api/forecast.ts";
import { cyan, yellow, bold, dim } from "./colors.ts";

const SPANISH_DAYS = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
];

function dayNameFromDate(dateStr: string): string {
    const d = new Date(`${dateStr}T00:00:00`);
    const idx = d.getDay();
    const name = SPANISH_DAYS[idx];
    return name ?? dateStr;
}

function compactDate(dateStr: string): string {
    const d = new Date(`${dateStr}T00:00:00`);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function fetchWeatherInfo(
    city: City,
    unit: Unit,
): Promise<WeatherInfo | null> {
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
}

export function printWeather(info: WeatherInfo): void {
    const label = info.unit === "celsius" ? "°C" : "°F";
    const location = [info.city.name, info.city.admin1, info.city.country]
        .filter(Boolean)
        .join(", ");
    console.log("");
    console.log(cyan(`  Clima de: ${location}`));
    console.log(cyan(`   ${info.weatherDescription}`));
    console.log(`   Temperatura:  ${bold(yellow(`${info.temperature}${label}`))} (sensación ${bold(yellow(`${info.apparentTemperature}${label}`))})`);
    console.log(dim(`   Humedad:      ${info.humidity}%`));
    console.log(dim(`   Viento:       ${info.windSpeed} km/h`));
    console.log("");
}

export async function fetchWeeklyForecast(
    city: City,
    unit: Unit,
): Promise<WeeklyForecast | null> {
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
}

export function printWeeklyForecast(weekly: WeeklyForecast): void {
    const label = weekly.unit === "celsius" ? "°C" : "°F";
    const location = [weekly.city.name, weekly.city.admin1, weekly.city.country]
        .filter(Boolean)
        .join(", ");
    console.log("");
    console.log(cyan(`  Pronóstico 7 días: ${location}`));
    console.log(cyan(`  ${"Fecha".padEnd(12)}${"Día".padEnd(11)}${"Clima".padEnd(22)}${"Máx".padEnd(8)}${"Mín".padEnd(8)}${"Lluvia".padEnd(8)}Viento`));
    for (const day of weekly.days) {
        const fecha = compactDate(day.date).padEnd(12);
        const dia = day.dayName.padEnd(11);
        const clima = day.weatherDescription.padEnd(22);
        const mx = bold(yellow(`${day.tempMax}${label}`.padEnd(8)));
        const mn = dim(`${day.tempMin}${label}`.padEnd(8));
        const lluvia = (day.precipitationProbability !== null ? `${day.precipitationProbability}%` : "-").padEnd(8);
        const viento = day.windMax !== null ? `${day.windMax} km/h` : "-";
        console.log(`  ${fecha}${dia}${clima}${mx}${mn}${lluvia}${viento}`);
    }
    console.log("");
}