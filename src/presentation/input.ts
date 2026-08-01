export function askQuestion(promptText: string): string {
  const answer = prompt(promptText);
  return answer === null ? "" : answer.trim();
}

export function pause(): void {
  prompt("  Presiona Enter para continuar...");
}

export function closeInput(): void {
  // Bun's global prompt() needs no teardown.
}

export function parseSelection(raw: string, max: number): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n)) return null;
  const idx = n - 1;
  if (idx < 0 || idx >= max) return null;
  return idx;
}
