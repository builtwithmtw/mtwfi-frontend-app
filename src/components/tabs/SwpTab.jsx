import { formatPKRShort, formatNumber } from '../../utils/formatters';

export default function SwpTab({ calc, inflation }) {
  const {
    totalExpense, annualExpense, targetCorpus, swrMultiplier,
    safetyRealCAGR, portfolioCAGR,
  } = calc;

  const year1Return = targetCorpus * (portfolioCAGR / 100);
  const year1Net = year1Return - annualExpense;
  const year1End = targetCorpus + year1Net;

  const swpRows = [];
  let monthly = totalExpense;
  let annual = annualExpense;
  const inflRate = inflation / 100;
  for (let i = 1; i <= 5; i++) {
    swpRows.push({ year: i, monthly, annual });
    monthly = monthly * (1 + inflRate);
    annual = annual * (1 + inflRate);
  }

  return (
    <div className="grid-2">
      {/* SWP Plan */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Systematic Withdrawal Plan</span>
          <span className="panel-chip">SWP</span>
        </div>

        <div className="stat-row" style={{ padding: '10px 0' }}>
          <span className="stat-lbl">Safe Monthly Withdrawal</span>
          <span className="stat-val green" style={{ fontSize: '1.35rem', fontFamily: 'Outfit', fontWeight: 800, letterSpacing: '-0.4px' }}>
            {formatNumber(totalExpense)}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-lbl">Safe Annual Withdrawal</span>
          <span className="stat-val" style={{ fontWeight: 700 }}>{formatNumber(annualExpense)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-lbl">Required SWR Target Factor</span>
          <span className="stat-val orange">{swrMultiplier.toFixed(1)}× Expenses</span>
        </div>
        <div className="stat-row">
          <span className="stat-lbl">Perpetual SWR Percentage</span>
          <span className="stat-val gold">{safetyRealCAGR.toFixed(2)}%</span>
        </div>

        <div className="sec-head" style={{ marginTop: 20 }}>Inflation-Adjusted SWP Timeline</div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Year Post-FI</th>
                <th style={{ textAlign: 'right' }}>Monthly Withdrawal</th>
                <th style={{ textAlign: 'right' }}>Annual Withdrawal</th>
              </tr>
            </thead>
            <tbody>
              {swpRows.map(row => (
                <tr key={row.year}>
                  <td style={{ fontWeight: 700, color: 'var(--text-2)' }}>Year {row.year}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600, textAlign: 'right' }}>{formatNumber(row.monthly)}</td>
                  <td style={{ textAlign: 'right' }}>{formatNumber(row.annual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stability Audit */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Year 1 Withdrawal Stability Audit</span>
        </div>

        <div className="cmp-cards">
          <div className="cmp-card">
            <div className="cmp-label">Estimated Year 1 Return</div>
            <div className="cmp-value green">{formatPKRShort(year1Return)}</div>
            <span className="cmp-chip green">{portfolioCAGR.toFixed(1)}% CAGR Earned</span>
          </div>
          <div className="cmp-card">
            <div className="cmp-label">Estimated Year 1 Safe SWP</div>
            <div className="cmp-value orange">{formatPKRShort(annualExpense)}</div>
            <span className="cmp-chip red">Money Withdrawn</span>
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div className="stat-row">
            <span className="stat-lbl">Post-Withdrawal Net Capital Growth</span>
            <span className={`stat-val ${year1Net >= 0 ? 'green' : 'orange'}`}>
              {year1Net >= 0 ? '+' : ''}{formatPKRShort(year1Net, false)}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Ending Year 1 Corpus Balance</span>
            <span className="stat-val" style={{ fontWeight: 700 }}>{formatPKRShort(year1End, false)}</span>
          </div>
        </div>

        <div className="info-box">
          <strong>Safety Analysis</strong>
          Because you live off real returns (Portfolio CAGR − Inflation), your starting principal stays 100% intact forever — compounding safely with inflation so you never run out of capital.
        </div>
      </div>
    </div>
  );
}
