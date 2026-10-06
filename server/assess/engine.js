// Assessment engine from "Intelligence_Layer_Technical_Note_v3".
// Reads one account record (account + usage) and produces the section-13 assessment record:
// rules for numbers and statuses, a text tagger for free text (every tag carries a verbatim quote),
// then classification, severity, proposed Risk Profile fields, actions and reach-out drafts.
// Nothing here calls a model. tagText() is the one place to swap in an LLM later; its output
// goes through the same verbatim-quote check either way.

export const CONFIG = {
  ruleVersion: 'rules-0.1',
  promptVersion: 'local-tagger-0.1',
  asOf: new Date('Oct 5, 2026 09:00'),
  renewalWindowDays: 180,
  escalateDays: 120,
  urgentDays: 90,
  idleUtilPct: 30,
  strongAdoptionPct: 85,
  stallDays: 14,
  badExperienceWindowDays: 90,
  // ASSUMPTION: the data has no per-product ARR or core flag, so core is set by name here
  coreProducts: /cloud data protection|m365|nas cloud direct/i,
};

const DAY = 86400000;
const SEV = ['Low', 'Medium', 'High'];
const bump = (s, n) => SEV[Math.max(0, Math.min(2, SEV.indexOf(s) + n))];
const maxSev = (list) => list.reduce((m, s) => (SEV.indexOf(s) > SEV.indexOf(m) ? s : m), 'Low');
const toDate = (s) => { const d = new Date(s); return isNaN(d) ? null : d; };
const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const addDays = (n) => new Date(CONFIG.asOf.getTime() + n * DAY);
const daysSince = (d) => (d ? Math.floor((CONFIG.asOf - d) / DAY) : null);

// ---------------------------------------------------------------- text sources
function collectTexts(a) {
  const out = [];
  const add = (record_type, record_id, date, text) => {
    if (text && typeof text === 'string') out.push({ record_type, record_id, date: date || null, text });
  };
  const cd = a.casesData || {};
  for (const c of cd.cases || []) {
    add('case', c.id, c.openedLabel, c.title);
    for (const u of c.updates || []) add('case_comment', c.id, u.time, u.text);
  }
  for (const h of cd.history || []) add('history', h.id, h.dateLabel, [h.title, h.desc].filter(Boolean).join('. '));
  for (const e of cd.escalations || []) add('escalation', e.id, e.openedLabel, [e.title, e.next].filter(Boolean).join('. '));
  if (cd.ps) add('ps_project', cd.ps.engagement || 'ps', null, cd.ps.note);
  const rx = (a.opsData || {}).renewalExtras || {};
  add('renewal', 'renewal-' + a.id, null, rx.procurement);
  for (const r of a.riskRegister || []) add('risk_profile', r.id, r.created, r.category);
  return out;
}

// ---------------------------------------------------------------- text tagger
const TAGS = [
  { group: 'sentiment', tag: 'Non-renewal motion', re: /non-renewal/i, conf: 'high' },
  { group: 'sentiment', tag: 'Competitor named', re: /competitor|cohesity|veeam|commvault|druva/i, conf: 'high' },
  { group: 'sentiment', tag: 'Pricing pushback', re: /pricing review|pricing|discount|budget/i, conf: 'medium' },
  { group: 'sentiment', tag: 'Project on hold or de-prioritised', re: /project on hold|de-?prioriti[sz]ation|paused|on hold|postponed/i, conf: 'high' },
  { group: 'sentiment', tag: 'Feature or use-case mismatch', re: /lack of functionality|feature gap|missing (feature|capability)|not supported|lack of file export|customer fit/i, conf: 'medium' },
  { group: 'sentiment', tag: 'Champion or sponsor left', re: /(champion|sponsor) (left|departed)/i, conf: 'high' },
  { group: 'bad_experience', tag: 'Escalation', re: /escalat(e|ed|ion)/i, conf: 'high' },
  { group: 'bad_experience', tag: 'Repeated chasing', re: /still waiting|chasing|follow(ing)? up again|no update|untouched|repeated/i, conf: 'medium' },
  { group: 'bad_experience', tag: 'Missed promised date', re: /missed (the )?(sla|date|deadline|fix)|overdue|sla breach/i, conf: 'high' },
  { group: 'engagement', tag: 'Waiting on customer', re: /waiting on customer|awaiting (customer|response)|requested from customer|support bundle requested|logs .{0,30}requested/i, conf: 'medium' },
  { group: 'engagement', tag: 'Customer unresponsive', re: /unresponsive|not reachable|no response from customer/i, conf: 'high' },
  { group: 'structural', tag: 'Deployed under parent account', re: /parent (company|account)|subsidiary/i, conf: 'medium' },
  { group: 'structural', tag: 'New or phased rollout', re: /phased rollout|later onboarding|new deployment/i, conf: 'medium' },
];

