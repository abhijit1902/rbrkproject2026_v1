import React from 'react';

export default function Sidebar({ currentView, onNavigate, onSelectAccount }) {
  const navItems = [
    { id: 'portfolio', label: 'Accounts Hub', icon: 'hub' },
    { id: 'usage-and-adoption', label: 'Telemetry & Usage', icon: 'insights' },
    { id: 'risk-signals', label: 'Risk & Signals', icon: 'crisis_alert' },
    { id: 'playbooks', label: 'Action Playbooks', icon: 'playlist_add_check' }
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#0d2a6c]/40 backdrop-blur-md border-r border-[#3858a6] z-40 flex flex-col justify-between p-space-md select-none">
      <div className="flex flex-col gap-space-sm">
        {/* Active Workspace Header */}
        <div className="px-space-sm py-space-xs">
          <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Active Workspace
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface truncate font-bold mt-0.5">
            Enterprise Health Matrix
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex flex-col gap-space-xs mt-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'portfolio' && (currentView === 'portfolio' || currentView === 'detail')) || (item.id === 'risk-signals' && currentView === 'risk-signals');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'portfolio') {
                    onNavigate('portfolio');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all text-left w-full border-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2b5db3] text-primary font-semibold shadow-sm border border-primary/20'
                    : 'bg-transparent text-on-surface-variant hover:bg-[#1b4098] hover:text-on-surface font-normal'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sync Status & Footer */}
      <div className="flex flex-col gap-space-xs pt-space-sm border-t border-[#3858a6]">
        <div className="flex items-center justify-between px-space-sm py-space-xs">
          <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold tracking-wider">
            SYNC STATUS
          </span>
          <span className="flex items-center gap-1.5 font-code-sm text-xs text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            LIVE
          </span>
        </div>
        <button
          onClick={() => alert('Console Settings: Telemetry poll rate 15s • SFDC bidirectional sync active • Zendesk webhook connected')}
          className="flex items-center gap-space-md px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-[#1b4098] hover:text-on-surface text-xs transition-colors bg-transparent border-0 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Console Settings</span>
        </button>
      </div>
    </aside>
  );
}
