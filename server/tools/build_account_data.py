#!/usr/bin/env python3
"""Convert Customer_Intelligence_Account_Data.docx into server/data/accounts.json.

Usage: python3 server/tools/build_account_data.py <input.docx> server/data/accounts.json
Dates are measured against AS_OF (the document says data is as of Oct 5, 2026).
"""
import sys, re, json
from datetime import datetime, date
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from parse_docx import parse

AS_OF = datetime(2026, 10, 5, 9, 0)
COLORS = {'red': '#F4664A', 'amber': '#F2B84B', 'info': '#66cfee', 'teal': '#66cfee', 'green': '#3ECF8E'}
DIM_COLORS = {'Healthy': '#3ECF8E', 'Attention': '#F2B84B', 'At Risk': '#F4664A'}


def money(s):
    s = str(s).replace('$', '').replace(',', '').strip()
    neg = s.startswith('-')
    s = s.lstrip('-')
    return -int(float(s)) if neg else int(float(s))


def d(s):
    return datetime.strptime(s.strip(), '%b %d, %Y')


def days_ago(s):
    return (AS_OF.date() - d(s).date()).days


def kv(items):
    out = {}
    for it in items:
        if ': ' in it['text']:
            k, v = it['text'].split(': ', 1)
            out[k.strip()] = v.strip()
        elif it['text'].endswith(':'):
            out[it['text'][:-1]] = it
    return out


def sect(acct, prefix):
    for t, s in acct['sections'].items():
        if t.startswith(prefix):
            return s
    return {'blocks': []}


def block(sec, label):
    for b in sec['blocks']:
        if b['label'] == label:
            return b
    return {'items': [], 'notes': []}


def first_items(sec):
    return [i for b in sec['blocks'] for i in b['items']]


def split_tone(text):
    if ' — ' in text:
        a, b = text.rsplit(' — ', 1)
        return a.strip(), b.strip()
    return text, 'info'


