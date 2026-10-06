import React from 'react';

// aggregates (optional): real account-level counts that override what can be derived from the itemized list
export default function CaseSummaryStrip({ cases, aggregates, teamFiltered }) {
  const open = cases.filter(c => c.status !== 'Resolved');
  const resolved = cases.filter(c => c.status === 'Resolved');
  const useAgg = aggregates && !teamFiltered;

  const openCount = useAgg ? aggregates.open.total : open.length;
  const p1 = useAgg ? aggregates.open.p1 : open.filter(c => c.severity === 'P1').length;
  const breached = open.filter(c => c.slaHoursLeft != null && c.slaHoursLeft < 0).length;
  const slaKnown = open.some(c => c.slaHoursLeft != null);

  const resWithHours = resolved.filter(c => c.resolutionHours != null);
  const avgRes = resWithHours.length
    ? Math.round(resWithHours.reduce((s, c) => s + c.resolutionHours, 0) / resWithHours.length) + 'h'
    : null;
  const rated = resolved.filter(c => c.csat);
  const csat = rated.length ? (rated.reduce((s, c) => s + c.csat, 0) / rated.length).toFixed(1) + ' / 5' : null;

  const aggRes = useAgg ? aggregates.last90.avgResolutionDays + 'd' : null;

  const items = [
    {
      label: 'Open Cases', value: openCount,
      sub: useAgg ? aggregates.open.support + ' support · ' + aggregates.open.renewal + ' renewal · ' + aggregates.open.retention + ' retention'
        : (open.length === 1 ? '1 case in flight' : open.length + ' cases in flight'),
      icon: 'inbox', color: '#66cfee',
    },
    { label: 'Open P1 Cases', value: p1, sub: p1 ? 'Needs immediate attention' : 'No critical cases', icon: 'priority_high', color: '#ff6b6b' },
    {
      label: 'SLA Breaches', value: slaKnown ? breached : '—',
      sub: slaKnown ? (breached ? 'Past response target' : 'All within SLA') : 'SLA not pulled',
      icon: 'timer_off', color: '#f59e0b',
    },
    {
      label: 'Avg Resolution', value: aggRes || avgRes || '—',
      sub: useAgg ? 'Last 90d, ' + aggregates.last90.avgBasis : (avgRes ? 'Resolved cases' : 'No resolved cases'),
      icon: 'schedule', color: '#a78bfa',
    },
    { label: 'CSAT', value: csat || '—', sub: csat ? rated.length + ' rated cases' : 'Not available', icon: 'sentiment_satisfied', color: '#34d399' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {items.map(item => (
        <div
          key={item.label}
          className="border rounded-xl p-4 flex flex-col gap-2"
          style={{ background: item.color + '1a', borderColor: item.color + '4d' }}
        >
          <div className="flex items-start justify-between">
            <span className="font-semibold text-[11px] uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
            <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>{item.icon}</span>
          </div>
          <div className="text-3xl font-bold text-white leading-none">{item.value}</div>
          <div className="text-[10px] text-[#9db4e2] font-medium">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
