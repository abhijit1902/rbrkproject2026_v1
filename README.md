# Customer Intelligence Platform

A high-density telemetry console for enterprise B2B Customer Success and Retention teams, modeled after the **Obsidian Telemetry** design system from Stitch (`screen: 8a1d0414e2664495ac3fe89bf3b17b65`).

Built with **Express**, **Node.js**, and **React**.

See [DATA_FIELDS.md](DATA_FIELDS.md) for every data field the UI displays. Design thinking and engineering logic follow the API reference below.

---

## 🚀 Tech Stack

- **Backend**: Express & Node.js, ES modules (`server/`)
  - Account, portfolio, usage, risk-signal and notification APIs, all derived from `server/data/accounts.json`.
  - A rules-based **assessment engine** (`server/assess/`) that produces a per-account AI assessment (classification, severity, actions, reach-out drafts) with verbatim-quote evidence. It makes no model calls.
  - Ask AI endpoint (`/api/ask-ai`) that answers from the stored assessment and cites the records it used.
  - Playbook dispatch (`/api/playbook/trigger`) and feedback endpoints.
- **Frontend**: React (Vite) (`client/`)
  - Modular component architecture with hash-based view routing.
  - Dark enterprise styling matching the **Obsidian Telemetry** design tokens.
  - Google Fonts: *Inter* and *JetBrains Mono*, with *Material Symbols Outlined*.
  - Hand-written SVG telemetry charts (health donut, velocity curve, signal distribution).
- **Data tooling**: Python scripts (`server/tools/`) that convert the source `.docx` account document into `accounts.json`.
- **Dev tooling**: Concurrently runs server and client together.

---

## 🧭 Views

| Hash | Sidebar / header label | Purpose |
|---|---|---|
| `#detail` | Account Detail (default) | Single-account cockpit, including the AI Assessment card |
| `#portfolio` | Accounts Hub | Portfolio overview and at-risk ranking |
| `#usage-and-adoption` | Telemetry & Usage | Product usage and adoption telemetry |
| `#risk-signals` | Risk & Signals | Risk table, signal feed, escalations, expansion pipeline |
| `#cases-and-history` | Cases & History | Case queue, account history timeline, trends |
| `#opportunities-and-actions` | Opportunities & Actions | Opportunities, expansion details, renewal and churn history |
| `#action-center` | Action Center | AI triage queue and Account 360 export |

The "Action Playbooks" sidebar entry is still a placeholder. `?account=<name>` in the URL preselects an account.

---

## 📁 Project Structure

```
.
├── package.json               # Root scripts coordinating server & client
├── DATA_FIELDS.md             # Every UI data field, grouped by table
├── README.md                  # Setup, API, design deep-dive and change log
├── server/                    # Express & Node.js backend
│   ├── index.js               # API routes, playbook dispatch, Ask AI
│   ├── portfolio.js           # Loads accounts.json; derives portfolio, risk signals, notifications
│   ├── data/
│   │   └── accounts.json      # 15 account records (account, usage, hub, risk and signal rows)
│   ├── assess/
│   │   ├── engine.js          # Rules + text tagger -> assessment records
│   │   └── store.js           # Runs the engine once at startup; Ask AI answers; feedback verdicts
│   ├── tools/
│   │   ├── parse_docx.py          # Parses the source .docx into structured sections
│   │   └── build_account_data.py  # Builds accounts.json from the .docx
│   └── package.json           # Server dependencies (express, cors)
└── client/                    # React frontend (Vite)
    ├── index.html             # Fonts and Tailwind config with Obsidian Telemetry tokens
    ├── vite.config.js         # Dev server on 5173, /api proxy to the backend
    └── src/
        ├── main.jsx           # React root entry
        ├── App.jsx            # State coordinator, view routing, modals
        ├── index.css          # Dark enterprise styles
        └── components/
            ├── Header.jsx, Sidebar.jsx
            ├── AccountDetail/        # Account cockpit cards (incl. AIAssessmentCard)
            ├── Portfolio/            # PortfolioDashboard
            ├── UsageAdoption/        # Usage & adoption view and charts
            ├── RiskSignals/          # Risk, signals, escalations, expansion
            ├── CasesHistory/         # Case queue, history timeline, trends
            ├── OpportunitiesActions/ # Opportunity list, expansion, renewal & churn
            ├── ActionCenter/         # AI triage queue, account360.js export
            └── Modals/               # AskAI, Playbook, Export, SeatOptimizer
```

