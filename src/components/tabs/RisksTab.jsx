import { formatNumber } from '../../utils/formatters';

export default function RisksTab({ inputs, calc }) {
  const { salary, sip } = inputs;
  const {
    totalExpense, targetCorpus, swrMultiplier,
    portfolioCAGR, yearsToFI, metTarget, savingsRate,
  } = calc;

  const totalCorpus = inputs.totalCorpus;
  const age         = inputs.age;

  const yearsDisplay = !metTarget ? '40+ Years'
    : yearsToFI === 0 ? 'Achieved' : `${yearsToFI} Years`;

  return (
    <div className="grid-2">
      <div className="col">
        {/* Financial Statement */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">Personal Financial Statement</span>
          </div>

          <div className="stmt-grid">
            <div>
              <div className="sec-head">Account Position</div>
              <div className="stat-row">
                <span className="stat-lbl">Monthly Salary</span>
                <span className="stat-val">₨{formatNumber(salary)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-lbl">Monthly Expenses</span>
                <span className="stat-val">₨{formatNumber(totalExpense)}</span>
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
                <span className="stat-lbl">Savings Rate</span>
                <span className="stat-val green">{savingsRate.toFixed(1)}%</span>
              </div>
            </div>

            <div>
              <div className="sec-head">FI Target &amp; Forecast</div>
              <div className="stat-row">
                <span className="stat-lbl">Total Assets</span>
                <span className="stat-val">₨{formatNumber(totalCorpus)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-lbl">FI Target</span>
                <span className="stat-val">₨{formatNumber(targetCorpus)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-lbl">SWR Multiplier</span>
                <span className="stat-val orange">{swrMultiplier.toFixed(1)}× Expenses</span>
              </div>
              <div className="stat-row">
                <span className="stat-lbl">Portfolio CAGR</span>
                <span className="stat-val green">{portfolioCAGR.toFixed(2)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-lbl">Years to FI</span>
                <span className="stat-val">{yearsDisplay}</span>
              </div>
            </div>
          </div>

          <div className="info-box">
            <strong>Audit Summary</strong>
            Monthly salary of ₨{formatNumber(salary)} against expenses of ₨{formatNumber(totalExpense)} gives you a highly disciplined surplus. You are on a very strong track to achieve financial independence.
          </div>
        </div>

        {/* Wealth Engine */}
        <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.1) 0%, rgba(7,18,12,.85) 100%)' }}>
          <div className="panel-hd">
            <span className="panel-title" style={{ color: 'white' }}>🚀 Your Wealth Engine — Age {age}</span>
          </div>
          <div className="wealth-list">
            {[
              {
                n: 1,
                title: 'Primary Wealth Generator',
                desc: 'Your monthly salary is your primary wealth generator. Continue expanding your skillset to increase this base cashflow.',
              },
              {
                n: 2,
                title: 'Hyper Savings Rate',
                desc: 'Your current savings rate is exceptional. Keep lifestyle inflation in check as your salary expands over time.',
              },
              {
                n: 3,
                title: 'Compounding Velocity',
                desc: `Compounding your savings at ${portfolioCAGR.toFixed(1)}% CAGR speeds up your retirement timeline exponentially.`,
              },
            ].map(item => (
              <div className="wealth-item" key={item.n}>
                <div className="wealth-num">{item.n}</div>
                <div>
                  <div className="wealth-title">{item.title}</div>
                  <div className="wealth-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Risk Factors &amp; Considerations</span>
        </div>
        <div className="risk-list">
          {[
            {
              title: 'Inflationary Erosion (10%)',
              desc: "Pakistan's high inflation can quickly erode purchasing power. Your monthly expenses will multiply within years. The model adjusts SWP for 10% inflation, but sustained hyper-inflation represents sequence risk.",
            },
            {
              title: 'PSX Stock Volatility',
              desc: 'Equities yields are highly cyclical. Expecting a steady 22% stock CAGR yearly is ideal; major stock corrections or sustained bear runs will prolong your required timeline.',
            },
            {
              title: 'Currency Devaluation',
              desc: 'Severe PKR depreciation impacts local purchasing power. Holding a percentage of foreign assets (USD) hedges this risk but yields lower raw CAGR rates.',
            },
            {
              title: 'Sequence of Returns Risk',
              desc: 'A severe market downturn in the first 2–3 years after you stop working represents high risk, as you withdraw capital from a depreciating base. Keep liquid emergency reserves.',
            },
          ].map(risk => (
            <div className="risk-card" key={risk.title}>
              <div className="risk-ico">🔴</div>
              <div>
                <div className="risk-title">{risk.title}</div>
                <div className="risk-desc">{risk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