def build_account(acct):
    name = acct['name']
    # ---------- 1. master
    m = kv(first_items(sect(acct, '1.')))
    ratio = m['Products owned']
    a_, b_ = [int(x) for x in re.findall(r'\d+', ratio)[:2]]
    filled = a_ if b_ == 5 else round(a_ / b_ * 5)
    def person(s):
        if s in (None, '', 'None'):
            return None
        if ', ' in s:
            n, e = s.rsplit(', ', 1)
            return {'name': n.strip(), 'email': e.strip()}
        return {'name': s, 'email': None}
    ae, se = person(m.get('Account Executive')), person(m.get('Sales Engineer'))
    days = int(m['Renewal days remaining'])

    # ---------- 2. health
    h = kv(first_items(sect(acct, '2.')))
    title, _, sub = h['Health status'].partition(' / ')
    dims = [{'label': k, 'val': h[k], 'color': DIM_COLORS.get(h[k], '#9db4e2')}
            for k in ['Usage', 'Adoption', 'Support', 'PS Services', 'Engagement', 'Commercial']]

    # ---------- 3. renewal & risk
    r3 = kv(first_items(sect(acct, '3.')))
    triggers = []
    for c in r3['Risk triggers']['children']:
        t, tone = split_tone(c['text'])
        triggers.append({'dotColor': COLORS.get(tone, '#66cfee'), 'text': t})
    risk_register = []
    for c in (r3.get('Risk history') or {'children': []})['children']:
        mm = re.match(r'^(RP-\d+): (.*?), (High|Medium|Low), (.*?), (.*), (Valid|Invalid|Snoozed[^.]*|Pending Approval|Mitigated)\. Created (.*?)(?:, closed (.*?))?\.$', c['text'])
        if mm:
            risk_register.append({'id': mm[1], 'status': mm[2], 'severity': mm[3], 'riskType': mm[4], 'category': mm[5],
                                  'validity': mm[6], 'created': mm[7], 'closed': mm[8]})
        else:
            risk_register.append({'id': c['text'].split(':')[0], 'raw': c['text']})

    # ---------- 4. signals
    s4 = kv(first_items(sect(acct, '4.')))
    summ = {'risks': '', 'warns': '', 'opps': ''}
    for part in s4['Signals summary'].split(', '):
        if 'Churn' in part: summ['risks'] = part
        elif 'Warning' in part: summ['warns'] = part
        elif 'Expansion' in part: summ['opps'] = part
    summ['total'] = int(s4['Signals total'])
    signals = []
    for c in s4['Signal list']['children']:
        mm = re.match(r'^(.*)\. Sub-text: (.*)\. Severity: (\w+)$', c['text'])
        signals.append({'dotColor': COLORS.get(mm[3], '#66cfee'), 'title': mm[1], 'sub': mm[2]})
    conf = s4['Model confidence']
    pct = re.search(r'(\d+)%', conf)

    # ---------- 5. telemetry series
    series, ann = [], []
    s5 = sect(acct, '5.')
    corr = ''
    for it in first_items(s5):
        t = it['text']
        mm = re.match(r'^([A-Z][a-z]{2} \d+): (\d+), (\d+)$', t)
        if mm:
            series.append({'date': mm[1], 'risk': int(mm[2]), 'opp': int(mm[3])}); continue
        mm = re.match(r'^Annotation \(([A-Z][a-z]{2} \d+), (\d+)d ago: ([^)]+)\): (.*)$', t)
        if mm:
            ann.append({'date': mm[1], 'daysAgo': int(mm[2]), 'header': mm[3], 'body': mm[4]}); continue
        if t.startswith('Correlation text: '):
            corr = t[len('Correlation text: '):]

    # ---------- 6. exec summary
    s6 = kv(first_items(sect(acct, '6.')))
    sources = [{'text': x.strip()} for x in s6['Sources'].split(', ')]

    # ---------- 7. portfolio rows
    s7 = kv(first_items(sect(acct, '7.')))
    pr = kv(s7['Risk-prioritized accounts entry']['children'])
    hub_parts = s7['Hub filter and selector entry'].split(', ')

    # ---------- 12. risk page
    s12 = kv(first_items(sect(acct, '12.')))
    ar = kv(s12['At-risk accounts entry']['children'])
    sf = kv(s12['Signal feed entry']['children'])
    arr_health = re.match(r'(\$[\d.]+[MK]), health (\d+)', ar['ARR and health'])
    risk_row = {
        'name': name, 'id': m['Account ID'], 'tier': m['Tier'].replace(' STRATEGIC', '').title().replace('Tier 1', 'TIER 1').replace('Tier 2', 'TIER 2'),
        'arr': arr_health[1], 'healthScore': int(arr_health[2]),
        'riskLevel': ar['Risk level'], 'topSignals': ar['Top signals'],
        'csm': ar['CSM'], 'renewalDays': int(re.search(r'\d+', ar['Renewal'])[0]),
        'churnProb': int(re.search(r'\d+', ar['Churn probability'])[0]),
        'playbookActive': ar['Playbook active'].lower().startswith('y'),
    }
    signal_feed = {
        'id': sf['ID'], 'severity': sf['Severity'], 'category': sf['Category'], 'title': sf['Title'],
        'account': name, 'accountId': m['Account ID'], 'message': sf['Message'], 'time': sf['Time'],
        'unread': sf['Unread'].lower().startswith('y'),
    }

    # ---------- 13. notifications
    s13 = sect(acct, '13.')
    notifs = []
    for it in first_items(s13):
        if it['text'].startswith('Notifications'):
            for c in it['children']:
                mm = re.match(r'^(.*?): (.*) \((critical|warning|info), (.*)\)$', c['text'])
                if mm:
                    notifs.append({'account': mm[1], 'text': mm[2], 'severity': mm[3], 'time': mm[4]})
    unread = int(re.search(r'\d+', kv(first_items(s13)).get('Unread count', '0'))[0])

    # ---------- 8. usage
    s8 = sect(acct, '8.')
    k = kv(block(s8, 'KPIs')['items'])
    wau_delta = re.match(r'^(.*) \((\w+)\)$', k['WAU change'])
    seats = re.match(r'^([\d,]+) active of ([\d,]+) total, ([\d,]+) dormant', k['Seats'])
    dau = k['DAU/MAU'].split(', ')
    fd = re.match(r'^(\d+)/100, (.*)$', k['Feature depth score'])
    num = lambda x: int(str(x).replace(',', ''))
    trend = []
    for it in block(s8, 'Weekly usage trend')['items']:
        mm = re.match(r'^(W\d+): ([\d,]+), ([\d,]+), ([\d,]+)$', it['text'])
        trend.append({'week': mm[1], 'apex': num(mm[2]), 'cohortAvg': num(mm[3]), 'target': num(mm[4])})
    products = []
    for it in block(s8, 'Products')['items']:
        pname, rest = it['text'].split(': Activated: ', 1)
        act = rest.startswith('Yes')
        note = re.search(r'Expansion note: (.*)$', rest)
        stat = re.search(r'Status: ([^.]+)\.', rest)
        ins = re.search(r'Insight: (.*?)(?: Expansion note:|$)', rest)
        us = re.search(r'([\d,]+) of ([\d,]+) (TB|users), (\d+)%, ([+-]\d+)% vs prior period', rest)
        prod = {'name': pname, 'activated': act, 'purchased': bool(us), 'status': stat[1] if stat else 'Not Activated'}
        if us:
            prod.update({'activeSeats': num(us[1]), 'totalSeats': num(us[2]), 'unit': us[3], 'utilization': int(us[4]),
                         'change': us[5] + '%', 'changeType': 'healthy' if us[5].startswith('+') and us[5] != '+0' else ('neutral' if us[5] in ('+0', '-0') else 'error')})
        else:
            prod.update({'activeSeats': 0, 'totalSeats': 0, 'unit': 'seats', 'utilization': 0, 'change': '—', 'changeType': 'neutral'})
        prod['alert'] = ins[1].strip() if ins else (note[1] if note else None)
        prod['expansionNote'] = note[1] if note else None
        prod['healthColor'] = {'Healthy': '#3ECF8E', 'Attention': '#F2B84B', 'At Risk': '#F4664A'}.get(prod['status'], '#9db4e2')
        products.append(prod)
    feats = []
    for it in block(s8, 'Feature adoption matrix')['items']:
        mm = re.match(r'^(.*) \((.+?)\): (\d+)% account vs (\d+)% cohort\. (.+?), (.+?), (.+?)\. Anomaly: (Yes|No)\.?$', it['text'])
        feats.append({'feature': mm[1], 'module': mm[2], 'adoptionPct': int(mm[3]), 'cohortPct': int(mm[4]),
                      'status': mm[5], 'freq': mm[6], 'timeSpent': mm[7], 'isAnomaly': mm[8] == 'Yes'})
    anoms = []
    for it in block(s8, 'Telemetry anomalies and alerts')['items']:
        mm = re.match(r'^(\d+)d ago: (.*?): (CRITICAL|WARNING|INFO), (\w+)\. Impact: (.*?)\. (.*)$', it['text'])
        anoms.append({'date': mm[1] + 'd ago', 'title': mm[2], 'severity': mm[3], 'color': COLORS.get(mm[4], '#66cfee'),
                      'impact': mm[5], 'desc': mm[6]})
    usage = {
        'accountName': name, 'accountId': m['Account ID'], 'arr': m['ARR (short)'] + ' ARR', 'renewalDaysVal': days,
        'wau': k['Weekly active users'], 'wauDelta': wau_delta[1], 'wauDeltaType': {'error': 'error', 'warning': 'warning', 'healthy': 'healthy'}.get(wau_delta[2], 'healthy'),
        'licenseUtilization': k['License utilization'] if k['License utilization'].endswith('%') else k['License utilization'],
        'activeSeats': num(seats[1]), 'totalSeats': num(seats[2]), 'dormantSeats': num(seats[3]),
        'dauMauRatio': dau[0], 'stickinessStatus': dau[1], 'featureDepthScore': fd[1] + ' / 100', 'featureDepthDelta': fd[2],
        'dormantArrExposure': k['Dormant ARR exposure'],
        'products': products, 'weeklyUsageTrend': trend, 'featuresMatrix': feats, 'adoptionAnomalies': anoms,
    }
    if not usage['licenseUtilization'].endswith('%'):
        usage['licenseUtilization'] += '%'

    # ---------- 9. cases
    s9 = sect(acct, '9.')
    activity = {}
    for it in block(s9, 'Case activity')['items']:
        mm = re.match(r'^(\d+), (.*?), ([A-Z][a-z]{2} \d+, \d{4} \d+:\d+): (.*)$', it['text'])
        if mm:
            activity.setdefault(mm[1], []).append({'author': mm[2], 'time': mm[3], 'text': mm[4], '_t': datetime.strptime(mm[3], '%b %d, %Y %H:%M')})
    cases = []
    for it in block(s9, 'Cases')['items']:
        cid, ctitle = it['text'].split(': ', 1)
        meta = it['children'][0]['text'].split(', ')
        sev = meta.pop(0) if re.match(r'^P\d$', meta[0]) else None
        status, team = meta[0], meta[1]
        owner = meta[-1]
        category = ', '.join(meta[2:-1])
        life = it['children'][1]['text']
        mo = re.match(r'^Opened (.*?\d{4})\.', life)
        opened = mo[1]
        case = {'id': cid, 'title': ctitle, 'severity': sev, 'status': status, 'team': 'Renewal' if team == 'Retention' else team,
                'kind': team, 'category': ('Retention' if team == 'Retention' else category), 'subcategory': category, 'owner': owner,
                'openedDays': days_ago(opened), 'openedLabel': opened}
        ms = re.search(r'SLA due (.*?\d{4} \d+:\d+)', life)
        if ms:
            due = datetime.strptime(ms[1], '%b %d, %Y %H:%M')
            case['slaDue'] = ms[1]
            case['slaHoursLeft'] = int((due - AS_OF).total_seconds() // 3600)
        else:
            case['slaHoursLeft'] = 0
            mc = re.search(r'CSAT (\d), resolved in (\d+) hours', life)
            if mc:
                case['csat'] = int(mc[1]); case['resolutionHours'] = int(mc[2])
        ups = sorted(activity.get(cid, []), key=lambda u: u['_t'], reverse=True)
        case['updates'] = [{'author': u['author'], 'time': u['time'], 'text': u['text']} for u in ups]
        cases.append(case)
    TPL = ['High-priority support case opened.', 'Retention risk opened for mitigation.', 'Renewal process started.', 'PS engagement kickoff.',
           'Account sync with customer team. Reviewed open cases and adoption.', 'Roadmap, renewal timeline and success plan.']
    history = []
    for it in block(s9, 'Interaction history')['items']:
        mm = re.match(r'^(H-\d+), (\w+), (\w+): (.*)$', it['text'])
        body = mm[4]
        tail = re.search(r', ([A-Z][a-z]{2} \d+, \d{4})$', body)
        when = tail[1]
        body = body[:tail.start()]
        who = None
        desc = ''
        ttl = body
        for tpl in TPL:
            idx = body.find(tpl)
            if idx > 0:
                ttl = body[:idx].rstrip(' .')
                desc = tpl
                who = body[idx + len(tpl):].strip()
                break
        if who is None:
            ttl, _, rest = body.partition('. ')
            who = rest.rsplit('. ', 1)[-1]
            desc = rest[:-len(who)].strip() if rest.endswith(who) else rest
        history.append({'id': mm[1], 'type': mm[2], 'team': mm[3], 'title': ttl, 'desc': desc, 'who': who, 'daysAgo': days_ago(when), 'dateLabel': when})
    escal = []
    for it in block(s9, 'Escalations')['items']:
        if it['children']:
            eid, etitle = it['text'].split(': ', 1)
            ek = kv(it['children'])
            escal.append({'id': eid, 'title': etitle, 'level': ek['Level'], 'owner': ek['Owner'], 'sinceDays': days_ago(ek['Opened']),
                          'openedLabel': ek['Opened'], 'status': ek['Status'], 'next': ek['Next step']})
    psk = kv(block(s9, 'PS status')['items'])
    ps = {'engagement': psk['Engagement name'], 'phase': psk['Phase'], 'status': psk['Status'], 'pm': psk['PS project manager'],
          'nextMilestone': psk['Next milestone'], 'note': psk['Status note'],
          'progress': int(psk['Progress'].rstrip('%')), 'budgetUsed': int(psk['Budget used'].rstrip('%'))}
    weekly = []
    for it in block(s9, 'Weekly case volume')['items']:
        mm = re.match(r'^(W\d+): (\d+), (\d+)$', it['text'])
        weekly.append({'week': mm[1], 'opened': int(mm[2]), 'resolved': int(mm[3])})
    cases_data = {'cases': cases, 'history': history, 'escalations': escal, 'ps': ps, 'weeklyVolume': weekly, 'aggregates': None}

    # ---------- 10. opportunities
    s10 = sect(acct, '10.')
    opps = []
    for it in block(s10, 'Opportunities')['items']:
        oid, oname = it['text'].split(': ', 1)
        p0 = it['children'][0]['text'].split(', ')
        otype = p0[0]
        value = money(p0[1])
        status = p0[2]
        opp = {'id': oid, 'name': oname, 'type': otype, 'value': value, 'status': status}
        if status == 'Open':
            opp['stage'] = p0[3]; opp['probability'] = int(p0[4].rstrip('%'))
        else:
            opp['stage'] = 'Closed Won' if status == 'Won' else 'Closed Lost'; opp['probability'] = 100 if status == 'Won' else 0
        for c in it['children'][1:]:
            t = c['text']
            mm = re.match(r'^(Close|Closed) (.*?\d{4}), (.*)$', t)
            if mm:
                opp['closeLabel'] = mm[2]; opp['owner'] = mm[3]
            elif t.startswith('Next step: '):
                opp['nextStep'] = t[11:]
            elif t.startswith('Expansion signal: '):
                opp['signal'] = t[18:]
            elif t.startswith('Lost reason: '):
                opp['lostReason'] = t[13:]
        opps.append(opp)
    churn = []
    for it in block(s10, 'Churn history')['items']:
        mm = re.match(r'^(.*?), ([^,:]+): \$(-?[\d,]+)\. (.*?)(?: Recovered: (Yes|No)\.)?$', it['text'], flags=re.S)
        if mm:
            churn.append({'period': mm[1], 'event': mm[2], 'amount': money(mm[3]), 'reason': mm[4], 'recovered': mm[5] == 'Yes'})
    sk = kv(block(s10, 'Renewal sentiment')['items'])
    sm = re.match(r'^(.*), score (\d+)/100$', sk['Sentiment'])
    drivers = []
    for c in sk['Sentiment drivers']['children']:
        t, tone = split_tone(c['text'])
        drivers.append({'label': t, 'tone': tone})
    ops_data = {'opportunities': opps, 'churnHistory': churn,
                'renewalExtras': {'sentiment': sm[1], 'score': int(sm[2]), 'champion': sk['Renewal champion'],
                                  'procurement': sk['Procurement status'], 'drivers': drivers}}

    # ---------- assemble account object
    pa = re.search(r'(\d+)', pr['Renewal tag'])
    account = {
        'id': m['Account ID'], 'name': name, 'status': m['Status label'], 'statusType': m['Status type'],
        'tier': m['Tier'], 'industry': m['Industry'], 'region': m['Region'], 'since': 'Customer since ' + m['Customer since'],
        'csm': m['CSM name'], 'arr': m['ARR (short)'], 'arrExact': m['ARR (exact)'], 'contractEnd': m['Contract end date'],
        'renewalWindowText': m['Renewal window text'], 'renewalDaysVal': days, 'renewalSub': m['Renewal sub-label'],
        'fiscalTag': m['Fiscal quarter tag'], 'yoy': m['YoY ARR growth'], 'totalContractValue': m['TCV'],
        'activeRiskFlagsSummary': m['Active risk flags summary'], 'productsRatio': ratio, 'productsFilled': filled,
        'execSponsor': m['Executive sponsor'], 'renewalOwner': m['Renewal owner'],
        'parentCompany': None if m['Parent company'] == 'None' else m['Parent company'],
        'ae': ae, 'se': se,
        'healthScore': h['Health score'], 'healthStatusTitle': title, 'healthStatusSub': sub,
        'healthDonutColors': [x['color'] for x in dims], 'healthDimensions': dims,
        'renewalDetailHeader': r3['Renewal detail header'], 'renewalDetailIcon': 'crisis_alert' if r3['Renewal detail header'] == 'URGENT' else 'fact_check',
        'riskTriggers': triggers, 'riskRegister': risk_register,
        'signalsSummary': summ, 'signalsList': signals,
        'actionsOpenCount': int(s4['Open prescriptions']), 'actionsConfidence': (pct[1] + '%') if pct else conf,
        'modelConfidence': conf, 'playbookTitle': s4['Active playbook'], 'playbookStep': s4['Playbook step'],
        'playbookProgress': int(s4['Playbook progress'].rstrip('%')), 'prescribedActions': [],
        'telemetrySeries': series, 'telemetryAnnotations': ann, 'telemetryCorrelation': corr,
        'execSummary': s6['Narrative'], 'sources': sources, 'generatedLabel': s6['Generated'], 'similarAccounts': [],
        'casesData': cases_data, 'opsData': ops_data,
    }
    hub = {'name': name, 'arr': m['ARR (short)'] + ' ARR', 'status': pr['Status color'], 'statusLabel': m['Status label'],
           'tier': m['Tier'].title().replace('Strategic', 'Strategic'), 'industry': m['Industry'], 'renewalDays': days}
    portfolio_row = {'name': name, 'arr': pr['ARR'] + ' ARR', 'renewalTag': pr['Renewal tag'], 'tier': pr['Tier'],
                     'summary': pr['Summary'], 'statusColor': COLORS.get(pr['Status color'], '#F2B84B'), 'statusName': pr['Status color']}
    return {'account': account, 'usage': usage, 'hub': hub, 'portfolioRow': portfolio_row, 'riskRow': risk_row,
            'signalFeed': signal_feed, 'notifications': notifs, 'unreadCount': unread}


def main(src, dst):
    tree = parse(src)
    out = [build_account(a) for a in tree]
    json.dump(out, open(dst, 'w'), indent=1, ensure_ascii=False)
    for o in out:
        a, u = o['account'], o['usage']
        c, p = a['casesData'], a['opsData']
        print('%-42s trend=%d prod=%d feat=%d anom=%d | cases=%d hist=%d esc=%d wk=%d | opps=%d churn=%d drivers=%d | series=%d ann=%d sig=%d risks=%d notif=%d' % (
            a['name'][:42], len(u['weeklyUsageTrend']), len(u['products']), len(u['featuresMatrix']), len(u['adoptionAnomalies']),
            len(c['cases']), len(c['history']), len(c['escalations']), len(c['weeklyVolume']),
            len(p['opportunities']), len(p['churnHistory']), len(p['renewalExtras']['drivers']),
            len(a['telemetrySeries']), len(a['telemetryAnnotations']), len(a['signalsList']), len(a['riskRegister']), len(o['notifications'])))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
