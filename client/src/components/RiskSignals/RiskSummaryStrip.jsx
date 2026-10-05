import React from 'react';

const STRIP_ITEMS = [
  {
    label: 'Critical Risk Accounts',
    valueKey: 'criticalCount',
    icon: 'dangerous',
    color: '#ff6b6b',
    bgColor: 'rgba(255,107,107,0.1)',
    borderColor: 'rgba(255,107,107,0.3)',
    suffix: 'accounts',
    trend: '+2 this week',
    trendUp: true,
  },
  {
    label: 'At-Risk ARR',
    valueKey: 'atRiskArr',
    icon: 'currency_exchange',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.1)',
    borderColor: 'rgba(245,158,11,0.3)',
    prefix: '$',
    suffix: 'M',
    trend: '↑ from $2.1M',
    trendUp: true,
  },
  {
    label: 'Active Escalations',
    valueKey: 'activeEscalations',
    icon: 'priority_high',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.3)',
    suffix: 'open',
    trend: '3 resolved today',
    trendUp: false,
  },
  {
    label: 'Expansion Opportunities',
    valueKey: 'expansionOpps',
    icon: 'trending_up',
    color: '#2DD4CF',
    bgColor: 'rgba(45,212,207,0.1)',
    borderColor: 'rgba(45,212,207,0.3)',
    prefix: '$',
    suffix: 'M potential',
    trend: '↑ Identified this quarter',
    trendUp: false,
  },
  {
    label: 'Health Score Avg',
    valueKey: 'avgHealthScore',
    icon: 'monitor_heart',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.1)',
    borderColor: 'rgba(52,211,153,0.3)',
    suffix: '/ 100',
    trend: '↑ +3 pts from last month',
    trendUp: false,
  },
];

const FALLBACK = {
  criticalCount: 4,
  atRiskArr: '3.2',
  activeEscalations: 7,
  expansionOpps: '8.5',
  avgHealthScore: 64,
};

export default function RiskSummaryStrip({ riskData, loading }) {
  const data = riskData?.summary || FALLBACK;

  return (
    <div className="grid grid-cols-5 gap-4">
      {STRIP_ITEMS.map((item, i) => {
        const raw = data[item.valueKey];
        const val = loading ? '—' : (raw ?? '—');
        return (
          <div
            key={i}
            style={{
              background: item.bgColor,
              borderColor: item.borderColor,
            }}
            className="relative overflow-hidden border rounded-xl p-4 flex flex-col gap-2"
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-5 blur-xl"
              style={{ background: item.color }}
            />
            <div className="relative flex items-start justify-between">
              <span
                className="font-semibold text-[11px] uppercase tracking-wider"
                style={{ color: item.color }}
              >
                {item.label}
              </span>
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ color: item.color }}
              >
                {item.icon}
              </span>
            </div>
            <div className="relative flex items-baseline gap-1">
              {item.prefix && (
                <span className="text-sm font-bold" style={{ color: item.color }}>
                  {item.prefix}
                </span>
              )}
              <span className="text-3xl font-bold text-white leading-none">
                {loading ? (
                  <span className="inline-block w-12 h-7 bg-[#162b46] rounded animate-pulse" />
                ) : val}
              </span>
              {item.suffix && !loading && (
                <span className="text-xs text-[#6b8cae] ml-1">{item.suffix}</span>
              )}
            </div>
            <div className="relative text-[10px] text-[#6b8cae] font-medium">
              {item.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}
