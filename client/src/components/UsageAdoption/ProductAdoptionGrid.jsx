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
          {products.length} Monitored Modules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {products.map((prod, idx) => {
          const isError = prod.changeType === 'error' || prod.status === 'At Risk';
          const isWarning = prod.changeType === 'warning' || prod.status === 'Attention';

          return (
            <div
              key={idx}
              className="p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md hover:bg-[#162b46] transition-colors flex flex-col justify-between"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface truncate">
                    {prod.name}
                  </span>
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
                <div className="w-full bg-[#00142c] h-2 rounded-full overflow-hidden border border-[#213551]/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${prod.utilization}%`,
                      backgroundColor: prod.healthColor || (isError ? '#F4664A' : '#3ECF8E')
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant font-code-sm">
                  <span>{prod.activeSeats} Active Seats</span>
                  <span>{prod.totalSeats} Purchased</span>
                </div>

                {/* Alert Box */}
                {prod.alert && (
                  <div className="p-2 rounded-lg bg-[#051c36] border border-[#213551]/40 text-xs text-on-surface-variant leading-snug mt-1">
                    <span className="text-on-surface font-semibold block text-[11px] mb-0.5">
                      Telemetry Insight:
                    </span>
                    {prod.alert}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-space-md mt-space-md border-t border-[#213551]/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-code-sm text-[11px]">
                  {prod.totalSeats - prod.activeSeats} Dormant Seats
                </span>
                <button
                  onClick={onOpenSeatOptimizer}
                  type="button"
                  className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
                >
                  Manage Seats →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
