import React from 'react';
import { SENTIMENT_COLORS, fmtMoney } from './data';

const TONE = {
  positive: { icon: 'trending_up', color: '#34d399' },
  neutral: { icon: 'remove', color: '#66cfee' },
  negative: { icon: 'trending_down', color: '#ff6b6b' },
};

export default function RenewalChurn({ renewal, churnHistory }) {
  const color = SENTIMENT_COLORS[renewal.sentiment] || '#9db4e2';
  const churnProvided = churnHistory != null;
  const history = churnHistory || [];
  const totalChurn = history.reduce((a, c) => a + c.amount, 0);

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Renewal sentiment */}
      <div className="col-span-5 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl" style={{ color }}>sentiment_neutral</span>
          <h3 className="text-sm font-bold text-white m-0">Renewal Sentiment</h3>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-col"
            style={{ border: '5px solid ' + color, background: color + '15' }}
          >
            <span className="text-xl font-bold text-white leading-none">{renewal.score != null ? renewal.score : '—'}</span>
            <span className="text-[9px] text-[#9db4e2]">{renewal.score != null ? '/ 100' : 'no score'}</span>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color }}>{renewal.sentiment}</div>
            <div className="text-[11px] text-[#9db4e2]">{renewal.value == null ? 'Renewal (value restricted)' : 'Renewal of ' + fmtMoney(renewal.value)} on {renewal.date}</div>
            <div className="text-[11px] text-[#9db4e2]">{renewal.daysAway} days away</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2]">Sentiment Drivers</div>
          {renewal.drivers.map((d, i) => {
            const t = TONE[d.tone];
            return (
              <div key={i} className="flex items-start gap-2 bg-[#12306f] border border-[#3858a6]/50 rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-[16px] mt-px" style={{ color: t.color }}>{t.icon}</span>
                <span className="text-xs text-white">{d.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px] pt-3 border-t border-[#3858a6]/50">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2]">Champion</div>
            <div className="text-white mt-0.5">{renewal.champion}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2]">Procurement</div>
            <div className="text-white mt-0.5">{renewal.procurement}</div>
          </div>
        </div>
      </div>

      {/* Churn history */}
      <div className="col-span-7 bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff6b6b] text-xl">trending_down</span>
            <h3 className="text-sm font-bold text-white m-0">Churn History</h3>
          </div>
          <span className="text-xs font-bold" style={{ color: !churnProvided ? '#9db4e2' : history.length ? '#ff6b6b' : '#34d399' }}>
            {!churnProvided ? 'Not provided' : history.length ? fmtMoney(totalChurn) + ' lifetime' : 'No churn on record'}
          </span>
        </div>

        {!churnProvided ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#9db4e2]">
            <span className="material-symbols-outlined text-4xl mb-2">help</span>
            <p className="text-sm m-0">Churn history was not provided for this account</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#9db4e2]">
            <span className="material-symbols-outlined text-4xl mb-2">verified</span>
            <p className="text-sm m-0">No churn or contraction events for this account</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((c, i) => (
              <div key={i} className="bg-[#12306f] border border-[#3858a6]/50 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{c.event}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#66cfee]/15 text-[#66cfee]">{c.period}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ background: (c.recovered ? '#34d399' : '#f59e0b') + '20', color: c.recovered ? '#34d399' : '#f59e0b' }}
                    >
                      {c.recovered ? 'Recovered' : 'Not recovered'}
                    </span>
                  </div>
                  <p className="text-xs text-[#9db4e2] mt-1.5 mb-0 leading-relaxed">{c.reason}</p>
                </div>
                <span className="text-lg font-bold text-[#ff6b6b] flex-shrink-0">{fmtMoney(c.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
