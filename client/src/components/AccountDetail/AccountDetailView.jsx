import React from 'react';
import BreadcrumbBar from './BreadcrumbBar';
import AccountHeaderCard from './AccountHeaderCard';
import AccountSnapshotCard from './AccountSnapshotCard';
import HealthDonutCard from './HealthDonutCard';
import RenewalRiskCard from './RenewalRiskCard';
import SignalsCard from './SignalsCard';
import RecommendedActionsCard from './RecommendedActionsCard';
import PeerCohortCard from './PeerCohortCard';
import TelemetryVelocityChart from './TelemetryVelocityChart';
import PrescribedActionsCard from './PrescribedActionsCard';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';

export default function AccountDetailView({
  account,
  allAccounts,
  onSelectAccount,
  onGoToPortfolio,
  onTriggerPlaybook,
  isDispatchingPlaybook,
  onOpenPlaybookModal,
  onOpenRenewalPlan,
  onExportReport
}) {
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
          <span className="text-sm text-on-surface-variant font-medium">Loading Account Cockpit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-lg animate-fadeIn">
      {/* Top Utility Nav & Interactive Breadcrumbs */}
      <BreadcrumbBar
        account={account}
        allAccounts={allAccounts}
        onSelectAccount={onSelectAccount}
        onGoToPortfolio={onGoToPortfolio}
        onTriggerPlaybook={onTriggerPlaybook}
        isDispatchingPlaybook={isDispatchingPlaybook}
        onExportReport={onExportReport}
      />

      {/* Main Account Header Card */}
      <AccountHeaderCard account={account} />

      {/* ROW 1: ACCOUNT SNAPSHOT, HEALTH DONUT, RENEWAL & RISK DETAIL */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <AccountSnapshotCard account={account} />
        <HealthDonutCard account={account} />
        <RenewalRiskCard account={account} onOpenRenewalPlan={onOpenRenewalPlan} />
      </section>

      {/* ROW 2: SIGNALS FOR THIS ACCOUNT, RECOMMENDED ACTIONS STATS, SIMILAR ACCOUNTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <SignalsCard account={account} />
        <RecommendedActionsCard
          account={account}
          onOpenPlaybookModal={onOpenPlaybookModal}
        />
        <PeerCohortCard
          account={account}
          onSelectAccount={onSelectAccount}
        />
      </section>

      {/* ROW 3: 60/40 SPLIT - SIGNAL HISTORY (90-DAY) & RECOMMENDED ACTIONS LIST */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <TelemetryVelocityChart account={account} />
        <PrescribedActionsCard
          account={account}
          onOpenPlaybookModal={onOpenPlaybookModal}
        />
      </section>

      {/* ROW 4: AI GENERATED EXECUTIVE SUMMARY (FULL-WIDTH) */}
      <ExecutiveSummaryCard
        account={account}
        onGeneratePdf={onExportReport}
      />
    </div>
  );
}