---

## 🏃 Running the Application

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Start fullstack dev server
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001` (override with `PORT`; set `API_PORT` so the Vite proxy follows)

Run the halves separately with `npm run server` and `npm run client`.

---

## 🗂 Regenerating the Data

`server/data/accounts.json` is generated from `Customer_Intelligence_Account_Data.docx` (data as of Oct 5, 2026):

```bash
python3 server/tools/build_account_data.py <input.docx> server/data/accounts.json
```

Restart the server afterwards. The assessment engine runs once at startup, so there is no view-time computation.

---

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/accounts` | Accounts Hub list (optional `?search=`) |
| `GET` | `/api/accounts/:name` | Full account record, with basic details |
| `GET` | `/api/portfolio` | Aggregate portfolio metrics |
| `GET` | `/api/usage/:name` | Usage and adoption data for one account |
| `GET` | `/api/notifications` | Notifications and unread count |
| `GET` | `/api/risk-signals` | Risk summary, at-risk rows and signal feed |
| `GET` | `/api/assessments` | Assessment summary rows, sorted by severity |
| `GET` | `/api/assessments/:name` | Full assessment and recorded verdicts |
| `POST` | `/api/assessments/:name/feedback` | Record `confirmed`, `false_positive` or `not_useful` |
| `POST` | `/api/playbook/trigger` | Dispatch a playbook for an account |
| `POST` | `/api/ask-ai` | Assessment-grounded Q&A |
| `POST` | `/api/feedback` | Feedback on AI responses |

Playbook triggers, feedback and verdicts are held in memory and reset when the server restarts.

---

## 🧠 Design & Engineering Deep-Dive

The **why**, **how** and **what** behind the platform.

### Origin — The Stitch Design

The project started from a single Stitch screen:

- **Screen ID**: `8a1d0414e2664495ac3fe89bf3b17b65`
- **Project**: Customer Intelligence Platform Dashboard (`projects/6840784166577113550`)
- **Design System**: **Obsidian Telemetry**

The Obsidian Telemetry design system is a dark, enterprise-grade aesthetic built around:

| Token | Value | Usage |
|---|---|---|
| `surface-base` | `#00142c` | Page background |
| `surface-raised` | `#09203b` | Cards, inputs |
| `surface-overlay` | `#162b46` | Active states, hovered items |
| `border` | `#213551` | All dividers and card outlines |
| `primary` (cyan) | `#2DD4CF` | Accents, CTAs, live indicators |
| `text-primary` | `#d4e3ff` | Body text |
| `text-muted` | `#6b8cae` | Labels, secondary info |
| `success` | `#34d399` | Positive trends, healthy scores |
| `warning` | `#f59e0b` | Moderate risk |
| `danger` | `#ff6b6b` | Critical risk, churn signals |
| `accent-purple` | `#a78bfa` | Info signals, neutral risk |
| Font (prose) | **Inter** | All UI text |
| Font (data) | **JetBrains Mono** | Metrics, IDs, timestamps |
| Icons | **Material Symbols Outlined** | All iconography |

The design communicates **enterprise-grade seriousness** — no gradients for decoration, no playful UI. Every color has semantic meaning (danger = red, growth = green, telemetry = cyan).

---

### Product Thinking — What Is This Platform?

The platform is a **Customer Success Intelligence Console** for B2B SaaS companies. The target user is a **Customer Success Manager (CSM)** or **VP of Customer Success** managing a portfolio of enterprise accounts.

#### Core User Problems Being Solved

| Problem | Feature Built |
|---|---|
| "I have 200+ accounts — which ones need attention RIGHT NOW?" | Portfolio Dashboard with health scoring |
| "I need to understand the full health picture of one account" | Account Detail Cockpit |
| "Is this account actually using our product?" | Usage & Adoption telemetry |
| "What are the early warning signs before a customer churns?" | Risk & Signals with churn probability |
| "A customer is escalating — where is that thread?" | Escalation Timeline |
| "There's an upsell opportunity — where do I track it?" | Expansion Pipeline |
| "I need an AI summary to paste into my QBR deck" | Executive Summary Card + Ask AI Modal |

#### The Mental Model

