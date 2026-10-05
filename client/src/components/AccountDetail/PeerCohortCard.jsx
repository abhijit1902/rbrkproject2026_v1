import React from 'react';

export default function PeerCohortCard({ account, onSelectAccount }) {
  const peers = account.similarAccounts || [
    { name: 'CloudScale Therapeutics', arr: '$820k ARR', match: '84% Vector Match', desc: 'Similar Product X decline pattern (-16%)', riskType: 'warning' },
    { name: 'Stratos Aerospace Systems', arr: '$650k ARR', match: '79% Vector Match', desc: 'Unresolved support escalation blocker', riskType: 'warning' },
    { name: 'OmniCorp Global', arr: '$1.84M ARR', match: '73% Vector Match', desc: 'Exec sponsor transition during renewal window', riskType: 'error' }
  ];

  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-secondary text-[20px]">compare_arrows</span>
            <h3>Similar At-Risk Accounts</h3>
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant font-semibold">PEER COHORT</span>
        </div>

        <p className="text-xs text-on-surface-variant m-0">
          Accounts in {account.industry} exhibiting analogous telemetry anomalies:
        </p>

        {/* Peer Account Rows */}
        <div className="flex flex-col gap-space-sm">
          {peers.map((peer, idx) => {
            const isRed = peer.riskType === 'error';
            return (
              <div
                key={idx}
                className="p-space-sm rounded-lg bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/40 transition-colors flex flex-col gap-1 cursor-pointer"
                onClick={() => onSelectAccount(peer.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface font-bold hover:text-primary transition-colors">
                    {peer.name}
                  </span>
                  <span className="font-code-sm text-xs text-primary font-bold">{peer.arr}</span>
                </div>

                <span className="text-xs text-on-surface-variant line-clamp-1">{peer.desc}</span>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`font-label-sm text-[11px] font-semibold flex items-center gap-1 ${
                      isRed ? 'text-[#F4664A]' : 'text-[#F2B84B]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isRed ? 'bg-[#F4664A]' : 'bg-[#F2B84B]'}`}
                    ></span>
                    {peer.match}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAccount(peer.name);
                    }}
                    className="text-primary font-label-md text-xs hover:underline bg-transparent border-0 cursor-pointer font-semibold p-0"
                  >
                    Compare →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#213551]/40 flex items-center justify-between">
        <button
          onClick={() => alert(`Browsing all 14 accounts in peer cohort: ${account.industry}`)}
          type="button"
          className="font-label-md text-xs text-primary hover:text-primary-fixed bg-transparent border-0 cursor-pointer font-semibold p-0"
        >
          Browse Full Cohort (14) →
        </button>
      </div>
    </div>
  );
}
