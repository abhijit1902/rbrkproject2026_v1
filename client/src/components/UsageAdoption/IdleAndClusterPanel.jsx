import React from 'react';

const SEV_COLOR = { P1: '#ff6b6b', P2: '#f59e0b', P3: '#a78bfa', P4: '#9db4e2' };
const OVERALL_COLOR = { Low: '#34d399', Medium: '#f59e0b', High: '#ff6b6b', Critical: '#ff3b5c' };
const fmtK = (n) => (n >= 1000000 ? '$' + (n / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'K');
const utilColor = (p) => (p < 10 ? '#ff6b6b' : p < 40 ? '#f59e0b' : '#3ECF8E');

function SummaryRow({ label, value, hint, last }) {
  return (
    <div className={'grid grid-cols-12 ' + (last ? '' : 'border-b border-[#3858a6]')}>
      <div className="col-span-3 px-3 py-2 font-bold text-white">{label}</div>
      <div className="col-span-4 px-3 py-2 text-white font-semibold">{value}</div>
      <div className="col-span-5 px-3 py-2 text-on-surface-variant">{hint}</div>
    </div>
  );
}

export default function IdleAndClusterPanel({ usage, isPortfolio, onOpenSeatOptimizer }) {
  if (!usage) return null;
  const idle = usage.idleProducts || [];
  const clusters = usage.clusters || [];
  const threshold = usage.nearZeroThresholdPct ?? 10;
  const sev = usage.severity;
  const sevColor = OVERALL_COLOR[sev] || '#9db4e2';
  const hasPlaceholders = clusters.some(c => c.placeholder);

  const nearZero = clusters.filter(c => c.nearZero);
  const nearNames = nearZero.slice(0, 4).map(c => c.name + ' ' + c.utilization + '%').join(', ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg select-none">
      {/* Idle products */}
      <div className="lg:col-span-6 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
            <h3>Idle Products</h3>
          </div>
          {sev && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border" style={{ color: sevColor, background: sevColor + '1f', borderColor: sevColor + '55' }}>
              Severity: {sev}
            </span>
          )}
        </div>

        <div className="rounded-lg border border-[#3858a6] overflow-hidden text-xs">
          <SummaryRow
            label="Idle products"
            value={`${usage.idleCount ?? idle.length} idle · ${usage.idleCoreCount ?? idle.filter(i => i.core).length} core`}
            hint="A core product idle means at least High severity"
          />
          <SummaryRow
            label="Idle ARR at stake"
            value={`${fmtK(usage.idleArr || 0)} · ${usage.idleArrPct ?? 0}% of renewal ARR`}
            hint="The money behind the idle products"
            last
          />
        </div>

        {idle.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-[#3ECF8E] py-3">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            No idle products. Every purchased product is activated and in use.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#3858a6]/40 max-h-64 overflow-y-auto">
            {idle.map((i, k) => (
              <div key={k} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="truncate">{i.name}</span>
                    {i.core && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30">CORE</span>
                    )}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {isPortfolio && <span className="text-[#66cfee]">{i.account} · </span>}
                    {i.note || (i.pct === 0 ? 'Not in use' : 'Usage at ' + i.pct + '%')}
                  </div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <div className="text-right text-[11px] font-bold" style={{ color: i.pct === 0 ? '#ff6b6b' : '#f59e0b' }}>
                    {i.pct}% used
                  </div>
                  <div className="h-1.5 rounded-full bg-[#3858a6]/50 overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: Math.max(2, i.pct) + '%', background: i.pct === 0 ? '#ff6b6b' : '#f59e0b' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {usage.dormantSeats > 0 && (
          <button
            onClick={onOpenSeatOptimizer}
            type="button"
            className="self-start text-primary hover:underline text-xs font-semibold bg-transparent border-0 cursor-pointer p-0"
          >
            Optimize {Number(usage.dormantSeats).toLocaleString()} dormant seats →
          </button>
        )}
      </div>

      {/* Cluster details */}
      <div className="lg:col-span-6 p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
            <span className="material-symbols-outlined text-primary text-[20px]">dns</span>
            <h3>Cluster Details</h3>
          </div>
          <span className="text-[11px] text-on-surface-variant">{usage.clusterTotal ?? clusters.length} clusters</span>
        </div>

        <div className="rounded-lg border border-[#3858a6] overflow-hidden text-xs">
          <SummaryRow
            label="Clusters near zero"
            value={`${usage.nearZeroClusters ?? nearZero.length} of ${usage.clusterTotal ?? clusters.length} under ${threshold}%`}
            hint={nearNames ? nearNames + (nearZero.length > 4 ? ' …' : '') : 'No cluster is under ' + threshold + '% utilization'}
            last
          />
        </div>

        {clusters.length === 0 ? (
          <div className="text-xs text-on-surface-variant py-3">No cluster data for {isPortfolio ? 'these accounts' : 'this account'}.</div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
            {clusters.map((c, k) => (
              <div key={k} className={'rounded-lg border p-2.5 ' + (c.nearZero ? 'bg-[#ff6b6b]/10 border-[#ff6b6b]/30' : 'bg-[#12306f] border-[#3858a6]/60')}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-code-sm text-xs font-bold text-white truncate" title={c.name}>
                    {c.name}
                    {isPortfolio && <span className="font-sans font-normal text-[10px] text-[#66cfee]"> · {c.account}</span>}
                  </span>
                  <span className="flex items-center gap-2 flex-shrink-0 text-[10px] font-bold">
                    {c.topSeverity && (
                      <span className="px-1.5 py-0.5 rounded" style={{ background: SEV_COLOR[c.topSeverity] + '26', color: SEV_COLOR[c.topSeverity] }}>{c.topSeverity}</span>
                    )}
                    {c.cases > 0 && <span className={c.open ? 'text-[#f59e0b]' : 'text-[#3ECF8E]'}>{c.open} open case{c.open === 1 ? '' : 's'}</span>}
                    <span style={{ color: utilColor(c.utilization) }}>{c.utilization}%</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#3858a6]/50 overflow-hidden mt-1.5">
                  <div className="h-full rounded-full" style={{ width: Math.max(2, c.utilization) + '%', background: utilColor(c.utilization) }} />
                </div>
                {c.latestTitle && (
                  <div className="text-[10px] text-on-surface-variant mt-1 leading-snug truncate" title={c.latestTitle}>
                    Latest case: {c.latestTitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {hasPlaceholders && (
          <p className="text-[10px] text-on-surface-variant m-0">
            Clusters under {threshold}% are the named ones from the account data. The other cluster names and their utilization are placeholders.
          </p>
        )}
      </div>
    </div>
  );
}
