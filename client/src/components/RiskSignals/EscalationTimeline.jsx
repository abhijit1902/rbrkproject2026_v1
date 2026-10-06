import React, { useState } from 'react';


const SEVERITY_BADGE = {
  Executive: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  Management: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Other: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};

const statusColorFor = (st) => (
  /critical|new/i.test(st) ? '#ff6b6b'
    : /progress|active|pending|needs|partially/i.test(st) ? '#f59e0b'
      : '#34d399'
);

export default function EscalationTimeline({ escalations: initial = [], query = '', onToast }) {
  const [escalations, setEscalations] = useState(() => initial.map(e => ({ ...e, statusColor: statusColorFor(e.status) })));
  const [selected, setSelected] = useState(initial[0] ? initial[0].id : null);
  const [draft, setDraft] = useState('');

  const q = query.trim().toLowerCase();
  const visible = escalations.filter(e =>
    !q || [e.id, e.account, e.title, e.owner, e.status].some(f => f.toLowerCase().includes(q))
  );
  const active = visible.find(e => e.id === selected) || visible[0];

  const postUpdate = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setEscalations(prev => prev.map(e => e.id === active.id
      ? { ...e, updatedAt: 'just now', updates: [{ time: 'just now', author: e.owner, text }, ...e.updates] }
      : e));
    setDraft('');
    onToast?.('Update posted to ' + active.id);
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left — Escalation List */}
      <div className="col-span-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">history_edu</span>
          <h2 className="text-sm font-bold text-white m-0">Active Escalations</h2>
          <span className="ml-auto px-2 py-0.5 bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ff6b6b] text-[10px] font-bold rounded-full">
            {escalations.filter(e => e.status !== 'Resolved').length} open
          </span>
        </div>
        {visible.length === 0 && (
          <p className="text-xs text-[#9db4e2] m-0">No escalations match the current filter</p>
        )}
        {visible.map(esc => (
          <button
            key={esc.id}
            onClick={() => setSelected(esc.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
              selected === esc.id
                ? 'bg-[#2b5db3] border-[#66cfee]/30'
                : 'bg-[#1c3f96]/40 border-[#3858a6] hover:bg-[#1b4098]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(SEVERITY_BADGE[esc.severity] || SEVERITY_BADGE.Other)}`}>
                {esc.severity}
              </span>
              <span className="text-[10px] text-[#9db4e2]">{esc.id}</span>
              <span
                className="ml-auto text-[10px] font-semibold"
                style={{ color: esc.statusColor }}
              >
                {esc.status}
              </span>
            </div>
            <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">{esc.title}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-[#66cfee]">{esc.account}</span>
            </div>
            <div className="text-[10px] text-[#9db4e2] mt-1">Updated {esc.updatedAt}</div>
          </button>
        ))}
      </div>

      {/* Right — Timeline Detail */}
      {active && (
        <div className="col-span-8 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3858a6]">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(SEVERITY_BADGE[active.severity] || SEVERITY_BADGE.Other)}`}>
                {active.severity}
              </span>
              <span className="text-[10px] text-[#9db4e2]">{active.id}</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold ml-auto"
                style={{ background: `${active.statusColor}20`, color: active.statusColor, border: `1px solid ${active.statusColor}40` }}
              >
                {active.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white m-0 mb-1">{active.title}</h3>
            <div className="flex items-center gap-4 text-[11px] text-[#9db4e2]">
              <span>Account: <span className="text-[#66cfee] font-medium">{active.account}</span></span>
              <span>Owner: <span className="text-white font-medium">{active.owner}</span></span>
              <span>Opened: {active.createdAt}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-6 py-5 space-y-0">
            <h4 className="text-xs font-bold text-[#9db4e2] uppercase tracking-wider mb-4">Activity Timeline</h4>
            <div className="flex flex-col">
              {active.updates.map((update, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Vertical line */}
                  {i < active.updates.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#3858a6]" />
                  )}
                  {/* Avatar dot */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2b5db3] border border-[#3858a6] flex items-center justify-center text-[11px] font-bold text-[#66cfee] mt-1 z-10">
                    {update.author === 'System' ? (
                      <span className="material-symbols-outlined text-[14px] text-[#a78bfa]">smart_toy</span>
                    ) : (
                      update.author.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white">
                        {update.author}
                      </span>
                      <span className="text-[10px] text-[#9db4e2]">{update.time}</span>
                    </div>
                    <div className="bg-[#1b4098] border border-[#3858a6] rounded-xl px-4 py-3">
                      <p className="text-xs text-[#e9f0ff] leading-relaxed m-0">{update.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply box */}
          <div className="px-6 py-4 border-t border-[#3858a6]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') postUpdate(); }}
                placeholder="Add an update to this escalation..."
                className="flex-1 bg-[#1b4098] border border-[#3858a6] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9db4e2] focus:outline-none focus:border-[#66cfee]/50"
              />
              <button onClick={postUpdate} className="px-4 py-2.5 bg-[#2d7d98] text-[#e6f7fd] font-bold text-xs rounded-xl hover:bg-[#2d7d98]/80 transition-colors cursor-pointer border-0">
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
