
const AMOUNT_UNITS = [
  { key: 'K', label: 'Thousands', mult: 1_000 },
  { key: 'L', label: 'Lacs',      mult: 100_000 },
  { key: 'M', label: 'Millions',  mult: 1_000_000 },
];


function fmtPKR(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

function fmtNum(n) {
  return Math.round(n).toLocaleString();
}

function calcExpense(exp, hourRate, lifeWH, returnRate, investYears) {
  const hours         = exp.amount / hourRate;
  const lifePct       = (hours / lifeWH) * 100;
  const investedAmt   = exp.amount * (exp.investPct / 100);
  const spendAmt      = exp.amount - investedAmt;
  const spendHours    = spendAmt    / hourRate;
  const investHours   = investedAmt / hourRate;
  const spendLifePct  = (spendHours / lifeWH) * 100;
  const futureValue   = investedAmt * Math.pow(1 + returnRate / 100, investYears);
  const futureHours   = futureValue  / hourRate;
  const futureLifePct = (futureHours / lifeWH) * 100;
  return { hours, lifePct, investedAmt, spendAmt, spendHours, investHours, spendLifePct, futureValue, futureHours, futureLifePct };
}

export default function HoursInvestingTab({
  salary, portfolioCAGR,
  hoursInputs, onHoursInputsChange,
  hoursExpenses, onHoursExpensesChange,
}) {
  const { workYears, dwh, wdy } = hoursInputs;
  const setField = (key, val) => onHoursInputsChange({ ...hoursInputs, [key]: val });

  const yearlyWH    = dwh * wdy;
  const lifeWH      = yearlyWH * workYears;
  const hourRate    = salary > 0 && yearlyWH > 0 ? (salary * 12) / yearlyWH : 1;
  const hourRateUSD = hourRate / 280;

  const returnRate  = portfolioCAGR;
  const investYears = workYears;

  const addExpense = () =>
    onHoursExpensesChange([...hoursExpenses, {
      id: Date.now(), name: 'New Expense',
      amount: 1_000_000, amountInput: '1', amountUnit: 'M', investPct: 50,
    }]);

  const updExp = (id, patch) =>
    onHoursExpensesChange(hoursExpenses.map(e => e.id === id ? { ...e, ...patch } : e));

  const delExp = (id) =>
    onHoursExpensesChange(hoursExpenses.filter(e => e.id !== id));

  const handleAmountInput = (id, val, unit) => {
    const mult = AMOUNT_UNITS.find(u => u.key === unit).mult;
    updExp(id, { amountInput: val, amount: (parseFloat(val) || 0) * mult });
  };

  const handleAmountUnit = (id, key, currentInput) => {
    const mult = AMOUNT_UNITS.find(u => u.key === key).mult;
    updExp(id, { amountUnit: key, amount: (parseFloat(currentInput) || 0) * mult });
  };

  const metrics = [
    { label: 'Yearly Working Hours', value: fmtNum(yearlyWH),            icon: '📅', desc: `${dwh}h × ${wdy} days`,  color: 'green'  },
    { label: 'Life Working Hours',   value: fmtNum(lifeWH),               icon: '⏳', desc: `Over ${workYears} years`, color: 'green'  },
    { label: 'Hour Rate (PKR)',       value: fmtPKR(hourRate),             icon: '💰', desc: 'Per hour of your life',   color: 'gold'   },
    { label: 'Hour Rate (USD)',       value: `$${hourRateUSD.toFixed(2)}`, icon: '💵', desc: 'At 280 PKR / USD',        color: 'orange' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Quote ── */}
      <div className="hi-quote">
        <span className="hi-quote-mark">"</span>
        Middle class don't know what they want, until society show it to them
        <span className="hi-quote-mark">"</span>
      </div>

      {/* ── Inputs ── */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">⏱️ Life Hours Inputs</span>
          <span className="panel-chip">{portfolioCAGR.toFixed(1)}% CAGR · {workYears}y horizon</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div className="field">
            <div className="field-label">Workable Years</div>
            <input type="number" value={workYears} min={1} max={60}
              onChange={e => setField('workYears', parseFloat(e.target.value) || 1)} />
          </div>
          <div className="field">
            <div className="field-label">Daily Working Hours</div>
            <input type="number" value={dwh} min={1} max={24}
              onChange={e => setField('dwh', parseFloat(e.target.value) || 1)} />
          </div>
          <div className="field">
            <div className="field-label">Workable Days / Year</div>
            <input type="number" value={wdy} min={1} max={365}
              onChange={e => setField('wdy', parseFloat(e.target.value) || 1)} />
          </div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {metrics.map(({ label, value, icon, desc, color }) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-top">
              <div className="kpi-label">{label}</div>
              <div className="kpi-icon">{icon}</div>
            </div>
            <div className={`kpi-value ${color}`}>{value}</div>
            <div className="kpi-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* ── Expenses ── */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">🎯 Expenses &amp; Investment Projection</span>
          <button className="profile-btn profile-btn-new" onClick={addExpense}>+ Add Expense</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hoursExpenses.map(exp => {
            const c    = calcExpense(exp, hourRate, lifeWH, returnRate, investYears);
            const mult = AMOUNT_UNITS.find(u => u.key === exp.amountUnit).mult;
            return (
              <div key={exp.id} className="hi-expense-card">

                {/* Compact header: name | unit-toggle + input | delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <input
                    className="hi-name-input"
                    value={exp.name}
                    placeholder="Expense name"
                    onChange={e => updExp(exp.id, { name: e.target.value })}
                    style={{ flex: 1, fontSize: '0.82rem', fontWeight: 700 }}
                  />
                  <div className="unit-toggle" style={{ flexShrink: 0 }}>
                    {AMOUNT_UNITS.map(u => (
                      <button key={u.key}
                        className={`unit-btn${exp.amountUnit === u.key ? ' active' : ''}`}
                        onClick={() => handleAmountUnit(exp.id, u.key, exp.amountInput)}>
                        {u.label}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={exp.amountInput} min={0} step={1}
                    style={{ width: 80, flexShrink: 0, textAlign: 'right' }}
                    onChange={e => handleAmountInput(exp.id, e.target.value, exp.amountUnit)} />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-4)', flexShrink: 0, minWidth: 70 }}>
                    = {((parseFloat(exp.amountInput) || 0) * mult).toLocaleString()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, borderLeft: '1px solid var(--border)', paddingLeft: 8 }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Invest</span>
                    <input type="number" value={exp.investPct} min={0} max={100} step={1}
                      style={{ width: 48, textAlign: 'right', flexShrink: 0 }}
                      onChange={e => updExp(exp.id, { investPct: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 700 }}>%</span>
                  </div>
                  <button className="hi-del-btn" onClick={() => delExp(exp.id)} title="Delete">✕</button>
                </div>

                {/* Row 1 — overview stats: Total Cost · Total Hours · % Working Life */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
                  <div className="hi-stat-card">
                    <div className="hi-stat-label">Total Cost</div>
                    <div className="hi-stat-val">{fmtPKR(exp.amount)}</div>
                  </div>
                  <div className="hi-stat-card">
                    <div className="hi-stat-label">Total Hours</div>
                    <div className="hi-stat-val">{fmtNum(c.hours)} hrs</div>
                  </div>
                  <div className="hi-stat-card">
                    <div className="hi-stat-label">% of Working Life</div>
                    <div className="hi-stat-val" style={{ color: 'var(--orange)' }}>{c.lifePct.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Row 2 — projection cards: Spend · Invested · Future Value · Future Hours */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  <div className="hi-proj-box">
                    <div className="hi-proj-title">Spend ({100 - exp.investPct}%)</div>
                    <div className="hi-proj-main" style={{ color: '#E24B4A' }}>{fmtPKR(c.spendAmt)}</div>
                    <div className="hi-proj-sub">{fmtNum(c.spendHours)} hrs · {c.spendLifePct.toFixed(1)}%</div>
                  </div>
                  <div className="hi-proj-box">
                    <div className="hi-proj-title">Invested ({exp.investPct}%)</div>
                    <div className="hi-proj-main" style={{ color: '#1D9E75' }}>{fmtPKR(c.investedAmt)}</div>
                    <div className="hi-proj-sub">{fmtNum(c.investHours)} hrs</div>
                  </div>
                  <div className="hi-proj-box">
                    <div className="hi-proj-title">Future Value ({investYears}y @ {returnRate.toFixed(1)}%)</div>
                    <div className="hi-proj-main" style={{ color: 'var(--green)' }}>{fmtPKR(c.futureValue)}</div>
                    <div className="hi-proj-sub">${Math.round(c.futureValue / 280).toLocaleString()} USD</div>
                  </div>
                  <div className="hi-proj-box">
                    <div className="hi-proj-title">Future in Life Hours</div>
                    <div className="hi-proj-main" style={{ color: 'var(--gold)' }}>{fmtNum(c.futureHours)} hrs</div>
                    <div className="hi-proj-sub">{c.futureLifePct.toFixed(2)}% of working life</div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
