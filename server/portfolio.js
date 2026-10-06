// Loads server/data/accounts.json (generated from Customer_Intelligence_Account_Data.docx)
// and derives every portfolio-level view from it, so nothing here is hand-maintained.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const RECORDS = JSON.parse(readFileSync(join(here, 'data', 'accounts.json'), 'utf8'));

export const ACCOUNTS = Object.fromEntries(RECORDS.map(r => [r.account.name, r.account]));
export const USAGE = Object.fromEntries(RECORDS.map(r => [r.usage.accountName, r.usage]));
export const HUB_LIST = RECORDS.map(r => r.hub);

const num = (s) => Number(String(s).replace(/[^0-9.-]/g, '')) || 0;
const fmtM = (n) => '$' + (n / 1000000).toFixed(1) + 'M';
const fmtExact = (n) => '$' + Math.round(n).toLocaleString('en-US');

const RISK_COLORS = { High: '#ff6b6b', Medium: '#f59e0b', Low: '#a78bfa' };
const SEV_TYPE = { critical: 'critical', warning: 'warning', info: 'info', positive: 'positive' };
const SEV_COLOR = { critical: '#ff6b6b', warning: '#f59e0b', info: '#a78bfa', positive: '#34d399' };
const CAT_ICON = {
  Usage: 'trending_down', Relationship: 'person_off', Support: 'support_agent', Competitive: 'compare_arrows',
  NPS: 'sentiment_dissatisfied', Engagement: 'forum', Expansion: 'trending_up',
};
const CAT_ACTIONS = {
  Usage: ['Open Account', 'Trigger Playbook', 'Schedule EBR'],
  Relationship: ['Open Account', 'Map Stakeholders', 'Alert CSM'],
  Support: ['Open Account', 'View Cases', 'Escalate'],
};

// "3h ago" / "2d ago" -> minutes, so notifications sort newest first
const minutesAgo = (t) => {
  const m = /(\d+)\s*([mhd])/.exec(t || '');
  if (!m) return 1e9;
  return Number(m[1]) * { m: 1, h: 60, d: 1440 }[m[2]];
};

const daysUntil = (label) => {
  const target = new Date(label + ' 09:00');
  const asOf = new Date('Oct 5, 2026 09:00');
  return Math.round((target - asOf) / 86400000);
};

export function buildPortfolio() {
  const accts = Object.values(ACCOUNTS);
  const arrs = accts.map(a => num(a.arrExact));
  const totalArr = arrs.reduce((s, x) => s + x, 0);
  const yoyWeighted = accts.reduce((s, a, i) => s + num(a.yoy) * arrs[i], 0) / (totalArr || 1);
  const scores = accts.map(a => num(a.healthScore.split('/')[0]));
  const avg = scores.reduce((s, x) => s + x, 0) / (scores.length || 1);
  const soon = accts.filter(a => a.renewalDaysVal <= 30);
  const soonArr = soon.reduce((s, a) => s + num(a.arrExact), 0);
  const byColor = (c) => HUB_LIST.filter(h => h.status === c).length;
  const total = HUB_LIST.length;
  const pct = (n) => Math.round((n / (total || 1)) * 100);

  return {
    totalArr: fmtM(totalArr),
    totalArrExact: fmtExact(totalArr),
    arrYoy: (yoyWeighted >= 0 ? '+' : '') + yoyWeighted.toFixed(1) + '% YoY',
    portfolioHealthAvg: avg.toFixed(1) + ' / 100',
    healthAvgDelta: 'Across ' + total + ' accounts',
    renewalArrExposed: fmtM(soonArr),
    renewalAccountsCount: soon.length + ' Accounts < 30d',
    openPrescriptionsCount: accts.reduce((s, a) => s + a.actionsOpenCount, 0) + ' Items',
    activePlaybooksCount: accts.filter(a => a.playbookTitle).length + ' Active Playbooks',
    healthBreakdown: {
      totalAccounts: total,
      healthy: { count: byColor('green'), percentage: pct(byColor('green')), label: 'Healthy' },
      attention: { count: byColor('amber'), percentage: pct(byColor('amber')), label: 'Attention / Watchlist' },
      critical: { count: byColor('red'), percentage: pct(byColor('red')), label: 'Critical Risk' },
    },
    riskPrioritizedAccounts: RECORDS
      .map(r => ({ ...r.portfolioRow, _d: r.hub.renewalDays }))
      .sort((a, b) => a._d - b._d)
      .map(({ _d, ...row }) => row),
  };
}