Think of this as a **mission control dashboard** — like a NASA flight operations center, but for customer success. Every piece of data shown should drive an **action**. The design principle is:

> *"If you can't act on it, don't show it."*

This is why every card has a CTA (trigger playbook, schedule call, view ticket, send pricing), and why the risk scores are always accompanied by the **reason** for the score.

---

### Tech Stack Decisions

#### Why Express + Node.js (not Next.js, not FastAPI)?

The user explicitly requested **Express, Node.js, and React**. This combination makes sense for this use case:

- **Express** gives complete control over API design without opinionated routing
- **Node.js** keeps the entire stack in JavaScript, reducing context switching
- **React (Vite)** gives a fast dev experience with hot module replacement
- **Vite proxy** (`/api → http://localhost:5001`, or `API_PORT`) eliminates CORS issues in development

#### Why a separate `server/` and `client/` directory?

Clean separation of concerns. The backend is a standalone Express API that could be consumed by any frontend (mobile app, other dashboards, etc.). The root `package.json` uses `concurrently` to run both with a single `npm run dev`.

#### Why Tailwind (via CDN in `index.html`) and not plain CSS?

The Stitch design has a rich token system. Tailwind's utility classes map directly to design tokens without writing custom CSS for every element — `bg-[#00142c]`, `text-[#2DD4CF]`, `border-[#213551]` etc. This lets component code be visually self-documenting.

#### Why no external charting library (Chart.js, Recharts, D3)?

The telemetry charts (health donut, velocity curve, signals distribution) are **hand-written SVG**. This was a deliberate choice:

1. No bundle size cost
2. Pixel-perfect control matching the Stitch design
3. No fighting library default styles in a dark theme
4. Charts are relatively simple (donuts, sparklines) — no need for a full charting library

---

### Architecture — How State Flows

```
App.jsx  (Central state coordinator)
  │
  ├── currentView  ──────────────────────────────────────────┐
  │   ('detail' | 'portfolio' | 'usage-and-adoption'        │
  │    | 'risk-signals' | 'opportunities-and-actions'       │
  │    | 'cases-and-history' | 'action-center')              │
  │                                                          │
  ├── selectedAccountName  ──► fetch /api/accounts/:name     │
  │                                                          │
  ├── accountData  ──────────────────────────────────────────┼──► AccountDetailView
  ├── allAccounts  ──────────────────────────────────────────┼──► PortfolioDashboard
  ├── portfolioData  ────────────────────────────────────────┼──► PortfolioDashboard
  │                                                          │
  ├── Modal state (isAskAIOpen, isPlaybookModalOpen, etc.)   │
  └── toastMessage  (ephemeral 3.5s notification)            │
                                                             │
  URL hash (#detail, #portfolio, #risk-signals, etc.) ───────┘
  (bi-directional sync via window.location.hash)
```

#### Routing Strategy: Hash-Based, No React Router

The app uses `window.location.hash` for navigation instead of React Router. This was intentional:

- **Zero dependencies** — no router library needed
- **Shareable URLs** — `http://localhost:5173/#risk-signals` deep-links to the exact view
- **Simple mental model** — one `currentView` state drives everything
- The hash and state are kept in sync via `useEffect` listeners in both directions

---

### Data Layer — `server/data/accounts.json`

The original hand-written `server/data.js` was removed. All data now comes from `server/data/accounts.json`, generated by `server/tools/build_account_data.py` from `Customer_Intelligence_Account_Data.docx` (data as of Oct 5, 2026). `DATA_FIELDS.md` lists every field the UI shows.

The file is an array of 15 account records, each with these keys:

| Key | Description |
|---|---|
| `account` | Full account object for the Account Detail cockpit (also carries cases, opportunities and history data) |
| `usage` | Usage and adoption telemetry for the account |
| `hub` | Summary row for the Accounts Hub list |
| `portfolioRow`, `riskRow` | Rows for the portfolio and at-risk tables |
| `signalFeed` | Risk signals for the feed |
| `notifications`, `unreadCount` | Header notification data |

`server/portfolio.js` loads this file once and derives `ACCOUNTS`, `USAGE`, `HUB_LIST`, and the portfolio, risk-signal and notification views, so nothing at the portfolio level is hand-maintained.

#### The Assessment Engine

`server/assess/engine.js` implements the "Intelligence Layer Technical Note v3" design. For each account it:

