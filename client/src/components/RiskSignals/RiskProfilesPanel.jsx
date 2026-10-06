import React, { useState } from 'react';

const SEV_STYLE = {
  High: 'bg-[#ff6b6b]/15 text-[#ff6b6b] border border-[#ff6b6b]/30',
  Medium: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30',
  Low: 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30',
};
const VALIDITY_COLOR = (v) => (/^Valid/.test(v) ? '#34d399' : /Invalid/.test(v) ? '#9db4e2' : '#f59e0b');
const STATUS_FILTERS = ['Active', 'All'];

// Plain-text email with every detail the retention owner needs for this risk profile
export function buildRetentionEmail(rp) {
  const subject = `[Retention] ${rp.id} - ${rp.riskType} (${rp.severity}) - ${rp.account}`;
  const lines = [
    `Hi ${rp.retentionOwner || 'team'},`,
    '',
    `Please review risk profile ${rp.id} for ${rp.account}.`,
    '',
    'RISK PROFILE',
    `- ID: ${rp.id}`,
    `- Risk type: ${rp.riskType}`,
    `- Category: ${rp.category}`,
    `- Severity: ${rp.severity}`,
    `- Status: ${rp.status}`,
    `- Validity: ${rp.validity}`,
    `- Created: ${rp.created}${rp.closed ? ' | Closed: ' + rp.closed : ''}`,
    '',
    'ACCOUNT',
    `- ${rp.account} (${rp.accountId}), ${rp.tier}`,
    `- ARR: ${rp.arr}`,
    `- Renewal: ${rp.contractEnd} (${rp.renewalDays} days)`,
    `- Health score: ${rp.healthScore}`,
    `- Churn probability: ${rp.churnProb}% (${rp.riskLevel} risk)`,
    `- CSM: ${rp.csm}`,
    `- Executive sponsor: ${rp.execSponsor}`,
    '',
    'CONTEXT',
    `- Top signals: ${rp.topSignals}`,
    `- Open cases: ${rp.openCases}`,
    `- Active escalations: ${rp.activeEscalations}`,
    `- Retention case: ${rp.retentionCaseStatus ? rp.retentionOwnerSource + ' (' + rp.retentionCaseStatus + ')' : 'none linked'}`,
    '',
    'Please confirm the mitigation plan and next step.',
    '',
    'Sent from Customer Intelligence',
  ];
  return { subject, body: lines.join('\n') };
}

export default function RiskProfilesPanel({ profiles = [], query = '', onSelectAccount, onToast }) {
  const [filter, setFilter] = useState('Active');
  const [sent, setSent] = useState({});

  const q = query.trim().toLowerCase();
  const visible = profiles.filter(p => {
    if (filter === 'Active' && !(p.status === 'In progress' && /^Valid/.test(p.validity))) return false;
    return !q || [p.id, p.account, p.riskType, p.category, p.retentionOwner || ''].some(f => f.toLowerCase().includes(q));
  });
  const activeCount = profiles.filter(p => p.status === 'In progress' && /^Valid/.test(p.validity)).length;

  const sendMail = (rp) => {
    const { subject, body } = buildRetentionEmail(rp);
    // Opens the user's mail client with everything filled in; the data has no email addresses, so the To field is left for them
    window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setSent(prev => ({ ...prev, [rp.id]: true }));
    onToast?.('Email to ' + (rp.retentionOwner || 'retention owner') + ' opened for ' + rp.id);
  };

  return (
    <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#3858a6]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f59e0b] text-xl">assignment_late</span>
          <h3 className="text-sm font-bold text-white m-0">Risk Profiles (RP)</h3>
          <span className="text-[11px] text-[#9db4e2]">{activeCount} active of {profiles.length}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#0b2166]/60 border border-[#3858a6] rounded-lg p-0.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer border-0 ${
                filter === f ? 'bg-[#2b5db3] text-white' : 'bg-transparent text-[#9db4e2] hover:text-white'
              }`}
            >
              {f === 'Active' ? 'Active (valid, in progress)' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-10 text-center text-xs text-[#9db4e2]">No risk profiles match.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead>
              <tr className="text-[#9db4e2] border-b border-[#3858a6]">
                {['Risk profile', 'Account', 'Type / category', 'Severity', 'Status', 'Retention owner', ''].map(h => (
                  <th key={h} className="py-2 px-4 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(rp => (
                <tr key={rp.id + rp.account} className="border-b border-[#3858a6]/50 text-[#e9f0ff] align-top">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-white">{rp.id}</div>
                    <div className="text-[10px] text-[#9db4e2]">Created {rp.created}</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectAccount?.(rp.account)}
                      className="font-semibold text-[#66cfee] hover:underline bg-transparent border-0 p-0 cursor-pointer text-left text-[11px]"
                    >
                      {rp.account}
                    </button>
                    <div className="text-[10px] text-[#9db4e2]">{rp.arr} · renews in {rp.renewalDays}d</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{rp.riskType}</div>
                    <div className="text-[10px] text-[#9db4e2]">{rp.category}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${SEV_STYLE[rp.severity] || SEV_STYLE.Low}`}>{rp.severity}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>{rp.status}</div>
                    <div className="text-[10px] font-semibold" style={{ color: VALIDITY_COLOR(rp.validity) }}>{rp.validity}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{rp.retentionOwner || 'Not assigned'}</div>
                    <div className="text-[10px] text-[#9db4e2]">{rp.retentionOwnerSource}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => sendMail(rp)}
                      disabled={!rp.retentionOwner}
                      title={rp.retentionOwner ? 'Open an email to ' + rp.retentionOwner + ' with all the details' : 'No retention owner on record'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d7d98] text-[#e6f7fd] hover:bg-[#2d7d98]/80 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] cursor-pointer border-0 whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[15px]">{sent[rp.id] ? 'mark_email_read' : 'mail'}</span>
                      {sent[rp.id] ? 'Email again' : 'Email owner'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] text-[#9db4e2] m-0 px-5 py-3 border-t border-[#3858a6]/50">
        The retention owner is the owner of the linked retention case, or the account's renewal owner when none is linked.
        The email opens in your mail client with the risk profile, account, renewal and signal details filled in.
      </p>
    </div>
  );
}
