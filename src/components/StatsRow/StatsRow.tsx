export function StatsRow({
  packages,
  clicks,
  systemLoad,
}: {
  packages: number;
  clicks: number;
  systemLoad: number;
}) {
  return (
    <section className="stats-row">
      <div className="glass-panel stat-card primary">
        <div className="stat-header">
          <span className="stat-title">NPM Libraries</span>
          <div className="stat-icon">📦</div>
        </div>
        <div className="stat-value">{packages}</div>
        <div className="stat-footer">
          <span className="stat-trend-up">100% verified</span> audit checked
        </div>
      </div>

      <div className="glass-panel stat-card secondary">
        <div className="stat-header">
          <span className="stat-title">Interactions</span>
          <div className="stat-icon">⚡</div>
        </div>
        <div className="stat-value">{clicks}</div>
        <div className="stat-footer">
          <span className="stat-trend-up">+100% live</span> updates
        </div>
      </div>

      <div className="glass-panel stat-card tertiary">
        <div className="stat-header">
          <span className="stat-title">CPU Telemetry</span>
          <div className="stat-icon">🖥️</div>
        </div>
        <div className="stat-value">{systemLoad}%</div>
        <div className="stat-footer">
          <span className="stat-trend-up">Optimized</span> background thread
        </div>
      </div>
    </section>
  );
}