1. Collects free text (cases, notes, history) as records with a type, id and date.
2. Applies **rules** for numbers and statuses (renewal windows, idle utilization, adoption strength, stalls; thresholds live in `CONFIG`).
3. Runs a **text tagger** whose every tag carries a verbatim quote from the source record. `tagText()` is the one place to swap in an LLM; its output would go through the same quote check.
4. Produces classification, severity (Low/Medium/High), proposed risk-profile fields, actions and reach-out drafts.

`server/assess/store.js` runs the engine once at startup and keeps the results in memory. The dashboard and Ask AI only read from there. User verdicts (confirmed, false positive, not useful) are also kept in memory.

#### The Synthesis Fallback Pattern

`getSynthesizedAccount(accountName)` in `server/index.js` still exists as a fallback for `/api/ask-ai` when the account is not in `accounts.json`. It hashes the name to generate deterministic values, so the same name always returns the same data.

---

### Page-by-Page Design Logic

#### Account Detail (Account Overview)
**Route**: `#detail`

The flagship view. Structured as a **12-column CSS grid** assembling independent cards:

```
Header, Basic Details, Contracts & Engagement, Account Snapshot,
Health Donut, Renewal Risk, Signals, AI Assessment,
Recommended Actions, Telemetry Velocity Chart, Executive Summary
(see AccountDetailView.jsx for the exact grid placement)
```

**Design decisions:**
- The **Health Donut** is an SVG with 6 arcs (Product Adoption, Support Sentiment, Executive Engagement, Feature Depth, Contract Expansion, NPS Trend). Each arc is independently colored by severity. This gives a holistic "at a glance" read of account health that can't be faked with a single number.
- The **Telemetry Velocity Chart** is a 90-day SVG path chart. It includes a **spike annotation** (a vertical dashed line) at the point of maximum deviation — typically the "trigger event" for the account's current risk state.
- The **Executive Summary Card** uses the `/api/ask-ai` endpoint to generate a synthesized AI narrative. This is designed to be copy-paste ready for QBR decks.

#### Portfolio Dashboard
**Route**: `#portfolio`

A multi-account portfolio view showing:
- Aggregate KPIs (total ARR, at-risk ARR, avg health score, accounts by tier)
- At-risk accounts ranked by churn probability
- Click-through to individual Account Detail cockpits

**Design philosophy:** Speed of triage. A CSM managing 50+ accounts needs to know in under 5 seconds which account needs immediate attention. The red/amber/green health indicators and churn % columns serve this purpose.

#### Usage & Adoption
**Route**: `#usage-and-adoption`

Telemetry-heavy view focused on **product usage signals**:

| Component | Purpose |
|---|---|
| `UsageMetricStrip` | 5 top-level KPIs (WAU, DAU, feature depth, API calls, sessions) |
| `WeeklyUsageTrendChart` | Multi-series SVG sparkline — WAU vs. contracted baseline |
| `ProductAdoptionGrid` | Module-level adoption heatmap (which product modules are being used) |
| `FeatureUtilizationTable` | Granular feature-by-feature usage % with trend arrows |
| `AdoptionAnomaliesFeed` | Automated anomaly detection feed (e.g. "Analytics module dropped 40%") |

**Design principle:** Usage data is the most **objective** signal of account health. A customer can say they love the product in an NPS survey but never log in. This page cuts through that.

#### Risk & Signals
**Route**: `#risk-signals`

The proactive early warning system. Structured in 4 tabs:

##### Tab 1: Risk Overview
Split layout:
- **Left (2/3 width)**: `AtRiskAccountsTable` — sortable by health score, churn %, renewal days. Includes inline health bars and signal tags.
- **Right (1/3 width)**: `ChurnProbabilityMatrix` — distribution of accounts by churn probability bucket, plus top 5 churn drivers ranked by prevalence.

##### Tab 2: Signal Feed
A **reverse-chronological event feed** of AI-detected risk signals. Each signal card:
- Color-coded by severity (critical = red left border, warning = amber, info = purple, positive = green)
- Filterable by signal type AND category (Usage, Relationship, Support, Competitive, NPS, Engagement, Expansion)
- Expandable to show full description + contextual action buttons (Trigger Playbook, Schedule EBR, etc.)
- Unread indicator dot

