import React from 'react';

export default function SignalsCard({ account }) {
  const summary = account.signalsSummary || { total: 4, risks: '2 Critical Churn Risks', warns: '1 Operational Warning', opps: '1 Expansion Upsell' };
  const list = account.signalsList || [];

  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
            <h3>Signals for This Account</h3>
          </div>
          <span className="font-code-sm text-xs text-primary font-bold">REAL-TIME</span>
        </div>

        {/* Donut & Summary Legend */}
        <div className="flex items-center gap-space-lg">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="text-[#213551]"
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="#F4664A"
                strokeDasharray="119 239"
                strokeDashoffset="0"
                strokeWidth="12"
              ></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="#F2B84B"
                strokeDasharray="59 239"
                strokeDashoffset="-120"
                strokeWidth="12"
              ></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="38"
                stroke="#2DD4CF"
                strokeDasharray="59 239"
                strokeDashoffset="-180"
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-headline-md text-xl font-bold text-on-surface leading-none">
                {summary.total}
              </span>
              <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">SIGNALS</span>
            </div>
          </div>

          {/* Distribution legend */}
          <div className="flex flex-col gap-1.5 font-label-md text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4664A] shrink-0"></span>
              <span className="text-on-surface">{summary.risks}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2B84B] shrink-0"></span>
              <span className="text-on-surface">{summary.warns}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
              <span className="text-on-surface">{summary.opps}</span>
            </div>
          </div>
        </div>

        {/* Detailed Signals List */}
        <div className="flex flex-col gap-2">
          {list.map((sig, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-[#051c36] border border-[#213551]/30 flex items-start gap-2 hover:bg-[#162b46] transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: sig.dotColor }}
              ></span>
              <div className="flex flex-col min-w-0">
                <span className="text-on-surface font-semibold text-xs truncate">{sig.title}</span>
                <span className="text-on-surface-variant font-code-sm text-[11px]">{sig.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#213551]/40 flex items-center justify-between">
        <button
          onClick={() => alert(`Showing telemetry webhook stream and raw event logs for ${account.name}`)}
          type="button"
          className="font-label-md text-xs text-primary hover:text-primary-fixed bg-transparent border-0 cursor-pointer font-semibold p-0"
        >
          Signal Log &amp; Webhooks →
        </button>
      </div>
    </div>
  );
}
