import React, { useState, useEffect, useRef } from 'react';

export default function BreadcrumbBar({
  account,
  allAccounts = [],
  onSelectAccount,
  onGoToPortfolio,
  onTriggerPlaybook,
  isDispatchingPlaybook,
  onExportReport
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAccounts = allAccounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.arr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md relative select-none">
      {/* Interactive Breadcrumb Bar */}
      <div className="flex items-center gap-space-xs font-label-md text-label-md relative" ref={dropdownRef}>
        {/* Back to Portfolio Button */}
        <button
          onClick={onGoToPortfolio}
          type="button"
          className="text-[#2DD4CF] hover:text-[#5ce4e0] cursor-pointer flex items-center gap-1.5 font-semibold transition-colors px-2 py-1 rounded hover:bg-surface-container-high bg-transparent border-0"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>All Accounts</span>
        </button>

        <span className="text-outline-variant font-light">/</span>

        {/* Account Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-on-surface font-semibold hover:text-[#2DD4CF] hover:bg-surface-container-high transition-colors flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer border border-transparent hover:border-surface-variant bg-transparent"
          >
            <span>{account.name}</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-[#12294B] border border-surface-variant rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-2">
              {/* Search Box */}
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-outline absolute left-2.5 pointer-events-none text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search 340 accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#000e23] border border-surface-variant rounded-lg text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-[#2DD4CF]"
                  autoFocus
                />
              </div>

              {/* Pinned "All Accounts (340)" row */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onGoToPortfolio();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#051c36] hover:bg-[#162b46] text-[#2DD4CF] font-label-md text-label-md transition-colors text-left border border-[#2DD4CF]/20 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <span className="font-semibold text-xs">All Accounts Portfolio (340)</span>
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <div className="h-px bg-surface-variant/60 my-0.5"></div>

              {/* Scrollable Account List */}
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                {filteredAccounts.length === 0 ? (
                  <div className="p-3 text-center text-xs text-on-surface-variant">
                    No accounts matching "{searchTerm}"
                  </div>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isSelected = acc.name === account.name;
                    let dotColor = '#3ECF8E';
                    if (acc.status === 'red') dotColor = '#F4664A';
                    if (acc.status === 'amber') dotColor = '#F2B84B';

                    return (
                      <button
                        key={acc.name}
                        type="button"
                        onClick={() => {
                          onSelectAccount(acc.name);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer border-0 ${
                          isSelected
                            ? 'bg-[#162b46] border border-primary/40 text-on-surface'
                            : 'bg-transparent hover:bg-[#051c36] text-on-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }}></span>
                          <div className="flex flex-col min-w-0 truncate">
                            <span className="text-xs font-semibold text-on-surface truncate">{acc.name}</span>
                            <span className="font-code-sm text-[11px] text-on-surface-variant">{acc.arr}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="pt-2 border-t border-surface-variant flex items-center justify-between text-xs">
                <span className="text-[11px] text-primary">340 Monitored Entities</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface bg-transparent border-0 cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <span className="text-outline-variant font-light">/</span>

        {/* Account ID Badge */}
        <span className="text-on-surface-variant font-code-sm text-xs px-2.5 py-0.5 rounded bg-[#000e23] border border-[#213551]">
          ID: {account.id}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-space-sm">
        <button
          onClick={onExportReport}
          type="button"
          className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-[#162b46] hover:bg-[#263a56] text-on-surface font-label-md text-xs font-medium transition-all shadow-sm cursor-pointer border border-[#213551]"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">download</span>
          <span>Export Account Report</span>
        </button>

        <button
          onClick={() => alert(`Scheduled Executive Review for ${account.name} with CSM ${account.csm} on calendar.`)}
          type="button"
          className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-[#162b46] hover:bg-[#263a56] text-on-surface font-label-md text-xs font-medium transition-all shadow-sm cursor-pointer border border-[#213551]"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
          <span>Schedule Review</span>
        </button>

        <button
          onClick={onTriggerPlaybook}
          disabled={isDispatchingPlaybook}
          type="button"
          className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-fixed shadow-md transition-all cursor-pointer border-0"
        >
          <span className={`material-symbols-outlined text-[16px] ${isDispatchingPlaybook ? 'animate-spin' : ''}`}>
            {isDispatchingPlaybook ? 'refresh' : 'bolt'}
          </span>
          <span>{isDispatchingPlaybook ? 'Dispatching...' : 'Trigger Playbook'}</span>
        </button>
      </div>
    </div>
  );
}
