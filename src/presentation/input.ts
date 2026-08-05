/*
    *  ------------------------------------------------------  *
    *  -----  input.ts  --  /src/presentation/input.ts  -----  *
    *  ------------------------------------------------------  *
*/


/**
 * ---------------------------------------
 * -----  `askQuestion(promptText)`  -----
 * ---------------------------------------
 * - Lee una línea del usuario y la devuelve recortada (vacía si EOF).
 */

export const askQuestion = (promptText: string): string => {
    const answer = prompt(promptText);
    return answer === null ? "" : answer.trim();
};


/**
 * -----------------------
 * -----  `pause()`  -----
 * -----------------------
 * - Espera a que el usuario pulse Enter para continuar.
 */

export const pause = (): void => {
    prompt("  Presiona Enter para continuar...");
};


/**
 * ----------------------------
 * -----  `closeInput()`  -----
 * ----------------------------
 * - No-op: el prompt global de Bun no necesita cierre.
 */

export const closeInput = (): void => {
    //  -----  no-op  -----
};


/**
 * ----------------------------------------
 * -----  `parseSelection(raw, max)`  -----
 * ----------------------------------------
 * - Convierte la entrada del usuario en índice 0-based válido o null.
 */

export const parseSelection = (raw: string, max: number): number | null => {
    const n = Number(raw);
    if (!Number.isInteger(n)) return null;
    const idx = n - 1;
    if (idx < 0 || idx >= max) return null;
    return idx;
};