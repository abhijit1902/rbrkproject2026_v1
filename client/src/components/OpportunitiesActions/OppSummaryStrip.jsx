import React from 'react';
import { fmtMoney, summarizeOps, SENTIMENT_COLORS } from './data';

export default function OppSummaryStrip({ ops }) {
  const s = summarizeOps(ops.opportunities);
  const r = ops.renewal;
  const sentColor = SENTIMENT_COLORS[r.sentiment] || '#9db4e2';

  const amt = (v, suffix, none) => (v == null ? 'Amount restricted' : (none && v === 0 ? none : fmtMoney(v) + suffix));

  const items = [
    { label: 'Open Ops', value: s.open.length, sub: amt(s.openValue, ' pipeline', 'No open pipeline'), icon: 'lock_open', color: '#66cfee' },
    { label: 'Closed Ops', value: s.closed.length, sub: amt(s.closedValue, ' total value', 'None on record'), icon: 'task_alt', color: '#a78bfa' },
    { label: 'Closed Won', value: s.won.length, sub: amt(s.wonValue, '', 'None closed won'), icon: 'emoji_events', color: '#34d399' },
    { label: 'Closed Lost', value: s.lost.length, sub: amt(s.lostValue, '', 'None closed lost'), icon: 'cancel', color: '#ff6b6b' },
    { label: 'Upcoming Renewal', value: fmtMoney(r.value), sub: 'In ' + r.daysAway + ' days · ' + r.date + (r.value == null ? ' · value restricted' : ''), icon: 'event_repeat', color: '#f59e0b' },
    { label: 'Renewal Sentiment', value: r.sentiment, sub: r.score != null ? 'Score ' + r.score + ' / 100' : 'Score not available', icon: 'sentiment_neutral', color: sentColor },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {items.map(item => (
        <div
          key={item.label}
          className="border rounded-xl p-4 flex flex-col gap-2"
          style={{ background: item.color + '1a', borderColor: item.color + '4d' }}
        >
          <div className="flex items-start justify-between gap-1">
            <span className="font-semibold text-[10px] uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
            <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>{item.icon}</span>
          </div>
          <div className="text-2xl font-bold text-white leading-none">{item.value}</div>
          <div className="text-[10px] text-[#9db4e2] font-medium">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
