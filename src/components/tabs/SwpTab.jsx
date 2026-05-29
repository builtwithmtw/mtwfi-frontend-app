import { formatPKRShort, formatNumber } from '../../utils/formatters';

export default function SwpTab({ calc, inflation }) {
  const {
    totalExpense, annualExpense, targetCorpus, swrMultiplier,
    safetyRealCAGR, portfolioCAGR, yearsToFI, metTarget,
  } = calc;

  // Inflate today's expenses forward to the actual FI retirement year
  const yrs = metTarget ? (yearsToFI ?? 0) : 0;
  const inflFactor = Math.pow(1 + inflation / 100, yrs);
  const fiMonthlyExpense = totalExpense  * inflFactor;
  const fiAnnualExpense  = annualExpense * inflFactor;

  // Year 1 audit uses FI-year figures, not today's
  const year1Return = targetCorpus * (portfolioCAGR / 100);
  const year1Net    = year1Return - fiAnnualExpense;
  const year1End    = targetCorpus + year1Net;

  // SWP timeline starts from FI-year expense and compounds from there
  const swpRows = [];
  let monthly = fiMonthlyExpense;
  let annual  = fiAnnualExpense;
  const inflRate = inflation / 100;
  for (let i = 1; i <= 5; i++) {
    swpRows.push({ year: i, monthly, annual });
    monthly = monthly * (1 + inflRate);
    annual  = annual  * (1 + inflRate);
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
          <span className="stat-lbl">
            Safe Monthly Withdrawal at FI
            {yrs > 0 && <span style={{ color: 'var(--text-4)', fontWeight: 500 }}> (Year {yrs} money)</span>}
          </span>
          <span className="stat-val green" style={{ fontSize: '1.35rem', fontFamily: 'Outfit', fontWeight: 800, letterSpacing: '-0.4px' }}>
            {formatNumber(fiMonthlyExpense)}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-lbl">
            Safe Annual Withdrawal at FI
            {yrs > 0 && <span style={{ color: 'var(--text-4)', fontWeight: 500 }}> (Today: {formatNumber(annualExpense)})</span>}
          </span>
          <span className="stat-val" style={{ fontWeight: 700 }}>{formatNumber(fiAnnualExpense)}</span>
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
          {yrs > 0 && (
            <span className="panel-chip">
              At FI in {yrs}y · {inflation}% inflation applied
            </span>
          )}
        </div>

        <div className="cmp-cards">
          <div className="cmp-card">
            <div className="cmp-label">Estimated Year 1 Portfolio Return</div>
            <div className="cmp-value green">{formatPKRShort(year1Return)}</div>
            <span className="cmp-chip green">{portfolioCAGR.toFixed(1)}% CAGR on Target Corpus</span>
          </div>
          <div className="cmp-card">
            <div className="cmp-label">Year 1 Inflation-Adjusted Withdrawal</div>
            <div className="cmp-value orange">{formatPKRShort(fiAnnualExpense)}</div>
            <span className="cmp-chip red">
              Today {formatPKRShort(annualExpense)} → {yrs}y @ {inflation}%
            </span>
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
          <strong>Inflation-Projected Safety Analysis</strong>
          Withdrawals start at your FI-year expense level ({yrs > 0 ? `today's ₨${formatNumber(totalExpense)}/mo inflated ${yrs} years at ${inflation}%` : 'current expenses'}) and increase each year with inflation. Because the corpus earns real returns above inflation, principal stays intact indefinitely.
        </div>
      </div>
    </div>
  );
}
