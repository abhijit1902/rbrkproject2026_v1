import { getCasesData, buildCaseSummary } from '../CasesHistory/data';
import { getOpsData, buildOpsSummary, summarizeOps, fmtMoney } from '../OpportunitiesActions/data';
import { buildUsageSummary } from '../UsageAdoption/AdoptionAnomaliesFeed';

const PRIORITY_RANK = { Critical: 0, High: 1, Medium: 2 };

// Gathers everything known about the account into one context object
export function buildContext(account, usage) {
  const cases = getCasesData(account);
  const ops = getOpsData(account);
  return { account, usage, cases, ops };
}

export function buildSteps({ account, usage, cases, ops }) {
  const steps = [];
  const push = (priority, team, title, why, due) =>
    steps.push({ id: 'S' + (steps.length + 1), priority, team, title, why, due });

  const openCases = cases.cases.filter(c => c.status !== 'Resolved');
  const p1 = openCases.filter(c => c.severity === 'P1');
  const breached = openCases.filter(c => c.slaHoursLeft != null && c.slaHoursLeft < 0 && c.severity !== 'P1');

  if (p1.length) {
    push('Critical', 'Support', 'Resolve open P1 ' + (p1.length === 1 ? 'case ' : 'cases ') + p1.map(c => c.id).join(', '),
      p1.map(c => c.title).join('; ') + '. Customer impact is active.', 'Within 24 hours');
  }
  if (breached.length) {
    push('High', 'Support', 'Recover SLA breaches on ' + breached.slice(0, 3).map(c => c.id).join(', ') + (breached.length > 3 ? ' and ' + (breached.length - 3) + ' more' : ''),
      breached.length + ' case(s) are past the response target.', 'Within 48 hours');
  }
  if (cases.escalations.length) {
    const e = cases.escalations[0];
    if (e.sinceDays > 90) {
      push('Medium', 'Executive', 'Confirm the status of the escalation "' + e.title + '"',
        'Recorded ' + e.sinceDays + ' days ago (' + e.status.toLowerCase() + '). ' + e.next + '.', 'Within 2 weeks');
    } else {
      push('Critical', 'Executive', 'Hold an escalation review for "' + e.title + '"',
        cases.escalations.length + ' active escalation(s); most senior level is ' + e.level.toLowerCase() + '. Next: ' + e.next + '.', 'Within 24 hours');
    }
  }

  const r = ops.renewal;

  // Ownership gaps
  if (/not assigned/i.test(account.csm || '')) {
    const highRisks = (account.riskRegister || []).filter(x => x.severity === 'High').length;
    push('High', 'CS', 'Assign a CSM to this ' + account.tier.toLowerCase().replace('strategic', 'strategic') + ' account',
      'No CSM is assigned' + (highRisks ? ' while ' + highRisks + ' High risk(s) are open' : '') + '.', 'This week');
  }
  if (/not assigned/i.test(account.execSponsor || '')) {
    const cands = (account.customerExecs || []).map(e => e.name).join(', ');
    push('High', 'Executive', 'Assign a Rubrik executive sponsor',
      'No executive sponsor is assigned.' + (cands ? ' Customer exec candidates: ' + cands + '.' : ''), 'Within 1 week');
  }
  const unowned = (account.riskRegister || []).filter(x => x.actionOwner === null || x.nextSteps === null);
  if (unowned.length) {
    push('Critical', 'CS', 'Assign action owners and next steps for ' + unowned.map(x => x.id).join(', '),
      unowned.length + ' open risk(s) are In progress with no action owner and no next steps recorded.', 'Within 48 hours');
  }
  const staleRetention = cases.cases.filter(c => c.status === 'New' && c.openedDays >= 14);
  if (staleRetention.length) {
    push('Critical', 'Renewal', 'Work retention case ' + staleRetention.map(c => c.id).join(', '),
      'Still at "New" after ' + staleRetention[0].openedDays + ' days with no updates, while the renewal is ' + ops.renewal.daysAway + ' days away.', 'Within 24 hours');
  }
  if (account.keyFindings && account.keyFindings.length) {
    push('High', 'Support', 'Run a joint root-cause review across Support, PS and Product',
      account.keyFindings[0], 'Within 1 week');
  }

  if (r.daysAway <= 60) {
    push(r.daysAway <= 30 ? 'Critical' : 'High', 'Renewal', 'Lock the renewal plan' + (r.value == null ? ' (value restricted)' : ' for ' + fmtMoney(r.value)),
      'Renewal is ' + r.daysAway + ' days away (' + r.date + ').' + (ops.opportunities.some(x => x.type === 'Renewal' && x.status === 'Open') ? ' Renewal opportunity stage: ' + ops.opportunities.filter(x => x.type === 'Renewal' && x.status === 'Open').map(x => x.stage + ' (' + x.probability + '%)')[0] + '.' : '') + ' Procurement status: ' + r.procurement.toLowerCase() + '.',
      r.daysAway <= 30 ? 'This week' : 'Within 2 weeks');
  }
  if (r.sentiment === 'At Risk' || r.sentiment === 'Negative') {
    push('High', 'CS', /^not assigned/i.test(r.champion) ? 'Engage a customer executive before the renewal' : 'Re-engage the executive sponsor (' + r.champion + ')',
      (/^not assigned/i.test(r.champion) ? 'Champion: ' + r.champion + '. ' : '') + 'Renewal sentiment is ' + r.sentiment.toLowerCase() + (r.score != null ? ' (' + r.score + '/100)' : '') + '. ' +
      (r.drivers.filter(d => d.tone === 'negative')[0] || { label: '' }).label + '.', 'Within 1 week');
  }

  if (usage && usage.noTelemetry) {
    push('Medium', 'CS', 'Connect usage telemetry for this account',
      'Consumed units, adoption % and overage are empty in Salesforce and must come from ' + (usage.usageSource || 'the telemetry source') + '.', 'Within 30 days');
  } else if (usage) {
    const util = parseFloat(usage.licenseUtilization);
    const trending = usage.wauDeltaType === 'error' || usage.wauDeltaType === 'warning';
    if (util < 75 || trending) {
      const worst = [...(usage.featuresMatrix || [])].sort((a, b) => (a.adoptionPct - a.cohortPct) - (b.adoptionPct - b.cohortPct))[0];
      push('High', 'CS', 'Run an adoption recovery workshop',
        'License utilization is ' + usage.licenseUtilization + ' and weekly users are ' + usage.wauDelta + '.' +
        (worst ? ' Biggest gap: ' + worst.feature + ' (' + worst.adoptionPct + '% vs ' + worst.cohortPct + '% cohort).' : ''), 'Within 2 weeks');
    }
    const notActivated = (usage.products || []).filter(p => p.activated === false);
    if (notActivated.length) {
      push('Medium', 'Sales', 'Position ' + notActivated.map(p => p.name).join(' and '),
        'Not yet activated for this account; potential expansion candidates.', 'This quarter');
    }
  }

  if (['Paused', 'At Risk', 'On Hold'].includes(cases.ps.status)) {
    push('High', 'PS', 'Unblock professional services: ' + cases.ps.engagement,
      'Status is ' + cases.ps.status.toLowerCase() + (cases.ps.progress != null ? ' at ' + cases.ps.phase.toLowerCase() : (cases.ps.hoursTotal ? ' with ' + cases.ps.hoursUsed + ' of ' + cases.ps.hoursTotal + ' hours used' : '')) + '. ' + cases.ps.note, 'This week');
  }

  const s = summarizeOps(ops.opportunities);
  if (s.expansionOpen.length) {
    const top = [...s.expansionOpen].sort((a, b) => b.value - a.value)[0];
    push('Medium', 'Sales', 'Advance expansion: ' + top.name + ' (' + fmtMoney(top.value) + ')',
      (top.signal || 'Open expansion opportunity') + '. Next step: ' + (top.nextStep || 'qualify with the customer') + '.', 'Within 30 days');
  }

  push('Medium', 'CS', 'Schedule the next executive business review',
    'Keeps sponsor alignment and covers adoption, support experience and renewal outlook.', 'Within 30 days');

  steps.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  return steps.map((st, i) => ({ ...st, id: 'S' + (i + 1) }));
}

