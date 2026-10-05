import React, { useState } from 'react';

const AT_RISK_ACCOUNTS = [
  {
    name: 'Apex Global Logistics',
    id: 'AGL-9942',
    tier: 'TIER 1',
    arr: '$1.8M',
    healthScore: 32,
    riskLevel: 'Critical',
    riskColor: '#ff6b6b',
    signals: ['NPS drop -28pts', 'Usage –62%', 'Support spike'],
    csm: 'Sarah Chen',
    renewalDays: 47,
    churnProb: 84,
    playbookActive: true,
  },
  {
    name: 'CloudScale Therapeutics',
    id: 'CST-4471',
    tier: 'TIER 1',
    arr: '$2.4M',
    healthScore: 41,
    riskLevel: 'High',
    riskColor: '#f59e0b',
    signals: ['Executive sponsor departed', 'Feature adoption –40%'],
    csm: 'Michael Torres',
    renewalDays: 92,
    churnProb: 67,
    playbookActive: false,
  },
  {
    name: 'Vertex FinTech Holdings',
    id: 'VFH-3310',
    tier: 'TIER 2',
    arr: '$980K',
    healthScore: 48,
    riskLevel: 'High',
    riskColor: '#f59e0b',
    signals: ['Competitor evaluation', '3 open P1 tickets'],
    csm: 'Rachel Kim',
    renewalDays: 134,
    churnProb: 59,
    playbookActive: false,
  },
  {
    name: 'DataStream Analytics',
    id: 'DSA-7823',
    tier: 'TIER 2',
    arr: '$620K',
    healthScore: 53,
    riskLevel: 'Medium',
    riskColor: '#f59e0b',
    signals: ['Billing dispute open', 'API usage flat'],
    csm: 'James Park',
    renewalDays: 210,
    churnProb: 44,
    playbookActive: false,
  },
  {
    name: 'Meridian Aerospace',
    id: 'MAE-5541',
    tier: 'TIER 3',
    arr: '$340K',
    healthScore: 61,
    riskLevel: 'Watch',
    riskColor: '#a78bfa',
    signals: ['Low engagement last 30d', 'Champion on leave'],
    csm: 'Lisa Wang',
    renewalDays: 180,
    churnProb: 31,
    playbookActive: false,
  },
  {
    name: 'NovaTech Robotics',
    id: 'NTR-2209',
    tier: 'TIER 2',
    arr: '$720K',
    healthScore: 57,
    riskLevel: 'Medium',
    riskColor: '#f59e0b',
    signals: ['QBR missed x2', 'Renewal upsell stalled'],
    csm: 'Alex Johnson',
    renewalDays: 68,
    churnProb: 52,
    playbookActive: true,
  },
];

const RISK_BADGE = {
  Critical: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  High: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Medium: 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30',
  Watch: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};

function HealthBar({ score, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#213551] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function AtRiskAccountsTable({ accounts, onSelectAccount }) {
  const [sortCol, setSortCol] = useState('churnProb');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const sorted = [...AT_RISK_ACCOUNTS].sort((a, b) => {
    const av = a[sortCol];
    const bv = b[sortCol];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return 0;
  });

  const SortIcon = ({ col }) => (
    <span className={`material-symbols-outlined text-[13px] ml-0.5 ${sortCol === col ? 'text-[#2DD4CF]' : 'text-[#213551]'}`}>
      {sortCol === col && sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
    </span>
  );

  return (
    <div className="bg-[#000e23] border border-[#213551] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#213551]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff6b6b] text-xl">warning</span>
          <h2 className="text-sm font-bold text-white m-0">At-Risk Accounts</h2>
          <span className="ml-1 px-2 py-0.5 bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ff6b6b] text-[10px] font-bold rounded-full">
            {AT_RISK_ACCOUNTS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#6b8cae]">Sorted by churn probability</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#213551]">
              {[
                { col: 'name', label: 'Account' },
                { col: 'riskLevel', label: 'Risk' },
                { col: 'healthScore', label: 'Health' },
                { col: 'churnProb', label: 'Churn %' },
                { col: 'renewalDays', label: 'Renewal' },
                { col: null, label: 'Top Signals' },
                { col: null, label: 'Action' },
              ].map(({ col, label }) => (
                <th
                  key={label}
                  onClick={col ? () => handleSort(col) : undefined}
                  className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6b8cae] whitespace-nowrap ${col ? 'cursor-pointer hover:text-white select-none' : ''}`}
                >
                  {label}
                  {col && <SortIcon col={col} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((acct, i) => (
              <tr
                key={acct.id}
                className="border-b border-[#213551]/50 hover:bg-[#09203b] transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-white group-hover:text-[#2DD4CF] transition-colors">
                    {acct.name}
                  </div>
                  <div className="text-[10px] text-[#6b8cae] mt-0.5">
                    {acct.id} · {acct.tier} · {acct.arr}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${RISK_BADGE[acct.riskLevel]}`}>
                    {acct.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <HealthBar
                    score={acct.healthScore}
                    color={acct.healthScore < 40 ? '#ff6b6b' : acct.healthScore < 60 ? '#f59e0b' : '#34d399'}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div
                      className="text-sm font-bold"
                      style={{ color: acct.churnProb > 70 ? '#ff6b6b' : acct.churnProb > 50 ? '#f59e0b' : '#a78bfa' }}
                    >
                      {acct.churnProb}%
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`font-semibold ${acct.renewalDays < 90 ? 'text-[#ff6b6b]' : 'text-[#6b8cae]'}`}>
                    {acct.renewalDays}d
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {acct.signals.map((s, si) => (
                      <span
                        key={si}
                        className="px-1.5 py-0.5 bg-[#162b46] border border-[#213551] text-[#6b8cae] text-[10px] rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectAccount(acct.name)}
                      className="px-2.5 py-1 bg-[#162b46] border border-[#2DD4CF]/30 text-[#2DD4CF] text-[10px] font-semibold rounded-lg hover:bg-[#2DD4CF]/10 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    {acct.playbookActive && (
                      <span className="material-symbols-outlined text-[14px] text-[#34d399]" title="Playbook Active">
                        playlist_add_check
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
