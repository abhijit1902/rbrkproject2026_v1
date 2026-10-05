export const ACCOUNTS_DATA = {
  'Apex Global Logistics': {
    id: 'AGL-9942',
    name: 'Apex Global Logistics',
    status: 'Attention Required',
    statusType: 'error',
    tier: 'TIER 1 STRATEGIC',
    industry: 'Logistics & Freight',
    region: 'North America',
    since: 'Customer since 2021',
    csm: 'Daniela Reyes',
    arr: '$1.4M',
    arrExact: '$1,420,000',
    contractEnd: 'Dec 04, 2024',
    renewalWindowText: 'Renewal: in 12 days',
    renewalDaysVal: 12,
    renewalSub: 'Action Required',
    fiscalTag: 'Q4 FISCAL',
    yoy: '+6.4% YoY',
    totalContractValue: '$4,260,000 (3-Yr)',
    activeRiskFlagsSummary: '4 Critical Flags',
    productsRatio: '3 of 5',
    productsFilled: 3,
    execSponsor: 'Marcus Vance (CTO)',
    healthScore: '54/100',
    healthStatusTitle: 'Attention',
    healthStatusSub: 'Required',
    healthDonutColors: ['#3ECF8E', '#F2B84B', '#F4664A', '#3ECF8E', '#F2B84B', '#2DD4CF'],
    healthDimensions: [
      { label: 'Usage', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Adoption', val: 'Attention', color: '#F2B84B' },
      { label: 'Support', val: 'At Risk', color: '#F4664A' },
      { label: 'PS Services', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Engagement', val: 'Attention', color: '#F2B84B' },
      { label: 'Commercial', val: 'Healthy', color: '#2DD4CF' }
    ],
    renewalDetailHeader: 'URGENT',
    renewalDetailIcon: 'crisis_alert',
    riskTriggers: [
      { dotColor: '#F4664A', text: 'Product X usage down 18% (past 60 days)' },
      { dotColor: '#F4664A', text: '3 unresolved P1/P2 support cases' },
      { dotColor: '#F2B84B', text: 'PS engagement declining (Milestone 3 paused)' },
      { dotColor: '#F4664A', text: 'No executive sponsor contact in 45 days' }
    ],
    signalsSummary: {
      total: 4,
      risks: '2 Critical Churn Risks',
      warns: '1 Operational Warning',
      opps: '1 Expansion Upsell'
    },
    signalsList: [
      { dotColor: '#F4664A', title: 'Product X adoption decline (-18%)', sub: 'Telemetry delta: -420 WAU in 60d' },
      { dotColor: '#F4664A', title: 'Support case spike (3 P1/P2 cases)', sub: 'Avg response lag: 14.2h' },
      { dotColor: '#F2B84B', title: 'PS engagement drop (Milestone delayed)', sub: 'Migration sprint 4 paused' },
      { dotColor: '#3ECF8E', title: 'Product Y expansion opportunity', sub: '$120k add-on ARR qualified' }
    ],
    actionsOpenCount: 4,
    actionsConfidence: '82%',
    playbookTitle: 'Apex Churn Prevention Plan v2',
    playbookStep: 'Step 2 of 5',
    playbookProgress: 40,
    prescribedActions: [
      { id: 1, dept: 'CSM TEAM', deptColor: 'text-primary bg-primary/10', status: 'In Progress', statusColor: '#F2B84B', time: '2d ago', title: 'Schedule Product X adoption & enablement review', assignee: 'Assignee: Daniela Reyes', action: 'Review →' },
      { id: 2, dept: 'SUPPORT DESK', deptColor: 'text-[#F4664A] bg-[#F4664A]/15', status: 'Open (Blocker)', statusColor: '#F4664A', time: '1d ago', title: 'Escalate Ticket #89201 to Tier-3 engineering leads', assignee: 'Assignee: Dev Escalation Hub', action: 'Escalate →' },
      { id: 3, dept: 'PROF SERVICES', deptColor: 'text-secondary bg-secondary/15', status: 'Open', statusColor: '#58f1eb', time: '3d ago', title: 'Align deliverables for cloud migration milestone 3', assignee: 'Assignee: Kurt Alvarez (Arch)', action: 'Align →' },
      { id: 4, dept: 'RETENTION DESK', deptColor: 'text-[#F2B84B] bg-[#F2B84B]/15', status: 'Open', statusColor: '#58f1eb', time: '4d ago', title: 'Prepare executive concession & multi-year incentive', assignee: 'Assignee: VP Customer Retention', action: 'Draft →' }
    ],
    chartAnnotation: {
      header: '12d Ago: Spike Alert',
      body: 'Support case spike begins (3 P1/P2 cases opened)',
      riskPathD: 'M 0 130 Q 80 120, 150 115 T 280 100 T 360 40 T 430 30 T 500 25',
      riskAreaD: 'M 0 130 Q 80 120, 150 115 T 280 100 T 360 40 T 430 30 T 500 25 L 500 150 L 0 150 Z',
      oppPathD: 'M 0 140 Q 90 135, 180 110 T 310 95 T 410 105 T 500 110',
      oppAreaD: 'M 0 140 Q 90 135, 180 110 T 310 95 T 410 105 T 500 110 L 500 150 L 0 150 Z',
      c1: [360, 40],
      c2: [500, 25],
      c3: [410, 105],
      correlation: 'Correlation Coefficient: <strong>0.88</strong> between support tickets & license deactivations'
    },
    execSummary: 'Apex Global Logistics demonstrates resilient baseline core infrastructure telemetry, but Product X adoption has dropped 18% over the preceding 60 days, coinciding precisely with 3 unresolved high-priority (P1/P2) support cases. When combined with reduced Professional Services engagement on their primary cloud migration stream, this generates an acutely elevated renewal risk heading directly into the 12-day contract renewal window. While a potential $120k Product Y expansion exists in the pipeline, it does not currently offset the immediate $1.4M ARR renewal vulnerability without urgent technical and executive intervention.',
    sources: [
      { text: '4 signals' },
      { text: '7 evidence records' },
      { text: 'Zendesk #89201' }
    ],
    modelConfidence: 'High (88%)',
    similarAccounts: [
      { name: 'CloudScale Therapeutics', arr: '$820k ARR', match: '84% Vector Match', desc: 'Similar Product X decline pattern (-16%)', riskType: 'warning' },
      { name: 'Stratos Aerospace Systems', arr: '$650k ARR', match: '79% Vector Match', desc: 'Unresolved support escalation blocker', riskType: 'warning' },
      { name: 'OmniCorp Global', arr: '$1.84M ARR', match: '73% Vector Match', desc: 'Exec sponsor transition during renewal window', riskType: 'error' }
    ]
  },

  'CloudScale Therapeutics': {
    id: 'CST-4471',
    name: 'CloudScale Therapeutics',
    status: 'Watchlist (Monitoring)',
    statusType: 'warning',
    tier: 'TIER 2 STRATEGIC',
    industry: 'Biotech & Pharma',
    region: 'North America',
    since: 'Customer since 2022',
    csm: 'Marcus Yu',
    arr: '$820k',
    arrExact: '$820,000',
    contractEnd: 'Mar 18, 2025',
    renewalWindowText: 'Renewal: in 28 days',
    renewalDaysVal: 28,
    renewalSub: 'Watchlist Status',
    fiscalTag: 'Q1 FISCAL',
    yoy: '+4.2% YoY',
    totalContractValue: '$2,460,000 (3-Yr)',
    activeRiskFlagsSummary: '2 Risk Flags',
    productsRatio: '2 of 5',
    productsFilled: 2,
    execSponsor: 'Dr. Aris Vance (VP R&D)',
    healthScore: '76/100',
    healthStatusTitle: 'Monitoring',
    healthStatusSub: 'Stable Baseline',
    healthDonutColors: ['#3ECF8E', '#F2B84B', '#3ECF8E', '#3ECF8E', '#F2B84B', '#3ECF8E'],
    healthDimensions: [
      { label: 'Usage', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Adoption', val: 'Attention', color: '#F2B84B' },
      { label: 'Support', val: 'Healthy', color: '#3ECF8E' },
      { label: 'PS Services', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Engagement', val: 'Attention', color: '#F2B84B' },
      { label: 'Commercial', val: 'Healthy', color: '#3ECF8E' }
    ],
    renewalDetailHeader: 'MONITORING',
    renewalDetailIcon: 'visibility',
    riskTriggers: [
      { dotColor: '#F2B84B', text: 'Product X adoption 16% below cohort average (60 days)' },
      { dotColor: '#F2B84B', text: 'Feature adoption stalled since Q3 laboratory rollout' }
    ],
    signalsSummary: {
      total: 3,
      risks: '1 Critical Churn Risk',
      warns: '2 Operational Warnings',
      opps: '0 Expansion Upsell'
    },
    signalsList: [
      { dotColor: '#F4664A', title: 'Product X adoption delta (-16% vs cohort)', sub: 'Bio-informatics module license inactivity' },
      { dotColor: '#F2B84B', title: 'Support queue stability normal (0 P1 cases)', sub: 'SLA resolution time: 3.4h' },
      { dotColor: '#F2B84B', title: 'PS milestone check required', sub: 'Clinical trial connector implementation paused' }
    ],
    actionsOpenCount: 2,
    actionsConfidence: '89%',
    playbookTitle: 'CloudScale Feature Enablement Playbook',
    playbookStep: 'Step 1 of 4',
    playbookProgress: 25,
    prescribedActions: [
      { id: 1, dept: 'CSM TEAM', deptColor: 'text-primary bg-primary/10', status: 'Open', statusColor: '#58f1eb', time: '1d ago', title: 'Schedule feature enablement session with R&D team', assignee: 'Assignee: Marcus Yu', action: 'Schedule →' },
      { id: 2, dept: 'PROF SERVICES', deptColor: 'text-secondary bg-secondary/15', status: 'Pending Review', statusColor: '#F2B84B', time: '3d ago', title: 'Re-engage on stalled implementation milestone', assignee: 'Assignee: Sarah Jenkins', action: 'Re-engage →' }
    ],
    chartAnnotation: {
      header: '28d Window: Review Stalled',
      body: 'Adoption drop flagged across sequencing modules',
      riskPathD: 'M 0 110 Q 90 100, 180 95 T 310 90 T 380 75 T 450 70 T 500 65',
      riskAreaD: 'M 0 110 Q 90 100, 180 95 T 310 90 T 380 75 T 450 70 T 500 65 L 500 150 L 0 150 Z',
      oppPathD: 'M 0 130 Q 90 120, 180 100 T 310 85 T 410 70 T 500 60',
      oppAreaD: 'M 0 130 Q 90 120, 180 100 T 310 85 T 410 70 T 500 60 L 500 150 L 0 150 Z',
      c1: [380, 75],
      c2: [500, 65],
      c3: [410, 70],
      correlation: 'Correlation Coefficient: <strong>0.74</strong> between onboarding cadence & research team seat utilization'
    },
    execSummary: 'CloudScale Therapeutics demonstrates healthy operational stability with zero active P1/P2 support cases, but feature adoption across primary bioinformatics modeling modules is 16% lower than industry peers over the past 60 days. With the 28-day contract renewal checkpoint approaching, customer sentiment remains constructive under CSM Marcus Yu, though progress on the Clinical Trial Connector milestone has stalled. Early enablement sessions and an architectural review with Dr. Aris Vance (VP R&D) are expected to protect the full $820,000 ARR commitment without structural concession.',
    sources: [
      { text: '3 signals' },
      { text: '5 evidence records' },
      { text: 'Audit Log #CST-104' }
    ],
    modelConfidence: 'Very High (92%)',
    similarAccounts: [
      { name: 'Apex Global Logistics', arr: '$1.4M ARR', match: '84% Vector Match', desc: 'Product X adoption deceleration profile', riskType: 'error' },
      { name: 'Zenith Health', arr: '$940k ARR', match: '81% Vector Match', desc: 'Healthcare vertical regulatory compliance lag', riskType: 'warning' }
    ]
  },

  'Vertex FinTech Holdings': {
    id: 'VFH-3108',
    name: 'Vertex FinTech Holdings',
    status: 'Procurement In Review',
    statusType: 'warning',
    tier: 'TIER 1 STRATEGIC',
    industry: 'Financial Services',
    region: 'North America',
    since: 'Customer since 2020',
    csm: 'Elena Rostova',
    arr: '$2.1M',
    arrExact: '$2,100,000',
    contractEnd: 'Jan 22, 2025',
    renewalWindowText: 'Renewal: in 45 days',
    renewalDaysVal: 45,
    renewalSub: 'Audit Scheduled',
    fiscalTag: 'Q1 FISCAL',
    yoy: '+11.8% YoY',
    totalContractValue: '$6,300,000 (3-Yr)',
    activeRiskFlagsSummary: '2 Flags',
    productsRatio: '4 of 5',
    productsFilled: 4,
    execSponsor: 'David Kim (CIO)',
    healthScore: '68/100',
    healthStatusTitle: 'Security Audit',
    healthStatusSub: 'Pending Sign-off',
    healthDonutColors: ['#3ECF8E', '#3ECF8E', '#F2B84B', '#3ECF8E', '#F2B84B', '#2DD4CF'],
    healthDimensions: [
      { label: 'Usage', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Adoption', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Support', val: 'Attention', color: '#F2B84B' },
      { label: 'PS Services', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Engagement', val: 'Attention', color: '#F2B84B' },
      { label: 'Commercial', val: 'Healthy', color: '#2DD4CF' }
    ],
    renewalDetailHeader: 'REVIEWING',
    renewalDetailIcon: 'security',
    riskTriggers: [
      { dotColor: '#F2B84B', text: 'Procurement security vendor assessment pending 28 days' },
      { dotColor: '#F2B84B', text: 'API latency tickets reported in Frankfurt region' }
    ],
    signalsSummary: {
      total: 3,
      risks: '0 Critical Churn Risks',
      warns: '2 Operational Warnings',
      opps: '1 Expansion Upsell'
    },
    signalsList: [
      { dotColor: '#F2B84B', title: 'SOC-2 Type II audit report refresh requested', sub: 'Compliance security team blocker' },
      { dotColor: '#F2B84B', title: 'API gateway latency spike in EU-West', sub: 'p99 latency 240ms (+40ms)' },
      { dotColor: '#3ECF8E', title: 'Algorithmic trading module pilot expanding', sub: '+$350k pipeline opportunity' }
    ],
    actionsOpenCount: 3,
    actionsConfidence: '91%',
    playbookTitle: 'Vertex FinTech Multi-Year Renewal Security Playbook',
    playbookStep: 'Step 3 of 6',
    playbookProgress: 50,
    prescribedActions: [
      { id: 1, dept: 'SECURITY DESK', deptColor: 'text-primary bg-primary/10', status: 'In Review', statusColor: '#F2B84B', time: '1d ago', title: 'Deliver completed Cloud Security Whitepaper to InfoSec', assignee: 'Assignee: Security Compliance Lead', action: 'Submit →' },
      { id: 2, dept: 'INFRA TEAM', deptColor: 'text-[#F4664A] bg-[#F4664A]/15', status: 'In Progress', statusColor: '#F2B84B', time: '2d ago', title: 'Provision dedicated EU-Central direct connect routing', assignee: 'Assignee: Core Network SRE', action: 'Track →' }
    ],
    chartAnnotation: {
      header: '45d Window: Strong Usage',
      body: 'API volume up 34% with security review in progress',
      riskPathD: 'M 0 135 Q 90 130, 180 120 T 310 115 T 410 100 T 500 95',
      riskAreaD: 'M 0 135 Q 90 130, 180 120 T 310 115 T 410 100 T 500 95 L 500 150 L 0 150 Z',
      oppPathD: 'M 0 140 Q 90 110, 180 90 T 310 70 T 410 50 T 500 40',
      oppAreaD: 'M 0 140 Q 90 110, 180 90 T 310 70 T 410 50 T 500 40 L 500 150 L 0 150 Z',
      c1: [410, 100], c2: [500, 95], c3: [410, 50],
      correlation: 'Correlation Coefficient: <strong>0.92</strong> between API invocation volume & contract upsell readiness'
    },
    execSummary: 'Vertex FinTech Holdings maintains heavy production dependence on the platform with API call volumes hitting all-time highs (+34% YoY). The 45-day renewal is contingent primarily upon closing the pending InfoSec security questionnaire and optimizing Frankfurt gateway routing. Commercial terms for an expanded $2.45M 3-year agreement are drafted and well-received by CIO David Kim.',
    sources: [
      { text: '3 signals' },
      { text: '6 evidence records' },
      { text: 'Jira SEC-4912' }
    ],
    modelConfidence: 'High (91%)',
    similarAccounts: [
      { name: 'Apex Global Logistics', arr: '$1.4M ARR', match: '78% Vector Match', desc: 'Tier 1 enterprise strategic review cohort', riskType: 'error' }
    ]
  },

  'OmniCorp Global': {
    id: 'OCG-7729',
    name: 'OmniCorp Global',
    status: 'Executive Churn Risk',
    statusType: 'error',
    tier: 'TIER 1 STRATEGIC',
    industry: 'Conglomerate & Manufacturing',
    region: 'Europe / UK',
    since: 'Customer since 2019',
    csm: 'Claire Dupont',
    arr: '$1.84M',
    arrExact: '$1,840,000',
    contractEnd: 'Dec 11, 2024',
    renewalWindowText: 'Renewal: in 19 days',
    renewalDaysVal: 19,
    renewalSub: 'Executive Alert',
    fiscalTag: 'Q4 FISCAL',
    yoy: '-2.1% YoY',
    totalContractValue: '$5,520,000 (3-Yr)',
    activeRiskFlagsSummary: '3 Critical Flags',
    productsRatio: '3 of 5',
    productsFilled: 3,
    execSponsor: 'Departed (Former VP Operations)',
    healthScore: '48/100',
    healthStatusTitle: 'Severe Risk',
    healthStatusSub: 'Sponsor Vacancy',
    healthDonutColors: ['#3ECF8E', '#F2B84B', '#F4664A', '#F4664A', '#F4664A', '#F2B84B'],
    healthDimensions: [
      { label: 'Usage', val: 'Healthy', color: '#3ECF8E' },
      { label: 'Adoption', val: 'Attention', color: '#F2B84B' },
      { label: 'Support', val: 'At Risk', color: '#F4664A' },
      { label: 'PS Services', val: 'At Risk', color: '#F4664A' },
      { label: 'Engagement', val: 'At Risk', color: '#F4664A' },
      { label: 'Commercial', val: 'Attention', color: '#F2B84B' }
    ],
    renewalDetailHeader: 'CRITICAL',
    renewalDetailIcon: 'warning',
    riskTriggers: [
      { dotColor: '#F4664A', text: 'Executive sponsor departed without official successor introduction' },
      { dotColor: '#F4664A', text: 'Corporate procurement consolidation evaluating 2 alternate vendors' },
      { dotColor: '#F2B84B', text: 'Contract renewal term expired on standard 30-day grace' }
    ],
    signalsSummary: {
      total: 4,
      risks: '3 Critical Churn Risks',
      warns: '1 Operational Warning',
      opps: '0 Expansion Upsell'
    },
    signalsList: [
      { dotColor: '#F4664A', title: 'Executive sponsor departure confirmed', sub: 'Last contact logged 52 days ago' },
      { dotColor: '#F4664A', title: 'Procurement consolidation RFP received', sub: 'Evaluating competitor pricing' },
      { dotColor: '#F4664A', title: 'Usage concentration limited to single division', sub: 'Expansion halted pending leadership' }
    ],
    actionsOpenCount: 4,
    actionsConfidence: '94%',
    playbookTitle: 'Executive Succession & Retention Rescue Playbook',
    playbookStep: 'Step 1 of 5',
    playbookProgress: 20,
    prescribedActions: [
      { id: 1, dept: 'EXECUTIVE SUITE', deptColor: 'text-error bg-error/15', status: 'Immediate Action', statusColor: '#F4664A', time: 'Just now', title: 'CEO-to-CEO introduction call request for new Head of Ops', assignee: 'Assignee: Chief Customer Officer', action: 'Initiate →' },
      { id: 2, dept: 'RETENTION DESK', deptColor: 'text-[#F2B84B] bg-[#F2B84B]/15', status: 'In Review', statusColor: '#F2B84B', time: '1d ago', title: 'Prepare ROI proof of value package detailing $3.2M realized savings', assignee: 'Assignee: Value Engineering', action: 'Assemble →' }
    ],
    chartAnnotation: {
      header: '19d Window: Critical Cliff',
      body: 'Abrupt drop in leadership steering committee check-ins',
      riskPathD: 'M 0 120 Q 80 110, 150 90 T 280 60 T 360 30 T 430 20 T 500 15',
      riskAreaD: 'M 0 120 Q 80 110, 150 90 T 280 60 T 360 30 T 430 20 T 500 15 L 500 150 L 0 150 Z',
      oppPathD: 'M 0 145 Q 90 145, 180 145 T 310 140 T 410 140 T 500 140',
      oppAreaD: 'M 0 145 Q 90 145, 180 145 T 310 140 T 410 140 T 500 140 L 500 150 L 0 150 Z',
      c1: [360, 30], c2: [500, 15], c3: [410, 140],
      correlation: 'Correlation Coefficient: <strong>0.95</strong> between executive stakeholder vacancy & non-renewal rate'
    },
    execSummary: 'OmniCorp Global presents our highest immediate ARR churn liability ($1.84M). Following the departure of VP Operations in October, communication with procurement has turned competitive due to a vendor consolidation mandate. Immediate intervention by our executive team with value engineering metrics is imperative within the next 72 hours.',
    sources: [
      { text: '4 signals' },
      { text: '9 evidence records' },
      { text: 'Board Risk Register' }
    ],
    modelConfidence: 'Extremely High (94%)',
    similarAccounts: [
      { name: 'Apex Global Logistics', arr: '$1.4M ARR', match: '73% Vector Match', desc: 'Sponsor disengagement risk archetype', riskType: 'error' }
    ]
  }
};

export const ALL_ACCOUNTS_LIST = [
  { name: 'Apex Global Logistics', arr: '$1.4M ARR', status: 'red', tier: 'Tier 1 Strategic', industry: 'Logistics & Freight', renewalDays: 12 },
  { name: 'CloudScale Therapeutics', arr: '$820k ARR', status: 'amber', tier: 'Tier 2 Strategic', industry: 'Biotech & Pharma', renewalDays: 28 },
  { name: 'Vertex FinTech Holdings', arr: '$2.1M ARR', status: 'amber', tier: 'Tier 1 Strategic', industry: 'Financial Services', renewalDays: 45 },
  { name: 'Stratos Aerospace Systems', arr: '$650k ARR', status: 'green', tier: 'Tier 2 Enterprise', industry: 'Aerospace & Defense', renewalDays: 88 },
  { name: 'OmniCorp Global', arr: '$1.84M ARR', status: 'red', tier: 'Tier 1 Strategic', industry: 'Conglomerates', renewalDays: 19 },
  { name: 'Hyperion Data', arr: '$1.21M ARR', status: 'amber', tier: 'Tier 2 Enterprise', industry: 'Cloud Infrastructure', renewalDays: 52 },
  { name: 'Zenith Health', arr: '$940k ARR', status: 'amber', tier: 'Tier 2 Enterprise', industry: 'Healthcare Systems', renewalDays: 34 },
  { name: 'Nordic Energy', arr: '$680k ARR', status: 'green', tier: 'Tier 3 Enterprise', industry: 'CleanTech & Utilities', renewalDays: 120 },
  { name: 'Kestrel Media', arr: '$420k ARR', status: 'amber', tier: 'Tier 3 Growth', industry: 'Digital Media & Streaming', renewalDays: 61 },
  { name: 'Meridian Retail Group', arr: '$1.1M ARR', status: 'green', tier: 'Tier 2 Enterprise', industry: 'Omnichannel Retail', renewalDays: 140 }
];

export const PORTFOLIO_DATA = {
  totalArr: '$248.6M',
  totalArrExact: '$248,600,000',
  arrYoy: '+14.2% YoY',
  portfolioHealthAvg: '78.4 / 100',
  healthAvgDelta: '+2.1 pts vs Q3',
  renewalArrExposed: '$18.9M',
  renewalAccountsCount: '14 Accounts < 30d',
  openPrescriptionsCount: '48 Items',
  activePlaybooksCount: '8 Active Playbooks',
  healthBreakdown: {
    totalAccounts: 340,
    healthy: { count: 248, percentage: 73, label: 'Healthy (Score > 80)' },
    attention: { count: 64, percentage: 19, label: 'Attention / Watchlist' },
    critical: { count: 28, percentage: 8, label: 'Critical Risk' }
  },
  riskPrioritizedAccounts: [
    {
      name: 'Apex Global Logistics',
      arr: '$1.40M ARR',
      renewalTag: '12d Renewal',
      tier: 'Tier 1',
      summary: '3 P1 cases open • Product X down 18% • Sponsor non-responsive',
      statusColor: '#F4664A'
    },
    {
      name: 'CloudScale Therapeutics',
      arr: '$820k ARR',
      renewalTag: '28d Renewal',
      tier: 'Tier 2',
      summary: 'Feature adoption stalled • Product X -16% vs cohort • Normal support',
      statusColor: '#F2B84B'
    },
    {
      name: 'OmniCorp Global',
      arr: '$1.84M ARR',
      renewalTag: '19d Renewal',
      tier: 'Tier 1',
      summary: 'Exec sponsor departure • Licensing contract consolidation review',
      statusColor: '#F4664A'
    },
    {
      name: 'Vertex FinTech Holdings',
      arr: '$2.10M ARR',
      renewalTag: '45d Renewal',
      tier: 'Tier 1',
      summary: 'Procurement security review pending • API latency complaints',
      statusColor: '#F2B84B'
    }
  ]
};

export const USAGE_ADOPTION_DATA = {
  portfolio: {
    totalActiveUsers: '38,420 WAU',
    wauGrowth: '+9.4% MoM',
    licenseUtilization: '86.2%',
    totalLicenses: 48500,
    activeLicenses: 41800,
    dormantLicenses: 6700,
    dauMauRatio: '68.4%',
    compositeAdoptionScore: '74 / 100',
    adoptionTrend: '+3.2 pts',
    reclaimOpportunity: '$420,000 ARR',
    products: [
      { id: 'px', name: 'Product X (Core Analytics)', activeUsers: '14,200 WAU', activeSeats: 16800, totalSeats: 22000, utilization: 76, growth: '-4.2%', status: 'warning', statusLabel: 'Stalled', desc: 'Anomaly detected in 3 major enterprise accounts' },
      { id: 'py', name: 'Product Y (Cloud Telemetry Connector)', activeUsers: '11,400 WAU', activeSeats: 12200, totalSeats: 13500, utilization: 90, growth: '+18.6%', status: 'healthy', statusLabel: 'Accelerating', desc: 'Strong adoption across North American tech accounts' },
      { id: 'wf', name: 'Workflow Automations Hub', activeUsers: '7,800 WAU', activeSeats: 8100, totalSeats: 9200, utilization: 88, growth: '+12.1%', status: 'healthy', statusLabel: 'Healthy', desc: 'Trigger executions up 35% across operations pods' },
      { id: 'sec', name: 'Security & Governance Shield', activeUsers: '5,020 WAU', activeSeats: 4700, totalSeats: 5800, utilization: 81, growth: '+6.4%', status: 'healthy', statusLabel: 'Stable', desc: 'SOC2 & HIPAA reporting automations enabled' }
    ]
  },
  accounts: {
    'Apex Global Logistics': {
      accountName: 'Apex Global Logistics',
      accountId: 'AGL-9942',
      arr: '$1.4M ARR',
      renewalDaysVal: 12,
      wau: '1,420 WAU',
      wauDelta: '-18.4% in 60d',
      wauDeltaType: 'error',
      licenseUtilization: '65.0%',
      activeSeats: 520,
      totalSeats: 800,
      dormantSeats: 280,
      dauMauRatio: '42.1%',
      stickinessStatus: 'At Risk',
      featureDepthScore: '58 / 100',
      featureDepthDelta: '-8 pts vs Cohort',
      dormantArrExposure: '$180,000',
      products: [
        { name: 'Product X (Core Telemetry)', activeSeats: 320, totalSeats: 500, utilization: 64, change: '-18%', changeType: 'error', status: 'At Risk', healthColor: '#F4664A', alert: 'Active sessions plummeted after v4.2 update; 3 P1 support tickets linked' },
        { name: 'Product Y (Expansion Connector)', activeSeats: 140, totalSeats: 150, utilization: 93, change: '+12%', changeType: 'healthy', status: 'Healthy', healthColor: '#3ECF8E', alert: 'High demand from field logistics operations' },
        { name: 'Automation Workflows', activeSeats: 60, totalSeats: 150, utilization: 40, change: '-9%', changeType: 'warning', status: 'Attention', healthColor: '#F2B84B', alert: 'Milestone 3 paused on migration pipeline' }
      ],
      weeklyUsageTrend: [
        { week: 'W1', apex: 1740, cohortAvg: 1650, target: 1800 },
        { week: 'W2', apex: 1720, cohortAvg: 1670, target: 1800 },
        { week: 'W3', apex: 1680, cohortAvg: 1680, target: 1800 },
        { week: 'W4', apex: 1610, cohortAvg: 1700, target: 1800 },
        { week: 'W5', apex: 1540, cohortAvg: 1720, target: 1800 },
        { week: 'W6', apex: 1490, cohortAvg: 1730, target: 1800 },
        { week: 'W7', apex: 1450, cohortAvg: 1750, target: 1800 },
        { week: 'W8', apex: 1420, cohortAvg: 1760, target: 1800 }
      ],
      featuresMatrix: [
        { feature: 'Fleet Tracking Dashboard', module: 'Product X', adoptionPct: 88, cohortPct: 92, status: 'Healthy', freq: 'Daily', timeSpent: '42m/session' },
        { feature: 'Automated Route Dispatcher', module: 'Product X', adoptionPct: 44, cohortPct: 76, status: 'Critical Drop', freq: 'Weekly', timeSpent: '12m/session', isAnomaly: true },
        { feature: 'Custom Telemetry Webhooks', module: 'Product Y', adoptionPct: 82, cohortPct: 68, status: 'Outperforming', freq: 'Daily', timeSpent: '58m/session' },
        { feature: 'ERP Data Sync Pipe', module: 'Workflows', adoptionPct: 35, cohortPct: 65, status: 'Stalled', freq: 'Bi-weekly', timeSpent: '8m/session', isAnomaly: true },
        { feature: 'Anomaly Notification Feeds', module: 'Product X', adoptionPct: 52, cohortPct: 70, status: 'Lagging', freq: 'Weekly', timeSpent: '15m/session' }
      ],
      adoptionAnomalies: [
        { date: '12d ago', title: 'Route Dispatcher Session Crash Anomaly', impact: '-420 WAU Impact', desc: 'Dispatcher active sessions fell 46% within 48h of v4.2 gateway migration. Triggered Zendesk #89201.', severity: 'CRITICAL', color: '#F4664A' },
        { date: '24d ago', title: 'ERP Sync Ingestion Pause', impact: 'Milestone Paused', desc: 'Sync pipeline execution rate dropped 32% due to authentication credential expiry.', severity: 'WARNING', color: '#F2B84B' },
        { date: '35d ago', title: 'Logistics Field App Adoption Spike', impact: '+140 Active Users', desc: 'Terminal operators in Dallas hub activated mobile telemetry scanner.', severity: 'OPPORTUNITY', color: '#3ECF8E' }
      ]
    },
    'CloudScale Therapeutics': {
      accountName: 'CloudScale Therapeutics',
      accountId: 'CST-4471',
      arr: '$820k ARR',
      renewalDaysVal: 28,
      wau: '680 WAU',
      wauDelta: '-16.0% vs Cohort',
      wauDeltaType: 'warning',
      licenseUtilization: '74.0%',
      activeSeats: 370,
      totalSeats: 500,
      dormantSeats: 130,
      dauMauRatio: '54.2%',
      stickinessStatus: 'Watchlist',
      featureDepthScore: '66 / 100',
      featureDepthDelta: '-12 pts vs Cohort',
      dormantArrExposure: '$65,000',
      products: [
        { name: 'Product X (Core Analytics)', activeSeats: 260, totalSeats: 350, utilization: 74, change: '-16%', changeType: 'warning', status: 'Attention', healthColor: '#F2B84B', alert: 'Bioinformatics lab seat inactivity post-Q3 rollout' },
        { name: 'Clinical Trial Connector', activeSeats: 110, totalSeats: 150, utilization: 73, change: '+4%', changeType: 'healthy', status: 'Healthy', healthColor: '#3ECF8E', alert: 'Active trial data feeding correctly' }
      ],
      weeklyUsageTrend: [
        { week: 'W1', apex: 810, cohortAvg: 720, target: 800 },
        { week: 'W2', apex: 790, cohortAvg: 730, target: 800 },
        { week: 'W3', apex: 760, cohortAvg: 740, target: 800 },
        { week: 'W4', apex: 730, cohortAvg: 750, target: 800 },
        { week: 'W5', apex: 710, cohortAvg: 760, target: 800 },
        { week: 'W6', apex: 695, cohortAvg: 770, target: 800 },
        { week: 'W7', apex: 685, cohortAvg: 780, target: 800 },
        { week: 'W8', apex: 680, cohortAvg: 790, target: 800 }
      ],
      featuresMatrix: [
        { feature: 'Genomic Sequence Analyzer', module: 'Product X', adoptionPct: 62, cohortPct: 82, status: 'Lagging', freq: 'Weekly', timeSpent: '25m/session', isAnomaly: true },
        { feature: 'Clinical Trial Ingestion', module: 'Connector', adoptionPct: 78, cohortPct: 70, status: 'Healthy', freq: 'Daily', timeSpent: '48m/session' }
      ],
      adoptionAnomalies: [
        { date: '18d ago', title: 'Genomics Modeling Seat Disuse', impact: '-65 Active Researchers', desc: '15 lead researchers stopped logging in following protocol adjustment.', severity: 'WARNING', color: '#F2B84B' }
      ]
    }
  }
};

