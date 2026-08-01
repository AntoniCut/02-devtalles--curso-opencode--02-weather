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