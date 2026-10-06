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

// null/undefined = every account; a name narrows every derived view to that one account
const scoped = (name) => (name ? RECORDS.filter(r => r.account.name === name) : RECORDS);

export function buildPortfolio(name) {
  const recs = scoped(name);
  const hubs = recs.map(r => r.hub);
  const accts = recs.map(r => r.account);
  const arrs = accts.map(a => num(a.arrExact));
  const totalArr = arrs.reduce((s, x) => s + x, 0);
  const yoyWeighted = accts.reduce((s, a, i) => s + num(a.yoy) * arrs[i], 0) / (totalArr || 1);
  const scores = accts.map(a => num(a.healthScore.split('/')[0]));
  const avg = scores.reduce((s, x) => s + x, 0) / (scores.length || 1);
  const soon = accts.filter(a => a.renewalDaysVal <= 30);
  const soonArr = soon.reduce((s, a) => s + num(a.arrExact), 0);
  const byColor = (c) => hubs.filter(h => h.status === c).length;
  const total = hubs.length;
  const pct = (n) => Math.round((n / (total || 1)) * 100);

  return {
    totalArr: fmtM(totalArr),
    totalArrExact: fmtExact(totalArr),
    arrYoy: (yoyWeighted >= 0 ? '+' : '') + yoyWeighted.toFixed(1) + '% YoY',
    portfolioHealthAvg: avg.toFixed(1) + ' / 100',
    healthAvgDelta: name ? 'Selected account' : 'Across ' + total + ' accounts',
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
    riskPrioritizedAccounts: recs
      .map(r => ({ ...r.portfolioRow, _d: r.hub.renewalDays }))
      .sort((a, b) => a._d - b._d)
      .map(({ _d, ...row }) => row),
  };
}

