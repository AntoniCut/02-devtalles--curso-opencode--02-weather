/*
    *  ---------------------------------------------------------------------  *
    *  -----  getWeather.test.ts  --  /tests/actions/getWeather.test.ts  -----  *
    *  ---------------------------------------------------------------------  *
*/

import { afterEach, describe, expect, it, spyOn } from "bun:test";
import type { City } from "../../src/types/City.ts";

const ottawa: City = {
  id: "ottawa-45.41117--75.69812",
  name: "Ottawa",
  country: "Canadá",
  admin1: "Ontario",
  latitude: 45.41117,
  longitude: -75.69812,
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

afterEach(() => {
  //  -----  spyOn.restore() se llama por spy al final de cada it  -----
});

let mod: typeof import("../../src/actions/getWeather.ts");

describe("getWeather.ts — buildWeatherInfo(city, unit)", () => {
  it("maps the API response to a WeatherInfo", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        current: {
          temperature_2m: 20,
          relative_humidity_2m: 60,
          apparent_temperature: 22,
          weather_code: 1,
          wind_speed_10m: 10,
        },
      }) as Response,
    );
    mod = await import("../../src/actions/getWeather.ts");
    const info = await mod.buildWeatherInfo(ottawa, "celsius");
    expect(info).not.toBeNull();
    expect(info?.city).toEqual(ottawa);
    expect(info?.temperature).toBe(20);
    expect(info?.apparentTemperature).toBe(22);
    expect(info?.humidity).toBe(60);
    expect(info?.windSpeed).toBe(10);
    expect(info?.weatherCode).toBe(1);
    expect(info?.weatherDescription).toBe("Mayormente despejado");
    expect(info?.unit).toBe("celsius");
    spy.mockRestore();
  });

  it("returns null when the API returns null", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(null) as Response,
    );
    mod = await import("../../src/actions/getWeather.ts");
    const info = await mod.buildWeatherInfo(ottawa, "celsius");
    expect(info).toBeNull();
    spy.mockRestore();
  });

  it("returns null when the API returns no current block", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}) as Response);
    mod = await import("../../src/actions/getWeather.ts");
    const info = await mod.buildWeatherInfo(ottawa, "celsius");
    expect(info).toBeNull();
    spy.mockRestore();
  });
});

describe("getWeather.ts — buildWeeklyForecast(city, unit)", () => {
  it("zips parallel arrays into DayForecast rows with descriptions and day names", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        daily: {
          time: ["2026-08-01", "2026-08-02", "2026-08-03"],
          weather_code: [0, 3, 95],
          temperature_2m_max: [30, 28, 25],
          temperature_2m_min: [18, 17, 16],
          precipitation_probability_max: [10, 20, 80],
          wind_speed_10m_max: [5, 6, 12],
        },
      }) as Response,
    );
    mod = await import("../../src/actions/getWeather.ts");
    const weekly = await mod.buildWeeklyForecast(ottawa, "celsius");
    expect(weekly).not.toBeNull();
    expect(weekly?.days).toHaveLength(3);
    expect(weekly?.days[0]).toEqual({
      date: "2026-08-01",
      dayName: "sábado",
      weatherCode: 0,
      weatherDescription: "Despejado",
      tempMax: 30,
      tempMin: 18,
      precipitationProbability: 10,
      windMax: 5,
      unit: "celsius",
    });
    expect(weekly?.days[2]?.weatherDescription).toBe("Tormenta");
    spy.mockRestore();
  });

  it("returns null when the API returns null", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(null) as Response,
    );
    mod = await import("../../src/actions/getWeather.ts");
    const weekly = await mod.buildWeeklyForecast(ottawa, "celsius");
    expect(weekly).toBeNull();
    spy.mockRestore();
  });

  it("returns null when daily block is missing", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}) as Response);
    mod = await import("../../src/actions/getWeather.ts");
    const weekly = await mod.buildWeeklyForecast(ottawa, "celsius");
    expect(weekly).toBeNull();
    spy.mockRestore();
  });

  it("tolerates missing precipitation/wind arrays", async () => {
    const spy = spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        daily: {
          time: ["2026-08-01"],
          weather_code: [0],
          temperature_2m_max: [25],
          temperature_2m_min: [15],
        },
      }) as Response,
    );
    mod = await import("../../src/actions/getWeather.ts");
    const weekly = await mod.buildWeeklyForecast(ottawa, "celsius");
    expect(weekly?.days[0]?.precipitationProbability).toBeNull();
    expect(weekly?.days[0]?.windMax).toBeNull();
    spy.mockRestore();
  });
});
