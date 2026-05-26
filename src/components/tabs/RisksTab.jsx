import { formatPKRShort, formatNumber } from '../../utils/formatters';

export default function RisksTab({ inputs, calc }) {
  const { portfolioCAGR, totalExpense, savingsRate, yearsToFI, metTarget, projection } = calc;
  const { age, salary, sip, inflation, totalCorpus } = inputs;

  // ── Compounding comparison (10 years) ─────────────────────
  const yr10 = projection[10] ?? projection[projection.length - 1];
  const invest10yr = yr10?.corpus ?? 0;

  // Without investing: corpus + raw SIP deposits, no returns
  const noInvestNominal = totalCorpus + sip * 12 * 10;
  const inflFactor = Math.pow(1 + inflation / 100, 10);
  const noInvestReal = noInvestNominal / inflFactor;

  // ── What to do ─────────────────────────────────────────────
  const emergencyFund = totalExpense * 18;
  const surplusForAlloc = Math.max(0, totalCorpus - emergencyFund);
  const monthlySurplus = Math.max(0, salary - totalExpense);
  const sipPct = salary > 0 ? ((sip / salary) * 100).toFixed(1) : '0';

  const yearsDisplay = !metTarget ? '40+ yrs'
    : yearsToFI === 0 ? 'Now!' : `${yearsToFI} yrs`;

  return (
    <div className="col">
      <div className="grid-2">
        {/* ── Left: Strategy ──────────────────────────────── */}
        <div className="col">
          {/* Core Strategy */}
          <div className="panel" style={{ background: 'linear-gradient(160deg, rgba(16,185,129,.09) 0%, rgba(7,18,12,.85) 100%)' }}>
            <div className="panel-hd">
              <span className="panel-title">🚀 Wealth Strategy — Age {age}</span>
            </div>
            <div className="wealth-list">
              {[
                {
                  n: 1,
                  title: 'Protect Your Income',
                  desc: 'Your salary is the engine of your wealth. Protect it with health insurance, an emergency fund, and skill development. No income = no SIP = no FI.',
                },
                {
                  n: 2,
                  title: 'Increase Savings Rate',
                  desc: `Your current savings rate is ${savingsRate.toFixed(1)}%. Every 1% increase in savings rate directly cuts years off your FI timeline. Automate SIP before spending.`,
                },
                {
                  n: 3,
                  title: 'Avoid Lifestyle Inflation',
                  desc: 'As your income grows, keep expenses flat. Lifestyle creep is the silent killer of FI plans — every permanent expense increase raises your target corpus permanently.',
                },
                {
                  n: 4,
                  title: 'Build Secondary Income',
                  desc: 'Freelancing, rental yield, dividends, or consulting adds cashflow independent of your primary job. Route 100% of secondary income directly into SIP.',
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

          {/* Investing vs Not Investing */}
          <div className="panel">
            <div className="panel-hd">
              <span className="panel-title">📊 Investing vs Not Investing — 10 Years</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,.15)', borderRadius: 'var(--r-lg)', padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
                  ❌ Without Investing
                </div>
                <div style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.4px' }}>
                  {formatPKRShort(noInvestNominal, true, 0)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--red)', fontWeight: 600, marginTop: 4 }}>
                  Real value: {formatPKRShort(noInvestReal, true, 0)}
                </div>
                <div style={{ fontSize: '0.63rem', color: 'var(--text-3)', marginTop: 2 }}>
                  inflation-adjusted
                </div>
              </div>

              <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 'var(--r-lg)', padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
                  ✅ With Investing
                </div>
                <div style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 800, color: 'var(--green)', letterSpacing: '-0.4px' }}>
                  {formatPKRShort(invest10yr, true, 0)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--green)', fontWeight: 600, marginTop: 4 }}>
                  at {portfolioCAGR.toFixed(1)}% CAGR
                </div>
                <div style={{ fontSize: '0.63rem', color: 'var(--text-3)', marginTop: 2 }}>
                  compounded corpus
                </div>
              </div>
            </div>

            <div className="stat-row">
              <span className="stat-lbl">Wealth gained by investing</span>
              <span className="stat-val green" style={{ fontWeight: 800 }}>
                +{formatPKRShort(Math.max(0, invest10yr - noInvestReal), true, 0)}
              </span>
            </div>

            <div className="info-box">
              <strong>The Power of Compounding</strong>
              Without investing, ₨{formatPKRShort(noInvestNominal, false, 0)} in 10 years has a real purchasing power of only{' '}
              <strong style={{ display: 'inline', color: 'var(--red)', fontFamily: 'inherit' }}>{formatPKRShort(noInvestReal, true, 0)}</strong>{' '}
              due to {inflation}% inflation. Investing at {portfolioCAGR.toFixed(1)}% CAGR grows your corpus to{' '}
              <strong style={{ display: 'inline', color: 'var(--green)', fontFamily: 'inherit' }}>{formatPKRShort(invest10yr, true, 0)}</strong> —
              a difference you cannot afford to miss.
            </div>
          </div>

          {/* What Should You Do */}

        </div>

        {/* ── Right: Risk Factors ──────────────────────────── */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">⚠️ Risk Factors &amp; Mitigations</span>
          </div>
          <div className="risk-list">
            {[
              {
                title: 'PSX Underperformance',
                desc: 'PSX may underperform historical averages due to political instability, weak corporate earnings, or foreign outflows.',
              },
              {
                title: 'High Inflation',
                desc: "Pakistan's persistently high inflation rapidly erodes purchasing power. ",
              },
              {
                title: 'Currency Devaluation',
                desc: 'Severe PKR depreciation raises the cost of imported goods and services, inflating your real expenses.',
              },
              {
                title: 'Medical Emergencies',
                desc: 'An unexpected illness or accident can wipe out years of savings in weeks. Health insurance and a dedicated medical buffer outside your invested corpus are non-negotiable before declaring FI.',
              },
              {
                title: 'Lifestyle Inflation',
                desc: 'Every permanent increase in monthly expenses raises your FI target and delays the date.',
              },
              {
                title: 'Children Expenses',
                desc: 'Education, healthcare, weddings, and support costs for children can be substantial and easy to underestimate.',
              },
              {
                title: 'Long Bear Markets',
                desc: 'A multi-year bear run — especially in the first 2–3 years post-FI — forces withdrawals from a declining base. ',
              },
              {
                title: 'Job Loss Before FI Achieved',
                desc: 'Losing your primary income before reaching your target corpus halts SIP contributions and may force early drawdown. An emergency fund covering 18 months of expenses is your first line of defence.',
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

      {/* ── Wealth Engine Formula ── full width below ──────── */}
      <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,.08) 0%, rgba(7,18,12,.9) 60%, rgba(249,115,22,.06) 100%)', borderColor: 'rgba(16,185,129,.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
            The Formula
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.3px' }}>
            💡 Wealth Engine{' '}
            <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>=</span>{' '}
            <span style={{ color: 'var(--gold)' }}>Earning Power</span>{' '}
            <span style={{ color: 'var(--text-3)' }}>×</span>{' '}
            <span style={{ color: 'var(--green)' }}>Savings Rate</span>{' '}
            <span style={{ color: 'var(--text-3)' }}>×</span>{' '}
            <span style={{ color: '#818cf8' }}>Compounding</span>{' '}
            <span style={{ color: 'var(--text-3)' }}>×</span>{' '}
            <span style={{ color: 'var(--orange)' }}>Time</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            {
              label: 'Earning Power',
              value: `₨${formatNumber(salary)}/mo`,
              sub: 'Monthly gross salary',
              color: 'var(--gold)',
              bg: 'rgba(245,158,11,.08)',
              border: 'rgba(245,158,11,.2)',
            },
            {
              label: 'Savings Rate',
              value: `${savingsRate.toFixed(1)}%`,
              sub: `₨${formatNumber(sip)}/mo SIP`,
              color: 'var(--green)',
              bg: 'rgba(16,185,129,.08)',
              border: 'rgba(16,185,129,.2)',
            },
            {
              label: 'Compounding',
              value: `${portfolioCAGR.toFixed(1)}% CAGR`,
              sub: 'Weighted portfolio return',
              color: '#818cf8',
              bg: 'rgba(99,102,241,.08)',
              border: 'rgba(99,102,241,.2)',
            },
            {
              label: 'Time to FI',
              value: yearsDisplay,
              sub: age + (metTarget && yearsToFI > 0 ? ` → age ${age + yearsToFI}` : ''),
              color: 'var(--orange)',
              bg: 'rgba(249,115,22,.08)',
              border: 'rgba(249,115,22,.2)',
            },
          ].map(card => (
            <div key={card.label} style={{
              background: card.bg, border: `1px solid ${card.border}`,
              borderRadius: 'var(--r-lg)', padding: '14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
                {card.label}
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 800, color: card.color, letterSpacing: '-0.3px', marginBottom: 3 }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
