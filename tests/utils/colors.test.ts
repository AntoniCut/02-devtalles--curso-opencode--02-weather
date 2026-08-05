/*
    *  -------------------------------------------------------------------  *
    *  -----  colors.test.ts  --  /tests/utils/colors.test.ts  -----  *
    *  -------------------------------------------------------------------  *
*/

import { describe, it, expect } from "bun:test";
import { bold, colorsEnabled, cyan, dim, green, red, yellow } from "../../src/utils/colors.ts";

describe("colors.ts", () => {
  describe("colorsEnabled flag", () => {
    it("is a boolean", () => {
      expect(typeof colorsEnabled).toBe("boolean");
    });
  });

  describe("color functions return the original text", () => {
    const text = "hello";

    it("cyan includes the text", () => {
      expect(cyan(text)).toContain(text);
    });

    it("yellow includes the text", () => {
      expect(yellow(text)).toContain(text);
    });

    it("green includes the text", () => {
      expect(green(text)).toContain(text);
    });

    it("red includes the text", () => {
      expect(red(text)).toContain(text);
    });

    it("bold includes the text", () => {
      expect(bold(text)).toContain(text);
    });

    it("dim includes the text", () => {
      expect(dim(text)).toContain(text);
    });
  });

  describe("ANSI behavior based on colorsEnabled", () => {
    const text = "hello";

    it("returns plain text when colors are disabled", () => {
      if (!colorsEnabled) {
        expect(cyan(text)).toBe(text);
        expect(yellow(text)).toBe(text);
        expect(green(text)).toBe(text);
        expect(red(text)).toBe(text);
        expect(bold(text)).toBe(text);
        expect(dim(text)).toBe(text);
      } else {
        expect(cyan(text)).not.toBe(text);
      }
    });

    it("wraps with ANSI escape codes when colors are enabled", () => {
      if (colorsEnabled) {
        expect(cyan(text)).toMatch(/\x1b\[36m/);
        expect(red(text)).toMatch(/\x1b\[31m/);
        expect(green(text)).toMatch(/\x1b\[32m/);
        expect(yellow(text)).toMatch(/\x1b\[33m/);
        expect(bold(text)).toMatch(/\x1b\[1m/);
        expect(dim(text)).toMatch(/\x1b\[2m/);
      }
    });
  });

  describe("combinations preserve text content", () => {
    it("bold(yellow(...)) still includes the text", () => {
      const out = bold(yellow("temp"));
      expect(out).toContain("temp");
    });
  });

  describe("empty strings", () => {
    it("cyan('') returns a string", () => {
      expect(typeof cyan("")).toBe("string");
    });

    it("red('') returns a string", () => {
      expect(typeof red("")).toBe("string");
    });
  });
});
