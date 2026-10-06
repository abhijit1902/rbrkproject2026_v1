import React, { useState, useEffect } from 'react';
import IdleAndClusterPanel from './IdleAndClusterPanel';
import UsageActivationPatternChart from './UsageActivationPatternChart';
import ProductAdoptionGrid from './ProductAdoptionGrid';
import FeatureUtilizationTable from './FeatureUtilizationTable';
import AdoptionAnomaliesFeed from './AdoptionAnomaliesFeed';
import SeatOptimizerModal from '../Modals/SeatOptimizerModal';

export default function UsageAdoptionView({
  selectedAccountName,
  allAccounts = [],
  onSelectAccount,
  onNavigate
}) {
  const [usageData, setUsageData] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('60D');
  const [isSeatOptimizerOpen, setIsSeatOptimizerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch usage telemetry whenever selectedAccountName changes
  useEffect(() => {
    fetchUsage(selectedAccountName);
  }, [selectedAccountName]);

  const fetchUsage = (accName) => {
    fetch(`/api/usage/${encodeURIComponent(accName || '__all__')}`)
      .then(res => res.json())
      .then(data => setUsageData(data.usage))
      .catch(err => console.error('Error fetching usage data:', err));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      fetchUsage(selectedAccountName);
      setIsRefreshing(false);
    }, 600);
  };

  if (!usageData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
          <span className="text-sm text-on-surface-variant font-medium">
            Fetching Real-Time Telemetry &amp; Adoption Matrix...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-lg select-none animate-fadeIn">
      {/* Top Header & Filter Bar */}
      <section className="bg-[#12306f] px-space-lg py-space-sm rounded-xl border border-[#3858a6] shadow-sm flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md flex-wrap">
          {/* Account Selector Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-semibold">Entity Context:</span>
            <select
              value={selectedAccountName || ''}
              onChange={(e) => onSelectAccount(e.target.value || null)}
              className="bg-[#1b4098] border border-[#3858a6] text-xs text-white font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="" className="bg-[#12306f] text-white">All Accounts</option>
              {allAccounts.map(acc => (
                <option key={acc.name} value={acc.name} className="bg-[#12306f] text-white">
                  {acc.name} ({acc.arr})
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-outline-variant"></div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#1c3f96]/40 border border-[#3858a6] rounded-lg p-0.5">
            {['7D', '30D', '60D', '90D', '12M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                type="button"
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer border-0 transition-colors ${
                  activeTimeframe === tf
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Sync Status & Action */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2 font-code-sm text-xs text-on-surface-variant">
            <span className={'w-2 h-2 rounded-full ' + (usageData.noTelemetry ? 'bg-outline' : 'bg-primary animate-ping')}></span>
            <span className="font-semibold text-on-surface">{usageData.noTelemetry ? 'Telemetry Not Connected' : 'Telemetry Ingestion Active'}</span>
            {!usageData.noTelemetry && (
              <>
                <span className="text-outline-variant">·</span>
                <span>Live Sync 2m ago</span>
              </>
            )}
          </div>

          <button
            onClick={handleRefresh}
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#2b5db3] text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border border-[#3858a6]"
            title="Force Telemetry Sync"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>

          <button
            onClick={() => onNavigate('account-overview')}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#2b5db3] hover:bg-[#3a66bb] text-primary font-label-md text-xs font-bold transition-all border border-[#3858a6] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Back to Cockpit</span>
          </button>
        </div>
      </section>

      {/* Row 1: idle products and cluster details */}
      <IdleAndClusterPanel
        usage={usageData}
        isPortfolio={!selectedAccountName}
        onOpenSeatOptimizer={() => setIsSeatOptimizerOpen(true)}
      />

      {usageData.noTelemetry ? (
        <section className="p-space-lg rounded-xl bg-[#1c3f96]/40 border border-dashed border-[#3858a6] flex items-center gap-space-md">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_off</span>
          <div>
            <div className="text-sm font-bold text-on-surface">Usage telemetry not connected for this account</div>
            <p className="text-xs text-on-surface-variant m-0 mt-1 leading-relaxed">
              Consumed units, adoption % and overage are empty in Salesforce and must come from {usageData.usageSource || 'the telemetry source'}.
              Weekly active users, license utilization, the usage trend and feature adoption will appear here once that data is connected.
              Entitlements are shown below.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Row 2: Usage & activation pattern */}
          <UsageActivationPatternChart usage={usageData} />
        </>
      )}

      {/* Row 3: Product Suite Adoption Grid */}
      <ProductAdoptionGrid
        usage={usageData}
        onOpenSeatOptimizer={() => setIsSeatOptimizerOpen(true)}
      />

      {/* Row 4: 60/40 Split: Feature Matrix & Anomalies Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {!usageData.noTelemetry && <FeatureUtilizationTable usage={usageData} />}
        <AdoptionAnomaliesFeed
          usage={usageData}
          onTriggerInvestigation={() => alert(`Investigating Zendesk Ticket #89201 for ${usageData.accountName}. Opening Tier-3 Engineering escalation thread.`)}
        />
      </div>

      {/* License Seat Optimizer Modal */}
      <SeatOptimizerModal
        isOpen={isSeatOptimizerOpen}
        onClose={() => setIsSeatOptimizerOpen(false)}
        usage={usageData}
      />
    </div>
  );
}
