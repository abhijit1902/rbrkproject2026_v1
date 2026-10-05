# README2 — Project Context, Design Thinking & Engineering Logic

> A deep-dive into the **why**, **how**, and **what** behind the Customer Intelligence Platform.
> Companion to `README.md` — which covers only setup and structure.

---

## 1. Origin — The Stitch Design

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

## 2. Product Thinking — What Is This Platform?

The platform is a **Customer Success Intelligence Console** for B2B SaaS companies. The target user is a **Customer Success Manager (CSM)** or **VP of Customer Success** managing a portfolio of enterprise accounts.

### Core User Problems Being Solved

| Problem | Feature Built |
|---|---|
| "I have 200+ accounts — which ones need attention RIGHT NOW?" | Portfolio Dashboard with health scoring |
| "I need to understand the full health picture of one account" | Account Detail Cockpit |
| "Is this account actually using our product?" | Usage & Adoption telemetry |
| "What are the early warning signs before a customer churns?" | Risk & Signals with churn probability |
| "A customer is escalating — where is that thread?" | Escalation Timeline |
| "There's an upsell opportunity — where do I track it?" | Expansion Pipeline |
| "I need an AI summary to paste into my QBR deck" | Executive Summary Card + Ask AI Modal |

### The Mental Model

Think of this as a **mission control dashboard** — like a NASA flight operations center, but for customer success. Every piece of data shown should drive an **action**. The design principle is:

> *"If you can't act on it, don't show it."*

This is why every card has a CTA (trigger playbook, schedule call, view ticket, send pricing), and why the risk scores are always accompanied by the **reason** for the score.

---

## 3. Tech Stack Decisions

### Why Express + Node.js (not Next.js, not FastAPI)?

The user explicitly requested **Express, Node.js, and React**. This combination makes sense for this use case:

- **Express** gives complete control over API design without opinionated routing
- **Node.js** keeps the entire stack in JavaScript, reducing context switching
- **React (Vite)** gives a fast dev experience with hot module replacement
- **Vite proxy** (`/api → http://localhost:5001`) eliminates CORS issues in development without needing environment variables

### Why a separate `server/` and `client/` directory?

Clean separation of concerns. The backend is a standalone Express API that could be consumed by any frontend (mobile app, other dashboards, etc.). The root `package.json` uses `concurrently` to run both with a single `npm run dev`.

### Why Tailwind (via CDN in `index.html`) and not plain CSS?

The Stitch design has a rich token system. Tailwind's utility classes map directly to design tokens without writing custom CSS for every element — `bg-[#00142c]`, `text-[#2DD4CF]`, `border-[#213551]` etc. This lets component code be visually self-documenting.

### Why no external charting library (Chart.js, Recharts, D3)?

The telemetry charts (health donut, velocity curve, signals distribution) are **hand-written SVG**. This was a deliberate choice:

1. No bundle size cost
2. Pixel-perfect control matching the Stitch design
3. No fighting library default styles in a dark theme
4. Charts are relatively simple (donuts, sparklines) — no need for a full charting library

---

## 4. Architecture — How State Flows

```
App.jsx  (Central state coordinator)
  │
  ├── currentView  ──────────────────────────────────────────┐
  │   ('detail' | 'portfolio' | 'usage-and-adoption'        │
  │    | 'risk-signals' | 'playbooks')                       │
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

### Routing Strategy: Hash-Based, No React Router

The app uses `window.location.hash` for navigation instead of React Router. This was intentional:

- **Zero dependencies** — no router library needed
- **Shareable URLs** — `http://localhost:5173/#risk-signals` deep-links to the exact view
- **Simple mental model** — one `currentView` state drives everything
- The hash and state are kept in sync via `useEffect` listeners in both directions

---

## 5. Data Layer — The `server/data.js` Dictionary

All mock data lives in `server/data.js`. It exports:

