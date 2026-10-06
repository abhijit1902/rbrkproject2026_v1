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
  },
  {
    label: 'Active Escalations',
    valueKey: 'activeEscalations',
    icon: 'priority_high',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.3)',
    suffix: 'open',
  },
  {
    label: 'Expansion Opportunities',
    valueKey: 'expansionOpps',
    icon: 'trending_up',
    color: '#66cfee',
    bgColor: 'rgba(102,207,238,0.1)',
    borderColor: 'rgba(102,207,238,0.3)',
    prefix: '$',
    suffix: 'M potential',
  },
  {
    label: 'Health Score Avg',
    valueKey: 'avgHealthScore',
    icon: 'monitor_heart',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.1)',
    borderColor: 'rgba(52,211,153,0.3)',
    suffix: '/ 100',
  },
];

const FALLBACK = {
  criticalCount: 0,
  atRiskArr: '0.0',
  activeEscalations: 0,
  expansionOpps: '0.0',
  avgHealthScore: 0,
  totalAccounts: 0,
  expansionCount: 0,
};

const captionsFor = (d) => ({
  criticalCount: 'High-risk of ' + d.totalAccounts + ' accounts',
  atRiskArr: 'ARR on High-risk accounts',
  activeEscalations: 'Across ' + d.totalAccounts + ' accounts',
  expansionOpps: d.expansionCount + ' open opportunities',
  avgHealthScore: 'Average across ' + d.totalAccounts + ' accounts',
});

export default function RiskSummaryStrip({ riskData, loading }) {
  const data = riskData?.summary || FALLBACK;
  const captions = captionsFor(data);

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
                  <span className="inline-block w-12 h-7 bg-[#2b5db3] rounded animate-pulse" />
                ) : val}
              </span>
              {item.suffix && !loading && (
                <span className="text-xs text-[#9db4e2] ml-1">{item.suffix}</span>
              )}
            </div>
            <div className="relative text-[10px] text-[#9db4e2] font-medium">
              {captions[item.valueKey]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
