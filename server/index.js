import express from 'express';
import cors from 'cors';
import { ACCOUNTS_DATA, ALL_ACCOUNTS_LIST, PORTFOLIO_DATA, USAGE_ADOPTION_DATA } from './data.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory runtime state for playbook triggers and actions
const activePlaybooks = new Map();
const userFeedback = [];

// Helper to synthesize account fallback data
function getSynthesizedAccount(accountName) {
  const hash = accountName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const arrNum = (0.5 + (hash % 20) / 10).toFixed(1);
  const daysNum = 15 + (hash % 60);

  return {
    id: 'ACC-' + (1000 + (hash % 9000)),
    name: accountName,
    status: daysNum < 25 ? 'Attention Required' : 'Active Monitoring',
    statusType: daysNum < 25 ? 'error' : 'warning',
    tier: (hash % 2 === 0) ? 'TIER 1 STRATEGIC' : 'TIER 2 ENTERPRISE',
    industry: 'Enterprise Software & Cloud',
    region: 'North America',
    since: 'Customer since ' + (2020 + (hash % 4)),
    csm: 'Strategic Accounts Team',
    arr: `$${arrNum}M`,
    arrExact: `$${(parseFloat(arrNum) * 1000000).toLocaleString()}`,
    contractEnd: 'Feb 15, 2025',
    renewalWindowText: `Renewal: in ${daysNum} days`,
    renewalDaysVal: daysNum,
    renewalSub: daysNum < 25 ? 'Urgent Action Required' : 'Review Scheduled',
    fiscalTag: 'Q1 FISCAL',
    yoy: '+5.4% YoY',
    totalContractValue: `$${(parseFloat(arrNum) * 3).toFixed(1)}M (3-Yr)`,
    activeRiskFlagsSummary: daysNum < 25 ? '3 Risk Flags' : '1 Risk Flag',
    productsRatio: '3 of 5',
    productsFilled: 3,
    execSponsor: 'VP Technology & Operations',
    healthScore: `${55 + (hash % 35)}/100`,
    healthStatusTitle: daysNum < 25 ? 'Attention' : 'Stable',
    healthStatusSub: daysNum < 25 ? 'Required' : 'Baseline',
    healthDonutColors: ['#3ECF8E', '#F2B84B', daysNum < 25 ? '#F4664A' : '#3ECF8E', '#3ECF8E', '#F2B84B', '#2DD4CF'],
    healthDimensions: [
      { label: 'Usage', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Adoption', val: 'Attention', color: '#F2B84B' },
      { label: 'Support', val: daysNum < 25 ? 'At Risk' : 'Healthy', color: daysNum < 25 ? '#F4664A' : '#3ECF8E' },
      { label: 'PS Services', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Engagement', val: 'Attention', color: '#F2B84B' },
      { label: 'Commercial', val: 'Healthy', color: '#2DD4CF' }
    ],
    renewalDetailHeader: daysNum < 25 ? 'URGENT' : 'MONITORING',
    renewalDetailIcon: daysNum < 25 ? 'crisis_alert' : 'fact_check',
    riskTriggers: [
      { dotColor: daysNum < 25 ? '#F4664A' : '#F2B84B', text: `Product adoption velocity shifted (-${10 + (hash % 12)}% in 60d)` },
      { dotColor: '#F2B84B', text: 'Renewal review cadence milestone pending approval' }
    ],
    signalsSummary: {
      total: 3,
      risks: daysNum < 25 ? '2 Critical Churn Risks' : '1 Operational Risk',
      warns: '1 Operational Warning',
      opps: '1 Expansion Upsell'
    },
    signalsList: [
      { dotColor: daysNum < 25 ? '#F4664A' : '#F2B84B', title: 'Platform engagement baseline shift', sub: 'Active telemetry monitored' },
      { dotColor: '#3ECF8E', title: 'Additional seat expansion qualified', sub: 'Pipeline opportunity logged in SFDC' }
    ],
    actionsOpenCount: 3,
    actionsConfidence: '87%',
    playbookTitle: `${accountName} Renewal & Retention Playbook`,
    playbookStep: 'Step 1 of 4',
    playbookProgress: 25,
    prescribedActions: [
      { id: 1, dept: 'CSM TEAM', deptColor: 'text-primary bg-primary/10', status: 'Open', statusColor: '#58f1eb', time: '1d ago', title: 'Conduct quarterly executive telemetry alignment', assignee: 'Assignee: CSM Pod', action: 'Schedule →' },
      { id: 2, dept: 'SUPPORT DESK', deptColor: 'text-[#F4664A] bg-[#F4664A]/15', status: 'In Review', statusColor: '#F2B84B', time: '3d ago', title: 'Review open technical tickets and SLA trends', assignee: 'Assignee: Support Tier-2', action: 'Inspect →' }
    ],
    chartAnnotation: {
      header: `${daysNum}d Window: Telemetry Check`,
      body: 'Standard enterprise baseline telemetry observed',
      riskPathD: 'M 0 120 Q 80 115, 160 110 T 300 100 T 400 95 T 500 90',
      riskAreaD: 'M 0 120 Q 80 115, 160 110 T 300 100 T 400 95 T 500 90 L 500 150 L 0 150 Z',
      oppPathD: 'M 0 140 Q 90 125, 180 110 T 310 90 T 410 80 T 500 70',
      oppAreaD: 'M 0 140 Q 90 125, 180 110 T 310 90 T 410 80 T 500 70 L 500 150 L 0 150 Z',
      c1: [300, 100], c2: [500, 90], c3: [410, 80],
      correlation: 'Correlation Coefficient: <strong>0.82</strong> between weekly usage & retention renewal probability'
    },
    execSummary: `${accountName} demonstrates consistent core telemetry. With the ${daysNum}-day renewal window approaching, active monitoring and execution of the prescribed playbook items are recommended to protect the $${arrNum}M ARR contract.`,
    sources: [
      { text: '3 telemetry signals' },
      { text: '5 audit records' }
    ],
    modelConfidence: 'High (87%)',
    similarAccounts: [
      { name: 'Apex Global Logistics', arr: '$1.4M ARR', match: '81% Vector Match', desc: 'Analogous contract renewal timing', riskType: 'error' }
    ]
  };
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GET list of accounts with optional search filter
app.get('/api/accounts', (req, res) => {
  const query = (req.query.search || '').toLowerCase().trim();
  let results = ALL_ACCOUNTS_LIST;
  if (query) {
    results = ALL_ACCOUNTS_LIST.filter(acc => 
      acc.name.toLowerCase().includes(query) || 
      acc.arr.toLowerCase().includes(query) ||
      acc.industry.toLowerCase().includes(query)
    );
  }
  res.json({ accounts: results });
});

// GET single account detail
app.get('/api/accounts/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const account = ACCOUNTS_DATA[name] || getSynthesizedAccount(name);
  
  // Overlay runtime playbook status if active
  if (activePlaybooks.has(name)) {
    const runtime = activePlaybooks.get(name);
    account.playbookStep = runtime.currentStep;
    account.playbookProgress = runtime.progress;
    account.isPlaybookDispatched = true;
  }
  
  res.json({ account });
});

// GET portfolio stats
app.get('/api/portfolio', (req, res) => {
  res.json({ portfolio: PORTFOLIO_DATA });
});

// GET usage & adoption portfolio or account
app.get('/api/usage', (req, res) => {
  res.json({ usage: USAGE_ADOPTION_DATA.portfolio });
});

app.get('/api/usage/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const accountUsage = USAGE_ADOPTION_DATA.accounts[name] || {
    accountName: name,
    accountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
    arr: '$1.1M ARR',
    renewalDaysVal: 42,
    wau: '950 WAU',
    wauDelta: '+4.2% in 60d',
    wauDeltaType: 'healthy',
    licenseUtilization: '78.0%',
    activeSeats: 390,
    totalSeats: 500,
    dormantSeats: 110,
    dauMauRatio: '62.0%',
    stickinessStatus: 'Stable',
    featureDepthScore: '72 / 100',
    featureDepthDelta: '+2 pts vs Cohort',
    dormantArrExposure: '$45,000',
    products: [
      { name: 'Core Analytics Suite', activeSeats: 280, totalSeats: 350, utilization: 80, change: '+5%', changeType: 'healthy', status: 'Healthy', healthColor: '#3ECF8E', alert: 'Normal baseline activity' },
      { name: 'API Gateway Connector', activeSeats: 110, totalSeats: 150, utilization: 73, change: '+2%', changeType: 'healthy', status: 'Healthy', healthColor: '#3ECF8E', alert: 'Steady invocation volume' }
    ],
    weeklyUsageTrend: [
      { week: 'W1', apex: 900, cohortAvg: 880, target: 950 },
      { week: 'W2', apex: 910, cohortAvg: 890, target: 950 },
      { week: 'W3', apex: 920, cohortAvg: 900, target: 950 },
      { week: 'W4', apex: 935, cohortAvg: 905, target: 950 },
      { week: 'W5', apex: 940, cohortAvg: 910, target: 950 },
      { week: 'W6', apex: 945, cohortAvg: 915, target: 950 },
      { week: 'W7', apex: 948, cohortAvg: 920, target: 950 },
      { week: 'W8', apex: 950, cohortAvg: 925, target: 950 }
    ],
    featuresMatrix: [
      { feature: 'Dashboard Reports', module: 'Analytics', adoptionPct: 84, cohortPct: 80, status: 'Healthy', freq: 'Daily', timeSpent: '35m/session' },
      { feature: 'Automated Exports', module: 'API', adoptionPct: 70, cohortPct: 65, status: 'Healthy', freq: 'Weekly', timeSpent: '18m/session' }
    ],
    adoptionAnomalies: [
      { date: '14d ago', title: 'Telemetry Ingestion Rate Normal', impact: 'Steady', desc: 'No unusual telemetry anomalies flagged in rolling window.', severity: 'STABLE', color: '#3ECF8E' }
    ]
  };

  res.json({ usage: accountUsage });
});