export function buildOverview({ account, usage, cases, ops }) {
  const agg = cases.aggregates;
  const openCases = cases.cases.filter(c => c.status !== 'Resolved');
  const openCount = agg ? agg.open.total : openCases.length;
  const p1 = agg ? agg.open.p1 : openCases.filter(c => c.severity === 'P1').length;
  const r = ops.renewal;
  const util = usage && usage.licenseUtilization ? usage.licenseUtilization : '—';
  const riskCount = (account.riskRegister || []).length;

  const headline =
    account.name + ' (' + [account.tier, account.region || (account.territory ? 'Territory ' + account.territory : '')].filter(Boolean).join(', ') +
    ') has status "' + account.status + '" and a health score of ' + account.healthScore + (account.arr === 'Restricted' ? ' (ARR restricted by data policy)' : ' and ' + account.arr + ' ARR') + '. The ' +
    (r.value == null ? '' : fmtMoney(r.value) + ' ') + 'renewal is ' + r.daysAway + ' days away with ' + r.sentiment.toLowerCase() + ' sentiment, ' +
    openCount + ' open ' + (openCount === 1 ? 'case' : 'cases') + (p1 ? ' (' + p1 + ' P1)' : '') +
    (riskCount ? ', ' + riskCount + ' open ' + (riskCount === 1 ? 'risk' : 'risks') : '') +
    ' and ' + cases.escalations.length + ' recorded ' + (cases.escalations.length === 1 ? 'escalation' : 'escalations') + '.';

  const tiles = [
    { label: 'Account Health', value: account.healthScore, sub: account.healthStatusTitle + ' ' + account.healthStatusSub, color: '#66cfee' },
    { label: 'Usage & Adoption', value: util, sub: usage ? (usage.noTelemetry ? 'Telemetry not connected' : 'WAU ' + usage.wau + ' (' + usage.wauDelta + ')') : 'Loading telemetry', color: '#a78bfa' },
    { label: 'Support & Cases', value: openCount + ' open', sub: (p1 ? p1 + ' P1 · ' : '') + cases.escalations.length + (cases.escalations.length === 1 ? ' escalation' : ' escalations'), color: '#f59e0b' },
    { label: 'Renewal & Commercial', value: fmtMoney(r.value), sub: r.sentiment + ' · ' + r.daysAway + ' days', color: '#34d399' },
  ];
  return { headline, tiles, findings: account.keyFindings || [], gaps: account.dataGaps || [] };
}

