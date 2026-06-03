import { formatPKRShort, formatNumber } from '../../utils/formatters';

export default function RetirementPlanTab({ inputs, calc }) {
  const { age, salary, sip, inflation, totalCorpus } = inputs;
  const {
    targetCorpus, yearsToFI, metTarget, portfolioCAGR, realCAGR,
    safetyRealCAGR, progressPct, totalExpense,
    annualExpense, swrMultiplier, projection,
  } = calc;

  const retireAge = metTarget ? (yearsToFI === 0 ? age : age + yearsToFI) : null;
  const yrsToFI = metTarget ? (yearsToFI ?? 0) : null;
  const inflFactor = yrsToFI != null ? Math.pow(1 + inflation / 100, yrsToFI) : 1;

  const retireMonthly = totalExpense * inflFactor;
  const retireAnnual = retireMonthly * 12;

  // Milestone years: find year in projection where corpus crosses 25/50/75/100% of target
  const milestones = [25, 50, 75, 100].map(pct => {
    const threshold = targetCorpus * (pct / 100);
    const hit = projection.find(p => p.corpus >= threshold);
    return {
      pct,
      year: hit?.year ?? null,
      age: hit ? age + hit.year : null,
      corpus: hit?.corpus ?? null,
    };
  });

  // Full simulation: pre-FI uses projection, post-FI compounds without SIP and applies SWP
  const fiYearIdx = metTarget ? (yearsToFI ?? 0) : null;
  const fiRow = fiYearIdx != null ? (projection[fiYearIdx] ?? projection[projection.length - 1]) : null;
  const fiInvested = fiRow?.invested ?? totalCorpus;

  const buildKeyAgeRows = () => {
    const rows = [];
    const maxAge = Math.max(age + 50, 80);

    // Post-FI simulation runs in REAL terms (constant today's PKR) to match
    // the projection, which also uses real CAGR. Annual withdrawal = annualExpense
    // (constant in real terms). Convert to nominal for display.
    let swpCumulativeReal = 0;
    let postFiCorpusNoSwpReal = fiRow?.corpus ?? totalCorpus;
    let postFiCorpusLeftReal = fiRow?.corpus ?? totalCorpus;
    let postFiYear = 0;

    for (let a = age; a <= maxAge; a++) {
      const y = a - age;
      const isPostFi = fiYearIdx != null && y > fiYearIdx;
      const isFiYear = fiYearIdx != null && y === fiYearIdx;

      if (!isPostFi && !isFiYear) {
        const pRow = projection[y] ?? projection[projection.length - 1];
        rows.push({
          age: a,
          corpusNoSwp: pRow.corpus,
          invested: pRow.invested,
          swpCumulative: 0,
          swpCurrentYear: 0,
          corpusLeft: pRow.corpus,
          phase: 'pre',
        });
      } else if (isFiYear) {
        rows.push({
          age: a,
          corpusNoSwp: fiRow.corpus,
          invested: fiInvested,
          swpCumulative: 0,
          swpCurrentYear: 0,
          corpusLeft: fiRow.corpus,
          phase: 'fi',
        });
      } else {
        postFiYear++;
        // Real-terms compounding and withdrawal
        postFiCorpusNoSwpReal = postFiCorpusNoSwpReal * (1 + safetyRealCAGR / 100);
        postFiCorpusLeftReal = Math.max(0, postFiCorpusLeftReal * (1 + safetyRealCAGR / 100) - annualExpense);
        swpCumulativeReal += annualExpense;

        // Convert to nominal for display: multiply by inflation factor since FI year
        const nomFactor = Math.pow(1 + inflation / 100, postFiYear);
        rows.push({
          age: a,
          corpusNoSwp: postFiCorpusNoSwpReal * nomFactor,
          invested: fiInvested,
          swpCumulative: swpCumulativeReal * nomFactor,
          swpCurrentYear: annualExpense * nomFactor,
          corpusLeft: postFiCorpusLeftReal * nomFactor,
          phase: 'post',
        });
      }
    }
    return rows;
  };

  // Show every 5 years + the exact FI age
  const allSimRows = buildKeyAgeRows();
  const keyAgeRows = allSimRows.filter(r => {
    if (fiYearIdx != null && r.age === age + fiYearIdx) return true;
    return (r.age - age) % 5 === 0;
  });

  const statusColor = progressPct >= 100 ? 'green' : progressPct >= 50 ? 'gold' : 'orange';

  return (
    <div className="col">

      {/* ── Blueprint header ────────────────────────────────── */}
      <div className="panel" style={{ background: 'linear-gradient(160deg, rgba(16,185,129,.10) 0%, rgba(7,18,12,.9) 100%)', borderColor: 'rgba(16,185,129,.25)' }}>
        <div className="panel-hd">
          <span className="panel-title">Your Retirement Blueprint</span>
          <span className="panel-chip" style={{ color: progressPct >= 100 ? 'var(--green)' : 'var(--orange)' }}>
            {progressPct >= 100 ? 'FI Achieved' : `${progressPct.toFixed(1)}% to FI`}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 8 }}>
          {[
            {
              label: 'Current Age',
              value: `${age} yrs`,
              sub: `Salary ₨${formatNumber(salary)}/mo`,
              color: 'var(--text-1)',
              bg: 'rgba(255,255,255,.04)',
              border: 'var(--border)',
            },
            {
              label: 'Target Retirement Age',
              value: retireAge != null ? `Age ${retireAge}` : '40+ yrs',
              sub: retireAge != null && yrsToFI > 0 ? `${yrsToFI} years away` : retireAge === age ? 'You\'re there!' : 'Extend SIP',
              color: 'var(--green)',
              bg: 'rgba(16,185,129,.08)',
              border: 'rgba(16,185,129,.2)',
            },
            {
              label: 'Corpus Required',
              value: formatPKRShort(targetCorpus),
              sub: `${swrMultiplier.toFixed(1)}× annual expenses`,
              color: 'var(--gold)',
              bg: 'rgba(245,158,11,.08)',
              border: 'rgba(245,158,11,.2)',
            },
            {
              label: 'Current Corpus',
              value: formatPKRShort(totalCorpus),
              sub: `${progressPct.toFixed(1)}% of target`,
              color: `var(--${statusColor})`,
              bg: progressPct >= 50 ? 'rgba(16,185,129,.06)' : 'rgba(249,115,22,.06)',
              border: progressPct >= 50 ? 'rgba(16,185,129,.15)' : 'rgba(249,115,22,.15)',
            },
          ].map(card => (
            <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 'var(--r-lg)', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>{card.label}</div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 800, color: card.color, letterSpacing: '-0.3px', marginBottom: 3 }}>{card.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.7rem', color: 'var(--text-3)' }}>
            <span>₨0</span>
            <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>FI Progress — {progressPct.toFixed(1)}%</span>
            <span>{formatPKRShort(targetCorpus)}</span>
          </div>
          <div style={{ height: 10, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, progressPct)}%`, background: 'linear-gradient(90deg, var(--primary), #34d399)', borderRadius: 99, transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      <div className="grid-2">

        {/* ── Milestone tracker ───────────────────────────────── */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">FI Milestone Tracker</span>
            <span className="panel-chip">4 Stages</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {milestones.map(m => {
              const reached = totalCorpus >= targetCorpus * (m.pct / 100);
              return (
                <div key={m.pct} style={{
                  background: reached ? 'rgba(16,185,129,.09)' : 'var(--surface-2)',
                  border: `1px solid ${reached ? 'rgba(16,185,129,.3)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-lg)', padding: '14px 12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{m.pct}% FI</span>
                    {reached && <span style={{ fontSize: '0.65rem', color: 'var(--green)', fontWeight: 700 }}>REACHED</span>}
                  </div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 800, color: reached ? 'var(--green)' : 'var(--text-1)', marginBottom: 2 }}>
                    {m.age != null ? `Age ${m.age}` : '40+ yrs'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>
                    {m.year != null ? (m.year === 0 ? 'Already there' : `Year ${m.year}`) : 'Beyond projection'} · {m.corpus ? formatPKRShort(m.corpus) : '—'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="info-box" style={{ marginTop: 14 }}>
            <strong>Coast FI at 50%</strong>
            Once you hit 50% FI (₨{formatPKRShort(targetCorpus * 0.5)}), compounding alone can carry you to full FI — even if you stop adding new money. That's your "coast" safety net.
          </div>
        </div>

        {/* ── Retirement income plan ────────────────────────── */}
        <div className="panel">
          <div className="panel-hd">
            <span className="panel-title">Retirement Income Plan</span>
            {yrsToFI > 0 && <span className="panel-chip">{inflation}% inflation for {yrsToFI} yrs</span>}
          </div>

          <div className="cmp-cards">
            <div className="cmp-card">
              <div className="cmp-label">Monthly Budget at Retirement</div>
              <div className="cmp-value green">{formatNumber(retireMonthly)}</div>
              <span className="cmp-chip green">Today: ₨{formatNumber(totalExpense)}/mo</span>
            </div>
            <div className="cmp-card">
              <div className="cmp-label">Annual Withdrawal Needed</div>
              <div className="cmp-value orange">{formatPKRShort(retireAnnual)}</div>
              <span className="cmp-chip red">From ₨{formatPKRShort(annualExpense)} today</span>
            </div>
          </div>


        </div>
      </div>

      {/* ── Corpus at Key Ages (full-width) ─────────────────── */}
      <div className="panel">
        <div className="panel-hd">
          <span className="panel-title">Corpus at Key Ages</span>
          <span className="panel-chip">SIP stops at FI · {portfolioCAGR.toFixed(1)}% CAGR · {inflation}% inflation SWP</span>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th style={{ textAlign: 'right' }}>Invested</th>
                <th style={{ textAlign: 'right' }}>
                  Corpus
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', fontWeight: 400, marginTop: 1 }}>after SWP withdrawal</div>
                </th>
                <th style={{ textAlign: 'right' }}>Annual SWP</th>
              </tr>
            </thead>
            <tbody>
              {keyAgeRows.map(row => {
                const isFi = row.phase === 'fi';
                const isPost = row.phase === 'post';
                const depleted = row.corpusLeft <= 0;
                return (
                  <tr key={row.age} style={
                    isFi ? { background: 'rgba(16,185,129,.08)', borderTop: '2px solid rgba(16,185,129,.3)' }
                    : depleted ? { background: 'rgba(239,68,68,.06)' }
                    : {}
                  }>
                    <td style={{ fontWeight: 700, color: isFi ? 'var(--green)' : 'var(--text-2)', whiteSpace: 'nowrap' }}>
                      {row.age}
                      {isFi && <span style={{ marginLeft: 6, fontSize: '0.62rem', background: 'rgba(16,185,129,.2)', color: 'var(--green)', padding: '1px 5px', borderRadius: 99, fontWeight: 700 }}>FI</span>}
                    </td>
                    <td style={{ textAlign: 'right', color: isPost ? 'var(--text-4)' : 'var(--text-3)' }}>
                      {formatPKRShort(row.invested)}
                      {isPost && <span style={{ fontSize: '0.62rem', color: 'var(--text-4)', marginLeft: 3 }}>✕</span>}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: depleted ? 'var(--red)' : isFi ? 'var(--green)' : isPost ? 'var(--text-1)' : 'var(--text-3)' }}>
                      {depleted ? 'Depleted' : formatPKRShort(row.corpusLeft)}
                    </td>
                    <td style={{ textAlign: 'right', color: isPost ? 'var(--orange)' : 'var(--text-4)' }}>
                      {isPost ? formatPKRShort(row.swpCurrentYear) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="info-box" style={{ marginTop: 14 }}>
          <strong>How this works:</strong> SIP contributions stop the moment you hit FI. After that, your corpus compounds at {portfolioCAGR.toFixed(1)}% CAGR while you withdraw inflation-adjusted expenses ({inflation}%/yr) each year. "Corpus (No SWP)" shows what compounding alone would build — the gap between that and "Corpus Left" is your total lifestyle cost.
        </div>
      </div>


    </div>
  );
}