**Design reasoning:** CSMs are overwhelmed with data. The signal feed distills telemetry into **actionable English sentences** rather than raw numbers. "Usage dropped 62% WAU" is more actionable than "WAU: 12".

##### Tab 3: Escalations
Master/detail split view:
- **Left panel**: List of escalations with severity badge (P1/P2/P3), account, status, and last updated time
- **Right panel**: Full activity timeline thread (like a Slack thread or GitHub issue comments) with avatars, timestamps, and a reply box

**Design reasoning:** Escalations involve multiple people (CSM, Support, Engineering). The thread model mirrors communication tools CSMs already use (Slack, Jira), reducing cognitive load.

##### Tab 4: Expansion Signals
**Two views** toggled via a button:
- **Table view**: Sortable columns showing account, expansion type, value, probability, stage, signal trigger
- **Kanban pipeline view**: Horizontal stage-by-stage board (Early Signal → Qualifying → Nurturing → Demo Scheduled → Pricing Sent → Closed Won)

**Design reasoning:** Expansion opportunities are a **sales motion**, not just a CS motion. The Kanban view mirrors CRM pipelines (Salesforce, HubSpot) that sales teams use — making it familiar for revenue teams joining the dashboard.

#### Cases & History
**Route**: `#cases-and-history`

Three tabs: **Case Queue** (support cases for the selected account, with a summary strip), **Account History** (timeline) and **Trends**. Side widgets show professional-services status, escalation details and an AI case summary.

#### Opportunities & Actions
**Route**: `#opportunities-and-actions`

Three tabs: **Opportunities** (list with summary strip), **Expansion Details** and **Renewal & Churn History**.

#### Action Center
**Route**: `#action-center`

Per-account action steps grouped by team (Support, Executive, Renewal, CS, PS, Sales), plus an **AI Triage Queue** across accounts. `account360.js` builds a downloadable Account 360 briefing.

---

### Modal System

Four modals live above the main content layer:

| Modal | Trigger | Purpose |
|---|---|---|
| `AskAIModal` | "Ask AI" button in Header | Context-aware Q&A — the AI knows which account is active and its telemetry |
| `PlaybookModal` | "Trigger Playbook" CTA or header button | Shows playbook steps, execution progress, audit log, dispatch button |
| `ExportModal` | "Export Report" CTA | Executive briefing PDF preview with cover page, metrics snapshot, and recommended actions |
| `SeatOptimizerModal` | Seat optimization CTA | Seat optimization view for the selected account |

All modals use a **backdrop blur** (`backdrop-filter: blur`) for depth, and animate in/out with CSS transitions. They're mounted at the App level (not inside individual components) so they always render above everything regardless of z-index stacking.

---

### Design Patterns Used Throughout

#### Pattern: Semantic Color = Instant Comprehension

Every color in the UI carries meaning:
- **Red** (`#ff6b6b`) = danger, critical, action required NOW
- **Amber** (`#f59e0b`) = warning, elevated risk, watch
- **Purple** (`#a78bfa`) = informational, neutral observation
- **Cyan** (`#2DD4CF`) = primary actions, live status, links
- **Green** (`#34d399`) = healthy, positive, expansion opportunity

A CSM scanning the dashboard never has to read a label to know if something is good or bad — color communicates it instantly.

#### Pattern: Data Density Without Overwhelm

Enterprise dashboards have a tendency to either be **too sparse** (pretty but useless) or **too dense** (data overload). The approach here:
- Group related metrics into **cards** with a clear single headline
- Use **progressive disclosure** (expandable signal cards, tab navigation) to hide detail until needed
- Use **micro-labels** (`text-[10px]`) for secondary context so it's there but doesn't compete

#### Pattern: Every View Has a "Now What?" Answer

Every screen has at least one primary CTA that answers "what should I do with this information?":
- Account Detail → "Trigger Playbook", "Schedule Review", "Export Report"
- Portfolio → "View" button on each at-risk account
- Signal Feed → "Trigger Playbook", "Schedule EBR", "Escalate"
- Escalations → "Post" reply, prioritized action buttons
- Expansion → "Create Opportunity", "Send Pricing"

---

### Complete Component Tree

