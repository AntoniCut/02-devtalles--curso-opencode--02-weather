/*
    *  -------------------------------------------------------------------------  *
    *  -----  settingsStorage.test.ts  --  /tests/storage/settingsStorage.test.ts  -----  *
    *  -------------------------------------------------------------------------  *
*/

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppData } from "../../src/types/Settings.ts";

let tmpDir: string;
let dataFile: string;
let mod: typeof import("../../src/storage/settingsStorage.ts");

beforeAll(async () => {
  tmpDir = mkdtempSync(join(tmpdir(), "weather-cli-test-"));
  process.env.XDG_CONFIG_HOME = tmpDir;
  dataFile = join(tmpDir, "weather-cli", "data.json");
  mod = await import("../../src/storage/settingsStorage.ts");
});

beforeEach(() => {
  //  -----  garantiza archivo limpio antes de cada test  -----
  if (existsSync(dataFile)) {
    rmSync(dataFile);
  }
});

afterEach(() => {
  if (existsSync(dataFile)) {
    rmSync(dataFile);
  }
});

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
  delete process.env.XDG_CONFIG_HOME;
});

const makeData = (over: Partial<AppData> = {}): AppData => ({
  defaultCityId: null,
  cities: [],
  unit: "celsius",
  ...over,
});

describe.serial("settingsStorage.ts (isolated XDG_CONFIG_HOME)", () => {
  describe("getDefaultData()", () => {
    it("returns an empty AppData with celsius unit", () => {
      const data = mod.getDefaultData();
      expect(data).toEqual({
        defaultCityId: null,
        cities: [],
        unit: "celsius",
      });
    });

    it("returns a fresh object on each call", () => {
      const a = mod.getDefaultData();
      const b = mod.getDefaultData();
      expect(a).not.toBe(b);
      a.cities.push({} as never);
      expect(b.cities).toHaveLength(0);
    });
  });

  describe("setDefault(data, id)", () => {
    it("updates defaultCityId", () => {
      const data = makeData();
      mod.setDefault(data, "city-1");
      expect(data.defaultCityId).toBe("city-1");
    });
  });

  describe("toggleUnit(data)", () => {
    it("switches celsius to fahrenheit", () => {
      const data = makeData({ unit: "celsius" });
      mod.toggleUnit(data);
      expect(data.unit).toBe("fahrenheit");
    });

    it("switches fahrenheit to celsius", () => {
      const data = makeData({ unit: "fahrenheit" });
      mod.toggleUnit(data);
      expect(data.unit).toBe("celsius");
    });
  });

  describe("unitLabel(unit)", () => {
    it("returns '°C' for celsius", () => {
      expect(mod.unitLabel("celsius")).toBe("°C");
    });

    it("returns '°F' for fahrenheit", () => {
      expect(mod.unitLabel("fahrenheit")).toBe("°F");
    });
  });

  describe("saveData(data) and loadData()", () => {
    it("writes to the XDG path and reads it back", () => {
      const data = makeData({
        defaultCityId: "ottawa-1-0",
        cities: [
          {
            id: "ottawa-1-0",
            name: "Ottawa",
            country: "Canadá",
            admin1: "Ontario",
            latitude: 1,
            longitude: 0,
          },
        ],
        unit: "fahrenheit",
      });

      mod.saveData(data);
      const loaded = mod.loadData();
      expect(loaded).toEqual(data);
    });

    it("writes valid JSON", () => {
      const data = makeData({ defaultCityId: "x" });
      mod.saveData(data);
      const raw = readFileSync(dataFile, "utf-8");
      expect(() => JSON.parse(raw)).not.toThrow();
    });

    it("falls back to defaults when the file is corrupt", () => {
      writeFileSync(dataFile, "{not valid json", "utf-8");
      const loaded = mod.loadData();
      expect(loaded).toEqual({
        defaultCityId: null,
        cities: [],
        unit: "celsius",
      });
    });

    it("returns defaults when the file does not exist", () => {
      const loaded = mod.loadData();
      expect(loaded).toEqual({
        defaultCityId: null,
        cities: [],
        unit: "celsius",
      });
    });
  });
});
