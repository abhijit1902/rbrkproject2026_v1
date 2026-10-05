import React from 'react';

export default function RenewalRiskCard({ account, onOpenRenewalPlan }) {
  const isError = account.statusType === 'error';

  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md hover:bg-[#162b46] transition-colors select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span
              className={`material-symbols-outlined text-[20px] ${
                isError ? 'text-error' : 'text-[#F2B84B]'
              }`}
            >
              fmd_bad
            </span>
            <h3>Renewal &amp; Risk Detail</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full font-label-sm text-xs font-bold flex items-center gap-1 ${
              isError
                ? 'bg-error-container/40 text-error'
                : 'bg-[#F2B84B]/20 text-[#F2B84B]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">alarm</span>
            <span>{account.renewalDetailHeader || 'URGENT'}</span>
          </span>
        </div>

        {/* Big Highlight Counter */}
        <div className="p-space-md rounded-lg bg-[#051c36] border border-[#213551]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              Time to Expiration
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`font-display-md text-3xl font-bold leading-none ${
                  isError ? 'text-error' : 'text-[#F2B84B]'
                }`}
              >
                {account.renewalDaysVal}
              </span>
              <span
                className={`font-headline-md text-base font-bold ${
                  isError ? 'text-error' : 'text-on-surface'
                }`}
              >
                Days Left
              </span>
            </div>
            <span className="text-xs text-on-surface-variant mt-1">
              Target ARR: <strong className="text-on-surface">{account.arrExact}</strong> @ Risk
            </span>
          </div>

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isError ? 'bg-error-container/30 text-error' : 'bg-[#F2B84B]/20 text-[#F2B84B]'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] animate-pulse">
              {account.renewalDetailIcon || 'crisis_alert'}
            </span>
          </div>
        </div>

        {/* Specific Risk Flags List */}
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Active Risk Triggers ({(account.riskTriggers || []).length})
          </span>
          <div className="flex flex-col gap-1.5 mt-1">
            {(account.riskTriggers || []).map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-space-sm p-2 rounded bg-[#051c36] hover:bg-[#213551] transition-colors border border-[#213551]/30"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: t.dotColor }}
                ></span>
                <span className="text-xs text-on-surface truncate">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-space-md mt-space-md border-t border-[#213551]/40">
        <button
          onClick={onOpenRenewalPlan}
          type="button"
          className="w-full py-2 px-space-md rounded-lg bg-[#213551] hover:bg-primary hover:text-on-primary text-primary font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-0"
        >
          <span>View Renewal Plan</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
