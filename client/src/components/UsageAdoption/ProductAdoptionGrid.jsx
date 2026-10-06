import React from 'react';

export default function ProductAdoptionGrid({ usage, onOpenSeatOptimizer }) {
  const products = usage?.products || [];

  return (
    <div className="flex flex-col gap-space-md select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
          <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
          <h3>Product Suite Adoption &amp; License Saturation</h3>
        </div>
        <span className="font-code-sm text-xs text-on-surface-variant font-semibold">
          {products.some(p => p.entitlement)
            ? products.length + ' Active Entitlements'
            : products.filter(p => p.activated !== false).length + ' Activated · ' + products.filter(p => p.activated === false).length + ' Not Activated'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {products.map((prod, idx) => {
          if (prod.entitlement) {
            return (
              <div
                key={idx}
                className="p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col justify-between gap-space-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-on-surface truncate">{prod.name}</span>
                    <span className="text-[10px] font-semibold text-[#3ECF8E] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      Active entitlement
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-code-sm font-bold bg-[#66cfee]/15 text-[#66cfee]">
                    Ends {prod.ends}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white font-headline-md">{prod.licensed.toLocaleString()}</span>
                  <span className="text-xs text-on-surface-variant font-medium">licensed (units not returned)</span>
                </div>
                {prod.covers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prod.covers.map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-[#12306f] border border-[#3858a6]/60 text-[10px] text-on-surface">{c}</span>
                    ))}
                  </div>
                )}
                <div className="p-2 rounded-lg bg-[#12306f] border border-[#3858a6]/40 text-xs text-on-surface-variant leading-snug">
                  <span className="text-on-surface font-semibold block text-[11px] mb-0.5">Consumption:</span>
                  Consumed, adoption % and overage not available (Snowflake).
                </div>
              </div>
            );
          }
          if (prod.activated === false && !prod.purchased) {
            return (
              <div
                key={idx}
                className="p-space-lg rounded-xl bg-[#1c3f96]/25 border border-dashed border-[#3858a6] flex flex-col justify-between gap-space-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface truncate">{prod.name}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-code-sm font-bold bg-[#9db4e2]/15 text-[#9db4e2] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">block</span>
                    Not Activated
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-on-surface-variant font-headline-md">—</span>
                  <span className="text-xs text-on-surface-variant font-medium">no usage</span>
                </div>
                <div className="p-2 rounded-lg bg-[#12306f] border border-[#3858a6]/40 text-xs text-on-surface-variant leading-snug">
                  <span className="text-on-surface font-semibold block text-[11px] mb-0.5">Expansion Insight:</span>
                  {prod.alert}
                </div>
              </div>
            );
          }
          const isError = prod.changeType === 'error' || prod.status === 'At Risk';
          const isWarning = prod.changeType === 'warning' || prod.status === 'Attention';

          return (
            <div
              key={idx}
              className="p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md hover:bg-[#2b5db3] transition-colors flex flex-col justify-between"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-on-surface truncate">
                      {prod.name}
                    </span>
                    {prod.activated === false ? (
                      <span className="text-[10px] font-semibold text-[#F2B84B] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">pause_circle</span>
                        Purchased, not activated
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#3ECF8E] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        Activated
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-code-sm font-bold flex items-center gap-1 ${
                      isError
                        ? 'bg-error-container/40 text-error'
                        : isWarning
                        ? 'bg-[#F2B84B]/20 text-[#F2B84B]'
                        : 'bg-[#3ECF8E]/20 text-[#3ECF8E]'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: prod.healthColor || (isError ? '#F4664A' : '#3ECF8E') }}
                    ></span>
                    {prod.status}
                  </span>
                </div>

                {/* Utilization Big Stat */}
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <span className="text-2xl font-bold text-white font-headline-md">
                      {prod.utilization}%
                    </span>
                    <span className="text-xs text-on-surface-variant ml-1 font-medium">
                      saturation
                    </span>
                  </div>
                  <span
                    className={`font-code-sm text-xs font-bold flex items-center gap-0.5 ${
                      isError ? 'text-error' : isWarning ? 'text-[#F2B84B]' : 'text-[#3ECF8E]'
                    }`}
                  >
                    {prod.change}
                  </span>
                </div>

                {/* Saturation Progress Bar */}
                <div className="w-full bg-[#071445] h-2 rounded-full overflow-hidden border border-[#3858a6]/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${prod.utilization}%`,
                      backgroundColor: prod.healthColor || (isError ? '#F4664A' : '#3ECF8E')
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant font-code-sm">
                  <span>{Number(prod.activeSeats).toLocaleString()} {prod.unit === 'TB' ? 'TB used' : prod.unit === 'users' ? 'Active Users' : 'Active Seats'}</span>
                  <span>{Number(prod.totalSeats).toLocaleString()} {prod.unit === 'TB' ? 'TB purchased' : 'Purchased'}</span>
                </div>

                {/* Alert Box */}
                {prod.alert && (
                  <div className="p-2 rounded-lg bg-[#12306f] border border-[#3858a6]/40 text-xs text-on-surface-variant leading-snug mt-1">
                    <span className="text-on-surface font-semibold block text-[11px] mb-0.5">
                      Telemetry Insight:
                    </span>
                    {prod.alert}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-code-sm text-[11px]">
                  {prod.unit === 'TB'
                    ? Number(prod.totalSeats - prod.activeSeats).toLocaleString() + ' TB headroom'
                    : Number(prod.totalSeats - prod.activeSeats).toLocaleString() + ' Dormant ' + (prod.unit === 'users' ? 'Users' : 'Seats')}
                </span>
                {prod.unit !== 'TB' && (
                  <button
                    onClick={onOpenSeatOptimizer}
                    type="button"
                    className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
                  >
                    Manage Seats →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