// POST Trigger Playbook
app.post('/api/playbook/trigger', (req, res) => {
  const { accountName } = req.body;
  if (!accountName) {
    return res.status(400).json({ error: 'accountName is required' });
  }

  const execution = {
    id: 'EXE-' + Date.now(),
    accountName,
    triggeredAt: new Date().toISOString(),
    status: 'ACTIVE_DISPATCHED',
    currentStep: 'Step 3 of 5 (Execution in flight)',
    progress: 60,
    steps: [
      { name: 'Telemetry Anomaly Triage', status: 'Completed', timestamp: 'Just now' },
      { name: 'Cross-functional Dispatch Notification', status: 'Completed', timestamp: 'Just now' },
      { name: 'Executive Alignment Briefing', status: 'In Progress', timestamp: 'Active' },
      { name: 'Contract Concession Package Prep', status: 'Pending', timestamp: 'Queued' },
      { name: 'Automated Post-Mortem & SFDC Sync', status: 'Pending', timestamp: 'Queued' }
    ]
  };

  activePlaybooks.set(accountName, execution);

  res.json({
    success: true,
    message: `Playbook successfully dispatched for ${accountName}`,
    execution
  });
});

// POST Ask AI Query
app.post('/api/ask-ai', (req, res) => {
  const { question, accountName } = req.body;
  const currentAccount = ACCOUNTS_DATA[accountName] || getSynthesizedAccount(accountName || 'Apex Global Logistics');
  
  const q = (question || '').toLowerCase();
  let answer = '';

  if (q.includes('arr') || q.includes('revenue') || q.includes('value')) {
    answer = `${currentAccount.name} has a Current ARR of ${currentAccount.arrExact} (${currentAccount.yoy}) with a Total 3-Year Contract Value of ${currentAccount.totalContractValue}. Total portfolio monitored ARR is $248.6M across 340 enterprise accounts.`;
  } else if (q.includes('risk') || q.includes('churn') || q.includes('critical')) {
    answer = `Risk assessment for ${currentAccount.name}: Health Score is ${currentAccount.healthScore} (${currentAccount.status}). Key risk triggers include: ${currentAccount.riskTriggers.map(t => t.text).join('; ')}. Immediate executive intervention is recommended before the ${currentAccount.renewalDaysVal}-day renewal deadline.`;
  } else if (q.includes('renewal') || q.includes('days') || q.includes('expire')) {
    answer = `Contract renewal for ${currentAccount.name} is in ${currentAccount.renewalDaysVal} days (${currentAccount.contractEnd}). Across the portfolio, $18.9M in ARR is currently in the 30-day renewal window (14 accounts).`;
  } else if (q.includes('playbook') || q.includes('action') || q.includes('next')) {
    answer = `Active Playbook: "${currentAccount.playbookTitle}". Top prescribed action item: "${currentAccount.prescribedActions[0]?.title}" assigned to ${currentAccount.prescribedActions[0]?.assignee}. AI Model Confidence: ${currentAccount.actionsConfidence}.`;
  } else {
    answer = `Telemetry synthesis for ${currentAccount.name}: Health score is ${currentAccount.healthScore} with ${currentAccount.activeRiskFlagsSummary}. CSM ${currentAccount.csm} is monitoring ${currentAccount.signalsSummary.total} signals. Executive summary: ${currentAccount.execSummary}`;
  }

  res.json({
    answer,
    accountName: currentAccount.name,
    timestamp: new Date().toISOString()
  });
});

// POST feedback
app.post('/api/feedback', (req, res) => {
  const { accountName, type, comments } = req.body;
  userFeedback.push({ accountName, type, comments, timestamp: new Date().toISOString() });
  res.json({ success: true, count: userFeedback.length });
});

// GET risk & signals summary
app.get('/api/risk-signals', (req, res) => {
  res.json({
    summary: {
      criticalCount: 4,
      atRiskArr: '3.2',
      activeEscalations: 7,
      expansionOpps: '8.5',
      avgHealthScore: 64,
    },
    signals: [
      { type: 'critical', account: 'Apex Global Logistics', message: 'Usage dropped 62% WAU', time: '8m ago' },
      { type: 'critical', account: 'CloudScale Therapeutics', message: 'Executive sponsor departed', time: '41m ago' },
      { type: 'warning', account: 'Vertex FinTech Holdings', message: 'P1 SLA breached', time: '1h ago' },
    ],
    lastUpdated: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Customer Intelligence API Server running on port ${PORT}`);
});
