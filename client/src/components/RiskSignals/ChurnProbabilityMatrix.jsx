import React from 'react';

const MATRIX_DATA = [
  { label: 'Critical (>75%)', count: 4, color: '#ff6b6b', width: 40 },
  { label: 'High (50–75%)', count: 6, color: '#f59e0b', width: 60 },
  { label: 'Medium (25–50%)', count: 9, color: '#a78bfa', width: 90 },
  { label: 'Low (<25%)', count: 14, color: '#34d399', width: 100 },
];

const REASONS = [
  { label: 'Low feature adoption', pct: 68, color: '#ff6b6b' },
  { label: 'Executive turnover', pct: 52, color: '#f59e0b' },
  { label: 'Support ticket volume', pct: 47, color: '#a78bfa' },
  { label: 'Missed QBRs', pct: 38, color: '#2DD4CF' },
  { label: 'Competitor evaluation', pct: 31, color: '#34d399' },
];

export default function ChurnProbabilityMatrix() {
  return (
    <div className="flex flex-col gap-5">
      {/* Churn Distribution */}
      <div className="bg-[#000e23] border border-[#213551] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#f59e0b] text-xl">donut_large</span>
          <h3 className="text-sm font-bold text-white m-0">Churn Risk Distribution</h3>
        </div>
        <div className="flex flex-col gap-3">
          {MATRIX_DATA.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#6b8cae]">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.count} accts
                </span>
              </div>
              <div className="h-2 bg-[#213551] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.width}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[#213551] flex items-center justify-between">
          <span className="text-[11px] text-[#6b8cae]">Total monitored</span>
          <span className="text-sm font-bold text-white">33 accounts</span>
        </div>
      </div>

      {/* Top Churn Reasons */}
      <div className="bg-[#000e23] border border-[#213551] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">analytics</span>
          <h3 className="text-sm font-bold text-white m-0">Top Churn Drivers</h3>
        </div>
        <div className="flex flex-col gap-3">
          {REASONS.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-[#6b8cae] bg-[#162b46]">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-[#d4e3ff]">{r.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: r.color }}>{r.pct}%</span>
                </div>
                <div className="h-1 bg-[#213551] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.pct}%`, background: r.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
