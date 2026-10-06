import React from 'react';

export default function UsageMetricStrip({ usage, onOpenSeatOptimizer }) {
  if (!usage) return null;

  const isWauDrop = usage.wauDeltaType === 'error';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md select-none">
      {/* Metric 1: WAU */}
      <div className="p-space-md rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
            Weekly Active Users
          </span>
          <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
            {usage.wau}
          </div>
          <span
            className={`font-code-sm text-xs flex items-center gap-0.5 mt-0.5 font-bold ${
              isWauDrop ? 'text-error' : 'text-[#3ECF8E]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isWauDrop ? 'trending_down' : 'trending_up'}
            </span>
            {usage.wauDelta}
          </span>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isWauDrop ? 'bg-error-container/30 text-error' : 'bg-primary/10 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">group</span>
        </div>
      </div>

      {/* Metric 2: License Utilization */}
      <div className="p-space-md rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
            License Saturation
          </span>
          <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
            {usage.licenseUtilization}
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant mt-0.5 block">
            {usage.activeSeats} of {usage.totalSeats} seats active
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[24px]">badge</span>
        </div>
      </div>

      {/* Metric 3: Stickiness (DAU/MAU) */}
      <div className="p-space-md rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
            Stickiness (DAU / MAU)
          </span>
          <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
            {usage.dauMauRatio}
          </div>
          <span
            className={`font-code-sm text-xs font-bold mt-0.5 block ${
              usage.stickinessStatus === 'At Risk' ? 'text-error' : usage.stickinessStatus === 'Healthy' ? 'text-[#3ECF8E]' : 'text-[#F2B84B]'
            }`}
          >
            {usage.stickinessStatus} Baseline
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[24px]">speed</span>
        </div>
      </div>

      {/* Metric 4: Feature Depth Score */}
      <div className="p-space-md rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
            Feature Depth Score
          </span>
          <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
            {usage.featureDepthScore}
          </div>
          <span className="font-code-sm text-xs text-error font-bold mt-0.5 block">
            {usage.featureDepthDelta}
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#F2B84B]/15 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B]">
          <span className="material-symbols-outlined text-[24px]">radar</span>
        </div>
      </div>

      {/* Metric 5: Dormant ARR Exposure */}
      <div className="p-space-md rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
            Dormant ARR Capital
          </span>
          <div className="font-headline-lg text-2xl text-error font-bold mt-0.5">
            {usage.dormantArrExposure}
          </div>
          <button
            onClick={onOpenSeatOptimizer}
            className="font-code-sm text-xs text-primary hover:underline font-bold mt-0.5 block bg-transparent border-0 p-0 cursor-pointer text-left"
          >
            Optimize {usage.dormantSeats} Seats →
          </button>
        </div>
        <div className="w-10 h-10 rounded-lg bg-error-container/30 border border-error/40 flex items-center justify-center text-error">
          <span className="material-symbols-outlined text-[24px]">savings</span>
        </div>
      </div>
    </div>
  );
}
