/*
    *  -------------------------------------------------------------------  *
    *  -----  format.test.ts  --  /tests/utils/format.test.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import { describe, it, expect } from "bun:test";
import {
  compactDate,
  dayNameFromDate,
  formatLocation,
  unitSymbol,
  weatherCodeDescription,
} from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";

describe("format.ts", () => {
  describe("dayNameFromDate(dateStr)", () => {
    it("returns 'sábado' for 2026-08-01", () => {
      expect(dayNameFromDate("2026-08-01")).toBe("sábado");
    });

    it("returns 'domingo' for 2026-08-02", () => {
      expect(dayNameFromDate("2026-08-02")).toBe("domingo");
    });

    it("returns 'lunes' for 2026-08-03", () => {
      expect(dayNameFromDate("2026-08-03")).toBe("lunes");
    });

    it("returns 'miércoles' for 2026-08-05", () => {
      expect(dayNameFromDate("2026-08-05")).toBe("miércoles");
    });

    it("falls back to the date string for invalid dates", () => {
      const result = dayNameFromDate("not-a-date");
      expect(result).toBe("not-a-date");
    });
  });

  describe("compactDate(dateStr)", () => {
    it("formats as dd/mm with zero padding", () => {
      expect(compactDate("2026-08-05")).toBe("05/08");
    });

    it("formats correctly at year boundary", () => {
      expect(compactDate("2026-01-01")).toBe("01/01");
    });

    it("formats correctly at month boundary", () => {
      expect(compactDate("2026-12-31")).toBe("31/12");
    });
  });

  describe("formatLocation(city)", () => {
    const fullCity: City = {
      id: "ottawa-45.41--75.69",
      name: "Ottawa",
      country: "Canadá",
      admin1: "Ontario",
      latitude: 45.41117,
      longitude: -75.69812,
    };

    it("joins name, admin1 and country", () => {
      expect(formatLocation(fullCity)).toBe("Ottawa, Ontario, Canadá");
    });

    it("omits empty admin1 segment", () => {
      const city: City = { ...fullCity, admin1: "" };
      expect(formatLocation(city)).toBe("Ottawa, Canadá");
    });

    it("omits both empty admin1 and empty country", () => {
      const city: City = { ...fullCity, admin1: "", country: "" };
      expect(formatLocation(city)).toBe("Ottawa");
    });
  });

  describe("unitSymbol(unit)", () => {
    it("returns '°C' for celsius", () => {
      expect(unitSymbol("celsius")).toBe("°C");
    });

    it("returns '°F' for fahrenheit", () => {
      expect(unitSymbol("fahrenheit")).toBe("°F");
    });
  });

  describe("weatherCodeDescription(code)", () => {
    it("returns 'Despejado' for code 0", () => {
      expect(weatherCodeDescription(0)).toBe("Despejado");
    });

    it("returns 'Nublado' for code 3", () => {
      expect(weatherCodeDescription(3)).toBe("Nublado");
    });

    it("returns 'Lluvia moderada' for code 63", () => {
      expect(weatherCodeDescription(63)).toBe("Lluvia moderada");
    });

    it("returns 'Tormenta' for code 95", () => {
      expect(weatherCodeDescription(95)).toBe("Tormenta");
    });

    it("falls back to 'Desconocido' for unknown codes", () => {
      expect(weatherCodeDescription(9999)).toBe("Desconocido");
    });

    it("falls back to 'Desconocido' for negative codes", () => {
      expect(weatherCodeDescription(-1)).toBe("Desconocido");
    });
  });
});
