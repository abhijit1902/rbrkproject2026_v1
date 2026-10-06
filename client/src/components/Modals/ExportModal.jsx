import React from 'react';

export default function ExportModal({ isOpen, onClose, account }) {
  if (!isOpen || !account) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#1b4098] border border-[#3858a6] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3858a6] bg-[#12306f]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">description</span>
            <h2 className="font-headline-sm text-base text-on-surface font-bold m-0">
              Executive Briefing Document Preview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-[#2b5db3] transition-colors cursor-pointer bg-transparent border-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs text-on-surface bg-[#071445]/60 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#12306f] border border-[#3858a6]">
            <div className="flex items-center justify-between border-b border-[#3858a6] pb-2">
              <div>
                <h3 className="text-base font-bold text-white m-0">{account.name}</h3>
                <span className="text-[11px] text-on-surface-variant font-code-sm">
                  Document ID: REP-{account.id}-{new Date().getFullYear()}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-primary/20 text-primary font-bold text-[11px]">
                CONFIDENTIAL
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-3 text-xs">
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase">Current ARR</span>
                <strong className="text-white text-sm">{account.arrExact}</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase">Renewal Countdown</span>
                <strong className="text-error text-sm">{account.renewalDaysVal} Days Left</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px] uppercase">Health Index</span>
                <strong className="text-primary text-sm">{account.healthScore}</strong>
              </div>
            </div>

            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mt-4 mb-1">
              AI Synthesized Telemetry Audit
            </h4>
            <p className="text-on-surface text-xs leading-relaxed m-0">
              {account.execSummary}
            </p>

            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mt-4 mb-1">
              Critical Risk Triggers
            </h4>
            <ul className="m-0 pl-4 space-y-1 text-xs text-on-surface-variant">
              {(account.riskTriggers || []).map((t, i) => (
                <li key={i}>{t.text}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#3858a6] bg-[#12306f] flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">Formatted for Board & CSM review</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#2b5db3] hover:bg-[#3a66bb] text-on-surface font-semibold rounded-lg text-xs cursor-pointer border border-[#3858a6]"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed flex items-center gap-1.5 cursor-pointer border-0 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
