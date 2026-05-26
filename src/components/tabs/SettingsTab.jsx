import { useState } from 'react';
import { formatPKRShort } from '../../utils/formatters';

const CORPUS_UNITS = [
  { key: 'K', label: 'Thousands', mult: 1_000 },
  { key: 'L', label: 'Lacs',      mult: 100_000 },
  { key: 'M', label: 'Millions',  mult: 1_000_000 },
];

const SALARY_UNITS = [
  { key: 'K', label: 'Thousands', mult: 1_000 },
  { key: 'L', label: 'Lacs',      mult: 100_000 },
];

export default function SettingsTab({ inputs, onInputChange }) {
  const { age, salary, sip, inflation, totalCorpus, expenses } = inputs;
  const totalExpense = Object.values(expenses).reduce((s, v) => s + v, 0);

  // Local display state: what the user typed — separate from the stored PKR value
  const [corpusInput, setCorpusInput] = useState(() => totalCorpus / 1_000_000);
  const [salaryInput, setSalaryInput] = useState(() => salary / 100_000);
  const [corpusUnit,  setCorpusUnit]  = useState('M');
  const [salaryUnit,  setSalaryUnit]  = useState('L');

  const handleExpense = (key, val) => onInputChange(`expenses.${key}`, parseFloat(val) || 0);
  const handleField   = (key, val) => onInputChange(key, parseFloat(val) || 0);

  const corpusMult = CORPUS_UNITS.find(u => u.key === corpusUnit).mult;
  const salaryMult = SALARY_UNITS.find(u => u.key === salaryUnit).mult;

  const handleCorpusInput = val => {
    const n = parseFloat(val) || 0;
    setCorpusInput(val);                          // keep raw typed value
    handleField('totalCorpus', n * corpusMult);
  };

  const handleCorpusUnit = key => {
    const newMult = CORPUS_UNITS.find(u => u.key === key).mult;
    setCorpusUnit(key);
    handleField('totalCorpus', (parseFloat(corpusInput) || 0) * newMult);
  };

  const handleSalaryInput = val => {
    const n = parseFloat(val) || 0;
    setSalaryInput(val);
    handleField('salary', n * salaryMult);
  };

  const handleSalaryUnit = key => {
    const newMult = SALARY_UNITS.find(u => u.key === key).mult;
    setSalaryUnit(key);
    handleField('salary', (parseFloat(salaryInput) || 0) * newMult);
  };

  const sipPct = salary > 0 ? ((sip / salary) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid-2">
      {/* Profile & SIP */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">👤 Profile &amp; Monthly SIP</span>
        </div>

        {/* Age */}
        <div className="field">
          <div className="field-label">Current Age</div>
          <input type="number" value={age} min="18" max="100"
            onChange={e => handleField('age', e.target.value)} />
        </div>

        {/* Total Corpus */}
        <div className="field">
          <div className="field-label">
            <span>Total Corpus</span>
            <div className="unit-toggle">
              {CORPUS_UNITS.map(u => (
                <button key={u.key}
                  className={`unit-btn${corpusUnit === u.key ? ' active' : ''}`}
                  onClick={() => handleCorpusUnit(u.key)}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <div className="input-wrap has-pre">
            <span className="input-pre">₨</span>
            <input type="number" value={corpusInput} min="0" step="1"
              onChange={e => handleCorpusInput(e.target.value)} />
          </div>
          <div className="field-hint">= ₨{((parseFloat(corpusInput) || 0) * corpusMult).toLocaleString()}</div>
        </div>

        {/* Salary */}
        <div className="field">
          <div className="field-label">
            <span>Monthly Gross Salary</span>
            <div className="unit-toggle">
              {SALARY_UNITS.map(u => (
                <button key={u.key}
                  className={`unit-btn${salaryUnit === u.key ? ' active' : ''}`}
                  onClick={() => handleSalaryUnit(u.key)}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <div className="input-wrap has-pre">
            <span className="input-pre">₨</span>
            <input type="number" value={salaryInput} min="0" step="1"
              onChange={e => handleSalaryInput(e.target.value)} />
          </div>
          <div className="field-hint">= ₨{((parseFloat(salaryInput) || 0) * salaryMult).toLocaleString()}</div>
        </div>

        {/* SIP slider */}
        <div className="field">
          <div className="field-label">
            <span>Monthly SIP (% of Salary)</span>
            <span className="field-label-val">{sipPct}%</span>
          </div>
          <input type="range" value={sip} min="0" max={salary || 1000000} step="1000"
            onChange={e => handleField('sip', e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <div className="range-marks" style={{ flex: 1 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, marginLeft: 12 }}>
              ₨{sip.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Inflation */}
        <div className="field">
          <div className="field-label">
            <span>Expected Inflation Rate</span>
            <span className="field-label-val">{inflation}%</span>
          </div>
          <input type="range" value={inflation} min="1" max="40" step="0.5"
            onChange={e => handleField('inflation', e.target.value)} />
          <div className="range-marks">
            <span>1%</span><span>20%</span><span>40%</span>
          </div>
        </div>
      </div>

      {/* Monthly Expenses */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">🏠 Monthly Expenses</span>
          <span className="panel-chip">{formatPKRShort(totalExpense)}</span>
        </div>

        {[
          { key: 'kitchen', label: 'Kitchen & Food' },
          { key: 'rent',    label: 'Rent & Home' },
          { key: 'bills',   label: 'Utility Bills & Net' },
          { key: 'petrol',  label: 'Petrol & Travel' },
          { key: 'outings', label: 'Outings & Leisure' },
          { key: 'wife',    label: 'Wife & Family' },
        ].map(({ key, label }) => {
          const pct = totalExpense > 0
            ? ((expenses[key] / totalExpense) * 100).toFixed(1)
            : '0.0';
          return (
            <div className="field" key={key}>
              <div className="field-label">{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="input-wrap has-pre" style={{ flex: 1 }}>
                  <span className="input-pre">₨</span>
                  <input type="number" value={expenses[key]} min="0" step="1000"
                    onChange={e => handleExpense(key, e.target.value)} />
                </div>
                <span style={{
                  fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 700,
                  width: 42, textAlign: 'right', flexShrink: 0,
                }}>
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
