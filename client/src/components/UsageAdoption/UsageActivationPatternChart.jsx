import React from 'react';

const W = 500;
const H = 150;
const X0 = 30;
const STEP = 62;

// Activation state of one product, from the purchased / activated flags
function activationState(p) {
  if (p.activated) return { label: 'Activated', color: p.healthColor || '#3ECF8E' };
  if (p.purchased) return { label: 'Purchased, not activated', color: '#F2B84B' };
  return { label: 'Not purchased', color: '#9db4e2' };
}

export default function UsageActivationPatternChart({ usage }) {
  const trend = usage?.weeklyUsageTrend || [];
  const products = usage?.products || [];

  // ---- usage pattern: weekly active users against the contracted target
  const vals = trend.flatMap(t => [t.apex, t.target]);
  const lo = vals.length ? Math.min(...vals) : 0;
  const hi = vals.length ? Math.max(...vals) : 1;
  const pad = (hi - lo) * 0.15 || 1;
  const min = lo - pad;
  const max = hi + pad;
  const getY = (v) => 140 - ((v - min) / (max - min)) * 120;
  const getX = (i) => X0 + i * STEP;

  const line = trend.map((t, i) => (i === 0 ? 'M' : 'L') + ' ' + getX(i) + ' ' + getY(t.apex)).join(' ');
  const area = trend.length ? line + ' L ' + getX(trend.length - 1) + ' ' + H + ' L ' + getX(0) + ' ' + H + ' Z' : '';
  const first = trend[0];
  const latest = trend[trend.length - 1];
  const change = first && latest && first.apex ? ((latest.apex - first.apex) / first.apex) * 100 : 0;
  const ofTarget = latest && latest.target ? Math.round((latest.apex / latest.target) * 100) : null;
  const trendColor = change >= 0 ? '#3ECF8E' : '#F4664A';

  // ---- activation pattern: purchased -> activated -> well used, per product
  const purchased = products.filter(p => p.purchased || p.activated);
  const activated = products.filter(p => p.activated);
  const wellUsed = activated.filter(p => p.utilization >= 60);
  const rows = [...products].sort((a, b) => (b.activated - a.activated) || (b.utilization - a.utilization));

  return (
    <div className="p-space-lg rounded-xl bg-[#1b4098] border border-[#3858a6] shadow-md flex flex-col gap-space-md select-none">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
          <span className="material-symbols-outlined text-primary text-[20px]">stacked_line_chart</span>
          <h3>Usage &amp; Activation Pattern</h3>
        </div>
        <div className="flex items-center gap-space-md font-label-md text-xs">
          <span className="flex items-center gap-1.5 text-on-surface">
            <span className="w-3 h-1 rounded-full" style={{ background: trendColor }}></span>
            <span>Weekly active users</span>
          </span>
          <span className="flex items-center gap-1.5 text-on-surface">
            <span className="w-3 border-t border-dashed border-primary"></span>
            <span>Contract target</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Usage pattern */}
        <div className="lg:col-span-7 bg-[#12306f] border border-[#3858a6]/60 rounded-lg p-space-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px]">Usage over time</span>
            {latest && (
              <span className="text-on-surface-variant">
                <strong style={{ color: trendColor }}>{(change >= 0 ? '+' : '') + change.toFixed(1)}%</strong> since {first.week}
                {ofTarget != null && <> · {ofTarget}% of target</>}
              </span>
            )}
          </div>

          {trend.length > 1 ? (
            <>
              <svg className="w-full h-44 overflow-visible" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${W} ${H}`}>
                <defs>
                  <linearGradient id="usagePatternGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20, 60, 100, 140].map(y => (
                  <line key={y} x1={X0} x2={getX(trend.length - 1)} y1={y} y2={y} stroke="#9db4e2" strokeOpacity="0.15" />
                ))}
                <line
                  x1={X0} x2={getX(trend.length - 1)} y1={getY(latest.target)} y2={getY(latest.target)}
                  stroke="#66cfee" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.6"
                />
                <path d={area} fill="url(#usagePatternGlow)" />
                <path d={line} stroke={trendColor} strokeLinecap="round" strokeWidth="3" />
                {trend.map((t, i) => (
                  <circle key={i} cx={getX(i)} cy={getY(t.apex)} r={i === trend.length - 1 ? 5 : 3.5} fill={trendColor} stroke="#071445" strokeWidth="1.5" />
                ))}
              </svg>
              <div className="flex justify-between text-outline-variant font-code-sm text-[11px] px-1">
                {trend.map((t, i) => (
                  <span key={i} className={i === trend.length - 1 ? 'font-bold' : ''} style={i === trend.length - 1 ? { color: trendColor } : undefined}>
                    {t.week} · {t.apex.toLocaleString()}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-on-surface-variant">No weekly usage data available.</div>
          )}
        </div>

        {/* Activation pattern */}
        <div className="lg:col-span-5 bg-[#12306f] border border-[#3858a6]/60 rounded-lg p-space-md flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px]">Activation by product</span>
            <span className="text-on-surface-variant">
              <strong className="text-on-surface">{activated.length}</strong> of {purchased.length} purchased activated · <strong className="text-on-surface">{wellUsed.length}</strong> well used
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {rows.map(p => {
              const st = activationState(p);
              const pct = p.activated ? Math.max(2, Math.min(100, p.utilization)) : 0;
              return (
                <div key={p.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-on-surface font-semibold truncate pr-2">{p.name}</span>
                    <span className="flex items-center gap-1.5 flex-shrink-0" style={{ color: st.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }}></span>
                      {p.activated ? p.utilization + '% used' : st.label}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#3858a6]/50 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: pct + '%', background: st.color }}></div>
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && <div className="text-xs text-on-surface-variant">No product data available.</div>}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-on-surface-variant mt-auto pt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3ECF8E]"></span>Activated</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F2B84B]"></span>Purchased, not activated</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9db4e2]"></span>Not purchased</span>
          </div>
        </div>
      </div>
    </div>
  );
}
