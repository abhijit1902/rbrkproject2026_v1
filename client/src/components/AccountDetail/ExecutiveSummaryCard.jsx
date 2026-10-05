import React, { useState } from 'react';

export default function ExecutiveSummaryCard({ account, onGeneratePdf }) {
  const [feedbackState, setFeedbackState] = useState(null); // 'helpful' | 'tuning'

  const handleFeedback = async (type) => {
    setFeedbackState(type);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName: account.name, type })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="w-full select-none">
      <div className="p-space-lg rounded-xl bg-[#09203b] border border-[#213551] shadow-md flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-[#213551]/40">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base text-on-surface font-bold m-0">
                Executive Summary
              </h3>
              <span className="text-xs text-on-surface-variant">
                AI-Synthesized Contextual Audit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="px-2.5 py-1 rounded-full bg-[#162b46] border border-[#213551] text-primary font-code-sm text-xs flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              AI Synthesized · 14m ago
            </span>
            <button
              onClick={() => alert(`Briefing summary shared with CSM ${account.csm} and Executive Account Pod.`)}
              type="button"
              className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-fixed transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer border-0"
            >
              <span className="material-symbols-outlined text-[16px]">ios_share</span>
              <span>Share with Account Team</span>
            </button>
          </div>
        </div>

        {/* Narrative Body */}
        <div className="p-space-md rounded-lg bg-[#051c36] border border-[#213551]/50 text-sm text-on-surface leading-relaxed">
          <p className="m-0">
            {account.execSummary}
          </p>
        </div>

        {/* Footer Metadata & Source Traceability */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm text-xs pt-space-xs">
          <div className="flex items-center gap-space-md text-on-surface-variant">
            <span>
              Sources:{' '}
              {(account.sources || [{ text: '4 signals' }, { text: '7 evidence records' }]).map((src, i) => (
                <span key={i}>
                  <a href="#" className="text-primary hover:underline font-semibold" onClick={(e) => e.preventDefault()}>
                    {src.text}
                  </a>
                  {i < (account.sources.length - 1) && ', '}
                </span>
              ))}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#3ECF8E]">verified_user</span>
              Model Confidence: <strong className="text-on-surface ml-0.5">{account.modelConfidence || 'High (88%)'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => handleFeedback('helpful')}
              type="button"
              className={`font-label-md text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded cursor-pointer border-0 ${
                feedbackState === 'helpful'
                  ? 'bg-[#3ECF8E]/20 text-[#3ECF8E]'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-[#162b46]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span>{feedbackState === 'helpful' ? 'Saved' : 'Helpful'}</span>
            </button>

            <button
              onClick={() => handleFeedback('tuning')}
              type="button"
              className={`font-label-md text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded cursor-pointer border-0 ${
                feedbackState === 'tuning'
                  ? 'bg-error/20 text-error'
                  : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-[#162b46]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">thumb_down</span>
              <span>Needs Tuning</span>
            </button>

            <button
              onClick={onGeneratePdf}
              type="button"
              className="ml-space-sm text-primary hover:text-primary-fixed font-label-md text-xs font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
            >
              <span>Generate PDF Briefing Doc</span>
              <span className="material-symbols-outlined text-[16px]">description</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
