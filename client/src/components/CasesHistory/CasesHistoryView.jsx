import React, { useState } from 'react';
import CaseSummaryStrip from './CaseSummaryStrip';
import CaseQueue from './CaseQueue';
import AccountHistoryTimeline from './AccountHistoryTimeline';
import CaseTrends from './CaseTrends';
import { PSStatusWidget, EscalationDetailsWidget, CaseAISummaryWidget } from './CaseWidgets';
import { getCasesData, TEAMS, TEAM_COLORS } from './data';

const TABS = [
  { id: 'cases', label: 'Case Queue', icon: 'inbox' },
  { id: 'history', label: 'Account History', icon: 'history' },
  { id: 'trends', label: 'Trends', icon: 'bar_chart' },
];

// Mounted with key={account name} so state resets when the selected account changes
export default function CasesHistoryView({ account, onToast }) {
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }
  return <CasesHistoryInner account={account} onToast={onToast} />;
}

function CasesHistoryInner({ account, onToast }) {
  const accountName = account.name;
  const data = getCasesData(account);
  const aggregates = data.aggregates || null;
  const [activeTab, setActiveTab] = useState('cases');
  const [cases, setCases] = useState(data.cases);
  const [team, setTeam] = useState('All');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const countFor = (t) => {
    if (aggregates) {
      const o = aggregates.open;
      if (t === 'All') return o.total;
      if (t === 'Support') return o.support;
      if (t === 'Renewal') return o.renewal + o.retention;
    }
    return t === 'All' ? cases.length : cases.filter(c => c.team === t).length;
  };

  const teamCases = cases.filter(c => team === 'All' || c.team === team);
  const teamEvents = data.history.filter(h => team === 'All' || h.team === team);

  const setStatus = (c, status) => {
    setCases(prev => prev.map(x => x.id === c.id ? { ...x, status } : x));
    onToast?.(c.id + ' marked ' + status);
  };

  const addNote = (c, text) => {
    setCases(prev => prev.map(x => x.id === c.id
      ? { ...x, updates: [{ author: x.owner, time: 'just now', text }, ...x.updates] }
      : x));
    onToast?.('Note added to ' + c.id);
  };

  return (
    <div className="min-h-screen bg-transparent pt-6 px-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#f59e0b] text-2xl">history</span>
            <h1 className="text-2xl font-bold text-white tracking-tight m-0">Cases &amp; History</h1>
            <span className="px-2 py-0.5 bg-[#66cfee]/20 border border-[#66cfee]/40 text-[#66cfee] text-[10px] font-bold rounded-full uppercase tracking-wider ml-1">
              {accountName}
            </span>
          </div>
          <p className="text-xs text-[#9db4e2] m-0">
            Support, CS and renewal cases, customer interaction history, PS status and escalations for the selected account
          </p>
        </div>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4098] border rounded-lg text-xs hover:text-white hover:border-[#66cfee]/50 transition-all cursor-pointer ${
            showFilter || query ? 'border-[#66cfee]/50 text-[#66cfee]' : 'border-[#3858a6] text-[#9db4e2]'
          }`}
          onClick={() => setShowFilter(v => !v)}
        >
          <span className="material-symbols-outlined text-[15px]">filter_list</span>
          Search{query ? ' (1)' : ''}
        </button>
      </div>

      {showFilter && (
        <div className="flex items-center gap-2 mb-4 bg-[#1b4098] border border-[#3858a6] rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-[16px] text-[#9db4e2]">search</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cases and history by ID, owner, category or keyword..."
            className="flex-1 bg-transparent border-0 text-xs text-white placeholder-[#9db4e2] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[11px] text-[#9db4e2] hover:text-white bg-transparent border-0 cursor-pointer">
              Clear
            </button>
          )}
        </div>
      )}

      {/* Team filter: Support / CS / Renewal */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9db4e2]">Team</span>
        <div className="flex items-center gap-1 bg-[#0b2166]/60 border border-[#3858a6] rounded-xl p-1">
          {['All', ...TEAMS].map(t => {
            const active = team === t;
            const color = TEAM_COLORS[t] || '#66cfee';
            const count = countFor(t);
            return (
              <button
                key={t}
                onClick={() => setTeam(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-0 transition-all ${
                  active ? 'bg-[#2b5db3] text-white' : 'bg-transparent text-[#9db4e2] hover:text-white'
                }`}
              >
                {t !== 'All' && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                {t}
                <span className="text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CaseSummaryStrip cases={teamCases} aggregates={aggregates} teamFiltered={team !== 'All'} />

      {/* Widgets: PS status, escalation details, AI summary */}
      <div className="grid grid-cols-3 gap-5 mt-6">
        <PSStatusWidget ps={data.ps} />
        <EscalationDetailsWidget escalations={data.escalations} />
        <CaseAISummaryWidget accountName={accountName} cases={teamCases} ps={data.ps} escalations={data.escalations} aggregates={aggregates} />
      </div>

      <div className="flex items-center gap-1 bg-[#0b2166]/60 border border-[#3858a6] rounded-xl p-1 mb-6 mt-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
              activeTab === tab.id ? 'bg-[#2b5db3] text-white shadow-sm' : 'bg-transparent text-[#9db4e2] hover:text-white hover:bg-[#1b4098]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'cases' && (
        <CaseQueue cases={teamCases} onSetStatus={setStatus} onAddNote={addNote} query={query} />
      )}
      {activeTab === 'history' && <AccountHistoryTimeline events={teamEvents} query={query} />}
      {activeTab === 'trends' && <CaseTrends cases={teamCases} aggregates={aggregates} weekly={data.weeklyVolume} />}
    </div>
  );
}
