// Builds one account-shaped object out of every account, so the Cases and Opportunities views
// can render the portfolio-wide ("no account selected") data without a separate code path.
export const ALL_ACCOUNTS_NAME = 'All Accounts';

export function mergeAccounts(accounts) {
  const opportunities = [];
  const churnHistory = [];
  const cases = [];
  const history = [];
  const escalations = [];

  accounts.forEach(a => {
    const tag = (text) => a.name + ' — ' + text;
    const ops = a.opsData || {};
    (ops.opportunities || []).forEach(o => opportunities.push({ ...o, name: tag(o.name) }));
    (ops.churnHistory || []).forEach(c => churnHistory.push({ ...c, event: tag(c.event) }));

    const cd = a.casesData || {};
    (cd.cases || []).forEach(c => cases.push({ ...c, account: a.name, id: c.id, title: c.title }));
    (cd.history || []).forEach(h => history.push({ ...h, title: tag(h.title) }));
    (cd.escalations || []).forEach(e => escalations.push({ ...e, title: tag(e.title) }));
  });

  // "Upcoming renewal" is the next one due: that account's date, value and renewal sentiment
  const soonest = [...accounts].sort((x, y) => x.renewalDaysVal - y.renewalDaysVal)[0];
  const extras = (soonest && soonest.opsData && soonest.opsData.renewalExtras) || {
    sentiment: 'Neutral', score: null, champion: 'Not recorded', procurement: 'Not recorded', drivers: [],
  };

  return {
    name: ALL_ACCOUNTS_NAME,
    arrExact: soonest ? soonest.arrExact : '0',
    contractEnd: soonest ? soonest.contractEnd : '—',
    renewalDaysVal: soonest ? soonest.renewalDaysVal : null,
    opsData: {
      opportunities,
      churnHistory,
      renewalExtras: extras,
    },
    casesData: {
      cases, history, escalations,
      weeklyVolume: [],
      aggregates: null,
      ps: {
        engagement: 'Select an account', phase: '—', status: 'Completed', progress: null, pm: '—',
        nextMilestone: '—', budgetUsed: 0, note: 'Professional services status is tracked per account. Select an account to see it.',
      },
    },
  };
}
