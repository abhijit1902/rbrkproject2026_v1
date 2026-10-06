import React, { useState } from 'react';

export default function SeatOptimizerModal({ isOpen, onClose, usage }) {
  if (!isOpen || !usage) return null;

  const [reclaimCount, setReclaimCount] = useState(usage.dormantSeats || 100);
  const costPerSeat = 640; // $640/seat/year
  const savings = reclaimCount * costPerSeat;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-xl bg-[#1b4098] border border-[#3858a6] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3858a6] bg-[#12306f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white m-0">
                License Seat Optimization &amp; Reclaim Studio
              </h3>
              <span className="text-[11px] text-on-surface-variant font-code-sm">
                Target Entity: {usage.accountName} • Total Purchased: {usage.totalSeats} Seats
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-[#2b5db3] transition-colors cursor-pointer bg-transparent border-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#12306f] border border-[#3858a6]/60">
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Active Seats</span>
              <strong className="text-white text-lg block mt-0.5">{usage.activeSeats}</strong>
              <span className="text-[#3ECF8E] text-[10px] font-bold">Active in past 30d</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12306f] border border-[#3858a6]/60">
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Dormant Seats</span>
              <strong className="text-error text-lg block mt-0.5">{usage.dormantSeats}</strong>
              <span className="text-error text-[10px] font-bold">&gt;60d Inactivity</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12306f] border border-[#3858a6]/60">
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Max Recovery</span>
              <strong className="text-primary text-lg block mt-0.5">{usage.dormantArrExposure}</strong>
              <span className="text-primary text-[10px] font-bold">ARR Potential</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#071445] border border-[#3858a6] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Seats to Reclaim &amp; Reallocate:</span>
              <span className="font-code-sm text-sm text-primary font-bold">{reclaimCount} Seats</span>
            </div>
            <input
              type="range"
              min="0"
              max={usage.dormantSeats || 280}
              value={reclaimCount}
              onChange={(e) => setReclaimCount(Number(e.target.value))}
              className="w-full accent-[#66cfee] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>0 (Keep All)</span>
              <span>Calculated Contract Savings: <strong className="text-[#3ECF8E]">${savings.toLocaleString()} / yr</strong></span>
              <span>{usage.dormantSeats} (Full Reclaim)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#12306f] border border-[#3858a6]/40 text-xs text-on-surface-variant leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">Automated Workflow:</span>
            Reclaiming seats will automatically notify CSM Daniela Reyes to present an optimized renewal package at <strong className="text-white">${((usage.activeSeats + (usage.dormantSeats - reclaimCount)) * costPerSeat).toLocaleString()} ARR</strong>, mitigating the customer's churn risk heading into the {usage.renewalDaysVal}-day expiration checkpoint.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#3858a6] bg-[#12306f] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#2b5db3] hover:bg-[#3a66bb] text-on-surface font-semibold rounded-lg text-xs cursor-pointer border border-[#3858a6]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Successfully queued seat reallocation: Reclaiming ${reclaimCount} dormant seats. Saved $${savings.toLocaleString()} ARR. SFDC Contract adjusted.`);
              onClose();
            }}
            className="px-4 py-1.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:bg-primary-fixed cursor-pointer border-0 shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Execute Seat Reallocation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
