import React, { useState } from 'react';

const OPPORTUNITIES = [
  {
    account: 'Pinnacle Healthcare Systems',
    id: 'PHC-8812',
    tier: 'TIER 1',
    currentArr: '$1.2M',
    expansionValue: '$480K',
    expansionType: 'Seat Expansion',
    probability: 87,
    signal: 'Analytics module at 94% seat capacity',
    champion: 'Dr. Amanda Reyes',
    stage: 'Pricing Sent',
    stageColor: '#2DD4CF',
    daysToClose: 18,
  },
  {
    account: 'GlobalTech Manufacturing',
    id: 'GTM-5521',
    tier: 'TIER 2',
    currentArr: '$820K',
    expansionValue: '$310K',
    expansionType: 'Module Upsell',
    probability: 73,
    signal: 'Champion requested Predictive Analytics demo',
    champion: 'James Walker',
    stage: 'Demo Scheduled',
    stageColor: '#a78bfa',
    daysToClose: 34,
  },
  {
    account: 'Meridian Aerospace',
    id: 'MAE-5541',
    tier: 'TIER 3',
    currentArr: '$340K',
    expansionValue: '$220K',
    expansionType: 'Tier Upgrade',
    probability: 61,
    signal: 'Consistent 90%+ platform utilization for 6 months',
    champion: 'Lisa Wang',
    stage: 'Qualifying',
    stageColor: '#f59e0b',
    daysToClose: 62,
  },
  {
    account: 'ClearBridge Capital',
    id: 'CBC-7741',
    tier: 'TIER 2',
    currentArr: '$650K',
    expansionValue: '$195K',
    expansionType: 'Add-on Feature',
    probability: 55,
    signal: 'Finance team inquired about Compliance Reporting add-on',
    champion: 'Robert Chang',
    stage: 'Nurturing',
    stageColor: '#6b8cae',
    daysToClose: 90,
  },
  {
    account: 'NovaTech Robotics',
    id: 'NTR-2209',
    tier: 'TIER 2',
    currentArr: '$720K',
    expansionValue: '$150K',
    expansionType: 'Seat Expansion',
    probability: 42,
    signal: '4 new R&D team members onboarded informally',
    champion: 'Alex Johnson',
    stage: 'Early Signal',
    stageColor: '#213551',
    daysToClose: 120,
  },
];

const STAGE_ORDER = ['Early Signal', 'Qualifying', 'Nurturing', 'Demo Scheduled', 'Pricing Sent', 'Closed Won'];

export default function ExpansionOpportunities({ onSelectAccount }) {
  const [view, setView] = useState('table');

  const totalPipeline = OPPORTUNITIES.reduce((sum, o) => {
    const val = parseFloat(o.expansionValue.replace(/[$KM]/g, '')) * (o.expansionValue.includes('K') ? 1000 : 1000000);
    return sum + val;
  }, 0);

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
            <span className="text-[10px] text-[#6b8cae]">total pipeline</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#000e23] border border-[#213551] rounded-xl p-1">
          {['table', 'pipeline'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 capitalize ${
                view === v ? 'bg-[#162b46] text-[#2DD4CF]' : 'text-[#6b8cae] hover:text-white'
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
          { label: 'Opportunities', value: OPPORTUNITIES.length, color: '#2DD4CF' },
          { label: 'Avg Probability', value: `${Math.round(OPPORTUNITIES.reduce((s, o) => s + o.probability, 0) / OPPORTUNITIES.length)}%`, color: '#34d399' },
          { label: 'Avg Days to Close', value: `${Math.round(OPPORTUNITIES.reduce((s, o) => s + o.daysToClose, 0) / OPPORTUNITIES.length)}d`, color: '#a78bfa' },
          { label: 'Best Opp', value: OPPORTUNITIES[0].expansionValue, color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} className="bg-[#000e23] border border-[#213551] rounded-xl p-4 text-center">
            <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-[#6b8cae] mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-[#000e23] border border-[#213551] rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#213551]">
                {['Account', 'Type', 'Value', 'Probability', 'Stage', 'Signal', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6b8cae]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPPORTUNITIES.map((opp, i) => (
                <tr key={opp.id} className="border-b border-[#213551]/50 hover:bg-[#09203b] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white group-hover:text-[#34d399] transition-colors">
                      {opp.account}
                    </div>
                    <div className="text-[10px] text-[#6b8cae]">{opp.id} · {opp.tier} · {opp.currentArr} ARR</div>
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
                      <div className="w-12 h-1.5 bg-[#213551] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${opp.probability}%`,
                            background: opp.probability > 70 ? '#34d399' : opp.probability > 50 ? '#f59e0b' : '#6b8cae',
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
                    <div className="text-[10px] text-[#6b8cae] mt-0.5">{opp.daysToClose}d est.</div>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <p className="text-[11px] text-[#6b8cae] m-0 line-clamp-2">{opp.signal}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectAccount(opp.account)}
                      className="px-2.5 py-1 bg-[#162b46] border border-[#34d399]/30 text-[#34d399] text-[10px] font-semibold rounded-lg hover:bg-[#34d399]/10 transition-colors cursor-pointer"
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b8cae]">{stage}</span>
                    {stageopps.length > 0 && (
                      <span className="w-4 h-4 bg-[#162b46] text-[#2DD4CF] text-[10px] font-bold rounded-full flex items-center justify-center">
                        {stageopps.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {stageopps.length === 0 && (
                      <div className="h-16 border border-dashed border-[#213551] rounded-xl flex items-center justify-center">
                        <span className="text-[10px] text-[#213551]">Empty</span>
                      </div>
                    )}
                    {stageopps.map(opp => (
                      <div
                        key={opp.id}
                        className="bg-[#000e23] border border-[#213551] rounded-xl p-3 cursor-pointer hover:border-[#34d399]/30 hover:bg-[#09203b] transition-all"
                        onClick={() => onSelectAccount(opp.account)}
                      >
                        <div className="text-xs font-bold text-white line-clamp-1">{opp.account}</div>
                        <div className="text-sm font-bold text-[#34d399] mt-1">{opp.expansionValue}</div>
                        <div className="text-[10px] text-[#6b8cae] mt-1">{opp.probability}% probability</div>
                        <div className="mt-2 h-1 bg-[#213551] rounded-full overflow-hidden">
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
