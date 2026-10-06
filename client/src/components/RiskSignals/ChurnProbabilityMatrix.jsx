import React from 'react';

export default function ChurnProbabilityMatrix({ distribution = [], drivers = [], total = 0 }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Churn Distribution */}
      <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#f59e0b] text-xl">donut_large</span>
          <h3 className="text-sm font-bold text-white m-0">Churn Risk Distribution</h3>
        </div>
        <div className="flex flex-col gap-3">
          {distribution.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#9db4e2]">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.count} accts
                </span>
              </div>
              <div className="h-2 bg-[#3858a6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: item.width + '%', background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[#3858a6] flex items-center justify-between">
          <span className="text-[11px] text-[#9db4e2]">Total monitored</span>
          <span className="text-sm font-bold text-white">{total} accounts</span>
        </div>
      </div>

      {/* Top Churn Reasons */}
      <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">analytics</span>
          <h3 className="text-sm font-bold text-white m-0">Top Churn Drivers</h3>
        </div>
        <div className="flex flex-col gap-3">
          {drivers.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-[#9db4e2] bg-[#2b5db3]">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-[#e9f0ff]">{r.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: r.color }}>{r.pct}% of accounts</span>
                </div>
                <div className="h-1 bg-[#3858a6] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: r.pct + '%', background: r.color }} />
                </div>
              </div>
            </div>
          ))}
          {drivers.length === 0 && <p className="text-xs text-[#9db4e2] m-0">No open risk profiles</p>}
        </div>
      </div>
    </div>
  );
}
