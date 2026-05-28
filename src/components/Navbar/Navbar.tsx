import type { ThemeMode } from "../../lib/types";

export function Navbar({
  theme,
  onToggleTheme,
}: {
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="nav-logo">
          <div className="nav-logo-icon">T</div>
          Tobeque Core
        </div>
        <div className="nav-actions">
          <span className="badge badge-indigo">Vite + React</span>
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
