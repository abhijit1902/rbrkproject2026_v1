import React from 'react';

export default function AccountSnapshotCard({ account }) {
  const isError = account.statusType === 'error';

  return (
    <div className="flex flex-col justify-between p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md hover:bg-[#2b5db3] transition-colors select-none">
      <div className="flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
            <h3>Account Snapshot</h3>
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant font-semibold">
            {account.fiscalTag}
          </span>
        </div>

        {/* 2-Col Metric Tiles */}
        <div className="grid grid-cols-2 gap-space-md">
          <div className="p-space-sm rounded-lg bg-[#12306f] border border-[#3858a6]/60 flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Annual Recurring Rev</span>
            <span className="font-headline-md text-xl text-on-surface font-bold mt-1">{account.arr}</span>
            <span className="font-code-sm text-xs text-primary flex items-center gap-0.5 mt-0.5 font-semibold">
              {account.yoy ? (
                <><span className="material-symbols-outlined text-[14px]">arrow_upward</span> {account.yoy}</>
              ) : (
                <span className="text-on-surface-variant font-normal">YoY not available</span>
              )}
            </span>
          </div>

          <div className="p-space-sm rounded-lg bg-[#12306f] border border-[#3858a6]/60 flex flex-col">
            <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Renewal Window</span>
            <span className={`font-headline-md text-xl font-bold mt-1 ${isError ? 'text-error' : 'text-[#F2B84B]'}`}>
              {account.renewalDaysVal} Days
            </span>
            <span className={`font-code-sm text-xs flex items-center gap-0.5 mt-0.5 font-semibold ${isError ? 'text-error' : 'text-[#F2B84B]'}`}>
              <span className="material-symbols-outlined text-[14px]">{isError ? 'warning' : 'info'}</span>
              {account.renewalSub}
            </span>
          </div>
        </div>

        {/* Breakdown Rows */}
        <div className="flex flex-col gap-space-xs text-xs text-on-surface-variant pt-space-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-[#3858a6]/40">
            <span>Contract Total Value</span>
            <span className="text-on-surface font-semibold">{account.totalContractValue}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#3858a6]/40">
            <span>Active Risk Flags</span>
            <span className={`font-semibold flex items-center gap-1.5 ${isError ? 'text-error' : 'text-[#F2B84B]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-error' : 'bg-[#F2B84B]'}`}></span>
              {account.activeRiskFlagsSummary}
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#3858a6]/40">
            <span>Products Owned</span>
            <div className="flex items-center gap-2">
              <span className="text-on-surface font-medium">{account.productsRatio}</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`w-3 h-2 rounded-xs ${
                      i < account.productsFilled ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span>Executive Sponsor</span>
            <span className="text-on-surface font-medium flex items-center gap-1 text-white">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              {account.execSponsor}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between">
        <button
          onClick={() => alert(`Showing master contract details for ${account.name} (SFDC Contract #CNT-89104)`)}
          type="button"
          className="font-label-md text-xs text-primary font-semibold hover:text-primary-fixed flex items-center gap-1 group bg-transparent border-0 cursor-pointer p-0"
        >
          <span>View Contract Details</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
        <span className="font-code-sm text-[11px] text-on-surface-variant flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]"></span>
          SFDC Synced
        </span>
      </div>
    </div>
  );
}
