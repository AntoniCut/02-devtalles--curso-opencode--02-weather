import type { City, Unit, WeatherInfo } from "./types.ts";
import { getForecast, weatherCodeDescription } from "./api/forecast.ts";
import { cyan, yellow, bold, dim } from "./colors.ts";

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