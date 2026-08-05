/*
    *  -----------------------------------------------------------------  *
    *  -----  citiesStorage.test.ts  --  /tests/storage/citiesStorage.test.ts  -----  *
    *  -----------------------------------------------------------------  *
*/

import { beforeEach, describe, expect, it } from "bun:test";
import {
  addCity,
  cityIdFromName,
  findCityById,
  removeCity,
} from "../../src/storage/citiesStorage.ts";
import type { City } from "../../src/types/City.ts";
import { getDefaultData } from "../../src/storage/settingsStorage.ts";

const makeCity = (over: Partial<City> = {}): City => ({
  id: "test-1-0-0",
  name: "Test City",
  country: "Testland",
  admin1: "Testregion",
  latitude: 1,
  longitude: 0,
  ...over,
});

describe("citiesStorage.ts", () => {
  describe("cityIdFromName(name, lat, lon)", () => {
    it("lowercases the name and joins with coordinates", () => {
      expect(cityIdFromName("Ottawa", 45.41117, -75.69812)).toBe("ottawa-45.41117--75.69812");
    });

    it("replaces spaces with dashes", () => {
      expect(cityIdFromName("New York", 40.7, -74)).toBe("new-york-40.7--74");
    });

    it("handles single-word names", () => {
      expect(cityIdFromName("Tokyo", 35.68, 139.69)).toBe("tokyo-35.68-139.69");
    });
  });

  describe("findCityById(data, id)", () => {
    it("returns the city when present", () => {
      const data = getDefaultData();
      const city = makeCity({ id: "abc" });
      data.cities.push(city);
      expect(findCityById(data, "abc")).toEqual(city);
    });

    it("returns undefined when not present", () => {
      const data = getDefaultData();
      expect(findCityById(data, "missing")).toBeUndefined();
    });
  });

  describe("addCity(data, city)", () => {
    let data = getDefaultData();
    beforeEach(() => {
      data = getDefaultData();
    });

    it("appends a new city and returns true", () => {
      const ok = addCity(data, makeCity({ id: "new" }));
      expect(ok).toBe(true);
      expect(data.cities).toHaveLength(1);
      expect(data.cities[0]?.id).toBe("new");
    });

    it("returns false and does not duplicate when id exists", () => {
      data.cities.push(makeCity({ id: "dup" }));
      const ok = addCity(data, makeCity({ id: "dup" }));
      expect(ok).toBe(false);
      expect(data.cities).toHaveLength(1);
    });
  });

  describe("removeCity(data, id)", () => {
    let data = getDefaultData();
    beforeEach(() => {
      data = getDefaultData();
    });

    it("removes the matching city", () => {
      data.cities.push(makeCity({ id: "a" }));
      data.cities.push(makeCity({ id: "b" }));
      removeCity(data, "a");
      expect(data.cities).toHaveLength(1);
      expect(data.cities[0]?.id).toBe("b");
    });

    it("clears defaultCityId when the removed city was the default", () => {
      data.cities.push(makeCity({ id: "a" }));
      data.defaultCityId = "a";
      removeCity(data, "a");
      expect(data.defaultCityId).toBeNull();
    });

    it("keeps defaultCityId when removing a non-default city", () => {
      data.cities.push(makeCity({ id: "a" }));
      data.cities.push(makeCity({ id: "b" }));
      data.defaultCityId = "a";
      removeCity(data, "b");
      expect(data.defaultCityId).toBe("a");
    });

    it("is a no-op when id does not exist", () => {
      data.cities.push(makeCity({ id: "a" }));
      data.defaultCityId = "a";
      removeCity(data, "missing");
      expect(data.cities).toHaveLength(1);
      expect(data.defaultCityId).toBe("a");
    });
  });
});
