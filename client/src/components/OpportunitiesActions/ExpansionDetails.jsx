import React from 'react';
import { STAGE_COLORS, fmtMoney, summarizeOps } from './data';

export default function ExpansionDetails({ opportunities, query }) {
  const s = summarizeOps(opportunities);
  const q = query.trim().toLowerCase();
  const open = s.expansionOpen.filter(x => !q || [x.name, x.type, x.signal || ''].some(f => f.toLowerCase().includes(q)));
  const wonExpansion = s.won.filter(x => x.type !== 'Renewal');
  const total = s.expansionOpen.reduce((a, x) => a + x.value, 0);
  const weighted = s.expansionOpen.reduce((a, x) => a + x.value * x.probability / 100, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open Expansion Pipeline', value: fmtMoney(total), color: '#66cfee' },
          { label: 'Weighted Forecast', value: fmtMoney(weighted), color: '#a78bfa' },
          { label: 'Expansion Won (history)', value: fmtMoney(wonExpansion.reduce((a, x) => a + x.value, 0)), color: '#34d399' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: k.color + '1a', borderColor: k.color + '4d' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: k.color }}>{k.label}</div>
            <div className="text-2xl font-bold text-white mt-1">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {open.map(x => {
          const color = STAGE_COLORS[x.stage];
          return (
            <div key={x.id} className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white m-0">{x.name}</h3>
                  <div className="text-[11px] text-[#9db4e2] mt-0.5">{x.type} · {x.id} · Close {x.closeLabel}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: color + '26', color }}>{x.stage}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">{fmtMoney(x.value)}</span>
                <span className="text-xs text-[#9db4e2]">{x.probability}% probability</span>
              </div>
              <div className="h-1.5 bg-[#3858a6]/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: x.probability + '%', background: color }} />
              </div>
              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="bg-[#12306f] border border-[#3858a6]/50 rounded-lg p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2] mb-0.5">Expansion Signal</div>
                  <div className="text-white">{x.signal || 'No expansion signal recorded'}</div>
                </div>
                <div className="bg-[#12306f] border border-[#3858a6]/50 rounded-lg p-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9db4e2] mb-0.5">Next Step</div>
                  <div className="text-white">{x.nextStep || 'No next step recorded'}</div>
                </div>
              </div>
              <div className="text-[10px] text-[#9db4e2]">Owner: {x.owner}</div>
            </div>
          );
        })}
      </div>

      {open.length === 0 && (
        <div className="bg-[#1c3f96]/40 border border-[#3858a6] rounded-2xl py-14 flex flex-col items-center text-[#9db4e2]">
          <span className="material-symbols-outlined text-4xl mb-2">trending_up</span>
          <p className="text-sm m-0">No open expansion opportunities for this account</p>
        </div>
      )}
    </div>
  );
}
