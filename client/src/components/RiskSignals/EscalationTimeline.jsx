import React, { useState } from 'react';

const ESCALATIONS = [
  {
    id: 'ESC-001',
    account: 'Apex Global Logistics',
    severity: 'P1',
    severityColor: '#ff6b6b',
    title: 'System-wide API timeout causing production outage',
    owner: 'Sarah Chen',
    createdAt: 'Oct 3, 2026',
    updatedAt: '8 min ago',
    status: 'Active',
    statusColor: '#ff6b6b',
    updates: [
      { time: '8 min ago', author: 'Sarah Chen', text: 'Engineering lead engaged. Root cause under investigation — suspected rate limiter misconfiguration in EU cluster.' },
      { time: '2h ago', author: 'David Park (Eng)', text: 'Rollback to v3.8.1 in progress. Estimated restoration: 35 mins.' },
      { time: '5h ago', author: 'System', text: 'Auto-escalated to P1 after 3h of no resolution. Stakeholders notified.' },
      { time: 'Oct 3', author: 'Sarah Chen', text: 'Customer reported API timeouts across all modules. Ticket opened and triaged.' },
    ],
  },
  {
    id: 'ESC-002',
    account: 'CloudScale Therapeutics',
    severity: 'P2',
    severityColor: '#f59e0b',
    title: 'Data export pipeline failing for HIPAA compliance reports',
    owner: 'Michael Torres',
    createdAt: 'Oct 1, 2026',
    updatedAt: '3h ago',
    status: 'In Progress',
    statusColor: '#f59e0b',
    updates: [
      { time: '3h ago', author: 'Michael Torres', text: 'Compliance team confirmed data export failure impacts monthly audit. Engineering fix ETA: 24h.' },
      { time: '1d ago', author: 'Rachel Kim (Support)', text: 'Confirmed reproduction in staging. Logs sent to Eng.' },
      { time: 'Oct 1', author: 'Michael Torres', text: 'Customer reported HIPAA export job silently failing since Sep 28.' },
    ],
  },
  {
    id: 'ESC-003',
    account: 'Vertex FinTech Holdings',
    severity: 'P2',
    severityColor: '#f59e0b',
    title: 'Executive complaint — repeated onboarding failures for new team',
    owner: 'Rachel Kim',
    createdAt: 'Sep 28, 2026',
    updatedAt: '1d ago',
    status: 'Pending Review',
    statusColor: '#a78bfa',
    updates: [
      { time: '1d ago', author: 'Rachel Kim', text: 'CTO sent formal complaint email. Escalated to VP of CS. Executive apology call scheduled for Oct 7.' },
      { time: '3d ago', author: 'James Park (Support)', text: '3 of 5 new users unable to complete SSO provisioning flow.' },
    ],
  },
  {
    id: 'ESC-004',
    account: 'DataStream Analytics',
    severity: 'P3',
    severityColor: '#a78bfa',
    title: 'Billing discrepancy — overcharged for Q3 enterprise seats',
    owner: 'James Park',
    createdAt: 'Sep 22, 2026',
    updatedAt: '5d ago',
    status: 'Resolved',
    statusColor: '#34d399',
    updates: [
      { time: '5d ago', author: 'Finance', text: 'Credit of $4,800 issued. Customer confirmed resolution. Escalation closed.' },
      { time: '8d ago', author: 'James Park', text: 'Billing team confirmed 12 excess seats billed. Credit memo in process.' },
    ],
  },
];

const SEVERITY_BADGE = {
  P1: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  P2: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  P3: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};

export default function EscalationTimeline() {
  const [selected, setSelected] = useState(ESCALATIONS[0].id);
  const active = ESCALATIONS.find(e => e.id === selected);

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left — Escalation List */}
      <div className="col-span-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">history_edu</span>
          <h2 className="text-sm font-bold text-white m-0">Active Escalations</h2>
          <span className="ml-auto px-2 py-0.5 bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ff6b6b] text-[10px] font-bold rounded-full">
            {ESCALATIONS.filter(e => e.status !== 'Resolved').length} open
          </span>
        </div>
        {ESCALATIONS.map(esc => (
          <button
            key={esc.id}
            onClick={() => setSelected(esc.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
              selected === esc.id
                ? 'bg-[#162b46] border-[#2DD4CF]/30'
                : 'bg-[#000e23] border-[#213551] hover:bg-[#09203b]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${SEVERITY_BADGE[esc.severity]}`}>
                {esc.severity}
              </span>
              <span className="text-[10px] text-[#6b8cae]">{esc.id}</span>
              <span
                className="ml-auto text-[10px] font-semibold"
                style={{ color: esc.statusColor }}
              >
                {esc.status}
              </span>
            </div>
            <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">{esc.title}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-[#2DD4CF]">{esc.account}</span>
            </div>
            <div className="text-[10px] text-[#6b8cae] mt-1">Updated {esc.updatedAt}</div>
          </button>
        ))}
      </div>

      {/* Right — Timeline Detail */}
      {active && (
        <div className="col-span-8 bg-[#000e23] border border-[#213551] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#213551]">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${SEVERITY_BADGE[active.severity]}`}>
                {active.severity}
              </span>
              <span className="text-[10px] text-[#6b8cae]">{active.id}</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold ml-auto"
                style={{ background: `${active.statusColor}20`, color: active.statusColor, border: `1px solid ${active.statusColor}40` }}
              >
                {active.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white m-0 mb-1">{active.title}</h3>
            <div className="flex items-center gap-4 text-[11px] text-[#6b8cae]">
              <span>Account: <span className="text-[#2DD4CF] font-medium">{active.account}</span></span>
              <span>Owner: <span className="text-white font-medium">{active.owner}</span></span>
              <span>Opened: {active.createdAt}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-6 py-5 space-y-0">
            <h4 className="text-xs font-bold text-[#6b8cae] uppercase tracking-wider mb-4">Activity Timeline</h4>
            <div className="flex flex-col">
              {active.updates.map((update, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Vertical line */}
                  {i < active.updates.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#213551]" />
                  )}
                  {/* Avatar dot */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#162b46] border border-[#213551] flex items-center justify-center text-[11px] font-bold text-[#2DD4CF] mt-1 z-10">
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
                      <span className="text-[10px] text-[#6b8cae]">{update.time}</span>
                    </div>
                    <div className="bg-[#09203b] border border-[#213551] rounded-xl px-4 py-3">
                      <p className="text-xs text-[#d4e3ff] leading-relaxed m-0">{update.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply box */}
          <div className="px-6 py-4 border-t border-[#213551]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Add an update to this escalation..."
                className="flex-1 bg-[#09203b] border border-[#213551] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6b8cae] focus:outline-none focus:border-[#2DD4CF]/50"
              />
              <button className="px-4 py-2.5 bg-[#2DD4CF] text-[#00142c] font-bold text-xs rounded-xl hover:bg-[#2DD4CF]/80 transition-colors cursor-pointer border-0">
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