export function buildRiskSignals() {
  const rows = RECORDS.map(r => ({
    ...r.riskRow,
    riskColor: RISK_COLORS[r.riskRow.riskLevel] || '#a78bfa',
    signals: r.riskRow.topSignals.split(/, (?=[A-Z0-9])/),
  }));

  // summary strip
  const high = rows.filter(r => r.riskLevel === 'High');
  const atRiskArr = high.reduce((s, r) => s + num(ACCOUNTS[r.name].arrExact), 0);
  const escalations = [];
  const expansion = [];
  RECORDS.forEach(rec => {
    const a = rec.account;
    a.casesData.escalations.forEach(e => {
      escalations.push({
        id: e.id, account: a.name, severity: e.level,
        title: e.title, owner: e.owner, createdAt: e.openedLabel, updatedAt: e.sinceDays + 'd open',
        status: e.status,
        updates: [
          { time: 'Next step', author: e.owner, text: e.next },
          { time: e.openedLabel, author: e.owner, text: 'Escalation opened. Status: ' + e.status + '.' },
        ],
      });
    });
    a.opsData.opportunities
      .filter(o => o.status === 'Open' && (o.type === 'Expansion' || o.type === 'New Product'))
      .forEach(o => {
        expansion.push({
          account: a.name, id: o.id, name: o.name, tier: rec.riskRow.tier,
          currentArr: rec.riskRow.arr, expansionValue: o.value, expansionType: o.type,
          probability: o.probability, signal: o.signal || o.nextStep || o.type,
          champion: a.opsData.renewalExtras.champion, stage: o.stage,
          daysToClose: o.closeLabel ? daysUntil(o.closeLabel) : null, owner: o.owner,
        });
      });
  });
  const expansionTotal = expansion.reduce((s, e) => s + e.expansionValue, 0);
  const avgHealth = Math.round(rows.reduce((s, r) => s + r.healthScore, 0) / (rows.length || 1));

  // churn distribution
  const bucket = (lo, hi) => rows.filter(r => r.churnProb >= lo && r.churnProb < hi).length;
  const distribution = [
    { label: 'Critical (>75%)', count: bucket(75, 101), color: '#ff6b6b' },
    { label: 'High (50–75%)', count: bucket(50, 75), color: '#f59e0b' },
    { label: 'Medium (25–50%)', count: bucket(25, 50), color: '#a78bfa' },
    { label: 'Low (<25%)', count: bucket(0, 25), color: '#34d399' },
  ].map(b => ({ ...b, width: Math.max(4, Math.round((b.count / (rows.length || 1)) * 100)) }));

  // churn drivers: how many accounts carry each valid, in-progress risk category
  const driverCounts = {};
  RECORDS.forEach(rec => {
    const seen = new Set();
    (rec.account.riskRegister || []).forEach(rk => {
      if (rk.status === 'In progress' && /^Valid/.test(rk.validity || '') && rk.category) seen.add(rk.category);
    });
    seen.forEach(c => { driverCounts[c] = (driverCounts[c] || 0) + 1; });
  });
  const palette = ['#ff6b6b', '#f59e0b', '#a78bfa', '#66cfee', '#34d399'];
  const drivers = Object.entries(driverCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([label, n], i) => ({ label, pct: Math.round((n / (rows.length || 1)) * 100), color: palette[i % palette.length] }));

  // signal feed: one per account
  const feed = RECORDS.map((rec, i) => {
    const s = rec.signalFeed;
    const sev = SEV_TYPE[s.severity] || 'info';
    return {
      id: s.id, type: sev, icon: CAT_ICON[s.category] || 'notifications', iconColor: SEV_COLOR[sev],
      title: s.title, account: s.account, accountId: s.accountId, message: s.message, time: s.time + ' ago',
      timeMin: minutesAgo(s.time), category: s.category,
      actions: CAT_ACTIONS[s.category] || ['Open Account', 'Alert CSM'], unread: s.unread,
    };
  }).sort((a, b) => a.timeMin - b.timeMin);

  return {
    summary: {
      criticalCount: high.length,
      atRiskArr: (atRiskArr / 1000000).toFixed(1),
      activeEscalations: escalations.length,
      expansionOpps: (expansionTotal / 1000000).toFixed(1),
      avgHealthScore: avgHealth,
      totalAccounts: rows.length,
      expansionCount: expansion.length,
    },
    accounts: rows,
    distribution,
    drivers,
    signals: feed,
    escalations,
    expansion,
    lastUpdated: new Date().toISOString(),
  };
}

export function buildNotifications() {
  const list = [];
  RECORDS.forEach(r => r.notifications.forEach(n => list.push({ ...n, timeMin: minutesAgo(n.time) })));
  list.sort((a, b) => a.timeMin - b.timeMin);
  return { notifications: list, unread: RECORDS.reduce((s, r) => s + r.unreadCount, 0) };
}

// Summary lines used by the Ask AI endpoint
export function portfolioFacts() {
  const p = buildPortfolio();
  return { totalArr: p.totalArr, accountCount: HUB_LIST.length, renewalArr: p.renewalArrExposed, renewalCount: p.renewalAccountsCount };
}