| Export | Description |
|---|---|
| `ACCOUNTS_DATA` | Full telemetry object for 3 named accounts (Apex Global Logistics, CloudScale Therapeutics, Vertex FinTech Holdings) |
| `ALL_ACCOUNTS_LIST` | Flat list of 33 accounts with summary-level fields for the portfolio view |
| `PORTFOLIO_DATA` | Aggregate portfolio metrics (total ARR, at-risk ARR, avg health score, tier breakdown) |
| `USAGE_ADOPTION_DATA` | Feature utilization matrices, WAU trends, adoption anomalies |

### The Synthesis Fallback Pattern

When a user searches for an account NOT in `ACCOUNTS_DATA`, the server runs `getSynthesizedAccount(accountName)`:

```js
function getSynthesizedAccount(accountName) {
  const hash = accountName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Uses hash of name to deterministically generate consistent fake data
  // Same name always returns same "data" — feels like real data
}
```

This means the app gracefully handles any account name input — it never crashes with "not found". The hash makes the values **deterministic** (same name → same score, always), which feels authentic.

---

## 6. Page-by-Page Design Logic

### 6.1 Account Detail (Account Overview)
**Route**: `#detail`

The flagship view. Structured as a **12-column CSS grid** assembling independent cards:

```
[Header Card — full width]
[Account Snapshot] [Health Donut] [Renewal Risk] [Signals]
[Recommended Actions]    [Peer Cohort]
[Telemetry Velocity Chart — full width]
[Prescribed Actions]     [Executive Summary]
```

**Design decisions:**
- The **Health Donut** is an SVG with 6 arcs (Product Adoption, Support Sentiment, Executive Engagement, Feature Depth, Contract Expansion, NPS Trend). Each arc is independently colored by severity. This gives a holistic "at a glance" read of account health that can't be faked with a single number.
- The **Telemetry Velocity Chart** is a 90-day SVG path chart. It includes a **spike annotation** (a vertical dashed line) at the point of maximum deviation — typically the "trigger event" for the account's current risk state.
- The **Executive Summary Card** uses the `/api/ask-ai` endpoint to generate a synthesized AI narrative. This is designed to be copy-paste ready for QBR decks.

### 6.2 Portfolio Dashboard
**Route**: `#portfolio`

A multi-account portfolio view showing:
- Aggregate KPIs (total ARR, at-risk ARR, avg health score, accounts by tier)
- At-risk accounts ranked by churn probability
- Click-through to individual Account Detail cockpits

**Design philosophy:** Speed of triage. A CSM managing 50+ accounts needs to know in under 5 seconds which account needs immediate attention. The red/amber/green health indicators and churn % columns serve this purpose.

### 6.3 Usage & Adoption
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

### 6.4 Risk & Signals
**Route**: `#risk-signals`

The proactive early warning system. Structured in 4 tabs:

#### Tab 1: Risk Overview
Split layout:
- **Left (2/3 width)**: `AtRiskAccountsTable` — sortable by health score, churn %, renewal days. Includes inline health bars and signal tags.
- **Right (1/3 width)**: `ChurnProbabilityMatrix` — distribution of accounts by churn probability bucket, plus top 5 churn drivers ranked by prevalence.

#### Tab 2: Signal Feed
A **reverse-chronological event feed** of AI-detected risk signals. Each signal card:
- Color-coded by severity (critical = red left border, warning = amber, info = purple, positive = green)
- Filterable by signal type AND category (Usage, Relationship, Support, Competitive, NPS, Engagement, Expansion)
- Expandable to show full description + contextual action buttons (Trigger Playbook, Schedule EBR, etc.)
- Unread indicator dot

**Design reasoning:** CSMs are overwhelmed with data. The signal feed distills telemetry into **actionable English sentences** rather than raw numbers. "Usage dropped 62% WAU" is more actionable than "WAU: 12".

#### Tab 3: Escalations
Master/detail split view:
- **Left panel**: List of escalations with severity badge (P1/P2/P3), account, status, and last updated time
- **Right panel**: Full activity timeline thread (like a Slack thread or GitHub issue comments) with avatars, timestamps, and a reply box

**Design reasoning:** Escalations involve multiple people (CSM, Support, Engineering). The thread model mirrors communication tools CSMs already use (Slack, Jira), reducing cognitive load.

