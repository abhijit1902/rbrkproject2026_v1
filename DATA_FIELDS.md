# Data Fields Needed for the UI

Every value below is **placeholder data today**. This file lists each field the UI shows, grouped by data table, so you can supply real values.

**Suggested format:** one sheet (or JSON array) per table, keyed by `Account ID` so rows can be joined. Fields marked **(computed)** are derived by the app and do not need to be supplied.

Legend: "Shown on" tells you which page and card the field appears in.

---

## 1. Account master (one row per account)

| Field | Example | Shown on |
|---|---|---|
| Account ID | `AGL-9942` | Account Detail breadcrumb, Cases/Ops/Account 360 |
| Account name | `Apex Global Logistics` | Everywhere; header account selector |
| Status label | `Attention Required` / `Active Monitoring` | Account Detail header pill |
| Status type | `error` / `warning` / `healthy` | Header pill color |
| Hub status color | `red` / `amber` / `green` | Accounts Hub list |
| Tier | `TIER 1 STRATEGIC` | Account Detail header, Accounts Hub |
| Industry | `Logistics & Freight` | Account Detail header |
| Region | `North America` | Header, Basic Account Details |
| Customer since (year) | `2021` | Header, Basic Account Details |
| CSM name | `Daniela Reyes` | Account Detail header, Account 360 |
| ARR (short) | `$1.4M` | Header, selector dropdown, Accounts Hub |
| ARR (exact) | `$1,420,000` | Header "Current ARR", Renewal card |
| Contract end date | `Dec 04, 2024` | Header "Contract End", Renewal card, Ops renewal |
| Renewal days remaining | `12` **(computed from contract end)** | Renewal countdown, Action Center steps |
| Renewal window text | `Renewal: in 12 days` **(computed)** | Header |
| Renewal sub-label | `Action Required` | Account Snapshot |
| Fiscal quarter tag | `Q4 FISCAL` | Account Snapshot |
| YoY ARR growth | `+6.4% YoY` | Account Snapshot |
| TCV (with term) | `$4,260,000 (3-Yr)` | Account Snapshot, Basic Account Details |
| Products owned | `3 of 5` (+ count filled) | Account Snapshot |
| Active risk flags summary | `4 Critical Flags` | Account Snapshot |
| Executive sponsor (name, title) | `Marcus Vance (CTO)` | Account Snapshot |
| Parent company (or none) | `CloudScale Holdings Group` | Basic Account Details |
| Account Executive (AE) name + email | `Jordan Mills`, `jordan.mills@rubrik.com` | Basic Account Details, Account 360 |
| Sales Engineer (SE) name + email | `Priya Nair`, `priya.nair@rubrik.com` | Basic Account Details, Account 360 |

## 2. Account health (one row per account)

You said you will provide the health logic later. These are the outputs the UI needs.

| Field | Example | Shown on |
|---|---|---|
| Health score (/100) | `54/100` | Health Breakdown card, Action Center |
| Health status title + sub | `Attention` / `Required` | Donut center, Action Center tile |
| Dimension: Usage | `Healthy` / `Attention` / `At Risk` | Health Breakdown (6 rows) |
| Dimension: Adoption | same | same |
| Dimension: Support | same | same |
| Dimension: PS Services | same | same |
| Dimension: Engagement | same | same |
| Dimension: Commercial | same | same |

Donut segment colors are **(computed)** from the dimension statuses.

## 3. Renewal & risk detail (per account)

| Field | Example | Shown on |
|---|---|---|
| Renewal detail header | `URGENT` / `MONITORING` | Renewal & Risk Detail card |
| Risk triggers (list: text + severity) | `Product X usage down 18% (past 60 days)`, red | Renewal & Risk Detail |

## 4. Account signals and playbook (per account)

| Field | Example | Shown on |
|---|---|---|
| Signals total count | `4` **(computed)** | Signals for This Account donut |
| Signals summary labels | `2 Critical Churn Risks`, `1 Operational Warning`, `1 Expansion Upsell` | Signals card legend |
| Signal list (title, sub-text, severity) | `Product X adoption decline (-18%)`, `Telemetry delta: -420 WAU in 60d`, red | Signals card |
| Open prescriptions count | `4` | Recommended Actions card |
| Model confidence | `82%` / `High (88%)` | Recommended Actions, Executive Summary |
| Active playbook title | `Apex Churn Prevention Plan v2` | Recommended Actions |
| Playbook current step | `Step 2 of 5` | same |
| Playbook progress % | `40` | same |

## 5. Telemetry velocity chart (per account, 90 days)

Currently hand-drawn SVG paths. Real data needed:

| Field | Example |
|---|---|
| Daily/weekly date | `2024-10-01` |
| Risk-signal value | number per date |
| Opportunity-signal value | number per date |
| Spike annotation: date, headline, description | `12d ago: Spike Alert`, `Support case spike begins (3 P1/P2 cases opened)` |
| Correlation text | `0.88 between support tickets & license deactivations` |

