// Seed data for the demo household (Rohan + Priya).
//
// The app runs against a fixed demo date so the seeded date groups
// ("Today, Aug 6", "Aug 5", …) stay coherent no matter when it's opened.
// Swap TODAY for `new Date()` once real transactions come from a backend.

export const TODAY = new Date('2026-08-06');
export const TODAY_ISO = '2026-08-06';

// Starting set of expense categories — seeds `data.categories` on first load.
// From then on it's fully user-editable (add/remove in Settings), so this is
// just a sensible default, not a fixed list. "Other" is the one category that
// can't be removed — it's the reassignment target when another category is
// deleted while transactions or bills still use it.
export const CATEGORIES_INITIAL = [
  { name: 'Food & Dining', letter: 'F', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-500)' },
  { name: 'Groceries', letter: 'G', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-500)' },
  { name: 'Transport', letter: 'T', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-500)' },
  { name: 'Shopping', letter: 'S', bg: 'var(--color-accent-200)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-600)' },
  { name: 'Bills & Utilities', letter: 'B', bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-600)' },
  { name: 'Entertainment', letter: 'E', bg: 'var(--color-neutral-300)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-600)' },
  { name: 'Health', letter: 'H', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-400)' },
  { name: 'Travel', letter: 'Tr', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-400)' },
  { name: 'Rent', letter: 'R', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-700)' },
  { name: 'Subscriptions', letter: 'Su', bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-500)' },
  { name: 'Other', letter: 'O', bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-800)', bg2: 'var(--color-neutral-400)' },
];

export const INCOME_CATS = [
  { name: 'Salary', letter: 'Sa', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', bg2: 'var(--color-accent-2-500)' },
  { name: 'Freelance', letter: 'Fr', bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-600)' },
  { name: 'Refund', letter: 'Rf', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', bg2: 'var(--color-accent-2-500)' },
  { name: 'Gift', letter: 'Gi', bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-600)' },
  { name: 'Interest', letter: 'In', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', bg2: 'var(--color-accent-2-500)' },
  { name: 'Other Income', letter: 'OI', bg: 'var(--color-accent-2-300)', fg: 'var(--color-accent-2-900)', bg2: 'var(--color-accent-2-700)' },
];

// No spend history yet — the Home hero hides the trend line until this is
// nonzero (see trendPct in useTracker.js).
export const LAST_MONTH = { combined: 0, you: 0, priya: 0 };

// Default monthly budget per starting category — only used until the user
// sets their own (data.budgetOverrides). Categories added later that aren't
// in this map fall back to FALLBACK_BUDGET.
export const DEFAULT_BUDGETS = {
  'Food & Dining': 10000,
  Groceries: 9000,
  Transport: 5000,
  Shopping: 9000,
  'Bills & Utilities': 7000,
  Entertainment: 2500,
  Health: 2000,
  Travel: 10000,
  Rent: 20000,
  Subscriptions: 1500,
  Other: 1500,
};
export const FALLBACK_BUDGET = 2000;

export const DEFAULT_OVERALL_BUDGET = 80000;

// Bank accounts and credit cards — starts empty, same as every other entity
// this session. limit/statementDay/dueDay only exist on type: 'credit' rows;
// cycle-to-date spend is computed live from real transactions in
// lib/cardCycle.js, never stored (see useTracker.js's `accounts` derivation).
export const ACCOUNTS_INITIAL = [];

// Credit-card EMIs — a large purchase converted to fixed monthly installments
// on a specific card. `paidMonths` is how many instalments have gone through;
// everything else (next due date, months left, per-month amount) is derived
// from it in lib/emi.js so there's one source of truth per EMI.
//
// Starts empty — add real ones from the EMIs screen.
export const CARD_EMIS_INITIAL = [];

// Transactions carry a real ISO date; the "Today, Aug 6" / "Aug 5" group
// headings the design shows are derived from it (see lib/dates.js), which is
// also what makes the export date filters real.
//
// Starts empty — add manually or backfill via Settings → Import past messages.
export const TX_INITIAL = [];

// Starts empty — the app populates this live from real SMS as they come in
// (or from a pasted backfill), not from fixtures.
export const SMS_INITIAL = [];

export const LOANS_DATA = [
  { id: 'home', name: 'Home Loan — SBI', principal: 2500000, outstanding: 1870000, roi: 8.6, emi: 21500, tenureLeft: '9 yrs 4 mo', dueDate: 'Aug 5' },
  { id: 'car', name: 'Car Loan — HDFC', principal: 600000, outstanding: 210000, roi: 9.25, emi: 12800, tenureLeft: '1 yr 6 mo', dueDate: 'Aug 7' },
];

// Starts empty — add real IOUs from the Loans & lending screen.
export const IOU_INITIAL = [];

// Starts empty — add real bills from the Bills & reminders screen.
export const BILLS_INITIAL = [];

// Historical months for the Trends bar chart. The final entry is replaced with
// the live month-to-date total at render time; any other month starts at zero
// and is replaced as soon as real transactions exist for it (e.g. backfilled
// via SMS import) — see realMonthlyTotal in lib/totals.js.
export const MONTH_HISTORY = [
  { label: 'Mar', month: '2026-03', amount: 0 },
  { label: 'Apr', month: '2026-04', amount: 0 },
  { label: 'May', month: '2026-05', amount: 0 },
  { label: 'Jun', month: '2026-06', amount: 0 },
  { label: 'Jul', month: '2026-07', amount: 0 },
  { label: 'Aug', month: '2026-08', amount: null },
];

export const HEATMAP_SEED = [
  1, 2, 0, 1, 3, 2, 1,
  2, 1, 3, 2, 1, 0, 1,
  0, 2, 1, 2, 3, 1, 2,
  1, 3, 2, 1, 2, 3, 2,
];

export const HEATMAP_COLORS = [
  'var(--color-neutral-200)',
  'var(--color-accent-2-300)',
  'var(--color-accent-2-500)',
  'var(--color-accent-700)',
];

export const NET_WORTH = {
  savings: 420000,
  fds: 200000,
  cardDebt: 117300,
  goalSaved: 93000,
  goalTarget: 150000,
};

export const DEFAULT_SETTINGS = {
  smsAndroid: true,
  notifNewTx: true,
  notifBudget: true,
  notifBills: true,
  notifWeekly: false,
};

export const DEFAULT_PROFILE = {
  loggedIn: false,
  name: '',
  partnerName: '',
};

export const NOTIF_TOGGLES = [
  { key: 'notifNewTx', label: 'New auto-detected transaction' },
  { key: 'notifBudget', label: 'Budget threshold alerts (85%)' },
  { key: 'notifBills', label: 'Bill due reminders' },
  { key: 'notifWeekly', label: 'Weekly summary' },
];
