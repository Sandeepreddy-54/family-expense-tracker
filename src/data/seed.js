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
export const CAT_TOTALS = {
  'Food & Dining': { combined: 9200, you: 5200, priya: 4000 },
  Groceries: { combined: 8600, you: 4600, priya: 4000 },
  Transport: { combined: 4300, you: 3100, priya: 1200 },
  Shopping: { combined: 11200, you: 3800, priya: 7400 },
  'Bills & Utilities': { combined: 6400, you: 6400, priya: 0 },
  Entertainment: { combined: 1900, you: 900, priya: 1000 },
  Health: { combined: 1360, you: 0, priya: 1360 },
  Travel: { combined: 9400, you: 9400, priya: 0 },
  Rent: { combined: 20000, you: 20000, priya: 0 },
  Subscriptions: { combined: 1470, you: 649, priya: 821 },
  Other: { combined: 1200, you: 0, priya: 1200 },
};

export const LAST_MONTH = { combined: 68500, you: 49200, priya: 19300 };

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
export const CARD_EMIS_INITIAL = [
  { id: 1, cardId: 'hdfc', item: 'MacBook Air M2', amount: 89999, tenureMonths: 12, paidMonths: 5, startDate: '2026-04-05' },
  { id: 2, cardId: 'icici', item: 'iPhone 15', amount: 64900, tenureMonths: 9, paidMonths: 2, startDate: '2026-06-15' },
];

// Transactions carry a real ISO date; the "Today, Aug 6" / "Aug 5" group
// headings the design shows are derived from it (see lib/dates.js), which is
// also what makes the export date filters real.
export const TX_INITIAL = [
  { id: 1, date: '2026-08-06', merchant: 'Swiggy', category: 'Food & Dining', amount: 420, person: 'you', account: 'PhonePe (Rohan)', source: 'auto' },
  { id: 2, date: '2026-08-06', merchant: 'Big Bazaar', category: 'Groceries', amount: 1860, person: 'priya', account: 'PhonePe (Priya)', source: 'auto' },
  { id: 3, date: '2026-08-05', merchant: 'Uber', category: 'Transport', amount: 260, person: 'you', account: 'PhonePe (Rohan)', source: 'auto' },
  { id: 4, date: '2026-08-05', merchant: 'Amazon', category: 'Shopping', amount: 3499, person: 'priya', account: 'ICICI Amazon Pay', source: 'auto' },
  { id: 5, date: '2026-08-05', merchant: 'Electricity Bill', category: 'Bills & Utilities', amount: 2380, person: 'you', account: 'PhonePe (Rohan)', source: 'manual' },
  { id: 6, date: '2026-08-04', merchant: 'Netflix', category: 'Subscriptions', amount: 649, person: 'you', account: 'HDFC Regalia', source: 'auto' },
  { id: 7, date: '2026-08-04', merchant: 'Local Store', category: 'Groceries', amount: 540, person: 'you', account: 'PhonePe (Rohan)', source: 'manual' },
  { id: 8, date: '2026-08-03', merchant: 'Zomato', category: 'Food & Dining', amount: 610, person: 'priya', account: 'PhonePe (Priya)', source: 'auto' },
  { id: 9, date: '2026-08-03', merchant: 'MakeMyTrip', category: 'Travel', amount: 8200, person: 'you', account: 'HDFC Regalia', source: 'auto' },
  { id: 10, date: '2026-08-02', merchant: 'Salon', category: 'Other', amount: 1200, person: 'priya', account: 'PhonePe (Priya)', source: 'manual' },
  { id: 11, date: '2026-08-02', merchant: 'Petrol Pump', category: 'Transport', amount: 1500, person: 'you', account: 'PhonePe (Rohan)', source: 'auto' },
  { id: 12, date: '2026-08-01', merchant: 'Rent Transfer', category: 'Rent', amount: 20000, person: 'you', account: 'PhonePe (Rohan)', source: 'manual' },
  { id: 13, date: '2026-08-01', merchant: 'Spotify', category: 'Subscriptions', amount: 119, person: 'priya', account: 'ICICI Amazon Pay', source: 'auto' },
  { id: 14, date: '2026-07-31', merchant: 'H&M', category: 'Shopping', amount: 2340, person: 'you', account: 'HDFC Regalia', source: 'auto' },
  { id: 15, date: '2026-07-31', merchant: 'Apollo Pharmacy', category: 'Health', amount: 680, person: 'priya', account: 'PhonePe (Priya)', source: 'auto' },
];

