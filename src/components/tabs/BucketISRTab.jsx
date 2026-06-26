import { formatPKRShort } from '../../utils/formatters';

export default function BucketISRTab({ calc, inputs }) {
  const { isr, buckets, finalCorpus, annualExpense, futureAnnualExpense, yearsToFI } = calc;

  const isrStatus = () => {
    if (isr >= 25) return { label: 'Excellent', color: '#10B981' };
    if (isr >= 20) return { label: 'Very Good', color: '#34D399' };
    if (isr >= 15) return { label: 'Good', color: '#F59E0B' };
    if (isr >= 10) return { label: 'Adequate', color: '#EAB308' };
    return { label: 'At Risk', color: '#EF4444' };
  };

  const status = isrStatus();
  const maxBucketValue = Math.max(...buckets.map(b => b.value));

  return (
    <div className="panel" style={{ maxWidth: '100%' }}>
      <div className="panel-hd">
        <span className="panel-title">3-Bucket Withdrawal Strategy & ISR</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Final Corpus: {formatPKRShort(finalCorpus)}</span>
      </div>

      {/* Text Above Arrows */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '12px', fontWeight: 500 }}>
        Move from bucket to bucket in green years
      </div>

      {/* Three Bucket Visualization with Flow Arrows */}
      <div style={{ padding: '16px 0' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0, height: '220px', width: '100%' }}>
          {buckets.map((bucket, i) => {
            let fillPercentage = 0;
            let isBelowTarget = false;

            if (i === 0) {
              const bucket1Target = futureAnnualExpense * 3;
              fillPercentage = Math.min(100, (bucket.value / bucket1Target) * 100);
              isBelowTarget = bucket.value < bucket1Target;
            } else {
              fillPercentage = (bucket.value / maxBucketValue) * 100;
            }

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }}>
                {/* Bucket Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  {/* Bucket SVG */}
                  <svg width="100" height="170" viewBox="0 0 80 150" style={{ marginBottom: '8px' }}>
                    <path
                      d="M 20 30 L 15 145 Q 15 150 20 150 L 60 150 Q 65 150 65 145 L 60 30 Z"
                      fill="none"
                      stroke={isBelowTarget ? '#EF4444' : 'var(--text-4)'}
                      strokeWidth={isBelowTarget ? 2.5 : 2}
                    />
                    <path
                      d="M 25 30 Q 40 10 55 30"
                      fill="none"
                      stroke={isBelowTarget ? '#EF4444' : 'var(--text-4)'}
                      strokeWidth={isBelowTarget ? 2.5 : 2}
                    />
                    <defs>
                      <clipPath id={`bucketClip${i}`}>
                        <path d="M 20 30 L 15 145 Q 15 150 20 150 L 60 150 Q 65 150 65 145 L 60 30 Z" />
                      </clipPath>
                    </defs>
                    <rect
                      x="15"
                      y={30 + (120 * (100 - fillPercentage)) / 100}
                      width="50"
                      height={120 * fillPercentage / 100}
                      fill={bucket.color}
                      opacity="0.8"
                      clipPath={`url(#bucketClip${i})`}
                    />
                    {i === 0 && (
                      <line
                        x1="15"
                        y1={30}
                        x2="65"
                        y2={30}
                        stroke="var(--text-3)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        opacity="0.5"
                      />
                    )}
                  </svg>

                  {/* Bucket Info */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: bucket.color }}>
                      {bucket.name.split(':')[1]?.trim() || bucket.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>
                      {bucket.alloc.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-1)' }}>
                      {formatPKRShort(bucket.value)}
                    </div>
                    {i === 0 && (
                      <div style={{ fontSize: '0.6rem', color: isBelowTarget ? '#EF4444' : 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                        {isBelowTarget ? '⚠️ Below Target' : '✓ On Target'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizontal Arrow between buckets (not after last bucket) */}
                {i < buckets.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 0.5, height: '180px' }}>
                    <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
                      {/* Arrow shaft - thick stick */}
                      <line
                        x1="180"
                        y1="40"
                        x2="50"
                        y2="40"
                        stroke={buckets[i + 1]?.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity="0.9"
                      />

                      {/* Arrow head - bold chevron */}
                      <polygon
                        points="35,40 20,40 35,58"
                        fill={buckets[i + 1]?.color}
                        opacity="0.9"
                      />
                      <polygon
                        points="35,40 20,40 35,22"
                        fill={buckets[i + 1]?.color}
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ISR and Corpus Details - Compact Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        padding: '12px',
        backgroundColor: 'var(--bg-2)',
        borderRadius: '6px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginBottom: '3px' }}>ISR</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: status.color }}>
            {isr.toFixed(2)}x
          </div>
          <div style={{ fontSize: '0.6rem', color: status.color }}>
            {status.label}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginBottom: '3px' }}>Final Corpus</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            {formatPKRShort(finalCorpus)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginBottom: '3px' }}>Future Expense</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: status.color }}>
            {formatPKRShort(futureAnnualExpense)}
          </div>
        </div>
      </div>

      {/* Bucket Details - Compact */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {buckets.map((bucket, i) => (
          <div key={i} style={{
            padding: '10px',
            backgroundColor: 'var(--bg-2)',
            borderRadius: '6px',
            borderLeft: `4px solid ${bucket.color}`
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: bucket.color, marginBottom: '4px' }}>
              {bucket.description}
            </div>
            {bucket.assets.length > 0 && (
              <div style={{ fontSize: '0.65rem', color: 'var(--text-4)' }}>
                {bucket.assets.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
