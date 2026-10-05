import React, { useState } from 'react';

export default function TelemetryVelocityChart({ account }) {
  const chartData = account.chartAnnotation || {
    header: '12d Ago: Spike Alert',
    body: 'Support case spike begins (3 P1/P2 cases opened)',
    riskPathD: 'M 0 130 Q 80 120, 150 115 T 280 100 T 360 40 T 430 30 T 500 25',
    riskAreaD: 'M 0 130 Q 80 120, 150 115 T 280 100 T 360 40 T 430 30 T 500 25 L 500 150 L 0 150 Z',
    oppPathD: 'M 0 140 Q 90 135, 180 110 T 310 95 T 410 105 T 500 110',
    oppAreaD: 'M 0 140 Q 90 135, 180 110 T 310 95 T 410 105 T 500 110 L 500 150 L 0 150 Z',
    c1: [360, 40],
    c2: [500, 25],
    c3: [410, 105],
    correlation: 'Correlation Coefficient: <strong>0.88</strong> between support tickets & license deactivations'
  };

  const [activeRange, setActiveRange] = useState('90D');

  return (
    <div className="lg:col-span-7 p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between select-none">
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
            <div className="flex items-center bg-[#051c36] border border-[#213551] rounded-lg p-0.5 ml-2">
              {['30D', '60D', '90D'].map((range) => (
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

        {/* Telemetry Chart Container */}
        <div className="relative w-full h-64 bg-[#051c36] border border-[#213551]/60 rounded-lg p-space-md flex flex-col justify-between overflow-hidden">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
            <div className="w-full border-b border-outline"></div>
          </div>

          {/* Annotation Badge pinned to 12 days ago spike */}
          <div className="absolute top-5 right-16 z-10 flex flex-col items-start bg-[#162b46]/95 border border-[#F4664A]/40 p-2.5 rounded-lg shadow-xl max-w-[220px]">
            <div className="flex items-center gap-1 text-[#F4664A] font-label-sm text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{chartData.header}</span>
            </div>
            <span className="text-xs text-on-surface mt-1 leading-snug">
              {chartData.body}
            </span>
            <div className="w-2.5 h-2.5 bg-[#162b46] border-r border-b border-[#F4664A]/40 rotate-45 absolute -bottom-1.5 left-6"></div>
          </div>

          {/* Inline SVG Multi-Line Chart */}
          <svg className="w-full h-44 mt-2 overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 500 150">
            <defs>
              <linearGradient id="riskGlowGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F4664A" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#F4664A" stopOpacity="0.0"></stop>
              </linearGradient>
              <linearGradient id="oppGlowGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2DD4CF" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#2DD4CF" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            {/* Risk Area & Line */}
            <path d={chartData.riskAreaD} fill="url(#riskGlowGrad)" />
            <path
              d={chartData.riskPathD}
              stroke="#F4664A"
              strokeLinecap="round"
              strokeWidth="3"
            />

            {/* Opportunity Area & Line */}
            <path d={chartData.oppAreaD} fill="url(#oppGlowGrad)" />
            <path
              d={chartData.oppPathD}
              stroke="#2DD4CF"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="2.5"
            />

            {/* Key Data Points */}
            <circle
              className="animate-ping"
              cx={chartData.c1[0]}
              cy={chartData.c1[1]}
              fill="#F4664A"
              r="6"
              stroke="#00142C"
              strokeWidth="2"
            />
            <circle cx={chartData.c1[0]} cy={chartData.c1[1]} fill="#F4664A" r="4.5" />
            <circle cx={chartData.c2[0]} cy={chartData.c2[1]} fill="#F4664A" r="4.5" />
            <circle cx={chartData.c3[0]} cy={chartData.c3[1]} fill="#2DD4CF" r="4.5" />
          </svg>

          {/* Axis Labels */}
          <div className="flex justify-between items-center text-outline-variant font-code-sm text-xs pt-2">
            <span>OCT 01</span>
            <span>OCT 15</span>
            <span>NOV 01</span>
            <span>NOV 15</span>
            <span className="text-error font-bold">NOV 22 (CURRENT)</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <span dangerouslySetInnerHTML={{ __html: chartData.correlation }} />
          <button
            onClick={() => alert('Deep-Dive Telemetry Correlator: Multi-variate Pearson coefficient = 0.88 with 95% statistical confidence.')}
            type="button"
            className="text-primary hover:underline bg-transparent border-0 cursor-pointer font-semibold"
          >
            Deep-Dive Correlator →
          </button>
        </div>
      </div>
    </div>
  );
}