## 6. Executive summary (per account)

| Field | Example |
|---|---|
| Summary narrative | one paragraph |
| Source list | `4 signals`, `7 evidence records`, `Zendesk #89201` |
| Generated-at label | `14m ago` |

## 7. Portfolio dashboard (Accounts Hub)

| Field | Example |
|---|---|
| Total monitored ARR | `$248.6M` (+ exact) |
| ARR YoY | `+14.2% YoY` |
| Portfolio health average + delta | `78.4 / 100`, `+2.1 pts vs Q3` |
| ARR in renewal window | `$18.9M`, `14 Accounts < 30d` |
| Open AI prescriptions | `48 Items`, `8 Active Playbooks` |
| Health breakdown: total accounts | `340` |
| Healthy / Attention / Critical: count, %, label | `248`, `73`, `Healthy (Score > 80)` |
| Risk-prioritized accounts (name, ARR, renewal tag, tier, one-line summary, status color) | `Apex Global Logistics`, `$1.40M ARR`, `12d Renewal`, `Tier 1`, `3 P1 cases open • Product X down 18%`, red |
| Accounts list for hub filter chips and header selector (name, ARR, status, tier, industry, renewal days) | see Account master |

## 8. Usage & adoption (per account)

**KPIs**

| Field | Example |
|---|---|
| Weekly active users | `1,420 WAU` |
| WAU change + direction | `-18.4% in 60d`, `error` |
| License utilization | `65.0%` |
| Active seats / total seats / dormant seats | `520` / `800` / `280` |
| DAU/MAU (stickiness) + status | `42.1%`, `At Risk` |
| Feature depth score + delta vs cohort | `58 / 100`, `-8 pts vs Cohort` |
| Dormant ARR exposure | `$180,000` |

**Weekly usage trend (8 rows)**

| Field | Example |
|---|---|
| Week label | `W1` |
| Account WAU | `1740` |
| Cohort average WAU | `1650` |
| Contract target WAU | `1800` |

**Products (one row per product, including products not activated)**

| Field | Example |
|---|---|
| Product name | `Product X (Core Telemetry)` |
| Activated? | `Yes` / `No` |
| Active seats / purchased seats | `320` / `500` |
| Utilization % | `64` **(computed from seats)** |
| Change vs prior period | `-18%` |
| Status | `At Risk` / `Attention` / `Healthy` |
| Telemetry insight (short text) | `Active sessions plummeted after v4.2 update` |
| Expansion note (if not activated) | `Not purchased; potential expansion candidate` |

**Granular feature adoption matrix**

| Field | Example |
|---|---|
| Feature name | `Automated Route Dispatcher` |
| Module / product | `Product X` |
| Account adoption % | `44` |
| Cohort adoption % | `76` |
| Status | `Healthy` / `Lagging` / `Stalled` / `Critical Drop` / `Outperforming` |
| Frequency | `Daily` / `Weekly` |
| Avg session time | `12m/session` |
| Anomaly flag | `true` / `false` |

**Telemetry anomalies and alerts**

| Field | Example |
|---|---|
| Date / age | `12d ago` |
| Title | `Route Dispatcher Session Crash Anomaly` |
| Impact | `-420 WAU Impact` |
| Description | sentence |
| Severity + color | `CRITICAL`, red |

The **AI Usage Summary** text is generated from the fields above and needs no input.

## 9. Cases & History (per account)

**Cases (one row per case)**

| Field | Example |
|---|---|
| Case ID | `CS-4821` |
| Title | `API timeouts across all modules in EU cluster` |
| Severity | `P1` / `P2` / `P3` |
| Status | `Open` / `In Progress` / `Waiting on Customer` / `Resolved` |
| Team | `Support` / `CS` / `Renewal` |
| Category | `Performance`, `Billing`, `Commercial` ... |
| Owner | `Sarah Chen` |
| Opened date | `2024-11-20` (days open is **computed**) |
| SLA due time (hours left is **computed**) | timestamp |
| CSAT (1-5, resolved cases only) | `4` |
| Resolution hours (resolved only) | `22` |

**Case activity (many rows per case):** case ID, author, timestamp, note text.

**Interaction history (one row per event)**

| Field | Example |
|---|---|
| Event ID | `H-1` |
| Type | `Call`, `Email`, `QBR`, `Ticket`, `Escalation`, `Renewal`, `Onboarding`, `Executive` |
| Team | `Support` / `CS` / `Renewal` |
| Title | `Health check call with VP Operations` |
| Description | sentence |
| Who | `Daniela Reyes` |
| Date | `2024-11-13` |

**Escalation details (one row per escalation)**

| Field | Example |
|---|---|
| Escalation ID | `ESC-001` |
| Title | `EU cluster API outage` |
| Level | `Executive` / `Management` / `Engineering` |
| Owner | `Sarah Chen` |
| Opened date | days open **computed** |
| Status | `Active`, `Investigating` |
| Next step | `Root-cause report due in 24h` |

