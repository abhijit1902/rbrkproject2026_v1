import React, { useState } from 'react';
import { STATUSES, STATUS_COLORS, SEVERITY_COLORS, slaLabel, dayLabel } from './data';

export default function CaseQueue({ cases, onSetStatus, onAddNote, query }) {
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All severities');
  const [selectedId, setSelectedId] = useState(cases[0] ? cases[0].id : null);
  const [draft, setDraft] = useState('');

  const q = query.trim().toLowerCase();
  const visible = cases
    .filter(c => status === 'All' || c.status === status)
    .filter(c => severity === 'All severities' || c.severity === severity)
    .filter(c => !q || [c.id, c.account, c.title, c.owner, c.category].some(f => f.toLowerCase().includes(q)));

  const active = visible.find(c => c.id === selectedId) || visible[0];

  const post = () => {
    const text = draft.trim();
    if (!text || !active) return;
    onAddNote(active, text);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-1">
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all ${
                status === s ? 'bg-[#2b5db3] text-[#66cfee]' : 'bg-transparent text-[#9db4e2] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={severity}
          onChange={e => setSeverity(e.target.value)}
          className="bg-[#1b4098] border border-[#3858a6] rounded-lg px-3 py-2 text-xs text-[#e9f0ff] focus:outline-none cursor-pointer"
        >
          {['All severities', 'P1', 'P2', 'P3', 'P4'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto text-[11px] text-[#9db4e2]">{visible.length} cases</div>
      </div>

      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Case list */}
        <div className="col-span-7 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
          {visible.map(c => {
            const sev = SEVERITY_COLORS[c.severity] || '#9db4e2';
            const stat = STATUS_COLORS[c.status];
            const breached = c.status !== 'Resolved' && c.slaHoursLeft != null && c.slaHoursLeft < 0;
            const isActive = active && active.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-5 py-4 border-0 border-b border-[#3858a6]/60 cursor-pointer transition-colors flex items-center gap-4 ${
                  isActive ? 'bg-[#2b5db3]' : 'bg-transparent hover:bg-[#1b4098]'
                }`}
              >
                <span className="px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0" style={{ background: sev + '26', color: sev, border: '1px solid ' + sev + '4d' }}>
                  {c.severity || '—'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{c.title}</div>
                  <div className="text-[10px] text-[#9db4e2] mt-0.5">
                    {c.id} · {c.team} · {c.category}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: stat + '26', color: stat }}>{c.status}</span>
                  <span className={`text-[10px] font-semibold ${breached ? 'text-[#ff6b6b]' : 'text-[#9db4e2]'}`}>
                    {slaLabel(c.slaHoursLeft, c.status)}
                  </span>
                </div>
              </button>
            );
          })}
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-[#9db4e2]">
              <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
              <p className="text-sm m-0">No cases match the current filters</p>
            </div>
          )}
        </div>

        {/* Case detail */}
        <div className="col-span-5 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
          {active ? (
            <div className="flex flex-col">
              <div className="px-5 py-4 border-b border-[#3858a6]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold" style={{ color: SEVERITY_COLORS[active.severity] || '#9db4e2' }}>{active.severity || 'Severity not set'}</span>
                  <span className="text-[10px] text-[#9db4e2]">{active.id} · opened {dayLabel(active.openedDays)}</span>
                </div>
                <h3 className="text-sm font-bold text-white m-0">{active.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9db4e2]">
                  <span>{active.team} · {active.category}</span>
                  <span>· Owner: {active.owner}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2]">Status</span>
                  <select
                    value={active.status}
                    onChange={e => onSetStatus(active, e.target.value)}
                    className="bg-[#1b4098] border border-[#3858a6] rounded-lg px-2 py-1 text-xs text-[#e9f0ff] focus:outline-none cursor-pointer"
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {active.csat && <span className="ml-auto text-[11px] text-[#34d399] font-semibold">CSAT {active.csat}/5</span>}
                </div>
              </div>

              <div className="px-5 py-4 max-h-[300px] overflow-y-auto flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-[#9db4e2] uppercase tracking-wider m-0">Activity</h4>
                {active.updates.length === 0 && (
                  <p className="text-xs text-[#9db4e2] m-0">No activity recorded for this case.</p>
                )}
                {active.updates.map((u, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#2b5db3] border border-[#3858a6] flex items-center justify-center flex-shrink-0">
                      {u.author === 'System' ? (
                        <span className="material-symbols-outlined text-[14px] text-[#a78bfa]">smart_toy</span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#66cfee]">{u.author.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{u.author}</span>
                        <span className="text-[10px] text-[#9db4e2]">{u.time}</span>
                      </div>
                      <p className="text-xs text-[#e9f0ff] leading-relaxed mt-1 mb-0">{u.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-[#3858a6] flex items-center gap-2">
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') post(); }}
                  placeholder="Add a note to this case..."
                  className="flex-1 bg-[#1b4098] border border-[#3858a6] rounded-xl px-3 py-2 text-xs text-white placeholder-[#9db4e2] focus:outline-none focus:border-[#66cfee]/50"
                />
                <button onClick={post} className="px-3 py-2 bg-[#2d7d98] text-[#e6f7fd] font-bold text-xs rounded-xl hover:bg-[#2d7d98]/80 cursor-pointer border-0">
                  Post
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-[#9db4e2] text-sm">Select a case to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
