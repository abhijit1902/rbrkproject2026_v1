import React, { useState } from 'react';
import OppSummaryStrip from './OppSummaryStrip';
import OpportunityList from './OpportunityList';
import ExpansionDetails from './ExpansionDetails';
import RenewalChurn from './RenewalChurn';
import { getOpsData, buildOpsSummary } from './data';

const TABS = [
  { id: 'ops', label: 'Opportunities', icon: 'filter_alt' },
  { id: 'expansion', label: 'Expansion Details', icon: 'trending_up' },
  { id: 'renewal', label: 'Renewal & Churn History', icon: 'event_repeat' },
];

// Mounted with key={account.name} so state resets when the selected account changes
export default function OpportunitiesActionsView({ account, isPortfolio }) {
  const [activeTab, setActiveTab] = useState('ops');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }

  const ops = getOpsData(account);
  const summary = buildOpsSummary(account, ops);

  return (
    <div className="min-h-screen bg-transparent pt-6 px-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#66cfee] text-2xl">rocket_launch</span>
            <h1 className="text-2xl font-bold text-white tracking-tight m-0">Opportunities &amp; Actions</h1>
            <span className="px-2 py-0.5 bg-[#66cfee]/20 border border-[#66cfee]/40 text-[#66cfee] text-[10px] font-bold rounded-full uppercase tracking-wider ml-1">
              {account.name}
            </span>
          </div>
          <p className="text-xs text-[#9db4e2] m-0">
            {isPortfolio ? 'Open and closed opportunities, expansion, renewals and churn history across all accounts' : 'Open and closed opportunities, expansion, upcoming renewal, renewal sentiment and churn history for the selected account'}
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
            placeholder="Search opportunities by name, type, stage or owner..."
            className="flex-1 bg-transparent border-0 text-xs text-white placeholder-[#9db4e2] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[11px] text-[#9db4e2] hover:text-white bg-transparent border-0 cursor-pointer">
              Clear
            </button>
          )}
        </div>
      )}

      <OppSummaryStrip ops={ops} />

      {/* AI Summary */}
      <div className="mt-6 bg-[#1c3f96]/40 border border-[#66cfee]/30 rounded-2xl p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">auto_awesome</span>
          <h3 className="text-sm font-bold text-white m-0">AI Summary</h3>
          <span className="text-[10px] font-semibold text-[#9db4e2] uppercase tracking-wider">Opportunities &amp; Renewal</span>
        </div>
        <p className="text-xs text-[#e9f0ff] m-0 leading-relaxed">{summary}</p>
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

      {activeTab === 'ops' && <OpportunityList opportunities={ops.opportunities} query={query} />}
      {activeTab === 'expansion' && <ExpansionDetails opportunities={ops.opportunities} query={query} />}
      {activeTab === 'renewal' && <RenewalChurn renewal={ops.renewal} churnHistory={ops.churnHistory} />}
    </div>
  );
}
