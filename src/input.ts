import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

let rl: ReturnType<typeof readline.createInterface> | null = null;

function getInterface(): ReturnType<typeof readline.createInterface> {
  if (rl === null) {
    rl = readline.createInterface({ input, output });
  }
  return rl;
}

export async function askQuestion(prompt: string): Promise<string> {
  const iface = getInterface();
  const answer = await iface.question(prompt);
  return answer.trim();
}

export async function pause(): Promise<void> {
  await askQuestion("  Presiona Enter para continuar...");
}

export function closeInput(): void {
  if (rl !== null) {
    rl.close();
    rl = null;
  }
}