export const SMS_INITIAL = [
  { id: 's1', raw: 'Rs.560.00 debited from A/c *3456 on 06-Aug-26 to VPA swiggy@ybl. UPI Ref 5521487933. -PhonePe', merchant: 'Swiggy Delivery', amount: 560, account: 'PhonePe (Rohan)', category: 'Food & Dining', person: 'you' },
  { id: 's2', raw: 'Your HDFC Bank Credit Card XX4521 has been used for Rs 4,250.00 at DECATHLON on 06-Aug-26.', merchant: 'Decathlon', amount: 4250, account: 'HDFC Regalia', category: 'Shopping', person: 'you' },
  { id: 's3', raw: 'ICICI Bank: INR 899.00 spent on Amazon Pay Card ending 7788 at BOOKMYSHOW on 05-Aug-26.', merchant: 'BookMyShow', amount: 899, account: 'ICICI Amazon Pay', category: 'Entertainment', person: 'priya' },
];

export const SMS_CATEGORY_CHOICES = [
  'Food & Dining', 'Shopping', 'Entertainment', 'Groceries', 'Transport', 'Bills & Utilities',
];

export const LOANS_DATA = [
  { id: 'home', name: 'Home Loan — SBI', principal: 2500000, outstanding: 1870000, roi: 8.6, emi: 21500, tenureLeft: '9 yrs 4 mo', dueDate: 'Aug 5' },
  { id: 'car', name: 'Car Loan — HDFC', principal: 600000, outstanding: 210000, roi: 9.25, emi: 12800, tenureLeft: '1 yr 6 mo', dueDate: 'Aug 7' },
];

export const IOU_INITIAL = [
  { id: 1, direction: 'lent', person: 'Arjun (friend)', amount: 8000, date: 'Jul 12', note: 'Trip advance', status: 'pending' },
  { id: 2, direction: 'borrowed', person: 'Amit (brother)', amount: 15000, date: 'Jun 2', note: 'Bike repair help', status: 'pending' },
  { id: 3, direction: 'lent', person: 'Neha (cousin)', amount: 3000, date: 'May 20', note: 'Book fair', status: 'repaid' },
];

export const BILLS_INITIAL = [
  { id: 1, name: 'Netflix', amount: 649, dueDate: '2026-08-10', autoDetected: true, paid: false, category: 'Subscriptions' },
  { id: 2, name: 'Electricity', amount: 2400, dueDate: '2026-08-15', autoDetected: true, paid: false, category: 'Bills & Utilities' },
  { id: 3, name: 'Wifi', amount: 999, dueDate: '2026-08-18', autoDetected: true, paid: false, category: 'Bills & Utilities' },
  { id: 4, name: 'Rent', amount: 20000, dueDate: '2026-09-01', autoDetected: false, paid: false, category: 'Rent' },
];

// Historical months for the Trends bar chart. The final entry is replaced with
// the live month-to-date total at render time; any other month is replaced too
// as soon as real transactions exist for it (e.g. backfilled via SMS import) —
// see realMonthlyTotal in lib/totals.js.
export const MONTH_HISTORY = [
  { label: 'Mar', month: '2026-03', amount: 61000 },
  { label: 'Apr', month: '2026-04', amount: 58000 },
  { label: 'May', month: '2026-05', amount: 72000 },
  { label: 'Jun', month: '2026-06', amount: 69500 },
  { label: 'Jul', month: '2026-07', amount: 68500 },
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

// Notifications the app can't derive from live state — past events.
export const NOTIFS_HISTORICAL = {
  recurringDetected: {
    id: 'n-recurring', letter: 'A', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)',
    title: 'New recurring bill detected: Electricity, ~₹2,400 monthly', time: '2 days ago',
  },
  weekly: {
    id: 'n-weekly', letter: 'W', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)',
    title: 'Weekly summary ready', time: '3 days ago',
  },
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
