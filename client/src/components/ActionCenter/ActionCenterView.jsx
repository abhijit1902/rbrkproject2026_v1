import React, { useState, useEffect } from 'react';
import AITriageQueue from './AITriageQueue';
import { buildContext, buildSteps, buildOverview, downloadAccount360 } from './account360';

const PRIORITY_STYLE = {
  Critical: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  High: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Medium: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};

const TEAM_ICONS = {
  Support: 'support_agent', Executive: 'groups', Renewal: 'event_repeat', CS: 'handshake', PS: 'engineering', Sales: 'trending_up',
};

// Mounted with key={account.name} so state resets when the selected account changes
export default function ActionCenterView({ account, onToast, onSelectAccount }) {
  const [usage, setUsage] = useState(null);
  const [done, setDone] = useState({});

  useEffect(() => {
    if (!account) return;
    fetch('/api/usage/' + encodeURIComponent(account.name))
      .then(res => res.json())
      .then(data => setUsage(data.usage))
      .catch(() => setUsage(null));
  }, [account && account.name]);

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
      </div>
    );
  }

  const ctx = buildContext(account, usage);
  const steps = buildSteps(ctx);
  const { headline, tiles, findings, gaps } = buildOverview(ctx);
  const doneCount = steps.filter(s => done[s.id]).length;

  const handleDownload = () => {
    downloadAccount360(ctx);
    onToast?.('Account 360 downloaded for ' + account.name);
  };

  return (
    <div className="min-h-screen bg-transparent pt-6 px-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#66cfee] text-2xl">bolt</span>
            <h1 className="text-2xl font-bold text-white tracking-tight m-0">Action Center</h1>
            <span className="px-2 py-0.5 bg-[#66cfee]/20 border border-[#66cfee]/40 text-[#66cfee] text-[10px] font-bold rounded-full uppercase tracking-wider ml-1">
              {account.name}
            </span>
          </div>
          <p className="text-xs text-[#9db4e2] m-0">
            Overall account status and the steps to take after analysing health, usage, cases, renewal and expansion
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#2d7d98] text-[#e6f7fd] hover:bg-[#2d7d98]/80 font-bold text-xs rounded-lg cursor-pointer border-0 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download Account 360
        </button>
      </div>

      {/* AI triage across all accounts, built from the stored assessments */}
      <AITriageQueue onSelectAccount={onSelectAccount} />

      {/* Overall summary */}
      <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#a78bfa] text-xl">auto_awesome</span>
          <h3 className="text-sm font-bold text-white m-0">Overall Summary</h3>
        </div>
        <p className="text-xs text-[#e9f0ff] m-0 leading-relaxed">{headline}</p>
        <div className="grid grid-cols-4 gap-4">
          {tiles.map(t => (
            <div key={t.label} className="rounded-xl p-4 border" style={{ background: t.color + '1a', borderColor: t.color + '4d' }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: t.color }}>{t.label}</div>
              <div className="text-2xl font-bold text-white mt-1">{t.value}</div>
              <div className="text-[10px] text-[#9db4e2] mt-1">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key findings and data gaps (shown when the account has them) */}
      {(findings.length > 0 || gaps.length > 0) && (
        <div className={`mt-6 grid gap-5 ${findings.length > 0 && gaps.length > 0 ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {findings.length > 0 && (
            <div className="col-span-2 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f59e0b] text-xl">lightbulb</span>
                <h3 className="text-sm font-bold text-white m-0">What This Account Shows</h3>
              </div>
              <ul className="m-0 pl-4 flex flex-col gap-2">
                {findings.map((f, i) => (
                  <li key={i} className="text-xs text-[#e9f0ff] leading-relaxed">{f}</li>
                ))}
              </ul>
            </div>
          )}
          {gaps.length > 0 && (
            <div className="bg-[#1c3f96]/25 border border-dashed border-[#3858a6] rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9db4e2] text-xl">help</span>
                <h3 className="text-sm font-bold text-white m-0">Data Not Available</h3>
              </div>
              <ul className="m-0 pl-4 flex flex-col gap-1.5">
                {gaps.map((g, i) => (
                  <li key={i} className="text-[11px] text-[#9db4e2] leading-relaxed">{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="mt-6 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3858a6]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#66cfee] text-xl">checklist</span>
            <h3 className="text-sm font-bold text-white m-0">Steps To Be Done</h3>
            <span className="text-[11px] text-[#9db4e2]">Prioritized from the complete account analysis</span>
          </div>
          <span className="text-xs font-bold text-white">{doneCount} / {steps.length} done</span>
        </div>

        <div className="flex flex-col">
          {steps.map((step, i) => {
            const isDone = !!done[step.id];
            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-[#3858a6]/50 last:border-b-0 transition-opacity ${isDone ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => setDone(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                  title={isDone ? 'Mark as not done' : 'Mark as done'}
                  className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 cursor-pointer bg-transparent ${
                    isDone ? 'border-[#34d399] text-[#34d399]' : 'border-[#9db4e2] text-transparent hover:border-[#34d399]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </button>
                <div className="w-6 text-xs font-bold text-[#9db4e2] pt-0.5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold text-white ${isDone ? 'line-through' : ''}`}>{step.title}</div>
                  <p className="text-[11px] text-[#9db4e2] mt-1 mb-0 leading-relaxed">{step.why}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 text-[11px] text-[#e9f0ff]">
                    <span className="material-symbols-outlined text-[15px] text-[#66cfee]">{TEAM_ICONS[step.team] || 'group'}</span>
                    {step.team}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_STYLE[step.priority]}`}>{step.priority}</span>
                  <span className="w-28 text-right text-[11px] text-[#9db4e2]">{step.due}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
