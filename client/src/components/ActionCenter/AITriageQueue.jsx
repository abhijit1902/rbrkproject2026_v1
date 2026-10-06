import React, { useState, useEffect } from 'react';
import { CLASS_LABEL } from '../AccountDetail/AIAssessmentCard';

const TABS = [
  ['confirmed', 'Confirmed risk'],
  ['renewal-sentiment', 'Renewal sentiment'],
  ['needs-check', 'Needs human check'],
  ['artifact', 'Score artifacts'],
  ['opportunity', 'Opportunities'],
];
const SEV_STYLE = {
  High: 'text-[#ff6b6b]', Medium: 'text-[#f59e0b]', Low: 'text-[#34d399]',
};

// Cross-account queue built from the stored assessments; clicking a row opens that account's assessment
export default function AITriageQueue({ onSelectAccount }) {
  const [rows, setRows] = useState(null);
  const [tab, setTab] = useState(null);
  const [within180, setWithin180] = useState(false);

  useEffect(() => {
    fetch('/api/assessments')
      .then(r => r.json())
      .then(d => setRows(d.rows || []))
      .catch(() => setRows([]));
  }, []);

  if (!rows) return null;

  const counts = Object.fromEntries(TABS.map(([k]) => [k, rows.filter(r => r.class === k).length]));
  const active = tab || (TABS.find(([k]) => counts[k])?.[0] ?? 'confirmed');
  const shown = rows.filter(r => r.class === active && (!within180 || (r.days != null && r.days <= 180)));

  return (
    <section className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#66cfee] text-xl">psychology</span>
          <h3 className="text-base font-bold text-white m-0">AI triage across {rows.length} accounts</h3>
        </div>
        <label className="flex items-center gap-1.5 text-[11px] text-[#9db4e2] cursor-pointer">
          <input type="checkbox" checked={within180} onChange={e => setWithin180(e.target.checked)} />
          Renewal inside 180 days
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={'px-3 py-1 rounded-full text-[11px] font-semibold border cursor-pointer ' +
              (active === k ? 'bg-[#2d7d98] border-[#66cfee] text-white' : 'bg-transparent border-[#3858a6] text-[#9db4e2]')}>
            {label} ({counts[k]})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-xs text-[#9db4e2] py-4">No accounts in this queue.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead>
              <tr className="text-[#9db4e2] border-b border-[#3858a6]">
                <th className="py-1.5 pr-3 font-semibold">Account</th><th className="pr-3 font-semibold">Severity</th>
                <th className="pr-3 font-semibold">Main driver</th><th className="pr-3 font-semibold">ARR</th>
                <th className="pr-3 font-semibold">Days to renewal</th><th className="pr-3 font-semibold">CSM</th>
                <th className="font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(r => (
                <tr key={r.name} onClick={() => onSelectAccount?.(r.name)}
                  className="border-b border-[#3858a6]/50 text-[#e9f0ff] cursor-pointer hover:bg-white/5 align-top">
                  <td className="py-2 pr-3 font-semibold">{r.name}</td>
                  <td className={'pr-3 font-bold ' + SEV_STYLE[r.severity]}>{r.severity}</td>
                  <td className="pr-3">{r.driver}</td>
                  <td className="pr-3 whitespace-nowrap">{r.arr}</td>
                  <td className="pr-3">{r.days}</td>
                  <td className="pr-3 whitespace-nowrap">{r.csm}</td>
                  <td>{r.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] text-[#9db4e2] mt-3 mb-0">
        Sorted by severity, then days to renewal. Class: {CLASS_LABEL[active]}. Counts of confirmed versus overridden calls will appear once CSM feedback is collected.
      </p>
    </section>
  );
}
