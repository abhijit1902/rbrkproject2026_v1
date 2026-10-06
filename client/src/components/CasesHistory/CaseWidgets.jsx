import React from 'react';
import { buildCaseSummary } from './data';

const PS_COLORS = { 'On Track': '#34d399', 'At Risk': '#f59e0b', Paused: '#ff6b6b', 'On Hold': '#ff6b6b', Delayed: '#ff6b6b', Completed: '#66cfee' };
const LEVEL_COLORS = { Executive: '#ff6b6b', Management: '#f59e0b', Engineering: '#a78bfa' };

function WidgetShell({ icon, iconColor, title, tag, children }) {
  return (
    <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl" style={{ color: iconColor }}>{icon}</span>
          <h3 className="text-sm font-bold text-white m-0">{title}</h3>
        </div>
        {tag}
      </div>
      {children}
    </div>
  );
}

export function PSStatusWidget({ ps }) {
  const color = PS_COLORS[ps.status] || '#9db4e2';
  return (
    <WidgetShell
      icon="engineering"
      iconColor="#66cfee"
      title="PS Status"
      tag={
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: color + '26', color }}>
          {ps.status}
        </span>
      }
    >
      <div>
        <div className="text-xs font-semibold text-white">{ps.engagement}</div>
        <div className="text-[11px] text-[#9db4e2] mt-0.5">{ps.phase} · PM: {ps.pm}</div>
      </div>
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-[#9db4e2]">{ps.progress != null ? 'Progress' : 'Hours used'}</span>
          <span className="font-bold text-white">
            {ps.progress != null ? ps.progress + '%' : ps.hoursUsed + ' of ' + ps.hoursTotal + ' hrs'}
          </span>
        </div>
        <div className="h-2 bg-[#3858a6]/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: (ps.progress != null ? ps.progress : ps.budgetUsed) + '%', background: color }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <div className="text-[#9db4e2] uppercase tracking-wider text-[10px] font-semibold">Next Milestone</div>
          <div className="text-white font-medium mt-0.5">{ps.nextMilestone}</div>
        </div>
        <div>
          <div className="text-[#9db4e2] uppercase tracking-wider text-[10px] font-semibold">Budget Used</div>
          <div className="text-white font-medium mt-0.5">{ps.budgetUsed}%</div>
        </div>
      </div>
      <p className="text-[11px] text-[#9db4e2] m-0 leading-relaxed">{ps.note}</p>
      {ps.other && ps.other.map(p => (
        <div key={p.name} className="flex items-center justify-between text-[11px] pt-2 border-t border-[#3858a6]/50">
          <span className="text-white font-medium">{p.name}</span>
          <span className="text-[#9db4e2]">{p.status} · {p.hoursUsed} of {p.hoursTotal} hrs</span>
        </div>
      ))}
    </WidgetShell>
  );
}

export function EscalationDetailsWidget({ escalations }) {
  return (
    <WidgetShell
      icon="priority_high"
      iconColor="#ff6b6b"
      title="Escalation Details"
      tag={
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff6b6b]/15 text-[#ff6b6b]">
          {escalations.length} active
        </span>
      }
    >
      {escalations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-[#9db4e2]">
          <span className="material-symbols-outlined text-3xl mb-1">verified</span>
          <p className="text-xs m-0">No active escalations</p>
        </div>
      )}
      {escalations.map(e => {
        const color = LEVEL_COLORS[e.level] || '#9db4e2';
        return (
          <div key={e.id} className="bg-[#12306f] border border-[#3858a6]/60 rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">{e.title}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0" style={{ background: color + '26', color }}>
                {e.level}
              </span>
            </div>
            <div className="text-[11px] text-[#9db4e2]">
              {e.id} · Owner: {e.owner} · Open {e.sinceDays}d · {e.status}
            </div>
            <div className="text-[11px] text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#66cfee]">schedule</span>
              {e.next}
            </div>
          </div>
        );
      })}
    </WidgetShell>
  );
}

export function CaseAISummaryWidget({ accountName, cases, ps, escalations, aggregates }) {
  return (
    <WidgetShell
      icon="auto_awesome"
      iconColor="#a78bfa"
      title="AI Summary"
      tag={<span className="text-[10px] font-semibold text-[#9db4e2] uppercase tracking-wider">Cases &amp; Engagement</span>}
    >
      <p className="text-xs text-[#e9f0ff] m-0 leading-relaxed">
        {buildCaseSummary(accountName, cases, ps, escalations, aggregates)}
      </p>
      <div className="text-[10px] text-[#9db4e2] mt-auto pt-2 border-t border-[#3858a6]/50">
        {aggregates
          ? 'Generated from account-level case counts, ' + escalations.length + ' recorded escalation(s) and the PS project'
          : 'Generated from ' + cases.length + ' cases, ' + escalations.length + ' escalations and PS milestones'}
      </div>
    </WidgetShell>
  );
}
