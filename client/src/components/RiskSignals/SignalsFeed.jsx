import React, { useState } from 'react';

const SIGNALS = [
  {
    id: 1,
    type: 'critical',
    icon: 'dangerous',
    iconColor: '#ff6b6b',
    title: 'Usage drop detected',
    account: 'Apex Global Logistics',
    accountId: 'AGL-9942',
    message: 'Weekly active users dropped 62% over the past 3 weeks. Current WAU: 12 vs. contracted 45. Immediate intervention required.',
    time: '8 min ago',
    category: 'Usage',
    actions: ['Open Account', 'Trigger Playbook', 'Schedule EBR'],
    unread: true,
  },
  {
    id: 2,
    type: 'critical',
    icon: 'person_off',
    iconColor: '#ff6b6b',
    title: 'Executive sponsor departed',
    account: 'CloudScale Therapeutics',
    accountId: 'CST-4471',
    message: 'VP of Engineering (primary champion) left the company. No internal successor identified. Risk of stalled renewal.',
    time: '41 min ago',
    category: 'Relationship',
    actions: ['Map Stakeholders', 'Alert CSM'],
    unread: true,
  },
  {
    id: 3,
    type: 'warning',
    icon: 'support_agent',
    iconColor: '#f59e0b',
    title: 'P1 ticket SLA breached',
    account: 'Vertex FinTech Holdings',
    accountId: 'VFH-3310',
    message: 'Ticket VFH-09812 has exceeded SLA by 14 hours. Customer escalated to C-suite. Immediate support attention needed.',
    time: '1h 12m ago',
    category: 'Support',
    actions: ['View Ticket', 'Escalate'],
    unread: true,
  },
  {
    id: 4,
    type: 'warning',
    icon: 'compare_arrows',
    iconColor: '#f59e0b',
    title: 'Competitor evaluation initiated',
    account: 'Vertex FinTech Holdings',
    accountId: 'VFH-3310',
    message: 'LinkedIn intelligence shows 3 job postings mentioning competitor platform integration. Monitor closely.',
    time: '3h ago',
    category: 'Competitive',
    actions: ['View Intel', 'Schedule Call'],
    unread: false,
  },
  {
    id: 5,
    type: 'info',
    icon: 'trending_down',
    iconColor: '#a78bfa',
    title: 'NPS score declined',
    account: 'DataStream Analytics',
    accountId: 'DSA-7823',
    message: 'NPS dropped from 42 to 18 in latest pulse survey. Detractors cited "slow onboarding" and "missing integrations".',
    time: '5h ago',
    category: 'NPS',
    actions: ['View Survey', 'Book Feedback Session'],
    unread: false,
  },
  {
    id: 6,
    type: 'info',
    icon: 'schedule',
    iconColor: '#a78bfa',
    title: 'QBR overdue',
    account: 'NovaTech Robotics',
    accountId: 'NTR-2209',
    message: 'Q3 Business Review is 47 days overdue. Account has missed 2 consecutive QBR cycles. Renewal in 68 days.',
    time: '1d ago',
    category: 'Engagement',
    actions: ['Schedule QBR', 'View Account'],
    unread: false,
  },
  {
    id: 7,
    type: 'positive',
    icon: 'star',
    iconColor: '#34d399',
    title: 'Expansion signal detected',
    account: 'Pinnacle Healthcare',
    accountId: 'PHC-8812',
    message: 'Usage of Analytics module is 94% of seat limit. Champion requested pricing info for 40-seat expansion.',
    time: '2h ago',
    category: 'Expansion',
    actions: ['Create Opportunity', 'Send Pricing'],
    unread: false,
  },
];

const TYPE_STYLES = {
  critical: { border: 'border-l-[#ff6b6b]', bg: 'hover:bg-[#ff6b6b]/5' },
  warning: { border: 'border-l-[#f59e0b]', bg: 'hover:bg-[#f59e0b]/5' },
  info: { border: 'border-l-[#a78bfa]', bg: 'hover:bg-[#a78bfa]/5' },
  positive: { border: 'border-l-[#34d399]', bg: 'hover:bg-[#34d399]/5' },
};

const FILTER_TYPES = ['All', 'Critical', 'Warning', 'Info', 'Positive'];
const FILTER_CATEGORIES = ['All Categories', 'Usage', 'Relationship', 'Support', 'Competitive', 'NPS', 'Engagement', 'Expansion'];

export default function SignalsFeed() {
  const [filterType, setFilterType] = useState('All');
  const [filterCat, setFilterCat] = useState('All Categories');
  const [expanded, setExpanded] = useState(null);

  const filtered = SIGNALS.filter(s => {
    const typeMatch = filterType === 'All' || s.type === filterType.toLowerCase();
    const catMatch = filterCat === 'All Categories' || s.category === filterCat;
    return typeMatch && catMatch;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[#000e23] border border-[#213551] rounded-xl p-1">
          {FILTER_TYPES.map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
                filterType === ft
                  ? 'bg-[#162b46] text-[#2DD4CF]'
                  : 'text-[#6b8cae] hover:text-white'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-[#000e23] border border-[#213551] rounded-xl px-3 py-2 text-xs text-[#6b8cae] focus:outline-none focus:border-[#2DD4CF]/50 cursor-pointer"
        >
          {FILTER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="ml-auto text-[11px] text-[#6b8cae]">
          {filtered.length} signals · {filtered.filter(s => s.unread).length} unread
        </div>
      </div>

      {/* Signal Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(signal => {
          const style = TYPE_STYLES[signal.type];
          const isExpanded = expanded === signal.id;

          return (
            <div
              key={signal.id}
              className={`bg-[#000e23] border border-[#213551] border-l-4 rounded-xl overflow-hidden transition-all ${style.border} ${style.bg}`}
            >
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : signal.id)}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${signal.iconColor}20`, border: `1px solid ${signal.iconColor}40` }}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ color: signal.iconColor }}>
                    {signal.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{signal.title}</span>
                    {signal.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4CF] flex-shrink-0" />
                    )}
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ background: `${signal.iconColor}20`, color: signal.iconColor }}
                    >
                      {signal.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#2DD4CF] font-medium">{signal.account}</span>
                    <span className="text-[10px] text-[#6b8cae]">· {signal.accountId}</span>
                    <span className="text-[10px] text-[#6b8cae] ml-auto">{signal.time}</span>
                  </div>
                  {!isExpanded && (
                    <p className="text-[11px] text-[#6b8cae] mt-1 m-0 line-clamp-1">
                      {signal.message}
                    </p>
                  )}
                </div>

                {/* Expand chevron */}
                <span className={`material-symbols-outlined text-[18px] text-[#6b8cae] flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-[#213551]/50">
                  <p className="text-xs text-[#d4e3ff] mt-3 mb-3 leading-relaxed m-0">
                    {signal.message}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {signal.actions.map((action, ai) => (
                      <button
                        key={ai}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          ai === 0
                            ? 'border-0 text-[#00142c] font-bold'
                            : 'bg-transparent border border-[#213551] text-[#6b8cae] hover:text-white hover:border-[#2DD4CF]/50'
                        }`}
                        style={ai === 0 ? { background: signal.iconColor } : {}}
                      >
                        {action}
                      </button>
                    ))}
                    <button className="ml-auto px-2 py-1.5 bg-transparent border-0 text-[11px] text-[#6b8cae] hover:text-white cursor-pointer transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#6b8cae]">
            <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
            <p className="text-sm m-0">No signals match current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
