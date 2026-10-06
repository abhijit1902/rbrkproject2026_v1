import React, { useState } from 'react';

const STAGE_RANK = ['Identified', 'Qualified', '1 Discovery', '2 Consensus', '3 Technical Validation', '4 Business Justification', 'Negotiation'];
const STAGE_COLOR = {
  Identified: '#9db4e2',
  Qualified: '#a78bfa',
  '1 Discovery': '#9db4e2',
  '2 Consensus': '#a78bfa',
  '3 Technical Validation': '#66cfee',
  '4 Business Justification': '#f59e0b',
  Negotiation: '#f59e0b',
};
const fmtVal = (n) => (n >= 1000000 ? '$' + (n / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'K');

export default function ExpansionOpportunities({ opportunities = [], onSelectAccount, query = '' }) {
  const [view, setView] = useState('table');
  const q = query.trim().toLowerCase();
  const ALL_OPPORTUNITIES = opportunities
    .map(o => ({ ...o, raw: o.expansionValue, expansionValue: fmtVal(o.expansionValue), stageColor: STAGE_COLOR[o.stage] || '#9db4e2' }))
    .sort((a, b) => b.raw - a.raw);
  const STAGE_ORDER = STAGE_RANK.filter(st => ALL_OPPORTUNITIES.some(o => o.stage === st));
  const OPPORTUNITIES = ALL_OPPORTUNITIES.filter(o =>
    !q || [o.account, o.id, o.name, o.expansionType, o.stage, o.champion].some(f => String(f || '').toLowerCase().includes(q))
  );
  const safeAvg = (fn) => OPPORTUNITIES.length ? Math.round(OPPORTUNITIES.reduce((s, o) => s + fn(o), 0) / OPPORTUNITIES.length) : 0;

  const totalPipeline = OPPORTUNITIES.reduce((sum, o) => sum + o.raw, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#34d399] text-xl">trending_up</span>
          <h2 className="text-sm font-bold text-white m-0">Expansion Pipeline</h2>
          <div className="flex flex-col">
            <span className="text-xs text-[#34d399] font-bold">
              ${(totalPipeline / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] text-[#9db4e2]">total pipeline</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-1">
          {['table', 'pipeline'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 capitalize ${
                view === v ? 'bg-[#2b5db3] text-[#66cfee]' : 'text-[#9db4e2] hover:text-white'
              }`}
            >
              {v === 'table' ? 'Table' : 'Pipeline'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Opportunities', value: OPPORTUNITIES.length, color: '#66cfee' },
          { label: 'Avg Probability', value: `${safeAvg(o => o.probability)}%`, color: '#34d399' },
          { label: 'Avg Days to Close', value: `${safeAvg(o => o.daysToClose)}d`, color: '#a78bfa' },
          { label: 'Best Opp', value: OPPORTUNITIES[0]?.expansionValue ?? '—', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-4 text-center">
            <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-[#9db4e2] mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#3858a6]">
                {['Account', 'Type', 'Value', 'Probability', 'Stage', 'Signal', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9db4e2]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPPORTUNITIES.map((opp, i) => (
                <tr key={opp.id} className="border-b border-[#3858a6]/50 hover:bg-[#1b4098] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white group-hover:text-[#34d399] transition-colors">
                      {opp.account}
                    </div>
                    <div className="text-[10px] text-[#9db4e2]">{opp.name} · {opp.tier} · {opp.currentArr} ARR</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] text-[10px] font-semibold rounded-full">
                      {opp.expansionType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#34d399]">{opp.expansionValue}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-[#3858a6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${opp.probability}%`,
                            background: opp.probability > 70 ? '#34d399' : opp.probability > 50 ? '#f59e0b' : '#9db4e2',
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{opp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: opp.stageColor }}
                    >
                      {opp.stage}
                    </span>
                    <div className="text-[10px] text-[#9db4e2] mt-0.5">{opp.daysToClose == null ? '—' : opp.daysToClose < 0 ? Math.abs(opp.daysToClose) + 'd past close date' : opp.daysToClose + 'd to close'}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <p className="text-[11px] text-[#9db4e2] m-0 line-clamp-2">{opp.signal}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectAccount(opp.account)}
                      className="px-2.5 py-1 bg-[#2b5db3] border border-[#34d399]/30 text-[#34d399] text-[10px] font-semibold rounded-lg hover:bg-[#34d399]/10 transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pipeline Kanban View */}
      {view === 'pipeline' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {STAGE_ORDER.map(stage => {
              const stageopps = OPPORTUNITIES.filter(o => o.stage === stage);
              return (
                <div key={stage} className="w-52 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9db4e2]">{stage}</span>
                    {stageopps.length > 0 && (
                      <span className="w-4 h-4 bg-[#2b5db3] text-[#66cfee] text-[10px] font-bold rounded-full flex items-center justify-center">
                        {stageopps.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {stageopps.length === 0 && (
                      <div className="h-16 border border-dashed border-[#3858a6] rounded-xl flex items-center justify-center">
                        <span className="text-[10px] text-[#3858a6]">Empty</span>
                      </div>
                    )}
                    {stageopps.map(opp => (
                      <div
                        key={opp.id}
                        className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-3 cursor-pointer hover:border-[#34d399]/30 hover:bg-[#1b4098] transition-all"
                        onClick={() => onSelectAccount(opp.account)}
                      >
                        <div className="text-xs font-bold text-white line-clamp-1">{opp.account}</div>
                        <div className="text-sm font-bold text-[#34d399] mt-1">{opp.expansionValue}</div>
                        <div className="text-[10px] text-[#9db4e2] mt-1">{opp.probability}% probability</div>
                        <div className="mt-2 h-1 bg-[#3858a6] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${opp.probability}%`, background: '#34d399' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
