import type { ConsoleLine } from "../../lib/types";

export function ConsoleTerminal({
  consoleHistory,
  consoleInput,
  onChangeInput,
  onSubmit,
  consoleEndRef,
}: {
  consoleHistory: ConsoleLine[];
  consoleInput: string;
  onChangeInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  consoleEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div id="console">
      <section className="glass-panel console-panel">
        <div className="console-header">
          <div className="console-dots">
            <div className="console-dot red"></div>
            <div className="console-dot yellow"></div>
            <div className="console-dot green"></div>
          </div>
          <div className="console-title">interactive_console.sh</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>● LIVE</div>
        </div>

        <div className="console-body">
          {consoleHistory.map((line, idx) => (
            <div key={idx} className={`console-log-row ${line.type}`}>
              {line.text}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="console-input-row"
          style={{
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingBottom: "1.5rem",
          }}
        >
          <span className="console-prompt">tobeque$</span>
          <input
            type="text"
            className="console-input"
            value={consoleInput}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder="Type 'help' or 'build'..."
            autoFocus
          />
        </form>
      </section>
    </div>
  );
}