```
client/src/
├── App.jsx                          # State hub, routing, data fetch coordinator
├── index.css                        # Global dark theme base styles
├── main.jsx                         # React DOM entry point
└── components/
    ├── Header.jsx                   # Top nav (Cases & History, Opportunities & Actions, Action Center), Ask AI, notifications
    ├── Sidebar.jsx                  # Left nav: Accounts Hub, Telemetry & Usage, Risk & Signals, Action Playbooks (placeholder)
    │
    ├── AccountDetail/               # Single Account Cockpit (#detail)
    │   ├── AccountDetailView.jsx    # Grid layout assembler
    │   ├── BreadcrumbBar.jsx        # Account selector dropdown with search
    │   ├── AccountHeaderCard.jsx    # Status pills, ARR, tier, CSM, action buttons
    │   ├── BasicAccountDetailsCard.jsx # TCV, region, customer since, AE/SE, renewal owner
    │   ├── ContractsEngagementCard.jsx # Contracts and engagement
    │   ├── AccountSnapshotCard.jsx  # Fiscal metrics: ARR, YoY growth, TCV
    │   ├── HealthDonutCard.jsx      # 6-dimension SVG health donut
    │   ├── RenewalRiskCard.jsx      # Renewal countdown + active risk triggers
    │   ├── SignalsCard.jsx          # Signal distribution donut + event log
    │   ├── AIAssessmentCard.jsx     # Assessment from /api/assessments with verdict feedback
    │   ├── RecommendedActionsCard.jsx # Open prescriptions + playbook status
    │   ├── TelemetryVelocityChart.jsx # 90-day SVG usage velocity + spike annotation
    │   └── ExecutiveSummaryCard.jsx   # AI narrative + feedback mechanism
    │
    ├── Portfolio/                   # Multi-account hub (#portfolio)
    │   └── PortfolioDashboard.jsx   # KPI strip, at-risk table, tier breakdown
    │
    ├── UsageAdoption/               # Product telemetry view (#usage-and-adoption)
    │   ├── UsageAdoptionView.jsx    # Layout assembler + account selector
    │   ├── UsageMetricStrip.jsx     # Top-level usage KPI cards
    │   ├── WeeklyUsageTrendChart.jsx # SVG multi-series trend sparkline
    │   ├── ProductAdoptionGrid.jsx  # Module-level heatmap grid
    │   ├── FeatureUtilizationTable.jsx # Granular feature usage % table
    │   └── AdoptionAnomaliesFeed.jsx   # Anomaly events
    │
    ├── RiskSignals/                 # Early warning system (#risk-signals)
    │   ├── RiskSignalsView.jsx      # Tab container + page header
    │   ├── RiskSummaryStrip.jsx     # KPI summary cards
    │   ├── AtRiskAccountsTable.jsx  # Sortable risk table with health bars
    │   ├── ChurnProbabilityMatrix.jsx # Risk distribution + top churn drivers
    │   ├── SignalsFeed.jsx          # Filterable live signal cards
    │   ├── EscalationTimeline.jsx   # Master/detail escalation thread view
    │   └── ExpansionOpportunities.jsx # Table + Kanban expansion pipeline
    │
    ├── CasesHistory/                # Support cases (#cases-and-history)
    │   ├── CasesHistoryView.jsx     # Tabs: Case Queue, Account History, Trends
    │   ├── CaseSummaryStrip.jsx, CaseQueue.jsx, AccountHistoryTimeline.jsx
    │   ├── CaseTrends.jsx, CaseWidgets.jsx  # PS status, escalation details, AI case summary
    │   └── data.js                  # Shapes account data for these views
    │
    ├── OpportunitiesActions/        # Commercial pipeline (#opportunities-and-actions)
    │   ├── OpportunitiesActionsView.jsx # Tabs: Opportunities, Expansion Details, Renewal & Churn History
    │   ├── OppSummaryStrip.jsx, OpportunityList.jsx
    │   ├── ExpansionDetails.jsx, RenewalChurn.jsx
    │   └── data.js
    │
    ├── ActionCenter/                # Triage (#action-center)
    │   ├── ActionCenterView.jsx     # Per-account action steps by team
    │   ├── AITriageQueue.jsx        # Cross-account AI triage queue
    │   └── account360.js            # Builds and downloads the Account 360 export
    │
    └── Modals/                      # Overlay system (mounted at App level)
        ├── AskAIModal.jsx           # Live AI assistant with account context
        ├── PlaybookModal.jsx        # Playbook execution + audit timeline
        ├── ExportModal.jsx          # Executive briefing PDF preview
        └── SeatOptimizerModal.jsx   # Seat optimization
```

