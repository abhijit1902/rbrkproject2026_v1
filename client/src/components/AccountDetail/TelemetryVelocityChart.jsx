import React, { useState } from 'react';

const RANGE_POINTS = { '30D': 5, '60D': 9, '90D': 13 };
const W = 500;
const H = 150;
const PAD_TOP = 12;

const toTime = (label) => new Date(label + ', 2026').getTime();

export default function TelemetryVelocityChart({ account }) {
  const [activeRange, setActiveRange] = useState('90D');

  const all = account.telemetrySeries || [];
  const annotations = account.telemetryAnnotations || [];

  if (all.length < 2) {
    return (
      <div className="lg:col-span-12 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col gap-space-sm select-none">
        <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
          <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
          <h3>Signal Telemetry &amp; Velocity (Past 90 Days)</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">cloud_off</span>
          <p className="text-sm m-0 font-semibold text-on-surface">No telemetry series available for this account</p>
        </div>
      </div>
    );
  }

  const series = all.slice(-RANGE_POINTS[activeRange]);
  const max = Math.max(...series.flatMap(p => [p.risk, p.opp])) * 1.15;
  const x = (i) => (i / (series.length - 1)) * W;
  const y = (v) => PAD_TOP + (H - PAD_TOP) * (1 - v / max);
  const line = (key) => series.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + x(i).toFixed(1) + ' ' + y(p[key]).toFixed(1)).join(' ');
  const area = (key) => line(key) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z';

  // pin each annotation to the nearest weekly point that is inside the visible range
  const pinned = annotations
    .map(a => {
      const t = toTime(a.date);
      let best = 0;
      series.forEach((p, i) => {
        if (Math.abs(toTime(p.date) - t) < Math.abs(toTime(series[best].date) - t)) best = i;
      });
      const inRange = t >= toTime(series[0].date) - 3 * 86400000;
      return { ...a, idx: best, inRange };
    })
    .filter(a => a.inRange);

  const last = series[series.length - 1];
  const tickEvery = series.length > 9 ? 3 : 2;

  return (
    <div className="lg:col-span-12 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
            <h3>Signal Telemetry &amp; Velocity (Past 90 Days)</h3>
          </div>

          <div className="flex items-center gap-space-md font-label-md text-xs">
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-1 rounded-full bg-[#F4664A]"></span>
              <span>Risk Signals (Coral)</span>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-1 rounded-full bg-primary"></span>
              <span>Opportunity (Teal)</span>
            </span>

            {/* Time range pills */}
            <div className="flex items-center bg-[#12306f] border border-[#3858a6] rounded-lg p-0.5 ml-2">
              {Object.keys(RANGE_POINTS).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  type="button"
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer border-0 transition-colors ${
                    activeRange === range
                      ? 'bg-primary text-on-primary'
                      : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Annotations */}
        {pinned.length > 0 && (
          <div className="flex flex-wrap gap-space-sm">
            {pinned.map((a, i) => (
              <div key={i} className="flex flex-col bg-[#2b5db3]/60 border border-[#F4664A]/40 px-space-md py-space-sm rounded-lg max-w-md">
                <div className="flex items-center gap-1 text-[#F4664A] font-label-sm text-xs font-bold">
                  <span className="material-symbols-outlined text-[15px]">error</span>
                  <span>{a.daysAgo}d ago ({a.date}): {a.header}</span>
                </div>
                <span className="text-xs text-on-surface mt-1 leading-snug">{a.body}</span>
              </div>
            ))}
          </div>
        )}

        {/* Telemetry Chart Container */}
        <div className="relative w-full h-64 bg-[#12306f] border border-[#3858a6]/60 rounded-lg p-space-md flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
          </div>

          <svg className="w-full h-44 mt-2 overflow-visible" fill="none" preserveAspectRatio="none" viewBox={'0 0 ' + W + ' ' + H}>
            <defs>
              <linearGradient id="riskGlowGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F4664A" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#F4664A" stopOpacity="0.0"></stop>
              </linearGradient>
              <linearGradient id="oppGlowGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66cfee" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#66cfee" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            {/* annotation markers */}
            {pinned.map((a, i) => (
              <line key={'m' + i} x1={x(a.idx)} x2={x(a.idx)} y1={PAD_TOP} y2={H} stroke="#F4664A" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            ))}

            <path d={area('risk')} fill="url(#riskGlowGrad)" />
            <path d={line('risk')} stroke="#F4664A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />

            <path d={area('opp')} fill="url(#oppGlowGrad)" />
            <path d={line('opp')} stroke="#66cfee" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

            {pinned.map((a, i) => (
              <circle key={'d' + i} cx={x(a.idx)} cy={y(series[a.idx].risk)} fill="#F4664A" r="4.5" stroke="#071445" strokeWidth="1.5" />
            ))}
            <circle cx={x(series.length - 1)} cy={y(last.risk)} fill="#F4664A" r="4.5" />
            <circle cx={x(series.length - 1)} cy={y(last.opp)} fill="#66cfee" r="4.5" />
          </svg>

          {/* Axis Labels */}
          <div className="flex justify-between items-center text-outline-variant font-code-sm text-xs pt-2">
            {series.map((p, i) => (
              <span key={p.date} className={i === series.length - 1 ? 'text-error font-bold' : ''}>
                {i % tickEvery === 0 || i === series.length - 1 ? p.date.toUpperCase() : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span>
            {account.telemetryCorrelation
              ? 'Correlation Coefficient: ' + account.telemetryCorrelation
              : 'Latest week (' + last.date + '): risk ' + last.risk + ', opportunity ' + last.opp}
          </span>
          <span className="font-code-sm">Latest: risk {last.risk} · opportunity {last.opp}</span>
        </div>
      </div>
    </div>
  );
}
