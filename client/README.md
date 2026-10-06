# Client

React (Vite) frontend for the Customer Intelligence Platform. See the [root README](../README.md) for the full project overview.

## Scripts

```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # Production build into dist/
npm run preview  # Serve the production build
```

The dev server proxies `/api` to `http://localhost:${API_PORT || 5001}`, so start the backend first (or run `npm run dev` from the repo root to start both).

## Notes

- Navigation is hash-based (no React Router); `App.jsx` owns the current view, selected account and modals.
- Styling uses Tailwind via the CDN config in `index.html` plus `src/index.css`, with Obsidian Telemetry design tokens.
- Charts are hand-written SVG; there is no charting library.
- Components are grouped per view under `src/components/`. Some views (`CasesHistory`, `OpportunitiesActions`, `ActionCenter`) keep their own `data.js` / `account360.js` helpers that shape account data for display.
