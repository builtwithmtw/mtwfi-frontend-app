export default function Header({ progressPct, yearsLabel, ageLabel }) {
  const pct = Math.min(progressPct, 100);

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo">💰</div>
        <div>
          <div className="header-title">FI Dashboard</div>
          <div className="header-sub">Financial Independence Calculator</div>
        </div>
      </div>

      <div className="header-progress">
        <div className="prog-wrap">
          <div className="prog-meta">
            <span className="prog-label">Road to Financial Independence</span>
            <span className="prog-pct">{pct.toFixed(1)}%</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill">
          <span className="status-dot" />
          Wealth Engine Active
        </div>
      </div>
    </header>
  );
}
