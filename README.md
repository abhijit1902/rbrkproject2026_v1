# Customer Intelligence Platform

A high-density telemetry console for enterprise B2B Customer Success and Retention teams, modeled after the **Obsidian Telemetry** design system from Stitch (`screen: 8a1d0414e2664495ac3fe89bf3b17b65`).

Built with **Express**, **Node.js**, and **React**.

---

## 🚀 Tech Stack

- **Backend**: Express & Node.js (`server/`)
  - RESTful APIs for account metrics, multi-account portfolio overview, and signals.
  - Interactive AI Q&A endpoint (`/api/ask-ai`) contextualized by telemetry data.
  - Action playbook dispatching engine (`/api/playbook/trigger`).
- **Frontend**: React (Vite) (`client/`)
  - Modular component architecture.
  - Precision dark enterprise styling matching the **Obsidian Telemetry** design tokens (`#00142c`, `#09203b`, `#2dd4cf`, `#3ECF8E`, `#F4664A`).
  - Google Fonts: *Inter* and *JetBrains Mono*, with *Material Symbols Outlined*.
  - SVG telemetry charts (multi-segment health donut, 90-day velocity curve, signals distribution).
- **Tooling**: Concurrently for running both server and client together.

---

## 📁 Project Structure

```
.
├── package.json               # Root scripts coordinating server & client
├── server/                    # Express & Node.js backend
│   ├── index.js               # API server routes and dispatch logic
│   ├── data.js                # Telemetry dictionary for accounts & portfolio
│   └── package.json           # Server dependencies (express, cors)
└── client/                    # React frontend (Vite)
    ├── index.html             # Fonts and Obsidian Telemetry styling config
    ├── vite.config.js         # Vite configuration with API proxy to port 5001
    ├── src/
    │   ├── main.jsx           # React root entry
    │   ├── App.jsx            # State coordinator, view routing & modals
    │   ├── index.css          # Dark enterprise styles
    │   └── components/
    │       ├── Header.jsx     # Navigation, Ask AI trigger, notifications, app switcher
    │       ├── Sidebar.jsx    # Enterprise Health Matrix workspace, live sync status
    │       ├── AccountDetail/ # Single Account Cockpit
    │       │   ├── AccountDetailView.jsx       # Grid layout assembler
    │       │   ├── BreadcrumbBar.jsx          # Interactive account selector dropdown
    │       │   ├── AccountHeaderCard.jsx      # KPIs, status pills, ARR & renewal date
    │       │   ├── AccountSnapshotCard.jsx    # Fiscal metrics, ARR, YoY, contract value
    │       │   ├── HealthDonutCard.jsx        # SVG 6-dimension health breakdown
    │       │   ├── RenewalRiskCard.jsx        # Expiration countdown & active risk triggers
    │       │   ├── SignalsCard.jsx            # Real-time signal distribution donut & log
    │       │   ├── RecommendedActionsCard.jsx # Open prescriptions & active playbook
    │       │   ├── PeerCohortCard.jsx         # At-risk accounts vector match
    │       │   ├── TelemetryVelocityChart.jsx # 90-day velocity chart with spike annotation
    │       │   ├── PrescribedActionsCard.jsx  # Department queue with action CTAs
    │       │   └── ExecutiveSummaryCard.jsx   # AI synthesized narrative & feedback
    │       ├── Portfolio/
    │       │   └── PortfolioDashboard.jsx     # 340-account overview & at-risk ranking
    │       └── Modals/
    │           ├── AskAIModal.jsx             # Live AI Assistant connected to backend
    │           ├── PlaybookModal.jsx          # Playbook execution & audit timeline
    │           └── ExportModal.jsx            # Executive briefing PDF preview
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
- **Backend API**: `http://localhost:5001`
