/*
    *  -------------------------------------------------  *
    *  -----  colors.ts  --  /src/utils/colors.ts  -----  *
    *  -------------------------------------------------  *
*/

const RESET = "\x1b[0m";

const codes = {
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
} as const;

const isTTY = process.stdout.isTTY === true;
const noColor = process.env.NO_COLOR !== undefined;
const forceColor = process.env.FORCE_COLOR !== undefined;

export const colorsEnabled = (isTTY || forceColor) && !noColor;


/**
 * -----------------------------
 * -----  `wrap(open, s)`  -----
 * -----------------------------
 * - Envuelve el string con el código ANSI de apertura y el reset.
 */

const wrap = (open: string, s: string): string => {
  return colorsEnabled ? `${open}${s}${RESET}` : s;
};


export const cyan = (s: string): string => wrap(codes.cyan, s);
export const yellow = (s: string): string => wrap(codes.yellow, s);
export const green = (s: string): string => wrap(codes.green, s);
export const red = (s: string): string => wrap(codes.red, s);
export const bold = (s: string): string => wrap(codes.bold, s);
export const dim = (s: string): string => wrap(codes.dim, s);