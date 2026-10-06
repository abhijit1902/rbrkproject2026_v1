import React from 'react';

export default function HealthDonutCard({ account }) {
  const isError = account.statusType === 'error';
  const colors = account.healthDonutColors || ['#3ECF8E', '#F2B84B', '#F4664A', '#3ECF8E', '#F2B84B', '#66cfee'];

  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md hover:bg-[#2b5db3] transition-colors select-none">
      <div className="flex flex-col gap-space-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-secondary text-[20px]">donut_large</span>
            <h3>Account Health Breakdown</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full font-label-sm text-xs font-bold ${
              isError ? 'bg-error-container/40 text-error' : 'bg-[#F2B84B]/20 text-[#F2B84B]'
            }`}
          >
            Score: {account.healthScore}
          </span>
        </div>

        {/* SVG Multi-Segment Donut Chart */}
        <div className="relative flex items-center justify-center my-space-xs">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-[#3858a6]"
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke="currentColor"
              strokeWidth="9"
            ></circle>
            {/* 6 Segment rings */}
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[0] || '#3ECF8E'}
              strokeDasharray="36 203"
              strokeDashoffset="0"
              strokeWidth="9"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[1] || '#F2B84B'}
              strokeDasharray="36 203"
              strokeDashoffset="-40"
              strokeWidth="9"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[2] || '#F4664A'}
              strokeDasharray="36 203"
              strokeDashoffset="-80"
              strokeWidth="9"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[3] || '#3ECF8E'}
              strokeDasharray="36 203"
              strokeDashoffset="-120"
              strokeWidth="9"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[4] || '#F2B84B'}
              strokeDasharray="36 203"
              strokeDashoffset="-160"
              strokeWidth="9"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="38"
              stroke={colors[5] || '#66cfee'}
              strokeDasharray="36 203"
              strokeDashoffset="-200"
              strokeWidth="9"
            ></circle>
          </svg>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Status
            </span>
            <span
              className={`font-headline-sm text-base font-bold leading-tight ${
                isError ? 'text-error' : 'text-[#F2B84B]'
              }`}
            >
              {account.healthStatusTitle}
            </span>
            <span className="font-label-sm text-xs font-semibold text-on-surface">
              {account.healthStatusSub}
            </span>
          </div>
        </div>

        {/* 6-Dimension Legend Grid */}
        <div className="grid grid-cols-2 gap-x-space-md gap-y-space-xs text-xs pt-space-xs">
          {(account.healthDimensions || []).map((dim, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-[#12306f] border border-[#3858a6]/40"
            >
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: dim.color }}
                ></span>
                <span>{dim.label}</span>
              </span>
              <span className="font-semibold font-code-sm text-[11px]" style={{ color: dim.color }}>
                {dim.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">Telemetry refresh: 4m ago</span>
        <button
          onClick={() => alert(`Opening Full 6-Dimension Telemetry Matrix for ${account.name}`)}
          type="button"
          className="font-label-md text-primary hover:underline bg-transparent border-0 cursor-pointer font-semibold"
        >
          Telemetry Matrix →
        </button>
      </div>
    </div>
  );
}
