import React, { useState } from 'react';

export default function PortfolioDashboard({
  portfolio,
  allAccounts = [],
  onSelectAccount,
  onExportPortfolio
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = portfolio || {
    totalArr: '$248.6M',
    arrYoy: '+14.2% YoY',
    portfolioHealthAvg: '78.4 / 100',
    healthAvgDelta: '+2.1 pts vs Q3',
    renewalArrExposed: '$18.9M',
    renewalAccountsCount: '14 Accounts < 30d',
    openPrescriptionsCount: '48 Items',
    activePlaybooksCount: '8 Active Playbooks'
  };

  const riskAccounts = (portfolio && portfolio.riskPrioritizedAccounts) || [
    {
      name: 'Apex Global Logistics',
      arr: '$1.40M ARR',
      renewalTag: '12d Renewal',
      tier: 'Tier 1',
      summary: '3 P1 cases open • Product X down 18% • Sponsor non-responsive',
      statusColor: '#F4664A'
    },
    {
      name: 'CloudScale Therapeutics',
      arr: '$820k ARR',
      renewalTag: '28d Renewal',
      tier: 'Tier 2',
      summary: 'Feature adoption stalled • Product X -16% vs cohort • Normal support',
      statusColor: '#F2B84B'
    },
    {
      name: 'OmniCorp Global',
      arr: '$1.84M ARR',
      renewalTag: '19d Renewal',
      tier: 'Tier 1',
      summary: 'Exec sponsor departure • Licensing contract consolidation review',
      statusColor: '#F4664A'
    },
    {
      name: 'Vertex FinTech Holdings',
      arr: '$2.10M ARR',
      renewalTag: '45d Renewal',
      tier: 'Tier 1',
      summary: 'Procurement security review pending • API latency complaints',
      statusColor: '#F2B84B'
    }
  ];

  const filteredRiskAccounts = riskAccounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'CRITICAL') return acc.statusColor === '#F4664A';
    if (activeFilter === 'WATCHLIST') return acc.statusColor === '#F2B84B';
    if (activeFilter === 'TIER1') return acc.tier === 'Tier 1';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-lg select-none animate-fadeIn">
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-2 font-label-md text-xs text-on-surface-variant">
            <span className="text-[#2DD4CF] font-bold">PORTFOLIO INTELLIGENCE</span>
            <span>•</span>
            <span>340 Active Enterprise Subscriptions</span>
          </div>
          <h1 className="font-headline-lg text-2xl text-on-surface font-bold mt-1 m-0">
            Global Accounts Portfolio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={() => setActiveFilter(activeFilter === 'ALL' ? 'CRITICAL' : 'ALL')}
            type="button"
            className="px-space-md py-1.5 rounded-lg bg-[#162b46] hover:bg-[#263a56] text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer border border-[#213551]"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
            <span>{activeFilter === 'ALL' ? 'Filter Cohort' : `Filtered: ${activeFilter}`}</span>
          </button>

          <button
            onClick={onExportPortfolio}
            type="button"
            className="px-space-md py-1.5 rounded-lg bg-[#162b46] hover:bg-[#263a56] text-on-surface font-label-md text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer border border-[#213551]"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">file_download</span>
            <span>Export Portfolio</span>
          </button>

          <button
            onClick={() => onSelectAccount('Apex Global Logistics')}
            type="button"
            className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-fixed flex items-center gap-1.5 shadow-md cursor-pointer border-0"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>View Apex Global (Detail)</span>
          </button>
        </div>
      </div>

      {/* Metric Strip (Platform Statistics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="p-space-md rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex items-center justify-between">
          <div>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              Total Monitored ARR
            </span>
            <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
              {stats.totalArr}
            </div>
            <span className="font-code-sm text-xs text-primary flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> {stats.arrYoy}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-space-md rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex items-center justify-between">
          <div>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              Portfolio Health Avg
            </span>
            <div className="font-headline-lg text-2xl text-on-surface font-bold mt-0.5">
              {stats.portfolioHealthAvg}
            </div>
            <span className="font-code-sm text-xs text-[#3ECF8E] flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> {stats.healthAvgDelta}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center text-[#3ECF8E]">
            <span className="material-symbols-outlined text-[24px]">speed</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-space-md rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex items-center justify-between">
          <div>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              ARR in Renewal Window
            </span>
            <div className="font-headline-lg text-2xl text-error font-bold mt-0.5">
              {stats.renewalArrExposed}
            </div>
            <span className="font-code-sm text-xs text-error flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">warning</span> {stats.renewalAccountsCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-error-container/30 border border-error/30 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[24px]">alarm</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-space-md rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex items-center justify-between">
          <div>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">
              AI Prescriptions Open
            </span>
            <div className="font-headline-lg text-2xl text-secondary font-bold mt-0.5">
              {stats.openPrescriptionsCount}
            </div>
            <span className="font-code-sm text-xs text-secondary flex items-center gap-0.5 mt-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">bolt</span> {stats.activePlaybooksCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">checklist</span>
          </div>
        </div>
      </div>

      {/* Portfolio Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Portfolio Health Breakdown Donut */}
        <div className="p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-base text-on-surface font-bold flex items-center gap-1.5 m-0">
                <span className="material-symbols-outlined text-[#2DD4CF] text-[20px]">pie_chart</span>
                Portfolio Health (340 Accounts)
              </h3>
              <span className="font-code-sm text-xs text-on-surface-variant font-bold">REAL-TIME</span>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-[#213551]"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="12"
                ></circle>
                {/* Healthy 248 accounts (73%) */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#3ECF8E"
                  strokeDasharray="174 239"
                  strokeDashoffset="0"
                  strokeWidth="12"
                ></circle>
                {/* Attention 64 accounts (19%) */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#F2B84B"
                  strokeDasharray="45 239"
                  strokeDashoffset="-174"
                  strokeWidth="12"
                ></circle>
                {/* Critical 28 accounts (8%) */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="38"
                  stroke="#F4664A"
                  strokeDasharray="20 239"
                  strokeDashoffset="-219"
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-2xl font-bold text-on-surface leading-none text-white">
                  340
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant font-bold uppercase mt-0.5">
                  ACCOUNTS
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div
                onClick={() => setActiveFilter(activeFilter === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
                className="flex items-center justify-between p-2 rounded bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/40 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E]"></span>
                  Healthy (Score &gt; 80)
                </span>
                <span className="font-code-sm text-xs text-on-surface font-semibold">248 accounts (73%)</span>
              </div>

              <div
                onClick={() => setActiveFilter(activeFilter === 'WATCHLIST' ? 'ALL' : 'WATCHLIST')}
                className="flex items-center justify-between p-2 rounded bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/40 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2B84B]"></span>
                  Attention / Watchlist
                </span>
                <span className="font-code-sm text-xs text-on-surface font-semibold">64 accounts (19%)</span>
              </div>

              <div
                onClick={() => setActiveFilter(activeFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
                className="flex items-center justify-between p-2 rounded bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/40 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2 text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4664A]"></span>
                  Critical Risk
                </span>
                <span className="font-code-sm text-xs text-error font-semibold">28 accounts (8%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#213551]/40 mt-3 text-right">
            <button
              onClick={() => alert('Opening Segment Telemetry Analysis across 340 customer environments.')}
              type="button"
              className="text-[#2DD4CF] font-label-md text-xs hover:underline bg-transparent border-0 cursor-pointer font-semibold p-0"
            >
              Segment Details →
            </button>
          </div>
        </div>

        {/* Top Accounts by Revenue at Risk */}
        <div className="lg:col-span-2 p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <h3 className="font-headline-sm text-base text-on-surface font-bold flex items-center gap-1.5 m-0">
                <span className="material-symbols-outlined text-[#F4664A] text-[20px]">warning</span>
                Accounts Nearing Renewal &amp; Revenue at Risk
              </h3>
              <span className="font-code-sm text-xs text-error font-bold">ACTION PRIORITY</span>
            </div>

            {/* Filter pills & search */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All Accounts' },
                  { id: 'CRITICAL', label: 'Critical Risk' },
                  { id: 'WATCHLIST', label: 'Watchlist' },
                  { id: 'TIER1', label: 'Tier 1' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    type="button"
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border-0 transition-colors ${
                      activeFilter === tab.id
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-[#051c36] text-on-surface-variant hover:text-on-surface border border-[#213551]/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Quick filter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2.5 py-1 bg-[#000e23] border border-[#213551] rounded-md text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary w-40"
              />
            </div>

            {/* Account Rows */}
            <div className="flex flex-col gap-2">
              {filteredRiskAccounts.map((item) => (
                <div
                  key={item.name}
                  onClick={() => onSelectAccount(item.name)}
                  className="p-3 rounded-lg bg-[#051c36] hover:bg-[#162b46] cursor-pointer border border-[#213551] hover:border-[#2DD4CF]/50 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.statusColor }}
                    ></span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-on-surface font-bold truncate hover:text-primary">
                          {item.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-code-sm font-semibold ${
                            item.statusColor === '#F4664A'
                              ? 'bg-error-container/40 text-error'
                              : 'bg-[#F2B84B]/20 text-[#F2B84B]'
                          }`}
                        >
                          {item.renewalTag}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-code-sm bg-[#213551] text-on-surface-variant font-semibold">
                          {item.tier}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5 truncate">
                        {item.summary}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div
                      className={`font-headline-md text-base font-bold ${
                        item.statusColor === '#F4664A' ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {item.arr}
                    </div>
                    <span className="text-primary font-label-sm text-xs font-semibold flex items-center gap-0.5 justify-end">
                      Open Detail
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#213551]/40 mt-3 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">
              Showing {filteredRiskAccounts.length} of 28 accounts requiring immediate executive intervention
            </span>
            <button
              onClick={() => alert('Full Renewal Workbench loaded with sorting and cohort forecasting.')}
              type="button"
              className="text-[#2DD4CF] font-label-md text-xs hover:underline bg-transparent border-0 cursor-pointer font-semibold p-0"
            >
              Full Renewal Workbench →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
