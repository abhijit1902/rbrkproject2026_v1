import React, { useState } from 'react';
import { HISTORY_TYPES, TEAM_COLORS, dayLabel } from './data';

export default function AccountHistoryTimeline({ events: allEvents, query }) {
  const [type, setType] = useState('All types');

  const q = query.trim().toLowerCase();
  const events = allEvents
    .filter(h => type === 'All types' || h.type === type)
    .filter(h => !q || [h.title, h.desc, h.who, h.type, h.team].some(f => f.toLowerCase().includes(q)))
    .sort((a, b) => a.daysAgo - b.daysAgo);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="bg-[#1b4098] border border-[#3858a6] rounded-lg px-3 py-2 text-xs text-[#e9f0ff] focus:outline-none cursor-pointer"
        >
          {['All types', ...Object.keys(HISTORY_TYPES)].map(t => <option key={t}>{t}</option>)}
        </select>
        <div className="ml-auto text-[11px] text-[#9db4e2]">{events.length} events</div>
      </div>

      <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl px-6 py-5">
        {events.map((ev, i) => {
          const meta = HISTORY_TYPES[ev.type];
          const teamColor = TEAM_COLORS[ev.team];
          return (
            <div key={ev.id} className="flex gap-4 relative">
              {i < events.length - 1 && <div className="absolute left-[15px] top-9 bottom-0 w-px bg-[#3858a6]" />}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                style={{ background: meta.color + '20', border: '1px solid ' + meta.color + '50' }}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ color: meta.color }}>{meta.icon}</span>
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{ev.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: meta.color + '20', color: meta.color }}>
                    {ev.type}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: teamColor + '20', color: teamColor }}>
                    {ev.team}
                  </span>
                  <span className="text-[10px] text-[#9db4e2] ml-auto">{ev.dateLabel ? ev.dateLabel + ' · ' : ''}{dayLabel(ev.daysAgo)}</span>
                </div>
                <div className="text-[11px] text-[#9db4e2] mt-0.5">{ev.who}</div>
                <p className="text-xs text-[#e9f0ff] leading-relaxed mt-1.5 mb-0">{ev.desc}</p>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#9db4e2]">
            <span className="material-symbols-outlined text-4xl mb-2">history</span>
            <p className="text-sm m-0">No history events match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
