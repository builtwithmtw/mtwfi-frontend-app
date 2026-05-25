export default function RisksTab({ inputs, calc }) {
  const { portfolioCAGR } = calc;
  const age = inputs.age;

  return (
    <div className="grid-2">
      {/* Left — Strategy */}
      <div className="panel" style={{ background: 'linear-gradient(160deg, rgba(16,185,129,.09) 0%, rgba(7,18,12,.85) 100%)' }}>
        <div className="panel-hd">
          <span className="panel-title">🚀 Wealth Strategy — Age {age}</span>
        </div>

        <div className="wealth-list">
          {[
            {
              n: 1,
              title: 'Primary Wealth Generator',
              desc: 'Your monthly salary is your primary wealth generator. Continuously expand your skillset and take on higher-value work to grow this base cashflow over time.',
            },
            {
              n: 2,
              title: 'Hyper Savings Rate',
              desc: 'Your savings rate is exceptional. The key discipline is to keep lifestyle inflation strictly in check as your income grows — avoid scope creep on expenses.',
            },
            {
              n: 3,
              title: 'Compounding Velocity',
              desc: `Compounding at ${portfolioCAGR.toFixed(1)}% CAGR accelerates your FI timeline exponentially. Every year you stay invested matters more than the year before.`,
            },
            {
              n: 4,
              title: 'Portfolio Diversification',
              desc: 'Spread across PSX equities, mutual funds, real estate, gold, and foreign assets to reduce correlation risk. No single asset should dominate your corpus.',
            },
            {
              n: 5,
              title: 'Income Diversification',
              desc: 'Develop secondary income streams — freelancing, rental income, dividends — to reduce dependence on your primary salary and accelerate SIP contributions.',
            },
            {
              n: 6,
              title: 'Perpetual Withdrawal Strategy',
              desc: 'At FI, withdraw only the real return (CAGR − inflation). This leaves your principal 100% intact, compounding indefinitely and sustaining wealth across generations.',
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

      {/* Right — Risk Factors */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">⚠️ Risk Factors &amp; Mitigations</span>
        </div>

        <div className="risk-list">
          {[
            {
              title: 'Inflationary Erosion',
              desc: "Pakistan's persistently high inflation erodes purchasing power rapidly. Monthly expenses will multiply within years. The model adjusts SWP for inflation, but hyper-inflation above 20% represents severe sequence risk.",
            },
            {
              title: 'PSX Stock Volatility',
              desc: 'Equity yields are highly cyclical. Expecting a steady 22% CAGR is an average — major corrections or multi-year bear runs will depress returns and extend your FI timeline.',
            },
            {
              title: 'PKR Currency Devaluation',
              desc: 'Severe rupee depreciation impacts local purchasing power and asset valuations. A USD / foreign asset allocation hedges this risk, though it trades off against raw CAGR.',
            },
            {
              title: 'Sequence of Returns Risk',
              desc: 'A severe downturn in the first 2–3 years post-FI is the highest danger: you withdraw from a depreciating portfolio, permanently reducing the base. Maintain 1–2 years of liquid emergency reserves.',
            },
            {
              title: 'Regulatory & Policy Risk',
              desc: 'Capital gains tax changes, property tax reforms, or foreign exchange controls can materially alter after-tax returns on each asset class. Stay informed and model conservative net-of-tax returns.',
            },
            {
              title: 'Healthcare & Longevity Risk',
              desc: 'A longer lifespan increases total spend, and healthcare inflation outpaces general inflation. Budget a healthcare buffer and ensure SWR accounts for a 30–40 year retirement horizon.',
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
