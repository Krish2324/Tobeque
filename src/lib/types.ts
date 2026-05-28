export type ThemeMode = "dark" | "light";

export type ConsoleLineType = "system" | "input" | "error" | "success";

export interface ConsoleLine {
  text: string;
  type: ConsoleLineType;
}