#### Tab 4: Expansion Signals
**Two views** toggled via a button:
- **Table view**: Sortable columns showing account, expansion type, value, probability, stage, signal trigger
- **Kanban pipeline view**: Horizontal stage-by-stage board (Early Signal → Qualifying → Nurturing → Demo Scheduled → Pricing Sent → Closed Won)

**Design reasoning:** Expansion opportunities are a **sales motion**, not just a CS motion. The Kanban view mirrors CRM pipelines (Salesforce, HubSpot) that sales teams use — making it familiar for revenue teams joining the dashboard.

---

## 7. Modal System

Three modals live above the main content layer:

| Modal | Trigger | Purpose |
|---|---|---|
| `AskAIModal` | "Ask AI" button in Header | Context-aware Q&A — the AI knows which account is active and its telemetry |
| `PlaybookModal` | "Trigger Playbook" CTA or header button | Shows playbook steps, execution progress, audit log, dispatch button |
| `ExportModal` | "Export Report" CTA | Executive briefing PDF preview with cover page, metrics snapshot, and recommended actions |

All modals use a **backdrop blur** (`backdrop-filter: blur`) for depth, and animate in/out with CSS transitions. They're mounted at the App level (not inside individual components) so they always render above everything regardless of z-index stacking.

---

## 8. API Endpoint Reference

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/accounts` | List of all accounts with summary fields |
| `GET` | `/api/accounts/:name` | Full telemetry for one account (or synthesized fallback) |
| `GET` | `/api/portfolio` | Aggregate portfolio metrics |
| `GET` | `/api/usage-adoption` | Usage & adoption telemetry data |
| `GET` | `/api/risk-signals` | Risk summary KPIs + top signals |
| `POST` | `/api/playbook/trigger` | Dispatch a playbook for an account |
| `POST` | `/api/ask-ai` | AI Q&A with account context injection |
| `POST` | `/api/feedback` | Capture user feedback on AI responses |

---

## 9. Design Patterns Used Throughout

### Pattern: Semantic Color = Instant Comprehension

Every color in the UI carries meaning:
- **Red** (`#ff6b6b`) = danger, critical, action required NOW
- **Amber** (`#f59e0b`) = warning, elevated risk, watch
- **Purple** (`#a78bfa`) = informational, neutral observation
- **Cyan** (`#2DD4CF`) = primary actions, live status, links
- **Green** (`#34d399`) = healthy, positive, expansion opportunity

A CSM scanning the dashboard never has to read a label to know if something is good or bad — color communicates it instantly.

### Pattern: Data Density Without Overwhelm

Enterprise dashboards have a tendency to either be **too sparse** (pretty but useless) or **too dense** (data overload). The approach here:
- Group related metrics into **cards** with a clear single headline
- Use **progressive disclosure** (expandable signal cards, tab navigation) to hide detail until needed
- Use **micro-labels** (`text-[10px]`) for secondary context so it's there but doesn't compete

### Pattern: Every View Has a "Now What?" Answer

Every screen has at least one primary CTA that answers "what should I do with this information?":
- Account Detail → "Trigger Playbook", "Schedule Review", "Export Report"
- Portfolio → "View" button on each at-risk account
- Signal Feed → "Trigger Playbook", "Schedule EBR", "Escalate"
- Escalations → "Post" reply, prioritized action buttons
- Expansion → "Create Opportunity", "Send Pricing"

---

## 10. Complete Component Tree

