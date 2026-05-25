export default function PortfolioTab({ assets, onUpdate, onAdd, onDelete, totalAlloc, portfolioCAGR }) {
  const isValid = Math.abs(totalAlloc - 100) <= 0.01;

  return (
    <div className="grid-2">
      {/* Editable table */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Configure Portfolio Allocations</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Set % &amp; return rates</span>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset Class</th>
                <th style={{ width: 90, textAlign: 'right' }}>Alloc</th>
                <th style={{ width: 90, textAlign: 'right' }}>Exp Ret</th>
                <th style={{ width: 85, textAlign: 'right' }}>Weighted</th>
                <th style={{ width: 36, textAlign: 'center' }}>Del</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="asset-name-input"
                      type="text"
                      defaultValue={asset.name}
                      onBlur={e => onUpdate(index, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                      <input
                        className="asset-num-input"
                        type="number"
                        value={asset.alloc}
                        onChange={e => onUpdate(index, 'alloc', e.target.value)}
                        min="0" max="100"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                      <input
                        className="asset-num-input"
                        type="number"
                        value={asset.ret}
                        onChange={e => onUpdate(index, 'ret', e.target.value)}
                        min="0" step="0.5"
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>%</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--green)', fontWeight: 700, textAlign: 'right' }}>
                    {((asset.alloc / 100) * asset.ret).toFixed(2)}%
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="del-btn" onClick={() => onDelete(index)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="tbl-foot">
                <td>TOTAL</td>
                <td style={{ textAlign: 'right' }}>{totalAlloc.toFixed(1)}%</td>
                <td style={{ color: 'var(--text-3)', textAlign: 'right' }}>—</td>
                <td style={{ textAlign: 'right', fontSize: '0.88rem' }}>{portfolioCAGR.toFixed(2)}%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <button className="btn-add" onClick={onAdd}>➕ Add Asset Class</button>

        <div className={`info-box${isValid ? '' : ' warn'}`}>
          {isValid
            ? <><strong>Allocation Valid</strong>Total is exactly 100%. Portfolio CAGR is optimized at {portfolioCAGR.toFixed(2)}%.</>
            : <><strong>Allocation Mismatch</strong>Total must equal 100% — current: {totalAlloc.toFixed(1)}%</>
          }
        </div>
      </div>

      {/* Visual bars */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Asset Mix</span>
          <span className="panel-chip">{portfolioCAGR.toFixed(2)}% CAGR</span>
        </div>

        <div className="asset-bars">
          {assets.map((asset, i) => (
            <div key={i}>
              <div className="asset-bar-meta">
                <span>{asset.name}</span>
                <span style={{ color: asset.color, fontWeight: 700 }}>{asset.alloc.toFixed(1)}%</span>
              </div>
              <div className="asset-bar-track">
                <div
                  className="asset-bar-fill"
                  style={{ width: `${asset.alloc}%`, backgroundColor: asset.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="info-box">
          <strong>Interactive Composition</strong>
          Edit names, percentages, and return estimates in the table. Weighted portfolio CAGR updates in real-time and recalculates your years to FI.
        </div>
      </div>
    </div>
  );
}
