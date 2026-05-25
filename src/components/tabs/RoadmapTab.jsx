import ProjectionChart from '../ProjectionChart';
import { formatNumber } from '../../utils/formatters';

export default function RoadmapTab({ projection, targetCorpus, yearsToFI, compoundingMode, onModeChange }) {
  return (
    <div className="grid-2">
      {/* Chart panel */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Corpus Compounding Projection</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 12, height: 3, background: 'var(--green)', borderRadius: 2 }} />
                Compounded
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 12, height: 0, borderTop: '2px dashed rgba(255,255,255,.4)' }} />
                Invested
              </span>
            </div>
            <div className="mode-toggle">
              <button
                className={`mode-btn${compoundingMode === 'real' ? ' active' : ''}`}
                onClick={() => onModeChange('real')}
              >Real</button>
              <button
                className={`mode-btn${compoundingMode === 'nominal' ? ' active' : ''}`}
                onClick={() => onModeChange('nominal')}
              >Nominal</button>
            </div>
          </div>
        </div>

        <ProjectionChart
          projection={projection}
          targetCorpus={targetCorpus}
          yearsToFI={yearsToFI}
        />

        <div className="info-box">
          <strong>Compounding Mode</strong>
          Toggle between <em>Real</em> (Portfolio CAGR − Inflation, today's purchasing power) and <em>Nominal</em> (raw portfolio returns).
        </div>
      </div>

      {/* Table panel */}
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="panel-hd">
          <span className="panel-title">Yearly Projection Table</span>
        </div>
        <div className="tbl-wrap" style={{ overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Yr</th>
                <th>Age</th>
                <th>SIP Contribution</th>
                <th>Total Corpus</th>
              </tr>
            </thead>
            <tbody>
              {projection.map(row => (
                <tr
                  key={row.year}
                  style={row.year === yearsToFI && yearsToFI > 0
                    ? { background: 'rgba(16,185,129,.12)', fontWeight: 700, color: 'white' }
                    : {}}
                >
                  <td>{row.year === 0 ? 'Now' : row.year}</td>
                  <td>{row.age}</td>
                  <td>{row.year === 0 ? '—' : `₨${formatNumber(row.contribution)}`}</td>
                  <td style={{ color: row.corpus >= targetCorpus ? 'var(--green)' : undefined, fontWeight: 600 }}>
                    ₨{formatNumber(row.corpus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
