export const STATUSES = ['Open', 'In Progress', 'Waiting on Customer', 'Resolved'];
export const TEAMS = ['Support', 'CS', 'Renewal'];

export const TEAM_COLORS = { Support: '#f59e0b', CS: '#66cfee', Renewal: '#34d399' };

export const STATUS_COLORS = {
  Open: '#ff6b6b',
  'In Progress': '#66cfee',
  'Waiting on Customer': '#a78bfa',
  Resolved: '#34d399',
};

export const SEVERITY_COLORS = { P1: '#ff6b6b', P2: '#f59e0b', P3: '#a78bfa', P4: '#9db4e2' };

export const HISTORY_TYPES = {
  Call: { icon: 'call', color: '#66cfee' },
  Email: { icon: 'mail', color: '#9db4e2' },
  QBR: { icon: 'event_available', color: '#a78bfa' },
  Ticket: { icon: 'confirmation_number', color: '#f59e0b' },
  Escalation: { icon: 'priority_high', color: '#ff6b6b' },
  Renewal: { icon: 'event_repeat', color: '#34d399' },
  Onboarding: { icon: 'rocket_launch', color: '#66cfee' },
  Executive: { icon: 'person_off', color: '#ff6b6b' },
};

export const WEEKLY_VOLUME = [
  { week: 'W1', opened: 14, resolved: 12 },
  { week: 'W2', opened: 18, resolved: 15 },
  { week: 'W3', opened: 12, resolved: 14 },
  { week: 'W4', opened: 21, resolved: 16 },
  { week: 'W5', opened: 17, resolved: 18 },
  { week: 'W6', opened: 24, resolved: 19 },
  { week: 'W7', opened: 19, resolved: 20 },
  { week: 'W8', opened: 16, resolved: 17 },
];

const mk = (account, c) => ({ account, csat: null, ...c });

const EMPTY = {
  cases: [], history: [], escalations: [], weeklyVolume: [], aggregates: null,
  ps: { engagement: 'No PS engagement', phase: '—', status: 'Completed', progress: null, pm: '—', nextMilestone: '—', budgetUsed: 0, note: 'No PS data for this account.' },
};

// Cases, history, escalations, PS status and weekly volume come from the account record
export function getCasesData(accountOrName) {
  const isObj = accountOrName && typeof accountOrName === 'object';
  const accountName = isObj ? accountOrName.name : accountOrName;
  const d = isObj && accountOrName.casesData ? accountOrName.casesData : EMPTY;
  return { ...EMPTY, ...d, escalations: d.escalations || [], cases: (d.cases || []).map(c => mk(accountName, c)) };
}

export function buildCaseSummary(accountName, cases, ps, escalations, aggregates) {
  const open = cases.filter(c => c.status !== 'Resolved');
  const parts = [];
  if (aggregates) {
    const o = aggregates.open;
    parts.push(
      accountName + ' has ' + o.total + ' open cases: ' + o.support + ' support (' + o.p1 + ' P1, ' + o.p2 + ' P2, ' + o.p3 + ' P3), ' +
      o.renewal + ' renewal and ' + o.retention + ' retention. SLA compliance was not available.'
    );
    const l = aggregates.last90;
    parts.push(
      l.created + ' support cases were created in the last 90 days (' + l.p1 + ' P1, ' + l.p2 + ' P2, ' + l.p3 + ' P3, ' + l.p4 + ' P4), ' +
      'with an average resolution time of about ' + l.avgResolutionDays + ' days.'
    );
    const top = aggregates.recurring[0];
    if (top) parts.push('The most recurring issue is ' + top.issue + ' (' + top.cases + ' cases' + (top.open != null ? ', ' + top.open + ' still open' : '') + ').');
  } else {
    const p1 = open.filter(c => c.severity === 'P1').length;
    const breached = open.filter(c => c.slaHoursLeft != null && c.slaHoursLeft < 0).length;
    const byTeam = TEAMS.map(t => t + ' ' + open.filter(c => c.team === t).length).join(', ');
    parts.push(
      accountName + ' has ' + open.length + ' open ' + (open.length === 1 ? 'case' : 'cases') + ' (' + byTeam + ')' +
      (p1 ? ', including ' + p1 + ' P1' : '') + (breached ? ' and ' + breached + ' past SLA.' : ' with all within SLA.')
    );
  }
  if (escalations.length) {
    parts.push(escalations.length + ' recorded ' + (escalations.length === 1 ? 'escalation' : 'escalations') + ', the most senior at ' + escalations[0].level.toLowerCase() + ' level.');
  } else {
    parts.push('No active escalations.');
  }
  parts.push(
    'Professional services is ' + ps.status.toLowerCase() +
    (ps.progress != null ? ' at ' + ps.phase.toLowerCase() + ' (' + ps.progress + '% complete).' : (ps.hoursTotal ? ' with ' + ps.hoursUsed + ' of ' + ps.hoursTotal + ' hours used.' : '.'))
  );
  const renewalOpen = aggregates ? aggregates.open.renewal + aggregates.open.retention : open.filter(c => c.team === 'Renewal').length;
  if (renewalOpen) parts.push(renewalOpen + ' renewal-related ' + (renewalOpen === 1 ? 'case needs' : 'cases need') + ' attention before the renewal date.');
  return parts.join(' ');
}

export const slaLabel = (hours, status) => {
  if (status === 'Resolved') return 'Resolved';
  if (hours == null) return 'SLA not pulled';
  const abs = Math.abs(hours);
  const span = abs >= 72 ? Math.round(abs / 24) + 'd' : abs + 'h';
  if (hours < 0) return span + ' over SLA';
  return hours === 0 ? 'Due now' : span + ' left';
};

export const dayLabel = (days) => (days === 0 ? 'Today' : days === 1 ? '1 day ago' : days + ' days ago');
