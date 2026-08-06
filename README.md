# Family Expense Tracker

A shared household spending tracker for two people (Rohan on Android, Priya on iPhone), built as a
React app rendered inside an iOS device frame.

Implemented from the Claude Design project **Shared Spending Tracker App**
(`Family Expense Tracker.dc.html`), using the **Organic** design system that ships with it.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5180. `npm run build` produces a static bundle in `dist/`.

Node 20+ is required.

## What's in it

| Area | What it does |
| --- | --- |
| **Home → Overview** | Month-to-date hero total, SMS review prompt, budget alerts, top categories, bills due in the next 7 days, recent transactions |
| **Home → Trends** | Six-month bar chart, full category breakdown, weekly heatmap, net-worth snapshot and savings goal |
| **Activity** | Every transaction, grouped by date, filterable by person and by auto/manual capture |
| **Cards** | Combined utilisation plus per-card detail with that card's transactions |
| **Budgets** | Editable overall and per-category limits with live progress and per-person split |
| **Settings** | Which person you're acting as, SMS linkage toggles, notification preferences, and entry points to Bills, Loans and Export |
| **Add** | Keypad entry for an expense or income, tagged to a person, category and account |
| **Review payments** | Confirm or discard payments parsed out of bank SMS, correcting the category and person first |
| **Bills** | Auto-detected and hand-added bills, with mark-paid and remove |
| **Loans & lending** | Loan/EMI summaries plus IOUs with friends and family |
| **Export** | Real CSV download for a week, a month, or a custom date range |

Every person selector, filter and budget edit recomputes from the live transaction list — the
numbers are not fixtures.

## How it's built

```
src/
  App.jsx              tab bar, screen routing
  main.jsx             entry point
  components/
    IOSDevice.jsx      iOS bezel, status bar, home indicator (ported from the design's ios-frame.jsx)
    ui.jsx             Seg, Bar, Badge, Toggle, TxRow and other shared pieces
  data/seed.js         seeded household: transactions, cards, loans, bills, budgets, SMS queue
  lib/
    format.js          rupee and date formatting
    dates.js           date grouping and export ranges
    totals.js          month-to-date category totals
    csv.js             export builder and download
  screens/             one file per tab and per pushed screen
  state/useTracker.js  all state, derivations and actions
  styles/
    organic.css        the design system, vendored verbatim
    app.css            app-level helpers
```

`src/styles/organic.css` is a verbatim copy of the design project's stylesheet. Don't hand-edit it —
re-pull it from the design project instead. All colour, spacing, radius and shadow values in the app
come from its tokens.

### State

`useTracker` holds everything. Household data (transactions, bills, IOUs, budget overrides,
settings) persists to `localStorage` under `family-expense-tracker/v1`; view state (current tab,
filters, open screen) is deliberately not persisted. **Settings → Reset to seeded data** clears it.

### How the month totals work

The seeded `CAT_TOTALS` are full-month figures, but the visible transaction list only covers the last
week. `lib/totals.js` subtracts the listed transactions from those totals to get an
earlier-in-the-month baseline, then adds the live list back on top. First load reproduces the design's
numbers exactly (₹75,030 combined), and every add, delete or SMS confirmation moves them for real.

## Where this departs from the prototype

The source `.dc.html` is a click-through prototype, so a few things there were display-only. Where
that would have shipped visibly wrong behaviour, this implementation does the real thing:

- **Totals are derived, not fixed.** In the prototype the hero total and budget bars were constants,
  so adding or deleting a transaction changed nothing. Here they recompute.
- **Trends follows the person selector.** The prototype always showed combined figures on Trends even
  with "You" or "Priya" selected.
- **Export writes a real CSV.** The prototype only showed a "check your downloads" message.
- **Notifications are derived** from the live SMS queue, budget state and next due bill, rather than a
  fixed list that would keep claiming "3 new payments" after you'd cleared them.
- **Keyboard focus works on segmented controls.** The prototype set `display:none` on the radios,
  which removed them from the tab order and defeated the design system's focus ring.
- **"Pay now"** on a card is disabled rather than inert-but-enabled — payments run through the bank,
  not this app.

Not implemented, matching the prototype: **+ Add category** in Settings is a visual affordance only.

## Demo data

The app runs against a fixed demo date of **6 Aug 2026** so the seeded date groups stay coherent.
All people, merchants, card numbers and balances are invented. There is no backend, no bank
connection and no real SMS parsing — `data/seed.js` is the whole data layer.
