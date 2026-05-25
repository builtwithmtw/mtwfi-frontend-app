# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (usually http://localhost:5173 or 5174)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

No linter or test runner is configured.

## Architecture

Single-page React app (Vite + React 18) for a Financial Independence calculator targeting Pakistani investors (PKR currency, PSX equities).

### Data flow

All application state lives in `App.jsx`:
- `inputs` — flat object with user profile fields plus a nested `expenses` sub-object
- `portfolioAssets` — array of `{ name, alloc, ret, color }` objects
- `compoundingMode` — `'real'` | `'nominal'`
- `activeTab` — which of the 5 tabs is visible

Every input change re-runs `runCalculations()` (wrapped in `useMemo`) which returns a single `calc` object consumed by the tab components. There is no external state library, no context, and no side effects — the entire app is a pure function of those four state values.

### Key files

| File | Role |
|---|---|
| `src/utils/calculations.js` | Pure function `runCalculations(inputs, assets, mode)` — all financial math lives here. Simulates month-by-month corpus growth up to 40 years. |
| `src/utils/formatters.js` | `formatPKRShort(num)` — formats numbers as Millions / Lacs / Thousands in PKR. `formatNumber(num)` is an alias without the ₨ symbol. |
| `src/components/ProjectionChart.jsx` | Recharts `ComposedChart` rendering the corpus growth chart: green `Area` fill, solid `Line` for compounded corpus, dashed `Line` for cumulative invested, `ReferenceLine` for the FI target, and a `ReferenceDot` at the FI crossing point. |
| `src/components/tabs/` | One file per tab — each receives slices of `calc` and `inputs` as props; none hold their own state. |

### Financial model (calculations.js)

- **Target corpus** = annual expenses ÷ (real CAGR / 100), where real CAGR = portfolio CAGR − inflation, floored at 1% to avoid division by zero.
- **Portfolio CAGR** = weighted average of `(alloc/100) * ret` across all assets.
- **Projection loop** compounds `remainingCorpus` (= totalCorpus − emergencyFund) monthly, adds SIP each month, then adds `emergencyFund` back for the displayed corpus. Stops when corpus ≥ target (minimum 10 years) or at 40 years.
- `compoundingMode === 'real'` uses real CAGR for the projection loop; `'nominal'` uses the raw portfolio CAGR.

### Styling

All styles are in `src/index.css` as plain CSS custom properties (no CSS-in-JS, no Tailwind). The design uses a dark green palette (`--primary: #10b981`). Inline styles are used sparingly for dynamic values (e.g., progress bar width, asset bar fill widths).
