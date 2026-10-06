import React from 'react';

export default function RecommendedActionsCard({ account, onOpenPlaybookModal }) {
  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
            </div>
            <h3>Recommended Actions</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#3858a6] text-primary font-label-sm text-xs font-bold">
            AI OPTIMIZED
          </span>
        </div>

        {/* Big Stat */}
        <div className="flex items-baseline gap-space-sm p-space-md rounded-lg bg-[#12306f] border border-[#3858a6]/60">
          <span className="font-display-lg text-4xl font-bold text-on-surface leading-none text-white">
            {account.actionsOpenCount || 4}
          </span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm text-on-surface font-bold leading-tight">
              Open Prescriptions
            </span>
            <span className="text-xs text-on-surface-variant">
              Prioritized by revenue exposure
            </span>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-space-sm">
          <div className="p-space-sm rounded-lg bg-[#12306f] border border-[#3858a6]/40 flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Model Confidence</span>
            <span className="font-headline-md text-xl text-primary font-bold mt-1">
              {account.actionsConfidence || '82%'}
            </span>
            <span className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">High Validation</span>
          </div>

          <div className="p-space-sm rounded-lg bg-[#12306f] border border-[#3858a6]/40 flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Audit Integrity</span>
            <span className="font-headline-md text-xl text-[#3ECF8E] font-bold mt-1">100%</span>
            <span className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">Evidence-Linked</span>
          </div>
        </div>

        {/* Active Playbook Card */}
        <div className="p-space-sm rounded-lg bg-[#2b5db3]/70 border border-[#3858a6] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">play_circle</span>
              ACTIVE PLAYBOOK
            </span>
            <span className="font-code-sm text-xs text-on-surface-variant font-semibold">
              {account.playbookStep || 'Step 2 of 5'}
            </span>
          </div>
          <span className="font-body-md text-sm text-on-surface font-semibold truncate">
            {account.playbookTitle || 'Retention Playbook'}
          </span>
          <div className="w-full bg-[#071445] h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${account.playbookProgress ?? 40}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between">
        <button
          onClick={onOpenPlaybookModal}
          type="button"
          className="font-label-md text-xs text-primary hover:text-primary-fixed bg-transparent border-0 cursor-pointer font-semibold p-0"
        >
          Manage Playbook Execution →
        </button>
      </div>
    </div>
  );
}