**PS (Professional Services) status (one row per account)**

| Field | Example |
|---|---|
| Engagement name | `Platform Migration to v4.2` |
| Phase / milestone | `Milestone 3 of 5` |
| Status | `On Track` / `At Risk` / `Paused` / `Delayed` / `Completed` |
| Progress % | `55` |
| PS project manager | `Callum Ward` |
| Next milestone | `Data validation sign-off` |
| Budget used % | `62` |
| Status note | sentence |

**Weekly case volume trend (Trends tab):** week label, cases opened, cases resolved. The category and severity charts are **(computed)** from the cases.

The **AI Summary** on this page is generated from the fields above.

## 10. Opportunities & Actions (per account)

**Opportunities (one row per opportunity, open and closed)**

| Field | Example |
|---|---|
| Opportunity ID | `OPP-1101` |
| Name | `FY25 Platform Renewal` |
| Type | `Renewal` / `Expansion` / `New Product` / `Upsell` |
| Value | `1420000` |
| Status | `Open` / `Won` / `Lost` |
| Stage | `Identified`, `Qualified`, `Proposal`, `Negotiation`, `Closed Won`, `Closed Lost` |
| Probability % (open only) | `62` |
| Close date | `Dec 04, 2024` |
| Owner | `Jordan Mills` |
| Expansion signal (expansion opps) | `Fleet Tracking at 88% adoption with seat waitlist` |
| Next step | `Size seat need with operations lead` |
| Lost reason (lost only) | `Budget freeze` |

**Churn history (one row per event, may be empty)**

| Field | Example |
|---|---|
| Period | `Q2 FY24` |
| Event | `Seat contraction`, `Product churn`, `Downsell` |
| Amount (negative) | `-85000` |
| Reason | `Reduced warehouse licenses after site consolidation` |
| Recovered? | `Yes` / `No` |

**Renewal sentiment (one row per account)**

| Field | Example |
|---|---|
| Sentiment label | `Positive` / `Neutral` / `At Risk` / `Negative` |
| Sentiment score (/100) | `38` |
| Renewal champion | `Marcus Vance (CTO)` |
| Procurement status | `Pricing review requested` |
| Sentiment drivers (list: text + positive/neutral/negative) | `Executive sponsor not responding for 45 days`, negative |

Upcoming renewal **value and date** come from the account master (ARR, contract end). All the open/closed/won/lost counts and totals are **(computed)**. The **AI Summary** is generated.

## 11. Action Center (per account)

No new inputs. The **Overall Summary**, the **prioritized steps** and the **Account 360 download** are all generated from tables 1 to 10 above. If you want specific wording, owners or due dates for steps, give me the rules and I'll encode them.

## 12. Risk & Signals page (portfolio-wide, not per account)

You said not to change this page yet. Listed for completeness, since these are also placeholder data.

| Table | Fields |
|---|---|
| Summary KPIs | Critical risk accounts count, at-risk ARR ($M), active escalations, expansion opportunities ($M), average health score, plus the five trend captions (for example `+2 this week`) |
| At-risk accounts | Name, ID, tier, ARR, health score, risk level (Critical/High/Medium/Watch), top signals (list), CSM, renewal days, churn probability %, playbook active |
| Churn risk distribution | Bucket label, account count (four buckets), total monitored |
| Top churn drivers | Driver label, % of accounts |
| Signal feed | ID, severity (critical/warning/info/positive), title, account, account ID, message, time, category (Usage/Relationship/Support/Competitive/NPS/Engagement/Expansion), action buttons, unread flag |
| Escalations | ID, account, severity (P1-P3), title, owner, created, last updated, status, update thread (author, time, text) |
| Expansion opportunities | Account, ID, tier, current ARR, expansion value, type, probability %, signal, champion, stage, days to close |

## 13. Global elements

| Element | Fields |
|---|---|
| Notifications bell | Account, severity, message, time ago, unread count (currently 2 hardcoded alerts, labeled "3 New") |
| Sidebar | Workspace name (`Enterprise Health Matrix`), sync status (`LIVE`) |
| User avatar | Initials (`DR`) / user name |
| Ask AI modal | Needs a real AI backend. Today `/api/ask-ai` returns canned answers built from the account fields. |
| Playbook modal | Playbook steps, audit log entries (step, owner, timestamp) |
| Export modal | Uses the account fields above |

---

## What I would collect first

If you want the smallest set that makes most screens real, start with:

1. **Account master** (table 1): this alone fills the header selector, Accounts Hub, Account Detail header, Snapshot and Basic Account Details.
2. **Products + usage KPIs + weekly trend** (table 8).
3. **Cases + escalations + PS status** (table 9).
4. **Opportunities + renewal sentiment + churn history** (table 10).

Tell me the format you'll send (CSV, Excel, API, or database) and I'll wire the server to read it in place of the placeholder data.
