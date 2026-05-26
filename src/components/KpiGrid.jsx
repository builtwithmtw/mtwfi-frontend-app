import { formatPKRShort } from '../utils/formatters';

function KpiCard({ label, value, valueClass, desc, icon, accentColor }) {
  return (
    <div
      className="kpi-card"
      style={{ '--kpi-accent': accentColor }}
    >
      <div className="kpi-top">
        <div className="kpi-label">{label}</div>
        <div className="kpi-icon">{icon}</div>
      </div>
      <div className={`kpi-value ${valueClass ?? ''}`}>{value}</div>
      <div className="kpi-desc">{desc}</div>
    </div>
  );
}

export default function KpiGrid({
  totalCorpus, annualExpense, totalExpense,
  targetCorpus, swrMultiplier, safetyRealCAGR,
  yearsLabel, ageLabel,
}) {
  return (
    <div className="kpi-strip">
      <KpiCard
        label="Total Corpus"
        value={formatPKRShort(totalCorpus, false, 0)}
        valueClass="gold"
        desc="Active compounding base"
        icon="🏦"
        accentColor="rgba(245,158,11,.1)"
      />
      <KpiCard
        label="Annual Expenses"
        value={formatPKRShort(annualExpense, false, 2)}
        valueClass="orange"
        desc={`Monthly: ${formatPKRShort(totalExpense, false, 0)}`}
        icon="💸"
        accentColor="rgba(249,115,22,.1)"
      />
      <KpiCard
        label="Target Corpus"
        value={formatPKRShort(targetCorpus, false, 0)}
        valueClass=""
        desc={`${Math.round(swrMultiplier)}× expenses · ${safetyRealCAGR.toFixed(1)}% SWR`}
        icon="🎯"
        accentColor="rgba(16,185,129,.1)"
      />
      <KpiCard
        label="Years to FI"
        value={yearsLabel}
        valueClass="green"
        desc={ageLabel}
        icon="⏳"
        accentColor="rgba(16,185,129,.1)"
      />
    </div>
  );
}