const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Self-contained HTML report (open in any browser, or print to PDF)
export function buildAccount360Html(ctx) {
  const { account, usage, cases, ops } = ctx;
  const d = account.basicDetails || {};
  const steps = buildSteps(ctx);
  const s = summarizeOps(ops.opportunities);
  const r = ops.renewal;
  const generated = new Date().toLocaleString();

  const table = (headers, rows) =>
    '<table><thead><tr>' + headers.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
    (rows.length ? rows.map(row => '<tr>' + row.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('')
      : '<tr><td colspan="' + headers.length + '" class="muted">None</td></tr>') +
    '</tbody></table>';

  const kv = (pairs) =>
    '<div class="kv">' + pairs.map(p => '<div><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b></div>').join('') + '</div>';

  const extra = (title, html) => (html ? [[title, html]] : []);
  const findingsHtml = (account.keyFindings || []).length
    ? '<ul>' + account.keyFindings.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul>' : '';
  const risksHtml = (account.riskRegister || []).length
    ? table(['Risk', 'Severity', 'Category', 'Type', 'Validity', 'Created', 'Status'],
        account.riskRegister.map(x => [x.id, x.severity, x.category, x.riskType, x.validity, x.created, x.status + (x.closed ? ' (closed ' + x.closed + ')' : '')])) : '';
  const contractsHtml = (account.contracts || []).length
    ? table(['Contract', 'Name', 'Term', 'Lines', 'Ends', 'Note'], account.contracts.map(c => [c.id, c.name, c.term, c.lines, c.ends, c.note || '']))
      + (account.engagement ? kv([['Last touch', account.engagement.lastTouch], ['Last meeting', account.engagement.lastMeeting], ['Next meeting', account.engagement.nextMeeting], ['Engagement level', account.engagement.level]]) : '') : '';
  const gapsHtml = (account.dataGaps || []).length
    ? '<ul>' + account.dataGaps.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul>' : '';

  const sections = [
    ...extra('Key Findings', findingsHtml),
    ['Account Profile', kv([
      ['Account ID', account.id], ['Tier', account.tier], ['Industry', account.industry], ['Region', d.region || 'Not set'],
      ...(d.territory ? [['Territory', d.territory]] : []),
      ...(d.renewalOwner ? [['Renewal Owner', d.renewalOwner]] : []),
      ['Customer Since', d.customerSince], ['TCV', d.tcv], ['ARR', account.arrExact], ['Contract End', account.contractEnd],
      ['Parent Company', d.parentCompany || 'None (standalone)'], ['CSM', account.csm],
      ['AE', d.ae ? d.ae.name + (d.ae.email ? ' (' + d.ae.email + ')' : '') : 'Not assigned'], ['SE', d.se ? d.se.name + (d.se.email ? ' (' + d.se.email + ')' : '') : 'Not assigned'],
      ['Executive Sponsor', account.execSponsor],
      ...((account.customerExecs || []).length ? [['Customer Exec Candidates', account.customerExecs.map(e => e.name + ' (' + e.title + ')').join('; ')]] : []),
    ])],
    ...extra('Open Risks', risksHtml),
    ...extra('Contracts & Engagement', contractsHtml),
    ['Account Health', kv([['Health Score', account.healthScore], ['Status', account.healthStatusTitle + ' ' + account.healthStatusSub]]) +
      table(['Dimension', 'Status'], (account.healthDimensions || []).map(x => [x.label, x.val]))],
    ['Usage & Adoption', (usage && usage.noTelemetry
      ? '<p>' + esc(buildUsageSummary(usage)) + '</p>' +
        table(['Entitlement (SKU)', 'Licensed', 'Covers', 'Ends'],
          usage.products.map(p => [p.name, p.licensed != null ? Number(p.licensed).toLocaleString() : '—', (p.covers || []).join(', ') || '—', p.ends || '—']))
      : usage
      ? '<p>' + esc(buildUsageSummary(usage)) + '</p>' +
        table(['Product', 'Activated', 'Utilization', 'Seats (active / total)', 'Status'],
          usage.products.map(p => [p.name, p.activated === false ? 'No' : 'Yes', p.activated === false ? '—' : p.utilization + '%', p.activated === false ? '—' : p.activeSeats + ' / ' + p.totalSeats, p.status])) +
        '<h4>Feature Adoption</h4>' +
        table(['Feature', 'Module', 'Adoption', 'Cohort', 'Status'],
          (usage.featuresMatrix || []).map(f => [f.feature, f.module, f.adoptionPct + '%', f.cohortPct + '%', f.status])) +
        '<h4>Telemetry Anomalies</h4>' +
        table(['When', 'Anomaly', 'Impact', 'Severity'], (usage.adoptionAnomalies || []).map(a => [a.date, a.title, a.impact, a.severity]))
      : '<p class="muted">Usage telemetry unavailable.</p>')],
    ['Cases, Escalations & PS Status',
      '<p>' + esc(buildCaseSummary(account.name, cases.cases, cases.ps, cases.escalations, cases.aggregates)) + '</p>' +
      (cases.aggregates
        ? kv([['Open cases', cases.aggregates.open.total], ['Open support', cases.aggregates.open.support + ' (P1 ' + cases.aggregates.open.p1 + ', P2 ' + cases.aggregates.open.p2 + ', P3 ' + cases.aggregates.open.p3 + ')'],
            ['Open renewal / retention', cases.aggregates.open.renewal + ' / ' + cases.aggregates.open.retention], ['Created, last 90 days', cases.aggregates.last90.created],
            ['Avg resolution', cases.aggregates.last90.avgResolutionDays + ' days'], ['SLA compliance', 'Not pulled']]) +
          '<h4>Recurring Issues (Last 90 Days)</h4>' +
          table(['Issue', 'Cases', 'Still open'], cases.aggregates.recurring.map(r => [r.issue, r.cases, r.open != null ? r.open : 'Not pulled']))
        : '') +
      '<h4>Itemized Cases</h4>' +
      table(['Case', 'Team', 'Severity', 'Status', 'Title', 'Owner'], cases.cases.map(c => [c.id, c.team, c.severity || '—', c.status, c.title, c.owner])) +
      '<h4>Escalations</h4>' +
      table(['ID', 'Title', 'Level', 'Owner', 'Status', 'Next'], cases.escalations.map(e => [e.id, e.title, e.level, e.owner, e.status, e.next])) +
      '<h4>Professional Services</h4>' +
      kv([['Engagement', cases.ps.engagement], ['Phase', cases.ps.phase], ['Status', cases.ps.status],
        ['Progress', cases.ps.progress != null ? cases.ps.progress + '%' : (cases.ps.hoursTotal ? cases.ps.hoursUsed + ' of ' + cases.ps.hoursTotal + ' hours used' : '—')],
        ['PM', cases.ps.pm], ['Next Milestone', cases.ps.nextMilestone]])],
    ['Opportunities, Renewal & Churn',
      '<p>' + esc(buildOpsSummary(account, ops)) + '</p>' +
      kv([['Open Ops', s.open.length + ' (' + fmtMoney(s.openValue) + ')'], ['Closed Won', s.won.length + ' (' + fmtMoney(s.wonValue) + ')'], ['Closed Lost', s.lost.length + ' (' + fmtMoney(s.lostValue) + ')'],
        ['Upcoming Renewal', (r.value == null ? 'Value restricted' : fmtMoney(r.value)) + ' on ' + r.date], ['Renewal Sentiment', r.sentiment + (r.score != null ? ' (' + r.score + '/100)' : '')]]) +
      table(['Opportunity', 'Type', 'Value', 'Status', 'Stage', 'Notes'], ops.opportunities.map(x => [x.name, x.type, fmtMoney(x.value), x.status, x.stage + (x.status === 'Open' && x.probability != null ? ' (' + x.probability + '%)' : ''), x.lostReason || x.nextStep || ''])) +
      '<h4>Churn History</h4>' +
      (ops.churnHistory == null ? '<p class="muted">Not provided.</p>'
        : table(['Period', 'Event', 'Amount', 'Reason'], ops.churnHistory.map(c => [c.period, c.event, fmtMoney(c.amount), c.reason])))],
    ['Recommended Next Steps', table(['#', 'Priority', 'Team', 'Step', 'Why', 'Due'], steps.map((st, i) => [i + 1, st.priority, st.team, st.title, st.why, st.due]))],
    ...extra('Data Not Available', gapsHtml),
  ];

  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Account 360 - ' + esc(account.name) + '</title><style>' +
    'body{font-family:"Open Sans",Arial,sans-serif;color:#10224f;margin:0;padding:32px;background:#fff;}' +
    'h1{margin:0 0 4px;font-size:26px}h2{margin:28px 0 8px;font-size:17px;border-bottom:2px solid #66cfee;padding-bottom:4px}h4{margin:16px 0 6px;font-size:13px}' +
    'p{font-size:13px;line-height:1.55}.muted{color:#6b7bab}.sub{color:#5a6a99;font-size:12px;margin-bottom:12px}' +
    'table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}th,td{border:1px solid #d3dcf3;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eaf0ff}' +
    '.kv{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0}.kv div{background:#f2f6ff;border:1px solid #d3dcf3;border-radius:6px;padding:8px}' +
    '.kv span{display:block;font-size:10px;text-transform:uppercase;color:#5a6a99;letter-spacing:.04em}.kv b{font-size:13px}' +
    '@media print{body{padding:12px}}' +
    '</style></head><body>' +
    '<h1>Account 360: ' + esc(account.name) + '</h1>' +
    '<div class="sub">Generated ' + esc(generated) + ' for the CSM team</div>' +
    sections.map(sec => '<h2>' + esc(sec[0]) + '</h2>' + sec[1]).join('') +
    '</body></html>';
}

export function downloadAccount360(ctx) {
  const html = buildAccount360Html(ctx);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Account-360-' + ctx.account.name.replace(/[^A-Za-z0-9]+/g, '-') + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
