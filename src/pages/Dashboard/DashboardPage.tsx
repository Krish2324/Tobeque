import { useEffect, useState } from "react";

import { useTheme } from "../../features/theme/useTheme";
import { useConsole } from "../../features/console/useConsole";
import { Navbar } from "../../components/Navbar/Navbar";
import { StatsRow } from "../../components/StatsRow/StatsRow";
import { ConsoleTerminal } from "../../components/ConsoleTerminal/ConsoleTerminal";
import { ShowcaseGrid } from "../../components/ShowcaseGrid/ShowcaseGrid";
import { Footer } from "../../components/Footer/Footer";

export function DashboardPage() {
  const { theme, toggleTheme } = useTheme("dark");

  const [packages, setPackages] = useState(152);
  const [clicks, setClicks] = useState(0);
  const [systemLoad, setSystemLoad] = useState(12);

  const {
    consoleInput,
    setConsoleInput,
    consoleHistory,
    consoleEndRef,
    handleConsoleSubmit,
  } = useConsole({
    theme,
    packages,
    clicks,
    systemLoad,
    onThemeRequested: toggleTheme,
    onAddPkgRequested: () => setPackages((p) => p + 1),
  });

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleHistory, consoleEndRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(5, Math.min(35, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMetricClick = () => {
    setClicks((c) => c + 1);
  };

  return (
    <div className="app-wrapper">
      <div className="glow-bg-indigo"></div>
      <div className="glow-bg-teal"></div>

      <Navbar />

      <main className="container">
        <div className="dashboard-grid">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <section className="glass-panel welcome-card">
              <div className="welcome-content">
                <span
                  className="badge badge-teal"
                  style={{ marginBottom: "0.75rem" }}
                >
                  Active Workspace
                </span>
                <h1 className="welcome-title">
                  Welcome to your new React workspace
                </h1>
                <p className="welcome-desc">
                  This React app has been created and set up in{" "}
                  <code>a:\\Dixit_work\\Tobeque</code>. It includes an HSL
                  design system, a glassmorphic layout structure, and full
                  light/dark theme support.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleMetricClick}
                  >
                    Trigger Interaction ({clicks})
                  </button>
                  <a href="#console" className="btn btn-secondary">
                    Explore Terminal Console
                  </a>
                </div>
              </div>
            </section>

            <StatsRow
              packages={packages}
              clicks={clicks}
              systemLoad={systemLoad}
            />
          </div>

          <ConsoleTerminal
            consoleHistory={consoleHistory}
            consoleInput={consoleInput}
            onChangeInput={setConsoleInput}
            onSubmit={handleConsoleSubmit}
            consoleEndRef={consoleEndRef}
          />
        </div>

        <ShowcaseGrid />
      </main>

      <Footer />
    </div>
  );
}
