import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AccountDetailView from './components/AccountDetail/AccountDetailView';
import PortfolioDashboard from './components/Portfolio/PortfolioDashboard';
import AskAIModal from './components/Modals/AskAIModal';
import PlaybookModal from './components/Modals/PlaybookModal';
import ExportModal from './components/Modals/ExportModal';
import UsageAdoptionView from './components/UsageAdoption/UsageAdoptionView';
import RiskSignalsView from './components/RiskSignals/RiskSignalsView';
import OpportunitiesActionsView from './components/OpportunitiesActions/OpportunitiesActionsView';
import CasesHistoryView from './components/CasesHistory/CasesHistoryView';
import ActionCenterView from './components/ActionCenter/ActionCenterView';

const KNOWN_VIEWS = ['usage-and-adoption', 'portfolio', 'detail', 'risk-signals', 'opportunities-and-actions', 'cases-and-history', 'action-center'];

// Alternate URL hashes that resolve to a canonical view id
const HASH_ALIASES = { 'risks-and-signals': 'risk-signals' };
const resolveHash = (raw) => HASH_ALIASES[raw] || raw;

export default function App() {
  const getInitialView = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = resolveHash(window.location.hash.replace('#', ''));
      if (KNOWN_VIEWS.includes(hash)) return hash;
    }
    return 'detail';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  // Default account can be overridden with ?account=<name> (handy for sharing a link to one account)
  const [selectedAccountName, setSelectedAccountName] = useState(() => {
    if (typeof window !== 'undefined') {
      const fromUrl = new URLSearchParams(window.location.search).get('account');
      if (fromUrl) return fromUrl;
    }
    return 'AFLAC Incorporated';
  });
  const [accountData, setAccountData] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isDispatchingPlaybook, setIsDispatchingPlaybook] = useState(false);
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [isPlaybookModalOpen, setIsPlaybookModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync hash with currentView
  useEffect(() => {
    window.location.hash = currentView;
  }, [currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = resolveHash(window.location.hash.replace('#', ''));
      if (hash && KNOWN_VIEWS.includes(hash)) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch accounts list and portfolio overview
  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => setAllAccounts(data.accounts || []))
      .catch(err => console.error('Error fetching accounts:', err));

    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setPortfolioData(data.portfolio))
      .catch(err => console.error('Error fetching portfolio:', err));
  }, []);

  // Fetch single account data whenever selectedAccountName changes
  useEffect(() => {
    if (!selectedAccountName) return;
    fetch(`/api/accounts/${encodeURIComponent(selectedAccountName)}`)
      .then(res => res.json())
      .then(data => {
        setAccountData(data.account);
      })
      .catch(err => console.error('Error fetching account detail:', err));
  }, [selectedAccountName]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectAccount = (name) => {
    setSelectedAccountName(name);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Header account selector: switch account but stay on the current page
  const handleChangeAccount = (name) => {
    setSelectedAccountName(name);
  };

  // Account data only counts once it matches the selected account (avoids showing the previous account's data)
  const currentAccount = accountData && accountData.name === selectedAccountName ? accountData : null;

  const handleTriggerPlaybook = async () => {
    if (!accountData) return;
    setIsDispatchingPlaybook(true);
    try {
      const res = await fetch('/api/playbook/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountName: accountData.name })
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Playbook "${accountData.playbookTitle}" active for ${accountData.name}`);
        // update local state
        setAccountData(prev => ({
          ...prev,
          playbookStep: result.execution.currentStep,
          playbookProgress: result.execution.progress,
          isPlaybookDispatched: true
        }));
      }
    } catch (e) {
      console.error(e);
      showToast('Error triggering playbook');
    } finally {
      setTimeout(() => {
        setIsDispatchingPlaybook(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e9f0ff] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#2b5db3] border border-[#66cfee] text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn text-xs font-semibold">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Fixed Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'portfolio') {
            setCurrentView('portfolio');
          } else if (view === 'account-overview') {
            setCurrentView('detail');
          } else {
            setCurrentView(view);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAskAI={() => setIsAskAIOpen(true)}
        allAccounts={allAccounts}
        selectedAccountName={selectedAccountName}
        onSelectAccount={handleChangeAccount}
        onSearchClick={() => {
          // Open dropdown or prompt
          const account = prompt('Enter account name to search (e.g. Apex Global Logistics, CloudScale Therapeutics, Vertex FinTech Holdings):');
          if (account) handleSelectAccount(account);
        }}
      />

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'portfolio') {
            setCurrentView('portfolio');
          } else {
            setCurrentView(view);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectAccount={handleSelectAccount}
      />

      {/* Main Workspace Frame */}
      <div className="pl-64 flex-1">
        <main className="w-full pt-16 px-space-lg bg-transparent min-h-screen">
          {currentView === 'detail' && (
            <AccountDetailView
              account={accountData}
              allAccounts={allAccounts}
              onSelectAccount={handleSelectAccount}
              onGoToPortfolio={() => {
                setCurrentView('portfolio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTriggerPlaybook={handleTriggerPlaybook}
              isDispatchingPlaybook={isDispatchingPlaybook}
              onOpenPlaybookModal={() => setIsPlaybookModalOpen(true)}
              onOpenRenewalPlan={() => setIsPlaybookModalOpen(true)}
              onExportReport={() => setIsExportModalOpen(true)}
              onToast={showToast}
            />
          )}

          {currentView === 'portfolio' && (
            <PortfolioDashboard
              portfolio={portfolioData}
              allAccounts={allAccounts}
              selectedAccountName={selectedAccountName}
              onSelectAccount={handleSelectAccount}
              onExportPortfolio={() => setIsExportModalOpen(true)}
            />
          )}

          {currentView === 'usage-and-adoption' && (
            <UsageAdoptionView
              selectedAccountName={selectedAccountName}
              allAccounts={allAccounts}
              onSelectAccount={handleSelectAccount}
              onNavigate={(view) => {
                if (view === 'account-overview') {
                  setCurrentView('detail');
                } else {
                  setCurrentView(view);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'risk-signals' && (
            <RiskSignalsView
              allAccounts={allAccounts}
              onSelectAccount={handleSelectAccount}
              onToast={showToast}
            />
          )}

          {currentView === 'opportunities-and-actions' && (
            <OpportunitiesActionsView
              key={selectedAccountName}
              account={currentAccount}
            />
          )}

          {currentView === 'cases-and-history' && (
            <CasesHistoryView
              key={selectedAccountName}
              account={currentAccount}
              onToast={showToast}
            />
          )}

          {currentView === 'action-center' && (
            <ActionCenterView
              key={selectedAccountName}
              account={currentAccount}
              onToast={showToast}
              onSelectAccount={handleSelectAccount}
            />
          )}

          {!KNOWN_VIEWS.includes(currentView) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 select-none">
              <div className="w-16 h-16 rounded-2xl bg-[#1b4098] border border-[#3858a6] flex items-center justify-center text-primary shadow-lg">
                <span className="material-symbols-outlined text-3xl">insights</span>
              </div>
              <h2 className="text-xl font-bold text-white capitalize m-0">
                {currentView.replace(/-/g, ' ')} Module
              </h2>
              <p className="text-xs text-on-surface-variant max-w-md text-center m-0">
                Connected to live telemetry feed for enterprise analytics. Switch to the Accounts Hub or Single Account Cockpit to view immediate actionable risk interventions.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setCurrentView('detail')}
                  className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-fixed cursor-pointer border-0 shadow-md"
                >
                  View Apex Global Cockpit
                </button>
                <button
                  onClick={() => setCurrentView('portfolio')}
                  className="px-4 py-2 bg-[#2b5db3] text-on-surface font-semibold text-xs rounded-lg hover:bg-[#3a66bb] cursor-pointer border border-[#3858a6]"
                >
                  View Accounts Portfolio
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <AskAIModal
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
        currentAccountName={accountData?.name || selectedAccountName}
      />

      <PlaybookModal
        isOpen={isPlaybookModalOpen}
        onClose={() => setIsPlaybookModalOpen(false)}
        account={accountData}
        onTriggerPlaybook={handleTriggerPlaybook}
        isDispatching={isDispatchingPlaybook}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        account={accountData}
      />
    </div>
  );
}
