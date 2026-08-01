import type { AppData } from "./Settings.ts";

export interface MenuOption {
  key: string;
  label: (data: AppData) => string;
  disabled?: boolean;
  isExit?: boolean;
  action?: (data: AppData) => Promise<void>;
}