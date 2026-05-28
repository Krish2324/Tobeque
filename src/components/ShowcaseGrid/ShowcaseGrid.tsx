export function ShowcaseGrid() {
  return (
    <section style={{ padding: "2rem 0 4rem 0" }}>
      <h2
        style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}
      >
        Built-in Design Foundations
      </h2>
      <div className="showcase-grid">
        <div className="glass-panel feature-card">
          <div className="feature-icon-wrapper">🎨</div>
          <h3 className="feature-title">Harmonious Theme Variables</h3>
          <p className="feature-desc">
            Clean HSL variables structured in <code>index.css</code>. Easily
            toggle colors, borders, shadows, and spacing parameters for
            dark/light themes.
          </p>
        </div>

        <div className="glass-panel feature-card teal">
          <div className="feature-icon-wrapper">✨</div>
          <h3 className="feature-title">Premium Glassmorphism</h3>
          <p className="feature-desc">
            Glass backdrops with custom <code>backdrop-filter</code> values.
            Designed to adapt gracefully to different environments and sizes.
          </p>
        </div>

        <div className="glass-panel feature-card purple">
          <div className="feature-icon-wrapper">⚡</div>
          <h3 className="feature-title">Micro-Animations</h3>
          <p className="feature-desc">
            Interactive hover triggers, glowing border effects, and floating
            indicators that bring the user experience to life.
          </p>
        </div>
      </div>
    </section>
  );
}
