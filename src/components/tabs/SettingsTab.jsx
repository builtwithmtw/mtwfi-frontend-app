import { formatPKRShort } from '../../utils/formatters';

export default function SettingsTab({ inputs, onInputChange }) {
  const { age, salary, sip, inflation, totalCorpus, expenses } = inputs;
  const totalExpense = Object.values(expenses).reduce((s, v) => s + v, 0);

  const handleExpense = (key, val) => onInputChange(`expenses.${key}`, parseFloat(val) || 0);
  const handleField   = (key, val) => onInputChange(key, parseFloat(val) || 0);

  return (
    <div className="grid-2">
      {/* Profile & SIP */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">👤 Profile &amp; Monthly SIP</span>
        </div>

        <div className="field">
          <div className="field-label">Current Age</div>
          <input type="number" value={age} min="18" max="100"
            onChange={e => handleField('age', e.target.value)} />
        </div>

        <div className="field">
          <div className="field-label">Monthly Gross Salary</div>
          <div className="input-wrap has-pre">
            <span className="input-pre">₨</span>
            <input type="number" value={salary} min="0" step="10000"
              onChange={e => handleField('salary', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <div className="field-label">Monthly SIP (Investments)</div>
          <div className="input-wrap has-pre">
            <span className="input-pre">₨</span>
            <input type="number" value={sip} min="0" step="10000"
              onChange={e => handleField('sip', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <div className="field-label">Total Corpus</div>
          <div className="input-wrap has-pre">
            <span className="input-pre">₨</span>
            <input type="number" value={totalCorpus} min="0" step="100000"
              onChange={e => handleField('totalCorpus', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <div className="field-label">
            <span>Expected Inflation Rate</span>
            <span className="field-label-val">{inflation}%</span>
          </div>
          <input
            type="range"
            value={inflation}
            min="1" max="40" step="0.5"
            onChange={e => handleField('inflation', e.target.value)}
          />
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
        ].map(({ key, label }) => (
          <div className="field" key={key}>
            <div className="field-label">{label}</div>
            <div className="input-wrap has-pre">
              <span className="input-pre">₨</span>
              <input type="number" value={expenses[key]} min="0" step="1000"
                onChange={e => handleExpense(key, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
