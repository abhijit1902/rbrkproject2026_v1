import React from 'react';

export function ContractsCard({ contracts }) {
  return (
    <div className="lg:col-span-2 p-space-lg rounded-xl bg-[#1c3f96]/40 border border-[#3858a6] shadow-md flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
          <span className="material-symbols-outlined text-primary text-[20px]">description</span>
          <h3 className="m-0">Contracts</h3>
        </div>
        <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
          {contracts.length} contracts
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {contracts.map(c => (
          <div key={c.id} className="flex items-center justify-between gap-space-md p-space-sm rounded-lg bg-[#12306f] border border-[#3858a6]/50">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-on-surface">{c.name}</span>
                {c.dueSoon && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F2B84B]/20 text-[#F2B84B]">RENEWS FIRST</span>
                )}
              </div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">
                {c.id} · {c.term} · {c.lines} {c.lines === 1 ? 'line' : 'lines'}
              </div>
              {c.note && <div className="text-[11px] text-primary mt-0.5">{c.note}</div>}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Ends</div>
              <div className="text-sm font-bold text-on-surface">{c.ends}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EngagementCard({ engagement }) {
  const rows = [
    ['Last touch', engagement.lastTouch],
    ['Last meeting', engagement.lastMeeting],
    ['Next meeting', engagement.nextMeeting],
  ];
  return (
    <div className="p-space-lg rounded-xl bg-[#1c3f96]/40 border border-[#3858a6] shadow-md flex flex-col gap-space-sm">
      <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
        <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
        <h3 className="m-0">Engagement</h3>
      </div>
      <div className="flex items-baseline gap-space-sm p-space-md rounded-lg bg-[#12306f] border border-[#3858a6]/60">
        <span className="text-4xl font-bold text-white leading-none">{engagement.level}</span>
        <span className="text-xs text-on-surface-variant">Engagement level</span>
      </div>
      <div className="flex flex-col">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#3858a6]/40 last:border-b-0 text-xs">
            <span className="text-on-surface-variant">{label}</span>
            <span className="text-on-surface font-semibold">{value}</span>
          </div>
        ))}
      </div>
      {engagement.note && <p className="text-[11px] text-on-surface-variant m-0 leading-relaxed">{engagement.note}</p>}
    </div>
  );
}
