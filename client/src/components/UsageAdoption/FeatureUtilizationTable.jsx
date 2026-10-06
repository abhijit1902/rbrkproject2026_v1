import React from 'react';

export default function FeatureUtilizationTable({ usage }) {
  const features = usage?.featuresMatrix || [];

  return (
    <div className="lg:col-span-12 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col justify-between select-none">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
            <h3>Granular Feature Adoption Matrix</h3>
          </div>
          <span className="font-code-sm text-xs text-on-surface-variant font-semibold">
            Cohort vs Account
          </span>
        </div>

        {/* Feature Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-on-surface-variant border-collapse">
            <thead>
              <tr className="border-b border-[#3858a6] text-[11px] uppercase tracking-wider text-outline">
                <th className="py-2.5 px-3">Feature Capability</th>
                <th className="py-2.5 px-2">Module</th>
                <th className="py-2.5 px-2">Account %</th>
                <th className="py-2.5 px-2">Cohort Avg</th>
                <th className="py-2.5 px-2">Frequency</th>
                <th className="py-2.5 px-2">Avg Session</th>
                <th className="py-2.5 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3858a6]/40 font-body-sm">
              {features.map((feat, idx) => {
                const isUnderperforming = feat.adoptionPct < feat.cohortPct - 15;
                const isOverperforming = feat.adoptionPct > feat.cohortPct + 10;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#12306f] transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                      {feat.isAnomaly && (
                        <span className="material-symbols-outlined text-[15px] text-error" title="Telemetry anomaly flagged">
                          warning
                        </span>
                      )}
                      <span>{feat.feature}</span>
                    </td>
                    <td className="py-3 px-2 font-code-sm text-[11px] text-on-surface-variant">
                      {feat.module}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            isUnderperforming
                              ? 'text-error'
                              : isOverperforming
                              ? 'text-primary'
                              : 'text-on-surface'
                          }`}
                        >
                          {feat.adoptionPct}%
                        </span>
                        <div className="w-12 bg-[#071445] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isUnderperforming
                                ? 'bg-error'
                                : isOverperforming
                                ? 'bg-primary'
                                : 'bg-[#3ECF8E]'
                            }`}
                            style={{ width: `${feat.adoptionPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-code-sm text-[11px]">
                      {feat.cohortPct}%
                    </td>
                    <td className="py-3 px-2">{feat.freq}</td>
                    <td className="py-3 px-2 font-code-sm text-[11px] text-white">
                      {feat.timeSpent}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isUnderperforming
                            ? 'bg-error-container/40 text-error'
                            : isOverperforming
                            ? 'bg-primary/20 text-primary'
                            : 'bg-[#3ECF8E]/20 text-[#3ECF8E]'
                        }`}
                      >
                        {feat.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-space-md mt-space-md border-t border-[#3858a6]/40 flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">
          Correlated with daily telemetry event logs
        </span>
        <button
          onClick={() => alert('Feature heatmaps and user journey flows opened in Analytics Studio.')}
          type="button"
          className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
        >
          View Full Feature Heatmap →
        </button>
      </div>
    </div>
  );
}
