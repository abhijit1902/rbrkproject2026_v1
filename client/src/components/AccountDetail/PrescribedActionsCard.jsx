import React from 'react';

export default function PrescribedActionsCard({ account, onOpenPlaybookModal }) {
  const actions = account.prescribedActions || [];

  return (
    <div className="lg:col-span-5 p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
            <h3>Prescribed Action Items ({actions.length})</h3>
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant font-semibold">
            PRIORITY QUEUE
          </span>
        </div>

        {/* Actions List */}
        <div className="flex flex-col gap-space-sm">
          {actions.map((act) => (
            <div
              key={act.id}
              className="p-space-sm rounded-lg bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/40 transition-colors flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded font-label-sm text-[11px] font-bold ${act.deptColor}`}>
                  {act.dept}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="font-code-sm text-[11px] font-semibold flex items-center gap-1"
                    style={{ color: act.statusColor }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: act.statusColor }}
                    ></span>
                    {act.status}
                  </span>
                  <span className="text-outline-variant font-code-sm text-[11px]">{act.time}</span>
                </div>
              </div>

              <span className="text-xs text-on-surface font-semibold mt-0.5">
                {act.title}
              </span>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-code-sm text-[11px] text-on-surface-variant">{act.assignee}</span>
                <button
                  type="button"
                  onClick={onOpenPlaybookModal}
                  className="text-primary hover:text-primary-fixed font-label-md text-xs font-bold bg-transparent border-0 cursor-pointer p-0"
                >
                  {act.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#213551]/40 flex items-center justify-between">
        <button
          onClick={onOpenPlaybookModal}
          type="button"
          className="font-label-md text-xs text-primary hover:text-primary-fixed bg-transparent border-0 cursor-pointer font-semibold p-0"
        >
          View Action Playbook Execution Log →
        </button>
      </div>
    </div>
  );
}
