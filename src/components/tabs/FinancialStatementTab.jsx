import { formatNumber, formatPKRShort } from '../../utils/formatters';

export default function FinancialStatementTab({ inputs, calc }) {
  const { salary, sip } = inputs;
  const {
    totalExpense, annualExpense, targetCorpus, swrMultiplier,
    portfolioCAGR, safetyRealCAGR, yearsToFI, metTarget,
    savingsRate, progressPct,
  } = calc;

  const totalCorpus = inputs.totalCorpus;
  const age = inputs.age;
  const yearsDisplay = !metTarget ? '40+ Years'
    : yearsToFI === 0 ? 'Achieved' : `${yearsToFI} Years`;

  return (
    <div className="grid-2">
      {/* Left column */}
      <div className="col">
        {/* Income & Cashflow */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">💼 Income &amp; Cashflow</span>
            <span className="panel-chip">Age {age}</span>
          </div>

          <div className="sec-head">Monthly Account Position</div>
          <div className="stat-row">
            <span className="stat-lbl">Gross Salary</span>
            <span className="stat-val">₨{formatNumber(salary)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Total Expenses</span>
            <span className="stat-val orange">₨{formatNumber(totalExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Monthly Surplus</span>
            <span className="stat-val green">₨{formatNumber(salary - totalExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Monthly SIP</span>
            <span className="stat-val">₨{formatNumber(sip)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Net After SIP</span>
            <span className="stat-val">₨{formatNumber(salary - totalExpense - sip)}</span>
          </div>

          <div className="sec-head" style={{ marginTop: 18 }}>Annual Snapshot</div>
          <div className="stat-row">
            <span className="stat-lbl">Annual Income</span>
            <span className="stat-val">₨{formatNumber(salary * 12)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Annual Expenses</span>
            <span className="stat-val">₨{formatNumber(annualExpense)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Annual SIP Deployed</span>
            <span className="stat-val green">₨{formatNumber(sip * 12)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Savings Rate</span>
            <span className="stat-val green">{savingsRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Savings Rate Visual */}

      </div>

      {/* Right column */}
      <div className="col">
        {/* FI Target & Forecast */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">🎯 FI Target &amp; Forecast</span>
            <span className="panel-chip">{yearsDisplay}</span>
          </div>

          <div className="sec-head">Wealth Position</div>
          <div className="stat-row">
            <span className="stat-lbl">Current Total Corpus</span>
            <span className="stat-val gold">₨{formatNumber(totalCorpus)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Required FI Target</span>
            <span className="stat-val">₨{formatNumber(targetCorpus)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Gap to FI</span>
            <span className="stat-val orange">
              ₨{formatNumber(Math.max(0, targetCorpus - totalCorpus))}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Progress to FI</span>
            <span className="stat-val green">{Math.min(progressPct, 100).toFixed(1)}%</span>
          </div>

          <div className="sec-head" style={{ marginTop: 18 }}>Model Parameters</div>
          <div className="stat-row">
            <span className="stat-lbl">Portfolio CAGR</span>
            <span className="stat-val green">{portfolioCAGR.toFixed(2)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Real CAGR (after inflation)</span>
            <span className="stat-val green">{safetyRealCAGR.toFixed(2)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">SWR Multiplier</span>
            <span className="stat-val orange">{swrMultiplier.toFixed(1)}× Expenses</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Safe Withdrawal Rate</span>
            <span className="stat-val">{safetyRealCAGR.toFixed(2)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Annual Spend at FI</span>
            <span className="stat-val">₨{formatNumber(annualExpense)}</span>
          </div>
        </div>

        {/* Audit Summary */}

      </div>
    </div>
  );
}
