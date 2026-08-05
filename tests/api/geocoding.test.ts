/*
    *  -------------------------------------------------------------------  *
    *  -----  geocoding.test.ts  --  /tests/api/geocoding.test.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import { describe, expect, it, spyOn } from "bun:test";
import { searchCities } from "../../src/api/geocoding.ts";

const jsonResponse = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

const okGeocoding = {
    results: [
        {
            id: 1,
            name: "Ottawa",
            latitude: 45.41117,
            longitude: -75.69812,
            country: "Canadá",
            admin1: "Ontario",
        },
    ],
};

describe("geocoding.ts — searchCities(name)", () => {
    it("returns the results array on a successful response", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okGeocoding) as Response);
        const results = await searchCities("Ottawa");
        expect(results).toHaveLength(1);
        expect(results[0]?.name).toBe("Ottawa");
        expect(results[0]?.country).toBe("Canadá");
        spy.mockRestore();
    });

    it("returns an empty array when the response is not ok", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 500) as Response);
        const results = await searchCities("Ottawa");
        expect(results).toEqual([]);
        spy.mockRestore();
    });

    it("returns an empty array when the API returns an error envelope", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(
            jsonResponse({ error: true, reason: "bad request" }) as Response,
        );
        const results = await searchCities("Ottawa");
        expect(results).toEqual([]);
        spy.mockRestore();
    });

    it("returns an empty array when results is missing", async () => {
        const spy = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}) as Response);
        const results = await searchCities("Ottawa");
        expect(results).toEqual([]);
        spy.mockRestore();
    });

    it("returns an empty array when fetch throws", async () => {
        const spy = spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
        const results = await searchCities("Ottawa");
        expect(results).toEqual([]);
        spy.mockRestore();
    });

    it("calls the geocoding URL with the expected query parameters", async () => {
        let calledUrl = "";
        const spy = spyOn(globalThis, "fetch").mockImplementation(((url: string | URL | Request) => {
            calledUrl = String(url);
            return Promise.resolve(jsonResponse(okGeocoding) as Response);
        }) as typeof fetch);
        await searchCities("Ottawa");
        expect(calledUrl).toContain("geocoding-api.open-meteo.com/v1/search");
        expect(calledUrl).toContain("name=Ottawa");
        expect(calledUrl).toContain("count=5");
        expect(calledUrl).toContain("language=es");
        expect(calledUrl).toContain("format=json");
        spy.mockRestore();
    });

    it("URL-encodes the search name", async () => {
        let calledUrl = "";
        const spy = spyOn(globalThis, "fetch").mockImplementation(((url: string | URL | Request) => {
            calledUrl = String(url);
            return Promise.resolve(jsonResponse(okGeocoding) as Response);
        }) as typeof fetch);
        await searchCities("New York");
        expect(calledUrl).toContain("name=New%20York");
        spy.mockRestore();
    });
});
