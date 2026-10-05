import React, { useState } from 'react';

export default function AskAIModal({ isOpen, onClose, currentAccountName }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am your Customer Intelligence AI assistant. I have live telemetry access to ${currentAccountName || 'Apex Global Logistics'} and the entire 340-account enterprise portfolio. How can I assist you with retention, telemetry anomalies, or playbooks today?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `What are the critical churn risks for ${currentAccountName}?`,
    `Explain the renewal window and ARR exposure.`,
    `What is the status of active playbooks?`,
    `Summarize portfolio health across 340 accounts.`
  ];

  const handleSend = async (textToSend) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt, accountName: currentAccountName })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', text: data.answer }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: 'assistant', text: 'Telemetry analysis error: Unable to contact the intelligence server. Please check connection.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#09203b] border border-[#213551] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#213551] bg-[#051c36]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base text-on-surface font-bold m-0">
                Ask Customer Intelligence AI
              </h2>
              <span className="text-[11px] text-on-surface-variant font-code-sm">
                Context: {currentAccountName} • Gemini & Telemetry Correlator Active
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-[#162b46] transition-colors cursor-pointer bg-transparent border-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-1.5 px-6 py-2.5 bg-[#00142c]/50 border-b border-[#213551]/60">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#162b46] hover:bg-primary hover:text-on-primary text-primary font-medium transition-colors cursor-pointer border border-[#213551]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
              )}
              <div
                className={`p-3.5 rounded-xl max-w-[80%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary font-medium rounded-tr-xs'
                    : 'bg-[#051c36] border border-[#213551] text-on-surface rounded-tl-xs shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-primary font-code-sm text-xs">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span>Synthesizing account telemetry data...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#213551] bg-[#051c36]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about ${currentAccountName}, churn velocity, or playbooks...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#00142c] border border-[#213551] rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-xs font-bold rounded-xl hover:bg-primary-fixed disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer border-0"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
