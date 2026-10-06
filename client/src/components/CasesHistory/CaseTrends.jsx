import React from 'react';

const CAT_COLORS = ['#66cfee', '#a78bfa', '#f59e0b', '#ff6b6b', '#34d399', '#9db4e2'];

// Real account-level numbers (last 90 days) used instead of the sample weekly chart
function AggregateTrends({ aggregates }) {
  const l = aggregates.last90;
  const maxCases = Math.max(...aggregates.recurring.map(r => r.cases));
  const sev = [
    { label: 'P1', count: l.p1, color: '#ff6b6b' },
    { label: 'P2', count: l.p2, color: '#f59e0b' },
    { label: 'P3', count: l.p3, color: '#a78bfa' },
    { label: 'P4', count: l.p4, color: '#9db4e2' },
  ];
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-7 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#f59e0b] text-xl">repeat</span>
          <h3 className="text-sm font-bold text-white m-0">Recurring Issues (Last 90 Days)</h3>
        </div>
        <div className="flex flex-col gap-4">
          {aggregates.recurring.map((r, i) => (
            <div key={r.issue}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#e9f0ff] font-medium">{r.issue}</span>
                <span className="text-[11px] text-[#9db4e2]">
                  <b className="text-white">{r.cases}</b> cases{r.open != null ? ' · ' + r.open + ' open' : ' · open count not pulled'}
                </span>
              </div>
              <div className="h-2 bg-[#3858a6]/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: (r.cases / maxCases) * 100 + '%', background: CAT_COLORS[i % CAT_COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-5 flex flex-col gap-5">
        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#ff6b6b] text-xl">priority_high</span>
            <h3 className="text-sm font-bold text-white m-0">{l.created} Cases Created (Last 90 Days)</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {sev.map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.color + '1a', border: '1px solid ' + s.color + '40' }}>
                <div className="text-2xl font-bold text-white">{s.count}</div>
                <div className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2]">Average Resolution Time</div>
          <div className="text-3xl font-bold text-white mt-1">{l.avgResolutionDays} days</div>
          <div className="text-[11px] text-[#9db4e2] mt-1">Based on the {l.avgBasis}</div>
        </div>
        {aggregates.note && <p className="text-[11px] text-[#9db4e2] m-0 leading-relaxed">{aggregates.note}</p>}
      </div>
    </div>
  );
}

export default function CaseTrends({ cases, aggregates, weekly = [] }) {
  if (aggregates) return <AggregateTrends aggregates={aggregates} />;
  const WEEKLY_VOLUME = weekly;
  const W = 560;
  const H = 220;
  const pad = { l: 30, r: 10, t: 10, b: 28 };
  const max = Math.max(...WEEKLY_VOLUME.flatMap(w => [w.opened, w.resolved]));
  const groupW = (W - pad.l - pad.r) / WEEKLY_VOLUME.length;
  const barW = groupW * 0.32;
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, Math.round(max / 2), max];

  const byCategory = Object.entries(
    cases.reduce((acc, c) => ({ ...acc, [c.category]: (acc[c.category] || 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1]);
  const catMax = byCategory[0] ? byCategory[0][1] : 1;

  const bySeverity = ['P1', 'P2', 'P3'].map(s => ({
    s,
    count: cases.filter(c => c.severity === s && c.status !== 'Resolved').length,
  }));

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#66cfee] text-xl">bar_chart</span>
            <h3 className="text-sm font-bold text-white m-0">Weekly Case Volume</h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#9db4e2]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#ff6b6b]" />Opened</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#34d399]" />Resolved</span>
          </div>
        </div>
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full h-auto">
          {ticks.map(t => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#3858a6" strokeDasharray="3 3" />
              <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#9db4e2">{t}</text>
            </g>
          ))}
          {WEEKLY_VOLUME.map((w, i) => {
            const x0 = pad.l + i * groupW + groupW / 2;
            return (
              <g key={w.week}>
                <rect x={x0 - barW - 1} y={y(w.opened)} width={barW} height={H - pad.b - y(w.opened)} rx="2" fill="#ff6b6b" />
                <rect x={x0 + 1} y={y(w.resolved)} width={barW} height={H - pad.b - y(w.resolved)} rx="2" fill="#34d399" />
                <text x={x0} y={H - 10} textAnchor="middle" fontSize="10" fill="#9db4e2">{w.week}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="col-span-4 flex flex-col gap-5">
        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl">category</span>
            <h3 className="text-sm font-bold text-white m-0">Cases by Category</h3>
          </div>
          <div className="flex flex-col gap-3">
            {byCategory.map(([name, count], i) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-[#e9f0ff]">{name}</span>
                  <span className="text-[11px] font-bold" style={{ color: CAT_COLORS[i % CAT_COLORS.length] }}>{count}</span>
                </div>
                <div className="h-1.5 bg-[#3858a6] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: (count / catMax) * 100 + '%', background: CAT_COLORS[i % CAT_COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#ff6b6b] text-xl">priority_high</span>
            <h3 className="text-sm font-bold text-white m-0">Open by Severity</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {bySeverity.map(({ s, count }) => {
              const color = s === 'P1' ? '#ff6b6b' : s === 'P2' ? '#f59e0b' : '#a78bfa';
              return (
                <div key={s} className="rounded-xl p-3 text-center" style={{ background: color + '1a', border: '1px solid ' + color + '40' }}>
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-[10px] font-bold" style={{ color }}>{s}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
