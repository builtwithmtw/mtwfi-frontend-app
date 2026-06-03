import { useState, useEffect, useRef } from 'react';

export default function Header({ progressPct, yearsLabel, ageLabel, datasource, onDatasourceChange }) {
  const pct = Math.min(progressPct, 100);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (value) => {
    onDatasourceChange(value);
    setOpen(false);
  };

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
        <div className="ds-anchor" ref={popoverRef}>
          <div
            className="status-pill"
            onClick={() => setOpen(v => !v)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <span className="status-dot" />
            Wealth Engine Active
          </div>

          {open && (
            <div className="ds-popover">
              <div className="ds-popover-label">Data Source</div>
              <button
                className={`ds-option${datasource === 'db' ? ' active' : ''}`}
                onClick={() => handleSelect('db')}
              >
                <span className="ds-option-icon">☁️</span>
                <div>
                  <div className="ds-option-name">Cloud DB</div>
                  <div className="ds-option-desc">Synced via Supabase</div>
                </div>
                {datasource === 'db' && <span className="ds-check">✓</span>}
              </button>
              <button
                className={`ds-option${datasource === 'local' ? ' active' : ''}`}
                onClick={() => handleSelect('local')}
              >
                <span className="ds-option-icon">💾</span>
                <div>
                  <div className="ds-option-name">Local</div>
                  <div className="ds-option-desc">Browser storage only</div>
                </div>
                {datasource === 'local' && <span className="ds-check">✓</span>}
              </button>
            </div>
          )}
        </div>

        <a
          href="https://www.linkedin.com/in/iammtw/"
          target="_blank"
          rel="noreferrer"
          className="header-credit"
        >
          Built by <strong>Mtw</strong>
        </a>
      </div>
    </header>
  );
}
