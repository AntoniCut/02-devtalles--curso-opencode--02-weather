/*
    *  ---------------------------------------------------------------  *
    *  -----  input.test.ts  --  /tests/presentation/input.test.ts  -----  *
    *  ---------------------------------------------------------------  *
*/

import { describe, expect, it } from "bun:test";
import { parseSelection } from "../../src/presentation/input.ts";

describe("parseSelection(raw, max)", () => {
  it("returns the 0-based index for a valid 1-based selection", () => {
    expect(parseSelection("1", 5)).toBe(0);
    expect(parseSelection("3", 5)).toBe(2);
    expect(parseSelection("5", 5)).toBe(4);
  });

  it("returns null for an empty string", () => {
    expect(parseSelection("", 5)).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(parseSelection("abc", 5)).toBeNull();
  });

  it("returns null for numbers out of range", () => {
    expect(parseSelection("0", 5)).toBeNull();
    expect(parseSelection("6", 5)).toBeNull();
    expect(parseSelection("100", 5)).toBeNull();
  });

  it("returns null for negative numbers", () => {
    expect(parseSelection("-1", 5)).toBeNull();
  });

  it("returns null for floats", () => {
    expect(parseSelection("1.5", 5)).toBeNull();
  });

  it("returns null when max is 0 and the only valid input is none", () => {
    expect(parseSelection("1", 0)).toBeNull();
  });
});
