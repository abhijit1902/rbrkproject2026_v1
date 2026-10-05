import React, { useState } from 'react';

export default function PlaybookModal({ isOpen, onClose, account, onTriggerPlaybook, isDispatching }) {
  if (!isOpen || !account) return null;

  const [activeTab, setActiveTab] = useState('STEPS');

  const steps = [
    { step: 1, title: 'Telemetry Anomaly Triage', dept: 'DATA OPS', status: 'Completed', time: '4h ago', details: 'Auto-triaged Product X usage decline (-18%) across 420 active seats.' },
    { step: 2, title: 'Cross-functional Dispatch Notification', dept: 'CSM & DEV', status: 'Completed', time: '2h ago', details: 'Notified CSM Daniela Reyes and escalated Zendesk ticket #89201 to Tier-3 team.' },
    { step: 3, title: 'Executive Alignment Briefing', dept: 'EXECUTIVE', status: 'In Progress', time: 'Active', details: 'Briefing CTO Marcus Vance with preliminary root-cause assessment on migration sprint.' },
    { step: 4, title: 'Contract Concession & Extension Package', dept: 'RETENTION', status: 'Pending', time: 'Queued', details: 'Draft multi-year discount structure with $120k Product Y expansion offset.' },
    { step: 5, title: 'Automated Post-Mortem & SFDC Sync', dept: 'SYSTEM', status: 'Pending', time: 'Queued', details: 'Update SFDC Opportunity stage and log retention playbook outcome.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#09203b] border border-[#213551] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#213551] bg-[#051c36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">play_circle</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-base text-on-surface font-bold m-0">
                  {account.playbookTitle || 'Retention Playbook'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-primary/20 text-primary font-bold">
                  ACTIVE
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                Target Entity: {account.name} ({account.id}) • ARR at Stake: {account.arrExact}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-[#162b46] transition-colors cursor-pointer bg-transparent border-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-[#00142c] border-b border-[#213551] flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-on-surface-variant">
              Execution Stage: <strong className="text-primary">{account.playbookStep || 'Step 2 of 5'}</strong>
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">
              Model Confidence: <strong className="text-[#3ECF8E]">{account.actionsConfidence || '82%'}</strong>
            </span>
          </div>

          <button
            onClick={onTriggerPlaybook}
            disabled={isDispatching}
            className="px-3 py-1 bg-primary text-on-primary font-label-md text-xs font-bold rounded-lg hover:bg-primary-fixed disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer border-0"
          >
            <span className={`material-symbols-outlined text-[15px] ${isDispatching ? 'animate-spin' : ''}`}>
              {isDispatching ? 'refresh' : 'restart_alt'}
            </span>
            <span>{isDispatching ? 'Dispatching...' : 'Re-dispatch Playbook'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#051c36] h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${account.playbookProgress || 40}%` }}
          ></div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {steps.map((st) => (
            <div
              key={st.step}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                st.status === 'Completed'
                  ? 'bg-[#051c36]/60 border-[#3ECF8E]/30'
                  : st.status === 'In Progress'
                  ? 'bg-[#162b46] border-primary/50 shadow-md'
                  : 'bg-[#000e23]/50 border-[#213551]/40 opacity-70'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  st.status === 'Completed'
                    ? 'bg-[#3ECF8E]/20 text-[#3ECF8E]'
                    : st.status === 'In Progress'
                    ? 'bg-primary text-on-primary animate-pulse'
                    : 'bg-[#213551] text-on-surface-variant'
                }`}
              >
                {st.status === 'Completed' ? '✓' : st.step}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface">{st.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-code-sm bg-[#000e23] border border-[#213551] text-on-surface-variant font-semibold">
                      {st.dept}
                    </span>
                  </div>
                  <span
                    className={`font-code-sm text-xs font-semibold ${
                      st.status === 'Completed'
                        ? 'text-[#3ECF8E]'
                        : st.status === 'In Progress'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {st.status} • {st.time}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 mb-0 leading-relaxed">
                  {st.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#213551] bg-[#051c36] flex items-center justify-between text-xs text-on-surface-variant">
          <span>Audit Log ID: #AUD-99420-PLB</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#162b46] hover:bg-[#263a56] text-on-surface font-semibold rounded-lg transition-colors cursor-pointer border border-[#213551]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
