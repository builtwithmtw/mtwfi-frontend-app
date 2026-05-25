import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ReferenceDot, ResponsiveContainer,
} from 'recharts';
import { formatPKRShort } from '../utils/formatters';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const gain = Math.max(0, d.corpus - (d.invested || d.corpus));
  return (
    <div className="tt">
      <div className="tt-head">
        <span>{d.year === 0 ? 'Now' : `Year ${d.year}`}</span>
        <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>Age {d.age}</span>
      </div>
      <div className="tt-row">
        <span className="tt-key" style={{ color: 'var(--green)' }}>Compounded</span>
        <span className="tt-val">{formatPKRShort(d.corpus)}</span>
      </div>
      <div className="tt-row">
        <span className="tt-key">Invested</span>
        <span className="tt-val" style={{ color: 'var(--text-2)' }}>{formatPKRShort(d.invested || d.corpus)}</span>
      </div>
      <div className="tt-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 4, marginTop: 4 }}>
        <span className="tt-key" style={{ color: 'var(--gold)' }}>Wealth Gain</span>
        <span className="tt-val" style={{ color: 'var(--gold)' }}>{formatPKRShort(gain)}</span>
      </div>
    </div>
  );
}

export default function ProjectionChart({ projection, targetCorpus, yearsToFI }) {
  const fiPoint = yearsToFI != null && yearsToFI > 0
    ? projection.find(p => p.year === yearsToFI)
    : null;

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={projection} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10B981" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,.03)" vertical={false} />

          <XAxis
            dataKey="year"
            tick={{ fill: '#52525b', fontSize: 9 }}
            tickFormatter={v => v === 0 ? 'Now' : `Yr ${v}`}
            stroke="rgba(255,255,255,.04)"
          />

          <YAxis
            tickFormatter={v => formatPKRShort(v, false)}
            tick={{ fill: '#52525b', fontSize: 9 }}
            stroke="rgba(255,255,255,.04)"
            width={72}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={targetCorpus}
            stroke="var(--orange)"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            label={{
              value: `TARGET: ${formatPKRShort(targetCorpus, false)}`,
              fill: 'var(--orange)',
              fontSize: 8,
              position: 'insideTopRight',
            }}
          />

          <Area
            type="monotone"
            dataKey="corpus"
            fill="url(#corpusGrad)"
            stroke="none"
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="invested"
            stroke="rgba(255,255,255,.35)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="corpus"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
            style={{ filter: 'drop-shadow(0 2px 6px rgba(16,185,129,.35))' }}
          />

          {fiPoint && (
            <ReferenceDot
              x={fiPoint.year}
              y={fiPoint.corpus}
              r={5}
              fill="var(--orange)"
              stroke="#fff"
              strokeWidth={1.5}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