export function buildRiskSignals(name) {
  const recs = scoped(name);
  const rows = recs.map(r => ({
    ...r.riskRow,
    riskColor: RISK_COLORS[r.riskRow.riskLevel] || '#a78bfa',
    signals: r.riskRow.topSignals.split(/, (?=[A-Z0-9])/),
  }));

  // summary strip
  const high = rows.filter(r => r.riskLevel === 'High');
  const atRiskArr = high.reduce((s, r) => s + num(ACCOUNTS[r.name].arrExact), 0);
  const escalations = [];
  const expansion = [];
  recs.forEach(rec => {
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
  // Risk Profiles (RP-xxxx) from each account's risk register, with the retention owner who handles them
  const riskProfiles = [];
  recs.forEach(rec => {
    const a = rec.account;
    const cases = a.casesData.cases || [];
    const openCases = cases.filter(c => c.status !== 'Resolved').length;
    (a.riskRegister || []).forEach(rp => {
      const retCase = cases.find(c => c.kind === 'Retention' && c.title.includes(rp.id));
      riskProfiles.push({
        ...rp,
        account: a.name, accountId: a.id, tier: a.tier, arr: a.arr, contractEnd: a.contractEnd,
        renewalDays: a.renewalDaysVal, healthScore: a.healthScore, csm: a.csm, execSponsor: a.execSponsor,
        churnProb: rec.riskRow.churnProb, riskLevel: rec.riskRow.riskLevel, topSignals: rec.riskRow.topSignals,
        openCases, activeEscalations: (a.casesData.escalations || []).length,
        retentionOwner: retCase ? retCase.owner : (a.renewalOwner || null),
        retentionOwnerSource: retCase ? 'Retention case ' + retCase.id : 'Renewal owner (no retention case linked)',
        retentionCaseStatus: retCase ? retCase.status : null,
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
  recs.forEach(rec => {
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
  const feed = recs.map((rec, i) => {
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
    riskProfiles,
    lastUpdated: new Date().toISOString(),
  };
}

export function buildNotifications(name) {
  const recs = scoped(name);
  const list = [];
  recs.forEach(r => r.notifications.forEach(n => list.push({ ...n, timeMin: minutesAgo(n.time) })));
  list.sort((a, b) => a.timeMin - b.timeMin);
  return { notifications: list, unread: recs.reduce((s, r) => s + r.unreadCount, 0) };
}

// Summary lines used by the Ask AI endpoint
export function portfolioFacts() {
  const p = buildPortfolio();
  return { totalArr: p.totalArr, accountCount: HUB_LIST.length, renewalArr: p.renewalArrExposed, renewalCount: p.renewalAccountsCount };
}

// Every account record, for views that merge data across the portfolio
export const allAccountRecords = () => RECORDS.map(r => r.account);

// Portfolio-wide usage in the same shape as one account's usage, so the usage view renders it unchanged
export function buildUsageAggregate() {
  const us = RECORDS.map(r => r.usage);
  const live = us.filter(u => !u.noTelemetry);
  const sum = (f) => us.reduce((s, u) => s + (Number(f(u)) || 0), 0);
  const activeSeats = sum(u => u.activeSeats);
  const totalSeats = sum(u => u.totalSeats);
  const wau = live.reduce((s, u) => s + num(u.wau), 0);

  const products = new Map();
  us.forEach(u => (u.products || []).forEach(p => {
    const cur = products.get(p.name) || { ...p, activeSeats: 0, totalSeats: 0, alert: '', expansionNote: '' };
    cur.activeSeats += p.activeSeats || 0;
    cur.totalSeats += p.totalSeats || 0;
    cur.activated = cur.activated || p.activated;
    cur.purchased = cur.purchased || p.purchased;
    products.set(p.name, cur);
  }));
  const prodList = [...products.values()].map(p => {
    const utilization = p.totalSeats ? Math.round((p.activeSeats / p.totalSeats) * 100) : 0;
    const status = utilization >= 75 ? 'Healthy' : utilization >= 50 ? 'Attention' : 'At Risk';
    const healthColor = utilization >= 75 ? '#3ECF8E' : utilization >= 50 ? '#F2B84B' : '#F4664A';
    return { ...p, utilization, status, healthColor, change: '', changeType: 'healthy' };
  });

  const weeks = {};
  live.forEach(u => (u.weeklyUsageTrend || []).forEach(w => {
    const cur = weeks[w.week] || { week: w.week, apex: 0, cohortAvg: 0, target: 0 };
    cur.apex += w.apex; cur.cohortAvg += w.cohortAvg; cur.target += w.target;
    weeks[w.week] = cur;
  }));

  const feats = new Map();
  live.forEach(u => (u.featuresMatrix || []).forEach(f => {
    const cur = feats.get(f.feature + '|' + f.module) || { ...f, _n: 0, adoptionPct: 0, cohortPct: 0, isAnomaly: false };
    cur._n += 1; cur.adoptionPct += f.adoptionPct; cur.cohortPct += f.cohortPct; cur.isAnomaly = cur.isAnomaly || f.isAnomaly;
    feats.set(f.feature + '|' + f.module, cur);
  }));

  const util = totalSeats ? (activeSeats / totalSeats) * 100 : 0;
  return {
    accountName: 'All Accounts', accountId: 'PORTFOLIO', arr: fmtM(RECORDS.reduce((s, r) => s + num(r.account.arrExact), 0)) + ' ARR',
    renewalDaysVal: Math.min(...RECORDS.map(r => r.account.renewalDaysVal)),
    wau: wau.toLocaleString('en-US') + ' WAU', wauDelta: live.length + ' of ' + us.length + ' accounts with telemetry', wauDeltaType: 'healthy',
    licenseUtilization: util.toFixed(0) + '%', activeSeats, totalSeats, dormantSeats: totalSeats - activeSeats,
    dauMauRatio: '—', stickinessStatus: 'Portfolio', featureDepthScore: '—', featureDepthDelta: '',
    dormantArrExposure: '$' + Math.round(sum(u => num(u.dormantArrExposure))).toLocaleString('en-US'),
    products: prodList,
    weeklyUsageTrend: Object.values(weeks),
    featuresMatrix: [...feats.values()].map(({ _n, ...f }) => ({ ...f, adoptionPct: Math.round(f.adoptionPct / _n), cohortPct: Math.round(f.cohortPct / _n) })),
    adoptionAnomalies: us.flatMap(u => (u.adoptionAnomalies || []).map(a => ({ ...a, title: u.accountName + ': ' + a.title }))),
    noTelemetry: live.length === 0,
  };
}

// ---- Idle products, cluster utilization and idle ARR for the Usage & Adoption page
// The figures come from server/data/usage_insights.json. Only the clusters under 10% are named there;
// the rest of each account's clusters get generated placeholder names so the list adds up to the total.
const INSIGHTS = JSON.parse(readFileSync(join(here, 'data', 'usage_insights.json'), 'utf8'));
const NEAR_ZERO_PCT = 10;
const CLUSTER_RE = /[Cc]luster(?: [Nn]ame)?\s*[:=]?\s*([A-Za-z0-9][A-Za-z0-9._-]{3,})/g;
const SEV_RANK = { P1: 1, P2: 2, P3: 3, P4: 4 };
const OVERALL_RANK = { Low: 0, Medium: 1, High: 2, Critical: 3 };

// small deterministic hash so the generated names and percentages never change between requests
const seeded = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296); };

// Clusters named in this account's case and escalation titles, with their case counts
function caseClusters(rec) {
  const map = new Map();
  const cd = rec.account.casesData || {};
  const items = [...(cd.cases || []), ...(cd.escalations || [])];
  items.forEach(c => {
    const seen = new Set();
    for (const m of String(c.title || '').matchAll(CLUSTER_RE)) {
      const name = m[1];
      if (!/[0-9_-]/.test(name) || seen.has(name)) continue;
      seen.add(name);
      const cur = map.get(name) || { cases: 0, open: 0, topSeverity: null, latestTitle: null, latestStatus: null, _age: 1e9 };
      cur.cases += 1;
      if (!/resolved|closed/i.test(c.status || '')) cur.open += 1;
      if (c.severity && (!cur.topSeverity || (SEV_RANK[c.severity] || 9) < (SEV_RANK[cur.topSeverity] || 9))) cur.topSeverity = c.severity;
      const age = c.openedDays != null ? c.openedDays : (c.sinceDays != null ? c.sinceDays : 1e9);
      if (age <= cur._age) { cur._age = age; cur.latestTitle = c.title; cur.latestStatus = c.status; }
      map.set(name, cur);
    }
  });
  return map;
}

function insightsFor(rec) {
  const name = rec.account.name;
  const ins = INSIGHTS[name];
  if (!ins) return { account: name, severity: null, clusters: [], clusterTotal: 0, nearZero: 0, idle: [], idleArr: 0, idleArrPct: null };

  const fromCases = caseClusters(rec);
  const named = ins.clusters.nearZero.map(([n, pct]) => ({ name: n, utilization: pct, placeholder: false }));

  // placeholder names in the style of the real ones (prefix-role-nn), unique, all at 10% or more
  const rnd = seeded(name);
  const used = new Set(named.map(c => c.name.toLowerCase()));
  const first = named.find(c => /^[a-z]+-/.test(c.name));
  const underscore = named.find(c => c.name.includes('_'));
  const prefix = first ? first.name.split('-')[0] : name.replace(/[^A-Za-z]/g, '').slice(0, 4).toLowerCase();
  const roles = ['prod', 'dev', 'dr', 'edge', 'site'];
  const generated = [];
  let guard = 0;
  while (named.length + generated.length < ins.clusters.total && guard++ < 500) {
    const nn = String(1 + Math.floor(rnd() * 12)).padStart(2, '0');
    const cname = underscore
      ? underscore.name.replace(/\d+$/, '') + nn
      : prefix + '-' + roles[Math.floor(rnd() * roles.length)] + '-' + nn;
    if (used.has(cname.toLowerCase())) continue;
    used.add(cname.toLowerCase());
    generated.push({ name: cname, utilization: NEAR_ZERO_PCT + Math.floor(rnd() * 86), placeholder: true });
  }

  const clusters = [...named, ...generated]
    .map(c => ({ account: name, ...c, nearZero: c.utilization < NEAR_ZERO_PCT, ...(fromCases.get(c.name) || {}) }))
    .sort((a, b) => a.utilization - b.utilization);

  return {
    account: name, severity: ins.severity, clusters,
    clusterTotal: ins.clusters.total, nearZero: clusters.filter(c => c.nearZero).length,
    idle: ins.idle.map(p => ({ ...p, account: name, activated: p.pct > 0 })),
    idleArr: ins.idleArr.amount, idleArrPct: ins.idleArr.pctOfRenewalArr,
    renewalArr: num(rec.account.arrExact),
  };
}

// name = one account, or null for every account
export function usageExtras(name) {
  const recs = name ? RECORDS.filter(r => r.account.name === name) : RECORDS;
  const per = recs.map(insightsFor);
  const idle = per.flatMap(p => p.idle);
  const idleArr = per.reduce((s, p) => s + p.idleArr, 0);
  const arr = per.reduce((s, p) => s + (p.renewalArr || 0), 0);
  const severity = per.reduce((w, p) => (p.severity && (!w || OVERALL_RANK[p.severity] > OVERALL_RANK[w]) ? p.severity : w), null);
  return {
    severity,
    clusters: per.flatMap(p => p.clusters),
    clusterTotal: per.reduce((s, p) => s + p.clusterTotal, 0),
    nearZeroClusters: per.reduce((s, p) => s + p.nearZero, 0),
    nearZeroThresholdPct: NEAR_ZERO_PCT,
    idleProducts: idle,
    idleCount: idle.length,
    idleCoreCount: idle.filter(i => i.core).length,
    idleArr,
    idleArrPct: per.length === 1 ? per[0].idleArrPct : (arr ? Math.round((idleArr / arr) * 100) : 0),
  };
}
