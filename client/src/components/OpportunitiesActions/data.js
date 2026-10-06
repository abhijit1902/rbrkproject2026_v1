export const SENTIMENT_COLORS = {
  Positive: '#34d399',
  Neutral: '#66cfee',
  'At Risk': '#f59e0b',
  Negative: '#ff6b6b',
};

export const STAGE_COLORS = {
  Identified: '#9db4e2',
  Qualified: '#a78bfa',
  '1 Discovery': '#9db4e2',
  '2 Consensus': '#a78bfa',
  '3 Technical Validation': '#66cfee',
  '4 Business Justification': '#f59e0b',
  Proposal: '#66cfee',
  Negotiation: '#f59e0b',
  'Closed Won': '#34d399',
  'Closed Lost': '#ff6b6b',
};

export const fmtMoney = (n) => {
  if (n == null) return 'Restricted';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000000) return sign + '$' + (abs / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (abs >= 1000) return sign + '$' + Math.round(abs / 1000) + 'K';
  return sign + '$' + abs;
};

const parseMoney = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || 0;

// account is the account object returned by /api/accounts/:name
const EMPTY_OPS = {
  opportunities: [],
  churnHistory: [],
  renewalExtras: { sentiment: 'Neutral', score: null, champion: 'Not recorded', procurement: 'Not recorded', drivers: [] },
};

export function getOpsData(account) {
  const d = account.opsData || EMPTY_OPS;
  const arr = parseMoney(account.arrExact);
  return {
    opportunities: d.opportunities,
    churnHistory: d.churnHistory,
    renewal: { date: account.contractEnd, value: arr || null, daysAway: account.renewalDaysVal, ...d.renewalExtras },
  };
}

// Sums values; returns null when every value is restricted (null) so the UI can say so
const sumValues = (list) => {
  const vals = list.filter(x => x.value != null);
  if (vals.length === 0) return list.length ? null : 0;
  return vals.reduce((t, x) => t + x.value, 0);
};

export function summarizeOps(opps) {
  const open = opps.filter(x => x.status === 'Open');
  const won = opps.filter(x => x.status === 'Won');
  const lost = opps.filter(x => x.status === 'Lost');
  return {
    open, won, lost,
    closed: [...won, ...lost],
    openValue: sumValues(open), wonValue: sumValues(won), lostValue: sumValues(lost),
    closedValue: sumValues([...won, ...lost]),
    expansionOpen: open.filter(x => x.type !== 'Renewal'),
  };
}

export function buildOpsSummary(account, ops) {
  const s = summarizeOps(ops.opportunities);
  const r = ops.renewal;
  const money = (v) => (v == null ? 'an amount restricted by data policy' : fmtMoney(v));
  const winRate = s.closed.length ? Math.round((s.won.length / s.closed.length) * 100) : null;
  const parts = [];
  parts.push(
    account.name + ' has ' + s.open.length + ' open ' + (s.open.length === 1 ? 'opportunity' : 'opportunities') +
    (s.openValue == null ? ' (amounts restricted by data policy)' : ' worth ' + fmtMoney(s.openValue)) +
    (s.closed.length
      ? ', with ' + s.won.length + ' closed won and ' + s.lost.length + ' closed lost' + (winRate != null && s.wonValue != null ? ' (' + winRate + '% win rate on closed deals)' : '') + '.'
      : ' and no closed opportunities on record.')
  );
  parts.push(
    'The upcoming renewal' + (r.value == null ? ' (value restricted)' : ' is worth ' + fmtMoney(r.value)) + ' is ' + r.daysAway +
    ' days away, and renewal sentiment is ' + r.sentiment.toLowerCase() + (r.score != null ? ' (' + r.score + '/100).' : '.')
  );
  const stages = Array.from(new Set(s.open.filter(x => x.type === 'Renewal').map(x => x.stage + ' at ' + x.probability + '%')));
  if (stages.length) parts.push('Renewal opportunities are at ' + stages.join(', ') + '.');
  const negatives = r.drivers.filter(d => d.tone === 'negative');
  if (negatives.length) parts.push('Main concerns: ' + negatives.map(d => d.label.charAt(0).toLowerCase() + d.label.slice(1)).join('; ') + '.');
  if (s.expansionOpen.length) {
    parts.push('Expansion pipeline of ' + money(sumValues(s.expansionOpen)) + ' across ' + s.expansionOpen.length +
      ' ' + (s.expansionOpen.length === 1 ? 'opportunity' : 'opportunities') + '.');
  }
  if (ops.churnHistory == null) {
    parts.push('Churn history was not provided.');
  } else if (ops.churnHistory.length) {
    const total = ops.churnHistory.reduce((a, c) => a + c.amount, 0);
    parts.push('Past churn and contraction totals ' + fmtMoney(total) + ' across ' + ops.churnHistory.length + ' events.');
  } else {
    parts.push('No churn or contraction history on record.');
  }
  return parts.join(' ');
}
