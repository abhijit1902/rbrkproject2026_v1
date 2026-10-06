import React, { useState } from 'react';
import { STAGE_COLORS, fmtMoney } from './data';

const FILTERS = ['All', 'Open', 'Closed', 'Won', 'Lost'];

export default function OpportunityList({ opportunities, query }) {
  const [filter, setFilter] = useState('Open');

  const q = query.trim().toLowerCase();
  const visible = opportunities
    .filter(x => {
      if (filter === 'All') return true;
      if (filter === 'Closed') return x.status !== 'Open';
      return x.status === filter;
    })
    .filter(x => !q || [x.name, x.id, x.type, x.stage, x.owner].some(f => f.toLowerCase().includes(q)));

  const count = (f) => opportunities.filter(x => f === 'All' ? true : f === 'Closed' ? x.status !== 'Open' : x.status === f).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 bg-[#0b2166]/60 border border-[#3858a6] rounded-xl p-1 w-fit">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all ${
              filter === f ? 'bg-[#2b5db3] text-white' : 'bg-transparent text-[#9db4e2] hover:text-white'
            }`}
          >
            {f} <span className="text-[10px] opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>

      <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#3858a6]">
              {['Opportunity', 'Type', 'Value', 'Stage', 'Probability', 'Close', 'Owner', 'Notes'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9db4e2] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(x => {
              const color = STAGE_COLORS[x.stage];
              return (
                <tr key={x.id} className="border-b border-[#3858a6]/50 hover:bg-[#1b4098] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{x.name}</div>
                    <div className="text-[10px] text-[#9db4e2]">{x.id}</div>
                  </td>
                  <td className="px-4 py-3 text-[#e9f0ff]">{x.type}</td>
                  <td className="px-4 py-3 font-bold text-white">{fmtMoney(x.value)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: color + '26', color }}>{x.stage}</span>
                  </td>
                  <td className="px-4 py-3">
                    {x.status === 'Open' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#3858a6]/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: x.probability + '%', background: color }} />
                        </div>
                        <span className="text-[#e9f0ff]">{x.probability}%</span>
                      </div>
                    ) : (
                      <span className="text-[#9db4e2]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#e9f0ff] whitespace-nowrap">{x.closeLabel}</td>
                  <td className="px-4 py-3 text-[#e9f0ff]">{x.owner}</td>
                  <td className="px-4 py-3 max-w-[240px] text-[#9db4e2]">
                    {x.status === 'Lost' ? 'Lost: ' + x.lostReason : x.nextStep || (x.status === 'Won' ? 'Closed won' : '—')}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-[#9db4e2]">No opportunities match the current filter</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
