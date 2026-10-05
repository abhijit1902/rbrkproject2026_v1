import React, { useState } from 'react';

export default function WeeklyUsageTrendChart({ usage }) {
  const trend = usage?.weeklyUsageTrend || [
    { week: 'W1', apex: 1740, cohortAvg: 1650, target: 1800 },
    { week: 'W2', apex: 1720, cohortAvg: 1670, target: 1800 },
    { week: 'W3', apex: 1680, cohortAvg: 1680, target: 1800 },
    { week: 'W4', apex: 1610, cohortAvg: 1700, target: 1800 },
    { week: 'W5', apex: 1540, cohortAvg: 1720, target: 1800 },
    { week: 'W6', apex: 1490, cohortAvg: 1730, target: 1800 },
    { week: 'W7', apex: 1450, cohortAvg: 1750, target: 1800 },
    { week: 'W8', apex: 1420, cohortAvg: 1760, target: 1800 }
  ];

  const [activeTab, setActiveTab] = useState('ALL');

  // Convert points to SVG coordinates
  // X: 0 to 500 across 8 weeks (interval ~ 70)
  // Y: min 1300 to max 1900 (height 150)
  const getY = (val) => {
    const min = 1300;
    const max = 1900;
    return 140 - ((val - min) / (max - min)) * 120;
  };

  const getX = (idx) => {
    return 30 + idx * 62;
  };

  const actualPath = trend.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.apex);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const actualArea = `${actualPath} L ${getX(trend.length - 1)} 150 L ${getX(0)} 150 Z`;

  const cohortPath = trend.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.cohortAvg);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
            <h3>Weekly Active Users (WAU) vs Peer Cohort Benchmark</h3>
          </div>

          <div className="flex items-center gap-space-md font-label-md text-xs">
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-1 rounded-full bg-[#F4664A]"></span>
              <span>Account Actual (WAU)</span>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-1 rounded-full bg-[#3ECF8E]"></span>
              <span>Cohort Median Benchmark</span>
            </span>
            <span className="flex items-center gap-1.5 text-on-surface">
              <span className="w-3 h-0.5 bg-primary border-t border-dashed border-primary"></span>
              <span>Contract Target Capacity</span>
            </span>
          </div>
        </div>

        {/* Telemetry Chart Canvas */}
        <div className="relative w-full h-64 bg-[#051c36] border border-[#213551]/60 rounded-lg p-space-md flex flex-col justify-between overflow-hidden">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
          </div>

          {/* Anomaly Annotation Marker */}
          <div className="absolute top-6 left-[240px] z-10 flex flex-col items-start bg-[#162b46]/95 border border-[#F4664A]/50 p-2 rounded-lg shadow-xl max-w-[210px]">
            <div className="flex items-center gap-1 text-[#F4664A] font-label-sm text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">error</span>
              <span>W4–W5: Gateway v4.2 Anomaly</span>
            </div>
            <span className="text-[11px] text-on-surface mt-0.5 leading-snug">
              -230 active logistics seats lost post-migration
            </span>
            <div className="w-2.5 h-2.5 bg-[#162b46] border-r border-b border-[#F4664A]/50 rotate-45 absolute -bottom-1.5 left-6"></div>
          </div>

          {/* SVG Multi-Line Chart */}
          <svg className="w-full h-44 mt-2 overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 500 150">
            <defs>
              <linearGradient id="usageRiskGlow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F4664A" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#F4664A" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            {/* Target Capacity Line */}
            <line
              x1="30"
              y1={getY(1800)}
              x2="464"
              y2={getY(1800)}
              stroke="#2DD4CF"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Account Actual Area & Line */}
            <path d={actualArea} fill="url(#usageRiskGlow)" />
            <path d={actualPath} stroke="#F4664A" strokeLinecap="round" strokeWidth="3" />

            {/* Cohort Benchmark Line */}
            <path
              d={cohortPath}
              stroke="#3ECF8E"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Data Point Circles */}
            {trend.map((t, idx) => {
              const x = getX(idx);
              const y = getY(t.apex);
              const isLatest = idx === trend.length - 1;
              return (
                <g key={idx}>
                  {isLatest && (
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#F4664A"
                      className="animate-ping"
                      stroke="#00142c"
                      strokeWidth="2"
                    />
                  )}
                  <circle cx={x} cy={y} r="4" fill="#F4664A" stroke="#00142c" strokeWidth="1.5" />
                  <circle cx={x} cy={getY(t.cohortAvg)} r="3" fill="#3ECF8E" />
                </g>
              );
            })}
          </svg>

          {/* Axis Labels */}
          <div className="flex justify-between items-center text-outline-variant font-code-sm text-xs pt-2">
            {trend.map((t, idx) => (
              <span
                key={idx}
                className={idx === trend.length - 1 ? 'text-error font-bold' : ''}
              >
                {t.week} ({t.apex} WAU)
              </span>
            ))}
          </div>
        </div>

        {/* Footer analysis note */}
        <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant px-1">
          <span>
            Telemetry Velocity Delta: <strong className="text-error">-18.4%</strong> divergence against peer benchmark over preceding 60 days
          </span>
          <button
            onClick={() => alert('Exporting full time-series telemetry telemetry.csv with hourly breakdowns.')}
            type="button"
            className="text-primary hover:underline bg-transparent border-0 cursor-pointer font-semibold"
          >
            Export Time-Series Telemetry (CSV) →
          </button>
        </div>
      </div>
    </div>
  );
}
