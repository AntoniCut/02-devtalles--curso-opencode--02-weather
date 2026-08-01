const NO_COLOR = process.env.NO_COLOR !== undefined;
const FORCE_COLOR = process.env.FORCE_COLOR !== undefined;
const isTTY = process.stdout.isTTY === true;
export const colorEnabled = FORCE_COLOR || (isTTY && !NO_COLOR);

const RESET = "\x1b[0m";

function wrap(code: string, str: string): string {
  if (!colorEnabled) return str;
  return `${code}${str}${RESET}`;
}

export function cyan(str: string): string {
  return wrap("\x1b[36m", str);
}

export function yellow(str: string): string {
  return wrap("\x1b[33m", str);
}

export function green(str: string): string {
  return wrap("\x1b[32m", str);
}

export function red(str: string): string {
  return wrap("\x1b[31m", str);
}

export function dim(str: string): string {
  return wrap("\x1b[2m", str);
}

export function bold(str: string): string {
  return wrap("\x1b[1m", str);
}