```
client/src/
├── App.jsx                          # State hub, routing, data fetch coordinator
├── index.css                        # Global dark theme base styles
├── main.jsx                         # React DOM entry point
└── components/
    ├── Header.jsx                   # Top nav: search, notifications, Ask AI, app switcher
    ├── Sidebar.jsx                  # Left nav: workspace title, nav items, sync status
    │
    ├── AccountDetail/               # Single Account Cockpit (#detail)
    │   ├── AccountDetailView.jsx    # Grid layout assembler
    │   ├── BreadcrumbBar.jsx        # Account selector dropdown with search
    │   ├── AccountHeaderCard.jsx    # Status pills, ARR, tier, CSM, action buttons
    │   ├── AccountSnapshotCard.jsx  # Fiscal metrics: ARR, YoY growth, TCV
    │   ├── HealthDonutCard.jsx      # 6-dimension SVG health donut
    │   ├── RenewalRiskCard.jsx      # Renewal countdown + active risk triggers
    │   ├── SignalsCard.jsx          # Signal distribution donut + event log
    │   ├── RecommendedActionsCard.jsx # Open prescriptions + playbook status
    │   ├── PeerCohortCard.jsx       # Similar at-risk accounts for context
    │   ├── TelemetryVelocityChart.jsx # 90-day SVG usage velocity + spike annotation
    │   ├── PrescribedActionsCard.jsx  # Dept-level action queue with CTAs
    │   └── ExecutiveSummaryCard.jsx   # AI narrative + feedback mechanism
    │
    ├── Portfolio/                   # Multi-account hub (#portfolio)
    │   └── PortfolioDashboard.jsx   # KPI strip, at-risk table, tier breakdown
    │
    ├── UsageAdoption/               # Product telemetry view (#usage-and-adoption)
    │   ├── UsageAdoptionView.jsx    # Layout assembler + account selector
    │   ├── UsageMetricStrip.jsx     # 5 WAU/DAU/API KPI cards
    │   ├── WeeklyUsageTrendChart.jsx # SVG multi-series trend sparkline
    │   ├── ProductAdoptionGrid.jsx  # Module-level heatmap grid
    │   ├── FeatureUtilizationTable.jsx # Granular feature usage % table
    │   └── AdoptionAnomaliesFeed.jsx   # AI-detected anomaly events
    │
    ├── RiskSignals/                 # Early warning system (#risk-signals)
    │   ├── RiskSignalsView.jsx      # Tab container + page header
    │   ├── RiskSummaryStrip.jsx     # 5 KPI summary cards
    │   ├── AtRiskAccountsTable.jsx  # Sortable risk table with health bars
    │   ├── ChurnProbabilityMatrix.jsx # Risk distribution + top churn drivers
    │   ├── SignalsFeed.jsx          # Filterable live signal cards
    │   ├── EscalationTimeline.jsx   # Master/detail escalation thread view
    │   └── ExpansionOpportunities.jsx # Table + Kanban expansion pipeline
    │
    └── Modals/                      # Overlay system (mounted at App level)
        ├── AskAIModal.jsx           # Live AI assistant with account context
        ├── PlaybookModal.jsx        # Playbook execution + audit timeline
        └── ExportModal.jsx          # Executive briefing PDF preview
```

---

## 11. What's Left / Future Directions

| Feature | Priority | Notes |
|---|---|---|
| Real database (PostgreSQL / MongoDB) | High | Replace `data.js` with persistent storage |
| Authentication & multi-tenant support | High | CSMs should only see their own accounts |
| Live WebSocket telemetry feed | Medium | Replace polling with push-based signal delivery |
| Action Playbooks page (`#playbooks`) | Medium | Currently shows placeholder — needs full CRUD |
| Notification center | Medium | Persistent unread signal history |
| Real AI integration (Gemini / OpenAI API) | Medium | Currently simulated responses in `/api/ask-ai` |
| CSV / PDF export engine | Low | Currently a preview UI only |
| Mobile responsive layout | Low | Currently desktop-optimized (1440px target) |
| Dark/Light theme toggle | Low | Currently dark-only |

---

## 12. Key Files Quick Reference

| File | What it does |
|---|---|
| `server/data.js` | The entire data universe — all mock telemetry |
| `server/index.js` | All Express API routes and business logic |
| `client/src/App.jsx` | Central brain — state, routing, data fetching |
| `client/src/components/Header.jsx` | Global nav bar with Ask AI, notifications, app switcher |
| `client/src/components/Sidebar.jsx` | Left nav — workspace context + sync status |
| `client/index.html` | Loads fonts, Tailwind config with Obsidian Telemetry tokens |
| `client/vite.config.js` | Vite proxy config (`/api` → port 5001) |

---

*Generated: October 2026 · Customer Intelligence Platform v1.0*
