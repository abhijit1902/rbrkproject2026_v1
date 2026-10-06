import React, { useState, useEffect } from 'react';
import RiskSummaryStrip from './RiskSummaryStrip';
import AtRiskAccountsTable from './AtRiskAccountsTable';
import SignalsFeed from './SignalsFeed';
import EscalationTimeline from './EscalationTimeline';
import ChurnProbabilityMatrix from './ChurnProbabilityMatrix';
import ExpansionOpportunities from './ExpansionOpportunities';
import RiskProfilesPanel from './RiskProfilesPanel';

const TABS = [
  { id: 'overview', label: 'Risk Overview', icon: 'crisis_alert' },
  { id: 'signals', label: 'Signal Feed', icon: 'notifications_active' },
  { id: 'escalations', label: 'Escalations', icon: 'history_edu' },
  { id: 'expansion', label: 'Expansion Signals', icon: 'trending_up' },
  { id: 'profiles', label: 'Risk Profiles', icon: 'assignment_late' },
];

export default function RiskSignalsView({ selectedAccountName, allAccounts, onSelectAccount, onToast }) {
  const [activeTab, setActiveTab] = useState(() => new URLSearchParams(window.location.search).get('tab') || 'overview');
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const loadRiskData = (notify = false) => {
    setLoading(true);
    fetch('/api/risk-signals' + (selectedAccountName ? '?account=' + encodeURIComponent(selectedAccountName) : ''))
      .then(res => res.json())
      .then(data => {
        setRiskData(data);
        setLoading(false);
        if (notify) onToast?.('Risk & signals data refreshed');
      })
      .catch(() => {
        setLoading(false);
        if (notify) onToast?.('Could not refresh risk data');
      });
  };

  useEffect(() => { loadRiskData(); }, []);

  return (
    <div className="min-h-screen bg-transparent pt-6 px-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ff6b6b] text-2xl">crisis_alert</span>
            <h1 className="text-2xl font-bold text-white tracking-tight m-0">Risk &amp; Signals</h1>
            <span className="px-2 py-0.5 bg-[#ff6b6b]/20 border border-[#ff6b6b]/40 text-[#ff6b6b] text-[10px] font-bold rounded-full uppercase tracking-wider ml-1">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-[#9db4e2] m-0">
            Churn risk, early warning signals, escalation tracking and expansion opportunities {selectedAccountName ? 'for ' + selectedAccountName : 'across the portfolio'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4098] border border-[#3858a6] rounded-lg text-xs text-[#9db4e2] hover:text-white hover:border-[#66cfee]/50 transition-all cursor-pointer"
            onClick={() => loadRiskData(true)}
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            Refresh
          </button>
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4098] border rounded-lg text-xs hover:text-white hover:border-[#66cfee]/50 transition-all cursor-pointer ${
              showFilter || query ? 'border-[#66cfee]/50 text-[#66cfee]' : 'border-[#3858a6] text-[#9db4e2]'
            }`}
            onClick={() => setShowFilter(v => !v)}
          >
            <span className="material-symbols-outlined text-[15px]">filter_list</span>
            Filter{query ? ' (1)' : ''}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="flex items-center gap-2 mb-4 bg-[#1b4098] border border-[#3858a6] rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-[16px] text-[#9db4e2]">search</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter every tab by account, ID, CSM, signal or stage..."
            className="flex-1 bg-transparent border-0 text-xs text-white placeholder-[#9db4e2] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[11px] text-[#9db4e2] hover:text-white bg-transparent border-0 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Summary Strip */}
      <RiskSummaryStrip riskData={riskData} loading={loading} />

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-1 mb-6 mt-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
              activeTab === tab.id
                ? 'bg-[#2b5db3] text-[#66cfee] shadow-sm'
                : 'text-[#9db4e2] hover:text-white hover:bg-[#1b4098]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.id ? 'text-[#66cfee]' : ''}`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {!riskData && (
        <div className="flex items-center justify-center py-16 text-[#9db4e2] text-sm">
          {loading ? 'Loading risk and signal data...' : 'Risk and signal data is unavailable.'}
        </div>
      )}

      {riskData && activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <AtRiskAccountsTable rows={riskData.accounts} onSelectAccount={onSelectAccount} query={query} />
          </div>
          <div className="col-span-4">
            <ChurnProbabilityMatrix
              distribution={riskData.distribution}
              drivers={riskData.drivers}
              total={riskData.summary.totalAccounts}
            />
          </div>
        </div>
      )}

      {riskData && activeTab === 'signals' && (
        <SignalsFeed signals={riskData.signals} query={query} onSelectAccount={onSelectAccount} onToast={onToast} />
      )}

      {riskData && activeTab === 'escalations' && (
        <EscalationTimeline escalations={riskData.escalations} query={query} onToast={onToast} />
      )}

      {riskData && activeTab === 'profiles' && (
        <RiskProfilesPanel profiles={riskData.riskProfiles || []} query={query} onSelectAccount={onSelectAccount} onToast={onToast} />
      )}

      {riskData && activeTab === 'expansion' && (
        <ExpansionOpportunities opportunities={riskData.expansion} onSelectAccount={onSelectAccount} query={query} />
      )}
    </div>
  );
}
