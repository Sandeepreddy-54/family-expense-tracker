// Seed data for the demo household (Rohan + Priya).
//
// The app runs against a fixed demo date so the seeded date groups
// ("Today, Aug 6", "Aug 5", …) stay coherent no matter when it's opened.
// Swap TODAY for `new Date()` once real transactions come from a backend.

export const TODAY = new Date('2026-08-06');
export const TODAY_ISO = '2026-08-06';

export const CATS = [
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

export const catMeta = (name) =>
  CATS.find((c) => c.name === name) ||
  INCOME_CATS.find((c) => c.name === name) ||
  CATS[CATS.length - 1];

// Month-to-date spend per category. The visible transaction list only covers the
// last week, so these are the full-month figures; `deriveBaselines` in
// lib/totals.js backs the listed transactions out of them, and everything the
// user adds or deletes from here on moves the numbers for real.
//
// Starts at zero — real households build these up from scratch (or from an
// SMS backfill via the Import screen), not from a fixed baseline.
export const CAT_TOTALS = {
  'Food & Dining': { combined: 0, you: 0, priya: 0 },
  Groceries: { combined: 0, you: 0, priya: 0 },
  Transport: { combined: 0, you: 0, priya: 0 },
  Shopping: { combined: 0, you: 0, priya: 0 },
  'Bills & Utilities': { combined: 0, you: 0, priya: 0 },
  Entertainment: { combined: 0, you: 0, priya: 0 },
  Health: { combined: 0, you: 0, priya: 0 },
  Travel: { combined: 0, you: 0, priya: 0 },
  Rent: { combined: 0, you: 0, priya: 0 },
  Subscriptions: { combined: 0, you: 0, priya: 0 },
  Other: { combined: 0, you: 0, priya: 0 },
};

// No spend history yet — the Home hero hides the trend line until this is
// nonzero (see trendPct in useTracker.js).
export const LAST_MONTH = { combined: 0, you: 0, priya: 0 };

export const BUDGETS_DATA = [
  { category: 'Food & Dining', budget: 10000 },
  { category: 'Groceries', budget: 9000 },
  { category: 'Transport', budget: 5000 },
  { category: 'Shopping', budget: 9000 },
  { category: 'Bills & Utilities', budget: 7000 },
  { category: 'Entertainment', budget: 2500 },
  { category: 'Health', budget: 2000 },
  { category: 'Travel', budget: 10000 },
  { category: 'Rent', budget: 20000 },
  { category: 'Subscriptions', budget: 1500 },
  { category: 'Other', budget: 1500 },
];

export const DEFAULT_OVERALL_BUDGET = 80000;

export const CARDS_DATA = [
  { id: 'hdfc', name: 'HDFC Regalia', person: 'you', personLabel: 'Rohan', last4: '4521', limit: 300000, outstanding: 84500, dueDate: 'Aug 28', statementDate: '12th', minDue: 4200 },
  { id: 'icici', name: 'ICICI Amazon Pay', person: 'priya', personLabel: 'Priya', last4: '7788', limit: 150000, outstanding: 32800, dueDate: 'Aug 22', statementDate: '5th', minDue: 1650 },
];

export const ACCOUNT_NAMES = ['PhonePe (Rohan)', 'PhonePe (Priya)', 'HDFC Regalia', 'ICICI Amazon Pay'];

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

export const SMS_CATEGORY_CHOICES = [
  'Food & Dining', 'Shopping', 'Entertainment', 'Groceries', 'Transport', 'Bills & Utilities',
];

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
  iphoneForward: true,
  notifNewTx: true,
  notifBudget: true,
  notifBills: true,
  notifWeekly: false,
  shared: true,
};

export const DEFAULT_PROFILE = {
  loggedIn: false,
  name: '',
  partnerName: '',
  syncCode: '',
  synced: false,
};

export const NOTIF_TOGGLES = [
  { key: 'notifNewTx', label: 'New auto-detected transaction' },
  { key: 'notifBudget', label: 'Budget threshold alerts (85%)' },
  { key: 'notifBills', label: 'Bill due reminders' },
  { key: 'notifWeekly', label: 'Weekly summary' },
];
