import { useMemo, useRef, useState } from "react";

import type { ConsoleLine, ConsoleLineType, ThemeMode } from "../../lib/types";
import {
  runConsoleCommand,
  type ConsoleCommandContext,
} from "./consoleCommands";

const initialHistory: ConsoleLine[] = [
  { text: "Tobeque Core OS [Version 1.0.0]", type: "system" },
  {
    text: "System initialized successfully. All systems nominal.",
    type: "success",
  },
  {
    text: 'Type "help" to see a list of available CLI commands.',
    type: "system",
  },
];

export type UseConsoleParams = {
  theme: ThemeMode;
  packages: number;
  clicks: number;
  systemLoad: number;
  onThemeRequested: () => void;
  onAddPkgRequested: () => void;
};

export function useConsole({
  theme,
  packages,
  clicks,
  systemLoad,
  onThemeRequested,
  onAddPkgRequested,
}: UseConsoleParams) {
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleHistory, setConsoleHistory] =
    useState<ConsoleLine[]>(initialHistory);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const ctx: ConsoleCommandContext = useMemo(
    () => ({ packages, clicks, systemLoad, theme }),
    [packages, clicks, systemLoad, theme],
  );

  const clear = () => {
    setConsoleHistory([]);
    setConsoleInput("");
  };

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const raw = consoleInput;
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    const nextLines: ConsoleLine[] = [
      ...consoleHistory,
      { text: `> ${raw}`, type: "input" as ConsoleLineType },
    ];

    if (cmd === "theme") {
      onThemeRequested();
      setConsoleHistory([
        ...nextLines,
        { text: "Theme successfully toggled.", type: "success" },
      ]);
      setConsoleInput("");
      return;
    }

    if (cmd === "add-pkg") {
      onAddPkgRequested();
      setConsoleHistory([
        ...nextLines,
        { text: "Package successfully registered.", type: "success" },
      ]);
      setConsoleInput("");
      return;
    }

    const result = runConsoleCommand(cmd, nextLines, ctx, raw);
    if ("kind" in result && result.kind === "clear") {
      clear();
      return;
    }

    if ("updatedLines" in result) {
      setConsoleHistory(result.updatedLines);
      setConsoleInput("");
    }
  };

  return {
    consoleInput,
    setConsoleInput,
    consoleHistory,
    consoleEndRef,
    handleConsoleSubmit,
    clear,
  };
}
