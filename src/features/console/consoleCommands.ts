import type { ConsoleLine, ThemeMode } from "../../lib/types";

export type ConsoleCommandContext = {
  packages: number;
  clicks: number;
  systemLoad: number;
  theme: ThemeMode;
};

export type ConsoleCommandResult = {
  updatedLines: ConsoleLine[];
};

export function runConsoleCommand(
  cmd: string,
  currentLines: ConsoleLine[],
  ctx: ConsoleCommandContext,
  rawInput: string,
): ConsoleCommandResult | { kind: "clear" } {
  switch (cmd) {
    case "help":
      return {
        updatedLines: [
          ...currentLines,
          { text: "Available commands:", type: "system" },
          {
            text: "  help       - Display this list of options",
            type: "system",
          },
          {
            text: "  about      - Learn about the Tobeque dashboard setup",
            type: "system",
          },
          {
            text: "  stats      - Display live project telemetry data",
            type: "system",
          },
          {
            text: "  theme      - Toggle between Dark and Light mode",
            type: "system",
          },
          {
            text: "  add-pkg    - Mock installing a new npm library",
            type: "system",
          },
          {
            text: "  build      - Run a simulated project build test",
            type: "system",
          },
          {
            text: "  clear      - Clear the console terminal screen",
            type: "system",
          },
        ],
      };

    case "about":
      return {
        updatedLines: [
          ...currentLines,
          {
            text: "Tobeque Core UI: Built using React 18, Vite 6, and TypeScript.",
            type: "success",
          },
          {
            text: "Styling: Pure, high-end Vanilla CSS with custom HSL layout variables.",
            type: "system",
          },
          {
            text: 'Location: Loaded dynamically from active workspace "a:\\Dixit_work\\Tobeque".',
            type: "system",
          },
        ],
      };

    case "stats":
      return {
        updatedLines: [
          ...currentLines,
          { text: `Telemetry Data:`, type: "system" },
          {
            text: `  - Total Installed Packages: ${ctx.packages}`,
            type: "success",
          },
          { text: `  - Interactive Clicks: ${ctx.clicks}`, type: "success" },
          {
            text: `  - Simulated CPU Load: ${ctx.systemLoad}%`,
            type: "success",
          },
          {
            text: `  - Current Visual Theme: ${ctx.theme.toUpperCase()}`,
            type: "success",
          },
        ],
      };

    case "theme":
      // actual theme switching is handled by the caller
      return {
        updatedLines: [
          ...currentLines,
          { text: "Theme toggle requested. (UI will update)", type: "system" },
        ],
      };

    case "add-pkg":
      // actual packages increment is handled by the caller
      return {
        updatedLines: [
          ...currentLines,
          {
            text: "Package installation requested. (UI will update)",
            type: "system",
          },
        ],
      };

    case "build":
      return {
        updatedLines: [
          ...currentLines,
          { text: "Launching production bundle optimizer...", type: "system" },
          { text: "✓ 15 files transformed.", type: "success" },
          { text: "✓ tsconfig compilation verified.", type: "success" },
          { text: "✓ dist/assets/index.js generated.", type: "success" },
          { text: "Build completed successfully in 348ms!", type: "success" },
        ],
      };

    case "clear":
      return { kind: "clear" };

    default:
      return {
        updatedLines: [
          ...currentLines,
          {
            text: `Command "${rawInput}" not recognized. Type "help" for valid commands.`,
            type: "error",
          },
        ],
      };
  }
}