Removed since v1.0: `PeerCohortCard.jsx` and `PrescribedActionsCard.jsx`.

---

### What's Left / Future Directions

| Feature | Priority | Notes |
|---|---|---|
| Real database (PostgreSQL / MongoDB) | High | Replace `accounts.json` with persistent storage; persist playbooks and verdicts |
| Authentication & multi-tenant support | High | CSMs should only see their own accounts |
| Live WebSocket telemetry feed | Medium | Replace static data with push-based signal delivery |
| Action Playbooks page | Medium | Sidebar entry exists but the page is not built (`#playbooks` is not a known view) |
| Notification center | Medium | Persistent unread signal history |
| LLM-backed text tagger | Medium | Swap `tagText()` in `server/assess/engine.js`; the verbatim-quote check stays |
| CSV / PDF export engine | Low | Export modal is a preview; Account 360 export exists in `account360.js` |
| Mobile responsive layout | Low | Currently desktop-optimized (1440px target) |
| Dark/Light theme toggle | Low | Currently dark-only |

---

### Key Files Quick Reference

| File | What it does |
|---|---|
| `server/data/accounts.json` | All account data, generated from the source `.docx` |
| `server/tools/build_account_data.py` | Rebuilds `accounts.json` from the `.docx` |
| `server/portfolio.js` | Loads the data and derives portfolio, risk and notification views |
| `server/assess/engine.js` | Rules and text tagger that produce assessments |
| `server/assess/store.js` | In-memory assessments, Ask AI answers, verdicts |
| `server/index.js` | Express API routes and playbook dispatch |
| `DATA_FIELDS.md` | Every UI field, grouped by data table |
| `client/src/App.jsx` | Central brain — state, routing, data fetching |
| `client/src/components/Header.jsx` | Global nav bar with Ask AI, notifications, app switcher |
| `client/src/components/Sidebar.jsx` | Left nav — workspace context + sync status |
| `client/index.html` | Loads fonts, Tailwind config with Obsidian Telemetry tokens |
| `client/vite.config.js` | Vite proxy config (`/api` → `API_PORT`, default 5001) |

---

---

## 📝 Changes Since v1.0

The initial commit (`99482e2`) shipped the original three-account mock dashboard. The following has changed since, and is not yet committed.

### Data layer
- **Removed** `server/data.js` (hand-written mock data for 3 accounts plus 33 list rows).
- **Added** `server/data/accounts.json`: 15 real account records generated from `Customer_Intelligence_Account_Data.docx` (as of Oct 5, 2026).
- **Added** `server/tools/parse_docx.py` and `build_account_data.py` to regenerate that file.
- **Added** `server/portfolio.js`, which derives the portfolio, risk-signal, notification and usage views from the JSON instead of hand-maintained exports.
- **Added** [DATA_FIELDS.md](DATA_FIELDS.md), listing every field the UI shows, grouped by data table.

### Backend
- **Added** the assessment engine (`server/assess/engine.js`, `store.js`): rules for numbers and statuses plus a text tagger with verbatim-quote evidence. It runs once at startup and makes no model calls.
- **New endpoints**: `/api/health`, `/api/notifications`, `/api/assessments`, `/api/assessments/:name` and `/api/assessments/:name/feedback`.
- **Changed** `/api/usage-adoption` to `/api/usage/:name` (per account).
- **Changed** `/api/ask-ai` to answer from the stored assessment and cite the records used. The keyword-based answer remains as a fallback for accounts without an assessment.
- `/api/accounts/:name` now includes basic details (TCV, region, customer since, AE, SE, renewal owner).

### Frontend
- **New views**: Cases & History, Opportunities & Actions and Action Center, with header navigation and hash routes.
- **New Account Detail cards**: AI Assessment, Basic Account Details, Contracts & Engagement.
- **Removed cards**: Peer Cohort and Prescribed Actions.
- **New modal**: Seat Optimizer.
- Existing cards, views, header, sidebar and styles were updated to read the new data shape.
- `?account=<name>` in the URL preselects an account.
- The Vite proxy target now follows `API_PORT` (default 5001).

### Docs
- `README2.md` was merged into this file, and the stale `client/README.md` template text was replaced.
