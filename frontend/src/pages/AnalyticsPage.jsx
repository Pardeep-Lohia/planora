import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card.jsx';

function Stat({ label, value, sub, tone }) {
  const accent = tone === 'success' ? 'rgba(34,197,94,.95)' : tone === 'warning' ? 'rgba(245,158,11,.95)' : 'rgba(59,130,246,.98)';
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div className="muted" style={{ fontWeight: 850, fontSize: 13 }}>{label}</div>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: accent,
            boxShadow: `0 0 0 5px ${accent.replace(',.95', ',.18').replace(',.98', ',.18')}`
          }}
          aria-hidden="true"
        />
      </div>
      <div style={{ marginTop: 8, fontWeight: 950, fontSize: 26 }}>{value}</div>
      {sub ? <div className="muted" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4 }}>{sub}</div> : null}
    </Card>
  );
}

function BarRow({ label, value, max = 100, accent = 'rgba(59,130,246,.95)' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 56px', gap: 12, alignItems: 'center' }}>
      <div className="muted" style={{ fontWeight: 850, fontSize: 13 }}>{label}</div>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: 'rgba(59,130,246,.10)',
          border: '1px solid rgba(59,130,246,.16)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${accent}, rgba(96,165,250,.85))`,
            borderRadius: 999,
            transition: 'width .35s ease'
          }}
        />
      </div>
      <div style={{ textAlign: 'right', fontWeight: 950 }}>{value}%</div>
    </div>
  );
}

function MiniLineChart({ points = [10, 30, 22, 55, 48, 70, 62] }) {
  const max = 100;
  const min = 0;
  const w = 520;
  const h = 160;

  const mapped = points.map((v) => {
    const x = (points.indexOf(v) / Math.max(1, points.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return { x, y };
  });

  const d = mapped
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `${d} L ${w.toFixed(1)} ${h.toFixed(1)} L 0 ${h.toFixed(1)} Z`;

  return (
    <div style={{ marginTop: 14 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="200" role="img" aria-label="Weekly productivity chart">
        <defs>
          <linearGradient id="planoraLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(59,130,246,.98)" />
            <stop offset="55%" stopColor="rgba(96,165,250,.92)" />
            <stop offset="100%" stopColor="rgba(34,197,94,.85)" />
          </linearGradient>
          <linearGradient id="planoraArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,246,.26)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#planoraArea)" />
        <path d={d} fill="none" stroke="url(#planoraLine)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

        {mapped.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r={6} fill="rgba(255,255,255,.75)" stroke="rgba(59,130,246,.45)" strokeWidth="2" />
          </g>
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -4 }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((l) => (
          <div key={l} className="muted" style={{ fontSize: 12, fontWeight: 800 }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const completion = useMemo(
    () => [
      { label: 'Completed', value: 78 },
      { label: 'On track', value: 64 },
      { label: 'Needs follow-up', value: 26 }
    ],
    []
  );

  const weekly = useMemo(() => [22, 35, 28, 55, 48, 72, 60], []);

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 950, fontSize: 28, letterSpacing: '-.4px' }}>Analytics</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Track progress and tighten your system.
          </div>
        </div>
        <div className="badge">This week</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        <Stat label="Task completion rate" value="78%" sub="Higher completion = stronger consistency." tone="success" />
        <Stat label="Weekly focus" value="6.1h" sub="Timebox quality over raw hours." tone="primary" />
        <Stat label="Overdue risk" value="26%" sub="Turn pending into a single next action." tone="warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 18, alignItems: 'start' }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontWeight: 900 }}>Task completion rate</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
            A simple view of where your tasks stand.
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
            <BarRow label={completion[0].label} value={completion[0].value} accent="rgba(34,197,94,.95)" />
            <BarRow label={completion[1].label} value={completion[1].value} accent="rgba(59,130,246,.95)" />
            <BarRow label={completion[2].label} value={completion[2].value} max={100} accent="rgba(245,158,11,.95)" />
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <span className="badge" style={{ background: 'rgba(34,197,94,.10)', borderColor: 'rgba(34,197,94,.25)', color: 'rgba(34,197,94,.95)' }}>On track</span>
            <span className="badge" style={{ background: 'rgba(245,158,11,.10)', borderColor: 'rgba(245,158,11,.25)', color: 'rgba(245,158,11,.95)' }}>Follow-up</span>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900 }}>Weekly productivity</div>
              <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                Trend over the last 7 days.
              </div>
            </div>
            <div className="badge">Momentum</div>
          </div>

          <MiniLineChart points={weekly} />

          <div className="muted" style={{ marginTop: -2, fontSize: 12, lineHeight: 1.6 }}>
            Tip: aim for consistent wins. A small improvement every day beats occasional bursts.
          </div>
        </Card>
      </div>
    </div>
  );
}

