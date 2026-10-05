import React from 'react';

export default function AccountHeaderCard({ account }) {
  const isError = account.statusType === 'error';

  return (
    <div className="p-space-lg rounded-xl bg-[#051c36] border border-[#213551] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-md select-none">
      <div className="flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-[#213551] flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
          </div>

          <h1 className="font-headline-lg text-2xl text-on-surface font-bold tracking-tight m-0">
            {account.name}
          </h1>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-xs font-semibold ${
              isError
                ? 'bg-error-container/40 text-error'
                : 'bg-[#F2B84B]/20 text-[#F2B84B]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isError ? 'bg-error animate-pulse' : 'bg-[#F2B84B]'
              }`}
            ></span>
            <span>{account.status}</span>
          </span>

          {/* Tier Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#213551] text-on-surface-variant font-code-sm text-xs font-semibold">
            {account.tier}
          </span>
        </div>

        {/* Metadata pills row */}
        <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-xs text-on-surface-variant mt-1">
          <span className="flex items-center gap-1 text-on-surface">
            <span className="material-symbols-outlined text-[15px] text-outline">local_shipping</span>
            <span>{account.industry}</span>
          </span>

          <span className="text-outline-variant">•</span>

          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-outline">public</span>
            <span>{account.region}</span>
          </span>

          <span className="text-outline-variant">•</span>

          <span>{account.since}</span>

          <span className="text-outline-variant">•</span>

          <span className="flex items-center gap-1 text-on-surface">
            <span className="material-symbols-outlined text-[15px] text-primary">person</span>
            CSM: <span className="font-medium text-white">{account.csm}</span>
          </span>

          <span className="text-outline-variant">•</span>

          <span className="text-primary font-semibold">ARR: {account.arr}</span>

          <span className="text-outline-variant">•</span>

          <span className={`font-semibold flex items-center gap-1 ${isError ? 'text-error' : 'text-[#F2B84B]'}`}>
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>{account.renewalWindowText}</span>
          </span>
        </div>
      </div>

      {/* Quick Header Metric Callout */}
      <div className="flex items-center gap-space-lg bg-[#000e23]/70 px-space-lg py-space-sm rounded-lg self-start md:self-auto border border-[#213551]/60">
        <div className="flex flex-col">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Current ARR</span>
          <span className="font-headline-md text-xl text-on-surface font-bold mt-0.5">
            {account.arrExact}
          </span>
        </div>
        <div className="w-px h-8 bg-surface-variant"></div>
        <div className="flex flex-col">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Contract End</span>
          <span className={`font-headline-md text-xl font-bold flex items-center gap-1 mt-0.5 ${isError ? 'text-error' : 'text-on-surface'}`}>
            {account.contractEnd}
          </span>
        </div>
      </div>
    </div>
  );
}
