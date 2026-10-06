import React, { useState } from 'react';


const TYPE_STYLES = {
  critical: { border: 'border-l-[#ff6b6b]', bg: 'hover:bg-[#ff6b6b]/5' },
  warning: { border: 'border-l-[#f59e0b]', bg: 'hover:bg-[#f59e0b]/5' },
  info: { border: 'border-l-[#a78bfa]', bg: 'hover:bg-[#a78bfa]/5' },
  positive: { border: 'border-l-[#34d399]', bg: 'hover:bg-[#34d399]/5' },
};

const FILTER_TYPES = ['All', 'Critical', 'Warning', 'Info', 'Positive'];
const FILTER_CATEGORIES = ['All Categories', 'Usage', 'Relationship', 'Support', 'Competitive', 'NPS', 'Engagement', 'Expansion'];

export default function SignalsFeed({ signals: initialSignals = [], query = '', onSelectAccount, onToast }) {
  const [signals, setSignals] = useState(initialSignals);
  const [filterType, setFilterType] = useState('All');
  const [filterCat, setFilterCat] = useState('All Categories');
  const [expanded, setExpanded] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = signals.filter(s => {
    const typeMatch = filterType === 'All' || s.type === filterType.toLowerCase();
    const catMatch = filterCat === 'All Categories' || s.category === filterCat;
    const queryMatch = !q || [s.title, s.account, s.accountId, s.message].some(f => f.toLowerCase().includes(q));
    return typeMatch && catMatch && queryMatch;
  });

  const toggleExpand = (signal) => {
    const opening = expanded !== signal.id;
    setExpanded(opening ? signal.id : null);
    if (opening && signal.unread) {
      setSignals(prev => prev.map(s => s.id === signal.id ? { ...s, unread: false } : s));
    }
  };

  const handleAction = (signal, action) => {
    if (action === 'Open Account' && onSelectAccount) {
      onSelectAccount(signal.account);
    } else {
      onToast?.(action + ' started for ' + signal.account);
    }
  };

  const dismiss = (signal) => {
    setSignals(prev => prev.filter(s => s.id !== signal.id));
    setExpanded(null);
    onToast?.('Signal dismissed: ' + signal.title);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-1">
          {FILTER_TYPES.map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
                filterType === ft
                  ? 'bg-[#2b5db3] text-[#66cfee]'
                  : 'text-[#9db4e2] hover:text-white'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl px-3 py-2 text-xs text-[#9db4e2] focus:outline-none focus:border-[#66cfee]/50 cursor-pointer"
        >
          {FILTER_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="ml-auto text-[11px] text-[#9db4e2]">
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
              className={`bg-[#1c3f96]/40 border border-[#3858a6] border-l-4 rounded-xl overflow-hidden transition-all ${style.border} ${style.bg}`}
            >
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                onClick={() => toggleExpand(signal)}
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
                      <span className="w-1.5 h-1.5 rounded-full bg-[#66cfee] flex-shrink-0" />
                    )}
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ background: `${signal.iconColor}20`, color: signal.iconColor }}
                    >
                      {signal.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#66cfee] font-medium">{signal.account}</span>
                    <span className="text-[10px] text-[#9db4e2]">· {signal.accountId}</span>
                    <span className="text-[10px] text-[#9db4e2] ml-auto">{signal.time}</span>
                  </div>
                  {!isExpanded && (
                    <p className="text-[11px] text-[#9db4e2] mt-1 m-0 line-clamp-1">
                      {signal.message}
                    </p>
                  )}
                </div>

                {/* Expand chevron */}
                <span className={`material-symbols-outlined text-[18px] text-[#9db4e2] flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-[#3858a6]/50">
                  <p className="text-xs text-[#e9f0ff] mt-3 mb-3 leading-relaxed m-0">
                    {signal.message}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {signal.actions.map((action, ai) => (
                      <button
                        key={ai}
                        onClick={() => handleAction(signal, action)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          ai === 0
                            ? 'border-0 text-[#071445] font-bold'
                            : 'bg-transparent border border-[#3858a6] text-[#9db4e2] hover:text-white hover:border-[#66cfee]/50'
                        }`}
                        style={ai === 0 ? { background: signal.iconColor } : {}}
                      >
                        {action}
                      </button>
                    ))}
                    <button onClick={() => dismiss(signal)} className="ml-auto px-2 py-1.5 bg-transparent border-0 text-[11px] text-[#9db4e2] hover:text-white cursor-pointer transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#9db4e2]">
            <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
            <p className="text-sm m-0">No signals match current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
