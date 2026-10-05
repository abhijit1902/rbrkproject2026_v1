import React from 'react';

export default function AdoptionAnomaliesFeed({ usage, onTriggerInvestigation }) {
  const anomalies = usage?.adoptionAnomalies || [];

  return (
    <div className="lg:col-span-5 p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-error text-[20px]">crisis_alert</span>
            <h3>Telemetry Anomalies &amp; Alerts</h3>
          </div>
          <span className="font-code-sm text-xs text-error font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            ACTIVE FEED
          </span>
        </div>

        <div className="flex flex-col gap-space-sm">
          {anomalies.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#051c36] hover:bg-[#162b46] border border-[#213551]/50 transition-colors flex flex-col gap-1.5"
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

      <div className="pt-space-md mt-space-md border-t border-[#213551]/40 flex items-center justify-between text-xs">
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
