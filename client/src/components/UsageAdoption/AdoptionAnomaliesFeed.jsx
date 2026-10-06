import React from 'react';
import { ADOPTION_THRESHOLD } from './FeatureUtilizationTable';

// Builds the AI summary text from the account's usage telemetry
export function buildUsageSummary(usage) {
  if (!usage) return '';
  const products = usage.products || [];
  if (usage.noTelemetry) {
    const skus = products.filter(p => p.entitlement);
    const covered = Array.from(new Set(skus.flatMap(p => p.covers)));
    return (
      usage.accountName + ' has ' + skus.length + ' active entitlements' +
      (covered.length ? ' covering ' + covered.join(', ') : '') + '. ' +
      'Consumed units, adoption % and overage are empty in Salesforce and must come from ' + (usage.usageSource || 'the telemetry source') +
      ', so usage, feature adoption and anomalies cannot be assessed yet.'
    );
  }
  const activated = products.filter(p => p.activated !== false);
  const notPurchased = products.filter(p => p.activated === false && !p.purchased);
  const neverActivated = products.filter(p => p.activated === false && p.purchased);
  const notActivated = notPurchased;
  const features = usage.featuresMatrix || [];
  const worst = [...features].sort((a, b) => a.adoptionPct - b.adoptionPct)[0];
  const anomalies = usage.adoptionAnomalies || [];
  const critical = anomalies.filter(a => ['CRITICAL', 'HIGH', 'WARNING'].includes(String(a.severity).toUpperCase())).length;

  const parts = [];
  parts.push(
    usage.accountName + ' has ' + activated.length + ' of ' + products.length + ' products activated with ' +
    usage.licenseUtilization + ' license utilization (' + usage.activeSeats + ' of ' + usage.totalSeats + ' seats active).'
  );
  parts.push('Weekly active users stand at ' + usage.wau + ' (' + usage.wauDelta + '), with stickiness rated ' + String(usage.stickinessStatus).toLowerCase() + '.');
  if (worst) {
    parts.push(
      worst.adoptionPct < ADOPTION_THRESHOLD
        ? 'The lowest feature adoption is ' + worst.feature + ' at ' + worst.adoptionPct + '%, below the ' + ADOPTION_THRESHOLD + '% threshold.'
        : 'Every feature meets the ' + ADOPTION_THRESHOLD + '% adoption threshold; the lowest is ' + worst.feature + ' at ' + worst.adoptionPct + '%.'
    );
  }
  if (anomalies.length) {
    parts.push(anomalies.length + ' telemetry ' + (anomalies.length === 1 ? 'anomaly was' : 'anomalies were') + ' detected recently' +
      (critical ? ', ' + critical + ' needing attention.' : ', none critical.'));
  }
  if (neverActivated.length) {
    parts.push('Purchased but never activated: ' + neverActivated.map(p => p.name).join(', ') + '.');
  }
  if (notActivated.length) {
    parts.push('Not purchased: ' + notActivated.map(p => p.name).join(', ') + ' (expansion candidates).');
  }
  if (usage.dormantArrExposure) {
    parts.push('Dormant seat exposure is ' + usage.dormantArrExposure + ' of ARR.');
  }
  return parts.join(' ');
}

export default function AdoptionAnomaliesFeed({ usage, onTriggerInvestigation }) {
  const anomalies = usage?.adoptionAnomalies || [];
  const summary = buildUsageSummary(usage);

  return (
    <div className="lg:col-span-12 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-error text-[20px]">crisis_alert</span>
            <h3>Telemetry Anomalies, Alerts &amp; AI Summary</h3>
          </div>
          <span className="font-code-sm text-xs text-error font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            ACTIVE FEED
          </span>
        </div>

        {/* AI Summary */}
        <div className="p-space-md rounded-lg bg-[#12306f] border border-primary/30 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            AI Usage Summary
          </div>
          <p className="text-xs text-on-surface m-0 leading-relaxed">{summary}</p>
        </div>

        <div className="flex flex-col gap-space-sm">
          {anomalies.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#12306f] hover:bg-[#2b5db3] border border-[#3858a6]/50 transition-colors flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-code-sm font-bold"
                    style={{
                      backgroundColor: `${item.color}25`,
                      color: item.color
                    }}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>
                <span className="font-code-sm text-[11px] text-on-surface-variant">
                  {item.date}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant m-0 leading-relaxed">
                {item.desc}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="font-code-sm text-xs font-bold" style={{ color: item.color }}>
                  {item.impact}
                </span>
                <button
                  onClick={onTriggerInvestigation}
                  type="button"
                  className="text-primary hover:underline font-semibold text-xs bg-transparent border-0 cursor-pointer p-0"
                >
                  Investigate Ticket →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">
          Correlated via Pearson Anomaly Detector (v2.4)
        </span>
        <button
          onClick={() => alert('Anomaly Webhooks configured: PagerDuty, Slack #rev-ops-alerts, Zendesk')}
          type="button"
          className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
        >
          Manage Alerts →
        </button>
      </div>
    </div>
  );
}
