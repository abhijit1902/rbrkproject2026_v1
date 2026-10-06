import React, { useState, useEffect } from 'react';

const SEV = {
  High: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border-[#ff6b6b]/30',
  Medium: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
  Low: 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/30',
};
export const CLASS_LABEL = {
  confirmed: 'Confirmed risk',
  'renewal-sentiment': 'Renewal sentiment risk',
  artifact: 'Score artifact',
  opportunity: 'Adoption opportunity',
  'needs-check': 'Needs human check',
};
const STATUS_STYLE = {
  risk: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border-[#ff6b6b]/30',
  'no-risk': 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/30',
  'needs-check': 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
};
const GROUP_STYLE = {
  sentiment: 'text-[#ff9b9b]', bad_experience: 'text-[#f59e0b]', engagement: 'text-[#a78bfa]', structural: 'text-[#66cfee]',
};
const GROUP_LABEL = { sentiment: 'Renewal sentiment', bad_experience: 'Bad experience', engagement: 'Engagement', structural: 'Structural' };
const AREA_LABEL = {
  renewal: 'Renewal', support: 'Support', activation: 'Activation', adoption: 'Adoption', engagement: 'Engagement',
  ps: 'PS', sentiment: 'Sentiment', risk_history: 'Risk history', experience: 'Experience',
};

const Chip = ({ className = '', children }) => (
  <span className={'px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ' + className}>{children}</span>
);

export default function AIAssessmentCard({ account, onToast }) {
  const [data, setData] = useState(null);
  const [verdicts, setVerdicts] = useState([]);
  const [open, setOpen] = useState({});
  const [showReach, setShowReach] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    fetch('/api/assessments/' + encodeURIComponent(account.name))
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { setData(d.assessment); setVerdicts(d.verdicts || []); })
      .catch(() => setError(true));
  }, [account.name]);

  if (error) {
    return (
      <section className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-5 text-sm text-[#9db4e2]">
        AI assessment is unavailable for this account.
      </section>
    );
  }
  if (!data) {
    return (
      <section className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-5 text-sm text-[#9db4e2]">
        Running assessment...
      </section>
    );
  }

  const { call, summary, findings, tags, actions, products } = data;
  const proposal = data.risk_profile_proposal;
  const review = data.support_experience_review;
  const verdictFor = (target) => verdicts.filter(v => v.target === target).slice(-1)[0];

  const sendVerdict = async (target, verdict) => {
    try {
      const res = await fetch('/api/assessments/' + encodeURIComponent(account.name) + '/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target, verdict }),
      });
      const d = await res.json();
      if (d.verdicts) setVerdicts(d.verdicts);
      onToast?.('Feedback saved');
    } catch {
      onToast?.('Could not save feedback');
    }
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text).then(() => onToast?.('Copied to clipboard'), () => onToast?.('Copy failed'));
  };

  const Verdict = ({ target }) => {
    const v = verdictFor(target);
    return (
      <span className="inline-flex items-center gap-1">
        {[['confirmed', 'check', 'Confirm'], ['false_positive', 'block', 'False positive'], ['not_useful', 'thumb_down', 'Not useful']].map(([k, icon, label]) => (
          <button key={k} title={label} onClick={() => sendVerdict(target, k)}
            className={'w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ' +
              (v && v.verdict === k ? 'bg-[#2d7d98] border-[#66cfee] text-white' : 'bg-transparent border-[#3858a6] text-[#9db4e2] hover:text-white')}>
            <span className="material-symbols-outlined text-[14px]">{icon}</span>
          </button>
        ))}
      </span>
    );
  };

  const lowScores = (data.scores || []).filter(s => s.low || s.watch);

  return (
    <section className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-5 flex flex-col gap-5">
      {/* Header: the call */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#66cfee] text-xl">psychology</span>
            <h3 className="text-base font-bold text-white m-0">AI Assessment</h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip className={STATUS_STYLE[call.status]}>{call.status === 'risk' ? 'Risk' : call.status === 'no-risk' ? 'No risk' : 'Needs check'}</Chip>
            <Chip className="bg-[#66cfee]/10 text-[#66cfee] border-[#66cfee]/30">{CLASS_LABEL[call.class]}</Chip>
            <Chip className={SEV[call.severity]}>{call.severity} severity</Chip>
            <Chip className="bg-white/5 text-[#e9f0ff] border-[#3858a6]">{call.confidence} confidence</Chip>
            <Chip className="bg-white/5 text-[#e9f0ff] border-[#3858a6]">Trend: {call.trend}</Chip>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Verdict target="call" />
          <span className="text-[10px] text-[#9db4e2]">As of {data.snapshot_date} - {data.rule_version}</span>
        </div>
      </div>

      {/* Verdict text */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#e9f0ff] leading-relaxed m-0">{summary.overview}</p>
        {summary.why_this_call && <p className="text-xs text-[#9db4e2] leading-relaxed m-0">{summary.why_this_call}</p>}
        <p className="text-[11px] text-[#9db4e2] m-0">
          Trend basis: {call.trend_basis}. What changed: {summary.what_changed_note}
        </p>
      </div>

      {/* Score view and structural explainers */}
      {(lowScores.length > 0 || data.structural_explainers.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {lowScores.map(s => (
            <span key={s.part} className={'px-2 py-1 rounded-md border text-[11px] ' + (s.low ? SEV.High : SEV.Medium)}>
              {s.part}: {s.val || s.value}
            </span>
          ))}
          {data.structural_explainers.map((e, i) => (
            <span key={i} className="px-2 py-1 rounded-md border border-[#66cfee]/30 bg-[#66cfee]/10 text-[#66cfee] text-[11px]" title={e.evidence}>
              Explainer: {e.type}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Findings with evidence */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Findings ({findings.length})</h4>
          {findings.length === 0 && <span className="text-xs text-[#9db4e2]">No triggers fired.</span>}
          {findings.map(f => (
            <div key={f.id} className="border border-[#3858a6] rounded-lg bg-[#0a1650]/30">
              <button onClick={() => setOpen(o => ({ ...o, [f.id]: !o[f.id] }))}
                className="w-full flex items-center gap-2 p-2.5 bg-transparent border-0 cursor-pointer text-left">
                <Chip className={SEV[f.severity]}>{f.severity}</Chip>
                <span className="text-[10px] text-[#9db4e2] uppercase tracking-wider w-16 shrink-0">{AREA_LABEL[f.area] || f.area}</span>
                <span className="text-xs text-[#e9f0ff] flex-1">{f.title}</span>
                <span className="material-symbols-outlined text-[16px] text-[#9db4e2]">{open[f.id] ? 'expand_less' : 'expand_more'}</span>
              </button>
              {open[f.id] && (
                <div className="px-3 pb-3 flex flex-col gap-1.5">
                  {f.evidence.map((e, i) => (
                    <div key={i} className="text-[11px] text-[#9db4e2] border-l-2 border-[#66cfee]/50 pl-2">
                      <span className="text-[#66cfee] font-semibold">{e.record_type} {e.record_id}</span>
                      {e.date ? ' - ' + e.date : ''}
                      <div className="text-[#e9f0ff]">"{e.quote}"</div>
                    </div>
                  ))}
                  <div className="flex justify-end"><Verdict target={f.id} /></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Text tags */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Evidence tags read from text ({tags.length})</h4>
          {tags.length === 0 && <span className="text-xs text-[#9db4e2]">No text tags found in cases, PS notes or renewal notes.</span>}
          {tags.map((t, i) => (
            <div key={i} className="border border-[#3858a6] rounded-lg bg-[#0a1650]/30 p-2.5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className={'font-bold ' + (GROUP_STYLE[t.group] || '')}>{t.tag}</span>
                <span className="text-[#9db4e2]">{GROUP_LABEL[t.group]} - {t.confidence} confidence</span>
              </div>
              <div className="text-[11px] text-[#e9f0ff] mt-0.5">"{t.quote}"</div>
              <div className="text-[10px] text-[#9db4e2] mt-0.5">{t.record_type} {t.record_id}{t.date ? ' - ' + t.date : ''}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Support experience review */}
      {review && (
        <div className="border border-[#3858a6] rounded-lg bg-[#0a1650]/30 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Support experience review</h4>
            <Chip className="bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30">{review.label}</Chip>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-[11px] text-[#e9f0ff]">
            <div><div className="text-[#9db4e2] mb-1">Oldest open cases</div>
              {review.timeline.map((t, i) => <div key={i} className="mb-0.5">{t.date} - {t.case}: {t.text}</div>)}</div>
            <div><div className="text-[#9db4e2] mb-1">Where time was lost</div>
              {review.what_went_wrong.map((t, i) => <div key={i} className="mb-0.5">- {t}</div>)}</div>
            <div><div className="text-[#9db4e2] mb-1">What could have helped</div>
              {review.could_have_helped.map((t, i) => <div key={i} className="mb-0.5">- {t}</div>)}</div>
          </div>
        </div>
      )}

      {/* Actions by team with re-check rules */}
      {actions.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Proposed actions and automatic re-checks</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="text-[#9db4e2] border-b border-[#3858a6]">
                  <th className="py-1.5 pr-3 font-semibold">Team</th><th className="pr-3 font-semibold">Action</th>
                  <th className="pr-3 font-semibold">Due</th><th className="font-semibold">Re-check</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((x, i) => (
                  <tr key={i} className="border-b border-[#3858a6]/50 align-top text-[#e9f0ff]">
                    <td className="py-1.5 pr-3 font-semibold whitespace-nowrap">{x.owner_team}</td>
                    <td className="pr-3">{x.text}</td>
                    <td className="pr-3 whitespace-nowrap">{x.due}</td>
                    <td className="text-[#9db4e2]">{x.recheck_date}: {x.recheck_rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Profile proposal and reach-out drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {proposal && (
          <div className="border border-[#3858a6] rounded-lg bg-[#0a1650]/30 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Risk Profile proposal</h4>
              <button onClick={() => copy(proposal.current_status_text)}
                className="text-[11px] text-[#66cfee] bg-transparent border border-[#66cfee]/40 rounded-md px-2 py-0.5 cursor-pointer">Copy status text</button>
            </div>
            <div className="text-[11px] text-[#e9f0ff] grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span className="text-[#9db4e2]">Category</span><span>{proposal.category}</span>
              <span className="text-[#9db4e2]">Primary reason</span><span>{proposal.primary_reason}</span>
              <span className="text-[#9db4e2]">Secondary reason</span><span>{proposal.secondary_reason || 'None'}</span>
              <span className="text-[#9db4e2]">Level</span><span>{proposal.level}</span>
              <span className="text-[#9db4e2]">Type</span><span>{proposal.type}</span>
            </div>
            <pre className="text-[11px] text-[#e9f0ff] whitespace-pre-wrap font-sans m-0 leading-relaxed">{proposal.current_status_text}</pre>
          </div>
        )}
        <div className="border border-[#3858a6] rounded-lg bg-[#0a1650]/30 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider m-0">Reach-out drafts ({data.reach_out_drafts.length})</h4>
            {data.reach_out_drafts.length > 0 && (
              <button onClick={() => setShowReach(s => !s)} className="text-[11px] text-[#66cfee] bg-transparent border-0 cursor-pointer">
                {showReach ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
          {data.reach_out_drafts.length === 0 && <span className="text-xs text-[#9db4e2]">No reach-out needed for this call.</span>}
          {showReach && data.reach_out_drafts.map((d, i) => (
            <div key={i} className="text-[11px] text-[#e9f0ff] border-l-2 border-[#66cfee]/50 pl-2">
              <div className="text-[#66cfee] font-semibold">To {d.to_role}</div>
              <div>{d.text}</div>
              <button onClick={() => copy(d.text)} className="mt-1 text-[10px] text-[#66cfee] bg-transparent border-0 cursor-pointer p-0">Copy</button>
            </div>
          ))}
        </div>
      </div>

      {/* Products and validation footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#9db4e2] border-t border-[#3858a6] pt-3">
        <span>
          Products: {products.filter(p => p.strong).length} strong, {products.filter(p => p.idle).length} idle, {products.filter(p => p.expansion_candidate).length} not purchased
        </span>
        <span className={data.validation.failed.length ? 'text-[#ff6b6b]' : 'text-[#34d399]'}>
          Validation: {data.validation.numbers_checked} numbers and {data.validation.quotes_checked} quotes checked against source,
          {' '}{data.validation.failed.length} failed, {data.validation.tags_discarded} tags discarded
        </span>
        <span>Rule-based with a text tagger; no model call is made.</span>
      </div>
    </section>
  );
}
