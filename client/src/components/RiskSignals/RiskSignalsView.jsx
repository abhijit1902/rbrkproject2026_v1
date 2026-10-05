import React, { useState, useEffect } from 'react';
import RiskSummaryStrip from './RiskSummaryStrip';
import AtRiskAccountsTable from './AtRiskAccountsTable';
import SignalsFeed from './SignalsFeed';
import EscalationTimeline from './EscalationTimeline';
import ChurnProbabilityMatrix from './ChurnProbabilityMatrix';
import ExpansionOpportunities from './ExpansionOpportunities';

const TABS = [
  { id: 'overview', label: 'Risk Overview', icon: 'crisis_alert' },
  { id: 'signals', label: 'Signal Feed', icon: 'notifications_active' },
  { id: 'escalations', label: 'Escalations', icon: 'history_edu' },
  { id: 'expansion', label: 'Expansion Signals', icon: 'trending_up' },
];

export default function RiskSignalsView({ allAccounts, onSelectAccount }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/risk-signals')
      .then(res => res.json())
      .then(data => {
        setRiskData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#00142c] pt-6 px-6 pb-10">
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
          <p className="text-xs text-[#6b8cae] m-0">
            Real-time churn risk signals, early warnings, escalation tracking, and expansion opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09203b] border border-[#213551] rounded-lg text-xs text-[#6b8cae] hover:text-white hover:border-[#2DD4CF]/50 transition-all cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
            Refresh
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09203b] border border-[#213551] rounded-lg text-xs text-[#6b8cae] hover:text-white hover:border-[#2DD4CF]/50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <RiskSummaryStrip riskData={riskData} loading={loading} />

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-[#000e23] border border-[#213551] rounded-xl p-1 mb-6 mt-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
              activeTab === tab.id
                ? 'bg-[#162b46] text-[#2DD4CF] shadow-sm'
                : 'text-[#6b8cae] hover:text-white hover:bg-[#09203b]'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.id ? 'text-[#2DD4CF]' : ''}`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <AtRiskAccountsTable accounts={allAccounts} onSelectAccount={onSelectAccount} />
          </div>
          <div className="col-span-4">
            <ChurnProbabilityMatrix />
          </div>
        </div>
      )}

      {activeTab === 'signals' && (
        <SignalsFeed />
      )}

      {activeTab === 'escalations' && (
        <EscalationTimeline />
      )}

      {activeTab === 'expansion' && (
        <ExpansionOpportunities accounts={allAccounts} onSelectAccount={onSelectAccount} />
      )}
    </div>
  );
}
