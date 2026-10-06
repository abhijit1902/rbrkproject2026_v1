// Runs the assessment engine once over the loaded accounts and keeps the results in memory.
// The dashboard and Ask AI read only from here; nothing calls the engine at view time.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { assessAll, summarize } from './engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const RECORDS = JSON.parse(readFileSync(join(here, '..', 'data', 'accounts.json'), 'utf8'));
export const ASSESSMENTS = assessAll(RECORDS);

const RANK = { High: 0, Medium: 1, Low: 2 };
export function assessmentRows() {
  return RECORDS.map(r => summarize(ASSESSMENTS[r.account.name], r))
    .sort((a, b) => RANK[a.severity] - RANK[b.severity] || (a.days ?? 1e9) - (b.days ?? 1e9));
}

// confirm / false positive / not useful, kept in memory like the other runtime state
const VERDICTS = {};
export function recordVerdict(name, target, verdict, reason) {
  (VERDICTS[name] = VERDICTS[name] || []).push({ target, verdict, reason: reason || '', at: new Date().toISOString() });
  return VERDICTS[name];
}
export const verdictsFor = (name) => VERDICTS[name] || [];

const cite = (f) => f.evidence.slice(0, 2).map(e => e.record_type + ' ' + e.record_id).join(', ');

// Ask AI answers only from the stored assessment and says which records it used
export function answerFromAssessment(name, question) {
  const a = ASSESSMENTS[name];
  if (!a || !question) return null;
  const q = question.toLowerCase();
  const byArea = (...areas) => a.findings.filter(f => areas.includes(f.area));
  const lines = (list) => list.map(f => '- ' + f.severity + ': ' + f.title + ' [' + cite(f) + ']').join('\n');
  const srcs = (list) => list.flatMap(f => f.evidence.map(e => e.record_type + ':' + e.record_id)).slice(0, 8);
  const head = a.account + ' is a ' + a.call.class + ' call, ' + a.call.severity + ' severity, ' + a.call.confidence + ' confidence, trend ' + a.call.trend + '.';

  if (/why|reason|call|class/.test(q)) {
    return { answer: head + '\n' + a.summary.why_this_call, sources: srcs(a.findings) };
  }
  if (/support|case|sla|p1|p2/.test(q)) {
    const f = byArea('support', 'experience');
    if (!f.length) return { answer: 'No support findings fired for ' + a.account + '.', sources: [] };
    const r = a.support_experience_review;
    return { answer: lines(f) + (r ? '\nWhat went wrong (hypothesis): ' + r.what_went_wrong.join('; ') + '.' : ''), sources: srcs(f) };
  }
  if (/ps |project|services|sow/.test(q + ' ')) {
    const f = byArea('ps');
    return { answer: f.length ? lines(f) : 'No PS findings fired for ' + a.account + '.', sources: srcs(f) };
  }
  if (/idle|adoption|usage|activat|product|expan/.test(q)) {
    const f = byArea('activation', 'adoption');
    const strong = a.products.filter(p => p.strong).map(p => p.product);
    const cand = a.products.filter(p => p.expansion_candidate).map(p => p.product);
    return { answer: (f.length ? lines(f) : 'No idle products.') + (strong.length ? '\nStrong adoption: ' + strong.join(', ') + '.' : '') + (cand.length ? '\nNot purchased: ' + cand.join(', ') + '.' : ''), sources: srcs(f) };
  }
  if (/sentiment|competit|pric|churn|renew/.test(q)) {
    const f = byArea('sentiment', 'renewal');
    const t = a.tags.filter(x => x.group === 'sentiment').map(x => x.tag + ' ("' + x.quote + '")');
    return { answer: (f.length ? lines(f) : 'No renewal findings.') + (t.length ? '\nText tags: ' + t.join('; ') : '\nNo renewal-sentiment text was found.') + '\nRenewal ' + a.renewal.date + ' (' + a.renewal.days_to_renewal + ' days).', sources: srcs(f) };
  }
  if (/action|next|do|step|recommend/.test(q)) {
    return { answer: a.actions.length ? a.actions.map(x => '- ' + x.owner_team + ' by ' + x.due + ': ' + x.text + ' (re-check ' + x.recheck_date + ': ' + x.recheck_rule + ')').join('\n') : 'No actions proposed for ' + a.account + '.', sources: [] };
  }
  if (/reach|email|draft|who/.test(q)) {
    return { answer: a.reach_out_drafts.length ? a.reach_out_drafts.map(d => 'To ' + d.to_role + ': ' + d.text).join('\n\n') : 'No reach-out needed.', sources: [] };
  }
  if (/summar|overview|status|health|risk|how/.test(q)) {
    return { answer: a.summary.overview + '\n' + a.summary.why_this_call, sources: srcs(a.findings) };
  }
  return null;
}