function sentenceAround(text, idx) {
  const parts = text.split(/(?<=[.!?])\s+/);
  let pos = 0;
  for (const p of parts) {
    const at = text.indexOf(p, pos);
    if (idx >= at && idx < at + p.length) return p.slice(0, 180);
    pos = at + p.length;
  }
  return text.slice(0, 180);
}

export function tagText(sources) {
  const tags = [];
  const seen = new Set();
  for (const s of sources) {
    for (const t of TAGS) {
      const m = t.re.exec(s.text);
      if (!m) continue;
      const key = t.tag + '|' + s.record_id;
      if (seen.has(key)) continue;
      seen.add(key);
      tags.push({ group: t.group, tag: t.tag, quote: sentenceAround(s.text, m.index), confidence: t.conf,
        record_type: s.record_type, record_id: s.record_id, date: s.date, _source: s.text });
    }
  }
  // guardrail from the note: a tag whose quote is not verbatim in its source is discarded
  const kept = tags.filter(t => t._source.includes(t.quote));
  const dropped = tags.length - kept.length;
  kept.forEach(t => delete t._source);
  return { tags: kept, dropped };
}

// ---------------------------------------------------------------- the assessment
export function assess(rec) {
  const a = rec.account;
  const u = rec.usage || null;
  const cd = a.casesData || {};
  const cases = cd.cases || [];
  const products = (u && u.products) || [];
  const ps = cd.ps || null;
  const rx = (a.opsData || {}).renewalExtras || {};
  const opps = (a.opsData || {}).opportunities || [];
  const days = a.renewalDaysVal;
  const inWindow = days != null && days <= CONFIG.renewalWindowDays;
  const findings = [];
  const missing = [];
  let n = 0;
  const F = (area, title, severity, evidence, extra = {}) => {
    findings.push({ id: 'F-' + ++n, area, title, severity, evidence, first_detected: fmt(CONFIG.asOf), trend: 'stable', ...extra });
  };
  const ev = (record_type, record_id, quote, date = null) => ({ record_type, record_id, date, quote });

  if (!u) missing.push('usage');
  if (!cases.length) missing.push('cases');
  if (!ps) missing.push('ps_project');

  // ---- trigger: renewal window and early-stage opportunity
  const renewalOpps = opps.filter(o => /renewal/i.test(o.type) && !/closed/i.test(o.stage));
  const earlyOpp = renewalOpps.find(o => /^1|discovery/i.test(o.stage) || o.probability <= 20);
  if (inWindow) {
    const base = days <= CONFIG.urgentDays ? 'High' : days <= CONFIG.escalateDays ? 'Medium' : 'Low';
    const sev = earlyOpp ? bump(base, 1) : base;
    const evidence = [ev('account', a.id, 'Contract ends ' + a.contractEnd + ' (' + days + ' days)')];
    if (earlyOpp) evidence.push(ev('opportunity', earlyOpp.id, earlyOpp.type + ' opportunity at ' + earlyOpp.stage + ' (' + earlyOpp.probability + '%)'));
    F('renewal', 'Renewal in ' + days + ' days' + (earlyOpp ? ' with the opportunity still at ' + earlyOpp.stage : ''), sev, evidence,
      { urgent: days <= CONFIG.urgentDays });
  }
  if (inWindow && (!a.ae || !a.ae.name || !a.se || !a.se.name)) {
    const who = [!a.ae || !a.ae.name ? 'AE' : null, !a.se || !a.se.name ? 'SE' : null].filter(Boolean).join(' and ');
    F('renewal', 'No ' + who + ' assigned on a renewal inside the window', 'Medium', [ev('account', a.id, 'No ' + who + ' on record')]);
  }

  // ---- usage and entitlement
  const idle = [];
  for (const p of products) {
    if (!p.purchased) continue;
    const core = CONFIG.coreProducts.test(p.name);
    if (!p.activated) idle.push({ p, core, why: 'purchased but not activated' });
    else if (p.utilization < CONFIG.idleUtilPct) idle.push({ p, core, why: 'activated with usage at ' + p.utilization + '%' });
  }
  for (const i of idle) {
    F(i.p.activated ? 'adoption' : 'activation', i.p.name + ' ' + i.why + (i.core ? ' (core product)' : ''),
      i.core ? 'High' : 'Medium',
      [ev('entitlement', i.p.name, i.p.name + ': ' + i.why)]);
  }
  for (const p of products) {
    if (p.purchased && p.utilization > 100) {
      F('adoption', p.name + ' consumption above entitlement (' + p.utilization + '%)', 'Low', [ev('entitlement', p.name, p.name + ' at ' + p.utilization + '% of licensed ' + p.unit)]);
    }
  }
  const strong = products.filter(p => p.purchased && p.activated && p.utilization >= CONFIG.strongAdoptionPct);
  const candidates = products.filter(p => !p.purchased);

  // ---- support load
  const open = cases.filter(c => !/resolved|closed/i.test(c.status) && /support/i.test(c.team));
  const p1 = open.filter(c => c.severity === 'P1');
  const p2 = open.filter(c => c.severity === 'P2');
  const breached = open.filter(c => c.slaHoursLeft != null && c.slaHoursLeft < 0);
  const waiting = open.filter(c => /waiting on customer/i.test(c.status));
  if (p1.length || p2.length >= 2) {
    const sev = p1.length ? 'High' : p2.length >= 5 ? 'High' : 'Medium';
    const top = [...p1, ...p2].slice(0, 3);
    F('support', [p1.length ? p1.length + ' open P1' : null, p2.length ? p2.length + ' open P2' : null].filter(Boolean).join(' and ') + ' support case' + (p1.length + p2.length === 1 ? '' : 's'), sev,
      top.map(c => ev('case', c.id, c.title, c.openedLabel)));
  }
  if (breached.length) {
    F('support', breached.length + ' open case' + (breached.length === 1 ? '' : 's') + ' past SLA', breached.length >= 3 || breached.some(c => c.severity === 'P1') ? 'High' : 'Medium',
      breached.slice(0, 3).map(c => ev('case', c.id, c.title + ' (SLA due ' + c.slaDue + ')', c.openedLabel)));
  }

  // ---- engagement: cases waiting on customer, retention escalations with no movement
  if (waiting.length >= 2) {
    F('engagement', waiting.length + ' cases waiting on customer input', 'Medium', waiting.slice(0, 3).map(c => ev('case', c.id, c.title, c.openedLabel)));
  }
  for (const e of cd.escalations || []) {
    if (e.sinceDays >= CONFIG.stallDays && /^(new|pending)/i.test(e.status)) {
      F('engagement', e.title + ' has had no movement for ' + e.sinceDays + ' days (' + e.status + ')', 'Medium',
        [ev('escalation', e.id, e.title + '. ' + e.next, e.openedLabel)]);
    }
  }

  // ---- PS project
  if (ps && /at risk|on hold|blocked/i.test(ps.status || '') || (ps && ps.budgetUsed >= 100 && ps.progress < 100)) {
    F('ps', 'PS project ' + (ps.status || 'needs attention') + ' at ' + ps.progress + '% progress', 'Medium',
      [ev('ps_project', ps.engagement || 'ps', ps.note || ps.status)]);
  }

  // ---- risk profile history
  const openRisks = (a.riskRegister || []).filter(r => !r.closed && !/snoozed|invalid/i.test(r.validity || ''));
  for (const r of openRisks.filter(x => x.severity === 'High')) {
    F(/sentiment/i.test(r.riskType) ? 'sentiment' : 'risk_history', 'Open High Risk Profile ' + r.id + ': ' + r.category, 'High',
      [ev('risk_profile', r.id, r.category, r.created)]);
  }

  // ---- text tags
  const sources = collectTexts(a);
  const { tags, dropped } = tagText(sources);
  const recent = (t) => { const d = toDate(t.date); return !d || daysSince(d) <= CONFIG.badExperienceWindowDays; };
  const bad = tags.filter(t => t.group === 'bad_experience' && recent(t));
  if (new Set(bad.map(t => t.record_id)).size >= 2) {
    F('experience', bad.length + ' bad-experience signals in the last ' + CONFIG.badExperienceWindowDays + ' days', 'Medium',
      bad.slice(0, 3).map(t => ev(t.record_type, t.record_id, t.quote, t.date)));
  }
  const sent = tags.filter(t => t.group === 'sentiment' && t.confidence !== 'low');
  const sentFromRisk = findings.some(f => f.area === 'sentiment');
  if (sent.length && !sentFromRisk) {
    // medium-confidence tags alone never decide the outcome (note section 9), so they stay Medium
    F('sentiment', 'Renewal sentiment: ' + [...new Set(sent.map(t => t.tag))].join(', '), sent.some(t => t.confidence === 'high') ? 'High' : 'Medium',
      sent.slice(0, 3).map(t => ev(t.record_type, t.record_id, t.quote, t.date)));
  }
  if (rx.sentiment && /negative/i.test(rx.sentiment)) {
    F('sentiment', 'Renewal sentiment recorded as ' + rx.sentiment, 'Medium', [ev('renewal', 'renewal-' + a.id, 'Sentiment: ' + rx.sentiment)]);
  }

  // ---- structural explainers (lower severity by one level and must be shown)
  const explainers = [];
  // only an explainer when it accounts for empty telemetry (note section 2); a parent link with live usage explains nothing
  const noTelemetry = !products.some(p => p.purchased && p.utilization > 0);
  if (a.parentCompany && noTelemetry) explainers.push({ type: 'Deployed under parent account', evidence: 'Parent company: ' + a.parentCompany + ' and no usage recorded' });
  const sinceYear = Number((/(\d{4})/.exec(a.since || '') || [])[1]);
  if (sinceYear && CONFIG.asOf.getFullYear() - sinceYear === 0) explainers.push({ type: 'New account', evidence: a.since + ' (the data holds the year only, so the exact age is unconfirmed)' });
  for (const t of tags.filter(t => t.group === 'structural')) explainers.push({ type: t.tag, evidence: t.quote });

  // ---- classification
  // renewal timing and an existing Risk Profile are context, not proof (note section 8); they never decide the class alone
  const hardAreas = ['activation', 'adoption', 'support', 'ps', 'engagement', 'experience'];
  const hard = findings.filter(f => hardAreas.includes(f.area) && f.severity === 'High');
  const hasSentiment = findings.some(f => f.area === 'sentiment');
  const anyMedium = findings.some(f => f.severity === 'Medium' || f.severity === 'High');
  const hardMediumAreas = new Set(findings.filter(f => hardAreas.includes(f.area) && f.severity === 'Medium').map(f => f.area));
  let cls;
  if (missing.length >= 2) cls = 'needs-check';
  else if (hard.length || hardMediumAreas.size >= 2) cls = 'confirmed';
  else if (hasSentiment) cls = 'renewal-sentiment';
  else if (explainers.length && anyMedium) cls = 'artifact';
  else if (anyMedium) cls = 'needs-check';
  else cls = 'opportunity';

  const riskClass = cls === 'confirmed' || cls === 'renewal-sentiment';
  const baseSev = maxSev(findings.filter(f => f.area !== 'renewal').map(f => f.severity));
  let severity = riskClass || cls === 'needs-check' ? baseSev : 'Low';
  if (riskClass && days != null && days <= CONFIG.escalateDays) severity = bump(severity, 1);
  if (riskClass && explainers.length) severity = bump(severity, -1);

  // confidence: independent areas with evidence (shown as High / Medium / Low, never a percentage)
  const areas = new Set(findings.filter(f => f.area !== 'renewal').map(f => f.area === 'risk_history' ? 'sentiment' : f.area));
  const confidence = missing.length ? 'Low' : areas.size >= 3 ? 'High' : areas.size === 2 ? 'Medium' : 'Low';

  // trend: needs history; derived from the last four weeks of case volume and the usage movement
  const wv = (cd.weeklyVolume || []).slice(-4);
  const net = wv.reduce((s, w) => s + (w.opened - w.resolved), 0);
  let trend = 'stable';
  if (wv.length && net >= 3) trend = 'worsening';
  else if (wv.length && net <= -3) trend = 'improving';
  if (u && u.wauDeltaType === 'critical') trend = 'worsening';

  // ---- score view (the data has categorical health dimensions, not the 30/30/20/20 parts)
  const scores = (a.healthDimensions || []).map(d => ({
    part: d.label, value: d.val, low: /risk/i.test(d.val), watch: /attention/i.test(d.val),
  }));

  // ---- support experience review (hypothesis for the CSM to confirm)
  let supportReview = null;
  const supportLow = scores.some(s => s.part === 'Support' && s.low) || p2.length >= 3 || p1.length;
  if (supportLow && open.length) {
    const oldest = [...open].sort((x, y) => y.openedDays - x.openedDays)[0];
    const silent = open.filter(c => !(c.updates || []).length && c.openedDays >= 3);
    supportReview = {
      label: 'Hypothesis for the CSM to confirm',
      timeline: open.slice().sort((x, y) => y.openedDays - x.openedDays).slice(0, 5)
        .map(c => ({ date: c.openedLabel, case: c.id, text: c.severity + ' ' + c.title + ' (' + c.status + ')' })),
      what_went_wrong: [
        oldest && oldest.openedDays >= 7 ? 'Oldest open case ' + oldest.id + ' has been open ' + oldest.openedDays + ' days' : null,
        silent.length ? silent.length + ' open case' + (silent.length === 1 ? '' : 's') + ' older than 3 days with no recorded update' : null,
        breached.length ? breached.length + ' case' + (breached.length === 1 ? '' : 's') + ' past SLA' : null,
        waiting.length ? waiting.length + ' case' + (waiting.length === 1 ? '' : 's') + ' waiting on customer input' : null,
      ].filter(Boolean),
      could_have_helped: [
        p2.length >= 3 ? 'Link the ' + p2.length + ' open P2 cases by category and escalate any shared root cause once' : null,
        silent.length ? 'A daily update on every open P1/P2 would have closed the visible silence' : null,
        waiting.length ? 'Pre-empt "waiting on customer" with a scheduled working session' : null,
      ].filter(Boolean),
    };
  }

  // ---- renewal block
  const ownerOpp = renewalOpps[0];
  const renewal = {
    date: a.contractEnd, days_to_renewal: days, in_window: inWindow,
    stage: ownerOpp ? ownerOpp.stage : null, probability: ownerOpp ? ownerOpp.probability : null,
    ae: a.ae && a.ae.name, se: a.se && a.se.name, arr: a.arrExact,
    sentiment: rx.sentiment || null, procurement: rx.procurement || null,
  };

  // ---- actions with owners, due dates and automatic re-checks
  const actions = [];
  const act = (owner_team, text, due, recheck_days, recheck_rule) =>
    actions.push({ owner_team, text, due: fmt(addDays(due)), recheck_date: fmt(addDays(recheck_days)), recheck_rule });
  const has = (area) => findings.some(f => f.area === area);
  if (riskClass) act('CSMs', 'Confirm the risk from this assessment and schedule a health assessment call', 2, 14, 'Risk Profile status updated and call logged');
  if (has('support') || has('experience')) {
    act('Support', 'Link the open P1/P2 cases, escalate any shared root cause as one defect and give the customer a fix ETA', 2, 14, 'No new case on the failing category for 14 days');
  }
  for (const i of idle.filter(x => x.core)) {
    act('CSMs', 'Plan activation of ' + i.p.name + ' with the customer', 5, 30, i.p.name + ' activated or usage rising above ' + CONFIG.idleUtilPct + '%');
  }
  if (has('ps')) act('PS', 'Resolve the PS blocker: ' + (ps.note || ps.status), 5, 21, 'PS status moves out of At Risk');
  if (has('engagement')) act('CSMs', 'Assign an owner and a due date to the stalled retention and waiting cases', 3, 14, 'Stalled case has an update within 14 days');
  if (has('renewal') && earlyOpp) act('Renewals', 'Move the renewal opportunity beyond ' + earlyOpp.stage + ' with this evidence attached', 7, Math.max(days - 90, 14), 'Opportunity stage advanced before the 90-day mark');
  if (has('sentiment')) act('Accounts', 'Executive outreach with the fix plan; use the value delivered so far in the renewal conversation', 5, 21, 'Renewal sentiment tag cleared or AE confirms customer position');
  if (cls === 'artifact') act('CSMs', 'Propose closing the Risk Profile as no-risk once the explainer is confirmed', 5, 30, 'Risk Profile closed or reopened with a reason');
  if (cls === 'opportunity' && (strong.length || candidates.length)) {
    act('Accounts', (strong.length ? 'Open an expansion conversation on ' + strong.map(p => p.name).join(', ') + ' (usage at or above ' + CONFIG.strongAdoptionPct + '%)' : 'Introduce ' + candidates.slice(0, 2).map(p => p.name).join(' and ') + ' as expansion candidates'), 14, 45, 'Expansion discussion logged on the opportunity');
  }

  // ---- reach-out drafts to the right person
  const reach = [];
  if (has('ps') && ps && ps.pm) reach.push({ to_role: 'PS manager (' + ps.pm + ')', text: 'The PS project "' + ps.engagement + '" is flagged ' + ps.status + '. ' + (ps.note || '') + ' Can you confirm the plan and timeline so we can brief the customer before the renewal on ' + a.contractEnd + '?' });
  if ((has('renewal') || has('sentiment')) && a.ae && a.ae.name) reach.push({ to_role: 'AE and SE (' + a.ae.name + (a.se && a.se.name ? ', ' + a.se.name : '') + ')', text: a.name + ' renews in ' + days + ' days' + (earlyOpp ? ' and the renewal is at ' + earlyOpp.stage : '') + '. ' + (rx.procurement ? 'Procurement note: ' + rx.procurement + '. ' : '') + 'What is the current read from the customer and who is driving the renewal?' });
  if (has('engagement')) reach.push({ to_role: 'CSM (' + a.csm + ')', text: 'Stalled items on ' + a.name + ': ' + findings.filter(f => f.area === 'engagement').map(f => f.title).join('; ') + '. Please assign an owner and date today.' });
  if (!reach.length && riskClass) reach.push({ to_role: 'CSM (' + a.csm + ')', text: 'Review the assessment for ' + a.name + ' and confirm or override the call.' });

  // ---- proposed Risk Profile fields
  const top = [...findings].sort((x, y) => SEV.indexOf(y.severity) - SEV.indexOf(x.severity))[0];
  const catMap = { sentiment: ['Renewal Sentiment Risk', 'Competition / Pricing'], risk_history: ['Renewal Sentiment Risk', 'Non-Renewal Motions'],
    support: ['Engagement Risk', 'Support Issues'], experience: ['Engagement Risk', 'Support Issues'], ps: ['Engagement Risk', 'PS Delivery'],
    engagement: ['Engagement Risk', 'Customer Unresponsive'], activation: ['CX Score Risk', 'Usage / Not Activated'],
    adoption: ['CX Score Risk', 'Usage / Lack of Adoption'], renewal: ['Renewal Sentiment Risk', 'Renewal Visibility'] };
  const [pcat, preason] = (top && catMap[top.area]) || ['CX Score Risk', 'Adoption'];
  const secondary = findings.filter(f => f !== top && catMap[f.area]).map(f => catMap[f.area][1])[0] || null;
  const statusText = riskClass ? [
    "What's at risk: the renewal of " + a.name + ' (' + a.arrExact + ') on ' + a.contractEnd + ' (' + days + ' days).',
    'Why: ' + findings.slice(0, 3).map(f => f.title).join('; ') + '.',
    'What has been done: ' + (cd.history && cd.history.length ? cd.history.length + ' recent events logged' + (cd.history[0] ? ', latest: ' + cd.history[0].title + ' (' + cd.history[0].dateLabel + ')' : '') : 'no recent activity recorded') + '.',
    'Next steps: ' + actions.slice(0, 3).map(x => x.owner_team + ' - ' + x.text.replace(/\.$/, '')).join('; ') + '.',
  ].join('\n') : null;

  // ---- summary
  const classText = { confirmed: 'a confirmed risk', 'renewal-sentiment': 'a renewal sentiment risk', artifact: 'a score artifact', opportunity: 'an adoption opportunity', 'needs-check': 'a case that needs a human check' }[cls];
  const overview = a.name + ' is assessed as ' + classText + (riskClass || cls === 'needs-check' ? ' with ' + severity + ' severity' : '') + '. ' +
    (inWindow ? 'The renewal is in ' + days + ' days. ' : days != null ? 'The renewal is ' + days + ' days away, outside the ' + CONFIG.renewalWindowDays + '-day window. ' : '') +
    (findings.length ? 'Main drivers: ' + findings.slice().sort((x, y) => SEV.indexOf(y.severity) - SEV.indexOf(x.severity)).slice(0, 3).map(f => f.title).join('; ') + '.' : 'No triggers fired and nothing in the cases, PS or renewal text raised a concern.');
  const why = [
    riskClass ? 'The call is driven by ' + (hard.length ? hard.length + ' high-severity finding' + (hard.length === 1 ? '' : 's') : hardMediumAreas.size + ' medium findings in different areas') + (hasSentiment ? ' plus renewal sentiment evidence' : '') + ' across ' + areas.size + ' area' + (areas.size === 1 ? '' : 's') + '.' : null,
    cls === 'needs-check' ? 'Evidence is thin or limited to renewal timing and one medium finding, so a CSM should confirm before this is treated as risk.' : null,
    riskClass && days != null && days <= CONFIG.escalateDays ? 'Severity raised one level because the renewal is inside ' + CONFIG.escalateDays + ' days.' : null,
    explainers.length ? 'Severity lowered one level by structural explainer: ' + explainers.map(e => e.type).join(', ') + '.' : null,
    cls === 'opportunity' ? 'Nothing above Low severity; ' + (strong.length ? strong.length + ' product' + (strong.length === 1 ? '' : 's') + ' at or above ' + CONFIG.strongAdoptionPct + '% usage.' : 'core usage is healthy.') : null,
    missing.length ? 'Sources unavailable: ' + missing.join(', ') + '. Checks that depend on them were skipped.' : null,
    !tags.some(t => t.group === 'sentiment') && sources.filter(s => /renewal|case_comment/.test(s.record_type)).length < 3 ? 'Renewal text is thin, so a verbal competitor conversation would not be visible here.' : null,
  ].filter(Boolean).join(' ');

  // ---- validation: quotes verbatim in source, cited ids exist, numbers traceable
  const idSet = new Set([a.id, 'renewal-' + a.id, ...cases.map(c => c.id), ...(cd.escalations || []).map(e => e.id), ...(cd.history || []).map(h => h.id),
    ...(a.riskRegister || []).map(r => r.id), ...opps.map(o => o.id), ps && (ps.engagement || 'ps'), ...products.map(p => p.name)].filter(Boolean));
  const srcText = JSON.stringify(rec);
  const failed = [];
  let quotesChecked = 0;
  for (const f of findings) for (const e of f.evidence) {
    quotesChecked++;
    if (!idSet.has(e.record_id)) failed.push('unknown record ' + e.record_id);
  }
  for (const t of tags) { quotesChecked++; if (!sources.some(s => s.record_id === t.record_id && s.text.includes(t.quote))) failed.push('quote not found in ' + t.record_id); }
  const allowed = new Set((srcText.match(/\d[\d,.]*/g) || []).map(x => x.replace(/[.,]$/, '')));
  [days, CONFIG.renewalWindowDays, CONFIG.escalateDays, CONFIG.urgentDays, CONFIG.idleUtilPct, CONFIG.strongAdoptionPct, CONFIG.badExperienceWindowDays, CONFIG.stallDays]
    .forEach(v => v != null && allowed.add(String(v)));
  [findings.length, tags.length, areas.size, hard.length, open.length, p1.length, p2.length, breached.length, waiting.length, idle.length, wv.length, net, actions.length, strong.length, candidates.length, bad.length, sent.length]
    .forEach(v => allowed.add(String(v)));
  const prose = [overview, why, statusText || '', ...findings.map(f => f.title)].join(' ');
  const nums = (prose.match(/\d[\d,.]*/g) || []).map(x => x.replace(/[.,]$/, ''));
  let numbersChecked = 0;
  for (const x of nums) { numbersChecked++; if (!allowed.has(x)) failed.push('number ' + x + ' not traceable'); }

  return {
    account_id: a.id, account: a.name,
    assessed_at: CONFIG.asOf.toISOString(), snapshot_date: fmt(CONFIG.asOf),
    rule_version: CONFIG.ruleVersion, prompt_version: CONFIG.promptVersion,
    data_freshness: ['account', 'usage', 'cases', 'ps_project', 'opportunity', 'risk_profile'].map(t => ({
      table: t, loaded_at: fmt(CONFIG.asOf),
      status: (t === 'usage' && !u) || (t === 'cases' && !cases.length) || (t === 'ps_project' && !ps) ? 'unavailable' : 'fresh',
    })),
    call: { status: riskClass ? 'risk' : cls === 'needs-check' ? 'needs-check' : 'no-risk', class: cls, severity, confidence, trend,
      first_detected: findings.length ? fmt(CONFIG.asOf) : null,
      trend_basis: 'Last 4 weeks of case volume and usage direction (only one score snapshot is loaded)' },
    scores,
    renewal,
    products: products.map(p => ({ product: p.name, is_core: CONFIG.coreProducts.test(p.name), purchased: p.purchased, status: p.activated ? 'Activated' : 'Not activated',
      adoption_pct: p.purchased ? p.utilization : null, idle: idle.some(i => i.p === p), strong: strong.includes(p), expansion_candidate: !p.purchased })),
    findings,
    tags,
    structural_explainers: explainers,
    summary: { overview, why_this_call: why, what_changed: null,
      what_changed_note: 'Needs two stored assessments to compare; only the first run exists.' },
    support_experience_review: supportReview,
    risk_profile_proposal: riskClass ? { category: pcat, primary_reason: preason, secondary_reason: secondary, level: severity,
      type: has('activation') || has('adoption') ? 'Entitlement Risk' : has('sentiment') ? 'Renewal Risk' : 'Engagement Risk', current_status_text: statusText } : null,
    actions,
    reach_out_drafts: reach,
    validation: { numbers_checked: numbersChecked, quotes_checked: quotesChecked, tags_discarded: dropped, failed },
  };
}

export function assessAll(records) {
  return Object.fromEntries(records.map(r => [r.account.name, assess(r)]));
}

// one row per account for queues and tables
export function summarize(a, rec) {
  const acct = rec.account;
  // renewal timing is context, so the driver is the strongest finding that is not just the countdown
  const ranked = [...a.findings].sort((x, y) => SEV.indexOf(y.severity) - SEV.indexOf(x.severity));
  const top = ranked.find(f => f.area !== 'renewal') || ranked[0];
  return {
    name: a.account, class: a.call.class, status: a.call.status, severity: a.call.severity, confidence: a.call.confidence, trend: a.call.trend,
    driver: top ? top.title : 'No triggers fired', arr: acct.arr, arrExact: acct.arrExact, days: acct.renewalDaysVal, csm: acct.csm,
    findings: a.findings.length, actions: a.actions.length, validationFailed: a.validation.failed.length,
  };
}
