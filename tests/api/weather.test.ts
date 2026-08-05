/*
    *  -------------------------------------------------------------------  *
    *  -----  weather.test.ts  --  /tests/api/weather.test.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { getDailyForecast, getForecast } from "../../src/api/weather.ts";

const jsonResponse = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const okForecast = {
    current: {
        temperature_2m: 21.3,
        relative_humidity_2m: 55,
        apparent_temperature: 22.1,
        weather_code: 1,
        wind_speed_10m: 12.5,
    },
};

const okDaily = {
    daily: {
        time: ["2026-08-01", "2026-08-02"],
        weather_code: [0, 3],
        temperature_2m_max: [25, 27],
        temperature_2m_min: [15, 17],
        precipitation_probability_max: [10, 20],
        wind_speed_10m_max: [5, 6],
    },
};

afterEach(() => {
    //  -----  restaura el fetch real después de cada test  -----
});

describe("weather.ts — getForecast(lat, lon, unit)", () => {
    it("returns the parsed response on success", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okForecast) as Response);
        const data = await getForecast(45.41117, -75.69812, "celsius");
        expect(data).not.toBeNull();
        expect(data?.current?.temperature_2m).toBe(21.3);
        spy.mockRestore();
    });

    it("returns null on non-ok HTTP status", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 503) as Response);
        const data = await getForecast(45.41117, -75.69812, "celsius");
        expect(data).toBeNull();

        spy.mockRestore();
    });

    it("returns null when fetch throws", async () => {
        const spy = spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        const data = await getForecast(45.41117, -75.69812, "celsius");
        expect(data).toBeNull();
        spy.mockRestore();
    });

    it("includes temperature_unit in the query", async () => {
        let calledUrl = "";
        const spy = spyOn(globalThis, "fetch").mockImplementation(((url: string | URL | Request) => {
            calledUrl = String(url);
            return Promise.resolve(jsonResponse(okForecast) as Response);
        }) as typeof fetch);
        await getForecast(45.41117, -75.69812, "fahrenheit");
        expect(calledUrl).toContain("temperature_unit=fahrenheit");
        expect(calledUrl).toContain("api.open-meteo.com/v1/forecast");
        spy.mockRestore();
    });
});

describe("weather.ts — getDailyForecast(lat, lon, unit)", () => {
    it("returns the parsed daily response on success", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okDaily) as Response);
        const data = await getDailyForecast(45.41117, -75.69812, "celsius");
        expect(data).not.toBeNull();
        expect(data?.daily?.time).toHaveLength(2);
        expect(data?.daily?.temperature_2m_max?.[0]).toBe(25);
        spy.mockRestore();
    });

    it("returns null on non-ok HTTP status", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 500) as Response);
        const data = await getDailyForecast(45.41117, -75.69812, "celsius");
        expect(data).toBeNull();
        spy.mockRestore();
    });

    it("returns null when fetch throws", async () => {
        const spy = spyOn(globalThis, "fetch").mockRejectedValue(new Error("timeout"));
        const data = await getDailyForecast(45.41117, -75.69812, "celsius");
        expect(data).toBeNull();
        spy.mockRestore();
    });

    it("requests 7 days and timezone=auto", async () => {
        let calledUrl = "";
        const spy = spyOn(globalThis, "fetch").mockImplementation(((url: string | URL | Request) => {
            calledUrl = String(url);
            return Promise.resolve(jsonResponse(okDaily) as Response);
        }) as typeof fetch);
        await getDailyForecast(45.41117, -75.69812, "celsius");
        expect(calledUrl).toContain("forecast_days=7");
        expect(calledUrl).toContain("timezone=auto");
        expect(calledUrl).toContain("daily=weather_code");
        spy.mockRestore();
    });
});
