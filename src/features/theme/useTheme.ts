import { useEffect, useState } from "react";

import type { ThemeMode } from "../../lib/types";

export function useTheme(initial: ThemeMode = "dark") {
  const [theme, setTheme] = useState<ThemeMode>(initial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
