import React, { useState } from 'react';


const RISK_BADGE = {
  Critical: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  High: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Medium: 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30',
  Watch: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};

function HealthBar({ score, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#3858a6] rounded-full overflow-hidden">
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

export default function AtRiskAccountsTable({ rows = [], onSelectAccount, query = '' }) {
  const AT_RISK_ACCOUNTS = rows;
  const [sortCol, setSortCol] = useState('churnProb');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const q = query.trim().toLowerCase();
  const visible = AT_RISK_ACCOUNTS.filter(a =>
    !q || [a.name, a.id, a.csm, a.riskLevel, ...(a.signals || [])].some(f => String(f).toLowerCase().includes(q))
  );

  const sorted = [...visible].sort((a, b) => {
    const av = a[sortCol];
    const bv = b[sortCol];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return 0;
  });

  const SortIcon = ({ col }) => (
    <span className={`material-symbols-outlined text-[13px] ml-0.5 ${sortCol === col ? 'text-[#66cfee]' : 'text-[#3858a6]'}`}>
      {sortCol === col && sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
    </span>
  );

  return (
    <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#3858a6]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff6b6b] text-xl">warning</span>
          <h2 className="text-sm font-bold text-white m-0">At-Risk Accounts</h2>
          <span className="ml-1 px-2 py-0.5 bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ff6b6b] text-[10px] font-bold rounded-full">
            {visible.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9db4e2]">Sorted by churn probability</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#3858a6]">
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
                  className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9db4e2] whitespace-nowrap ${col ? 'cursor-pointer hover:text-white select-none' : ''}`}
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
                className="border-b border-[#3858a6]/50 hover:bg-[#1b4098] transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-white group-hover:text-[#66cfee] transition-colors">
                    {acct.name}
                  </div>
                  <div className="text-[10px] text-[#9db4e2] mt-0.5">
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
                  <div className={`font-semibold ${acct.renewalDays < 90 ? 'text-[#ff6b6b]' : 'text-[#9db4e2]'}`}>
                    {acct.renewalDays}d
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {acct.signals.map((s, si) => (
                      <span
                        key={si}
                        className="px-1.5 py-0.5 bg-[#2b5db3] border border-[#3858a6] text-[#9db4e2] text-[10px] rounded"
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
                      className="px-2.5 py-1 bg-[#2b5db3] border border-[#66cfee]/30 text-[#66cfee] text-[10px] font-semibold rounded-lg hover:bg-[#66cfee]/10 transition-colors cursor-pointer"
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
