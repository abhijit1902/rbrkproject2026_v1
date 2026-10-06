import React, { useState, useEffect } from 'react';

export default function Header({ currentView, onNavigate, onOpenAskAI, onSearchClick, allAccounts = [], selectedAccountName, onSelectAccount }) {
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [accountQuery, setAccountQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Alerts follow the account filter: one account when selected, the whole portfolio otherwise
  useEffect(() => {
    const q = selectedAccountName ? '?account=' + encodeURIComponent(selectedAccountName) : '';
    fetch('/api/notifications' + q)
      .then(res => res.json())
      .then(data => { setNotifications(data.notifications || []); setUnreadCount(data.unread || 0); })
      .catch(() => {});
  }, [selectedAccountName]);

  const aq = accountQuery.trim().toLowerCase();
  const matchingAccounts = allAccounts.filter(a => !aq || a.name.toLowerCase().includes(aq));

  const navItems = [
    { id: 'account-overview', label: 'ACCOUNT OVERVIEW' },
    { id: 'usage-and-adoption', label: 'USAGE & ADOPTION' },
    { id: 'risk-signals', label: 'RISKS & SIGNALS' },
    { id: 'cases-and-history', label: 'CASES & HISTORY' },
    { id: 'opportunities-and-actions', label: 'OPPORTUNITIES & ACTIONS' },
    { id: 'action-center', label: 'ACTION CENTER' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-[#0d2a6c]/60 backdrop-blur-md border-b border-[#3858a6] flex items-center justify-between px-space-lg select-none">
      {/* Brand & Global Navigation */}
      <div className="flex items-center h-full gap-space-lg">
        <button
          onClick={() => onNavigate('portfolio')}
          className="flex items-center gap-space-sm cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 text-left p-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1b4098] border border-[#3858a6] flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">insights</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide whitespace-nowrap font-bold">
            Customer Intelligence
          </span>
        </button>

        <nav className="hidden xl:flex items-center h-full gap-space-lg">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'detail' && item.id === 'account-overview') || (currentView === 'portfolio' && item.id === 'account-overview');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id === 'account-overview' ? 'portfolio' : item.id)}
                className={`tracking-wider flex items-center h-full transition-colors text-xs font-medium bg-transparent border-0 cursor-pointer pt-0.5 ${
                  isActive
                    ? 'text-primary font-semibold border-b-2 border-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* ASK AI Button */}
        <button
          onClick={onOpenAskAI}
          type="button"
          className="flex items-center gap-space-xs px-space-md py-1 rounded-full border border-primary-container text-primary font-label-md text-label-md hover:bg-[#2b5db3] hover:shadow-[0_0_12px_rgba(102,207,238,0.2)] transition-all cursor-pointer bg-transparent"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
          <span className="tracking-wider font-semibold">ASK AI</span>
        </button>

        {/* Search */}
        <button
          onClick={onSearchClick}
          className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center"
          title="Search accounts and telemetry"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#1b4098] border border-[#3858a6] rounded-xl p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#3858a6]">
                <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                  Live Telemetry Alerts
                </span>
                <span className="font-code-sm text-[11px] text-primary">{unreadCount} New</span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {notifications.slice(0, 6).map((n, idx) => {
                  const color = n.severity === 'critical' ? '#ff6b6b' : n.severity === 'warning' ? '#F2B84B' : '#66cfee';
                  return (
                    <div
                      key={idx}
                      onClick={() => { onSelectAccount?.(n.account); setShowNotifications(false); }}
                      className="p-2 rounded bg-[#12306f] hover:bg-[#2b5db3] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold" style={{ color }}>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
                          {n.account}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">{n.text}</p>
                    </div>
                  );
                })}
                {notifications.length === 0 && (
                  <p className="text-xs text-on-surface-variant m-0 p-2">No alerts right now</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Apps Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowAppsMenu(!showAppsMenu)}
            className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer bg-transparent border-0 flex items-center justify-center"
            title="Intelligence Apps"
          >
            <span className="material-symbols-outlined text-[20px]">apps</span>
          </button>

          {showAppsMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#12306f] border border-[#3858a6] rounded-xl p-space-sm shadow-2xl z-50">
              <div className="font-label-sm text-label-sm text-on-surface-variant px-space-sm py-1 uppercase tracking-wider font-semibold">
                Intelligence Apps
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => { setShowAppsMenu(false); onNavigate('portfolio'); }}
                  className="flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm w-full text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  Account Intelligence Hub
                </button>
                <button
                  onClick={() => { setShowAppsMenu(false); onNavigate('portfolio'); }}
                  className="flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm w-full text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
                  Renewal Workbench
                </button>
                <button
                  onClick={() => { setShowAppsMenu(false); }}
                  className="flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm w-full text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  Case Intelligence Hub
                </button>
                <button
                  onClick={() => { setShowAppsMenu(false); }}
                  className="flex items-center gap-space-sm px-space-sm py-space-xs rounded hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm w-full text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Opportunity Radar
                </button>
              </div>
              <div className="h-px bg-surface-variant my-space-xs"></div>
              <a href="#" className="block px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded text-xs no-underline">
                Global Console Dashboard
              </a>
              <a href="#" className="block px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded text-xs no-underline">
                Settings & Integrations
              </a>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-outline-variant"></div>

        {/* Account Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowAccountMenu(v => !v); setAccountQuery(''); }}
            className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer bg-transparent border-0"
          >
            <span className="material-symbols-outlined text-[18px]">domain</span>
            <span className="hidden md:inline font-label-md text-label-md max-w-[180px] truncate">
              {selectedAccountName || 'All Accounts'}
            </span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#12306f] border border-[#3858a6] rounded-xl p-space-sm shadow-2xl z-50">
              <div className="font-label-sm text-label-sm text-on-surface-variant px-space-sm py-1 uppercase tracking-wider font-semibold">
                Select Account
              </div>
              <input
                autoFocus
                value={accountQuery}
                onChange={e => setAccountQuery(e.target.value)}
                placeholder="Search accounts..."
                className="w-full mt-1 mb-1 px-space-sm py-1.5 rounded-lg bg-[#1b4098] border border-[#3858a6] text-xs text-white placeholder-[#9db4e2] focus:outline-none focus:border-primary"
              />
              <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5">
                {!aq && (
                  <button
                    onClick={() => { onSelectAccount?.(null); setShowAccountMenu(false); }}
                    className={`flex items-center justify-between gap-2 px-space-sm py-space-xs rounded text-left w-full border-0 cursor-pointer text-xs ${
                      !selectedAccountName
                        ? 'bg-[#2b5db3] text-white font-semibold'
                        : 'bg-transparent text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="truncate">All Accounts</span>
                    <span className="text-[10px] text-on-surface-variant flex-shrink-0">{allAccounts.length} accounts</span>
                  </button>
                )}
                {matchingAccounts.map(acc => (
                  <button
                    key={acc.name}
                    onClick={() => { onSelectAccount?.(acc.name); setShowAccountMenu(false); }}
                    className={`flex items-center justify-between gap-2 px-space-sm py-space-xs rounded text-left w-full border-0 cursor-pointer text-xs ${
                      acc.name === selectedAccountName
                        ? 'bg-[#2b5db3] text-white font-semibold'
                        : 'bg-transparent text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="truncate">{acc.name}</span>
                    <span className="text-[10px] text-on-surface-variant flex-shrink-0">{acc.arr}</span>
                  </button>
                ))}
                {matchingAccounts.length === 0 && (
                  <div className="px-space-sm py-3 text-xs text-on-surface-variant">No accounts match</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-[#66cfee]/40 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
            DR
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#3ECF8E] border-2 border-[#071445]"></span>
        </div>
      </div>
    </header>
  );
}
