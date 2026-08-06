import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BILLS_INITIAL, BUDGETS_DATA, CARDS_DATA, DEFAULT_OVERALL_BUDGET,
  DEFAULT_SETTINGS, IOU_INITIAL, LAST_MONTH, NOTIFS_HISTORICAL, SMS_INITIAL,
  TODAY, TODAY_ISO, TX_INITIAL, catMeta,
} from '../data/seed.js';
import { categoryTotals, monthTotal } from '../lib/totals.js';
import { daysUntil, inr, muted, shortDate } from '../lib/format.js';
import { byDateDesc, groupByDate } from '../lib/dates.js';

const STORAGE_KEY = 'family-expense-tracker/v1';

const freshData = () => ({
  transactions: TX_INITIAL,
  smsQueue: SMS_INITIAL,
  bills: BILLS_INITIAL,
  ious: IOU_INITIAL,
  budgetOverrides: {},
  overallBudget: DEFAULT_OVERALL_BUDGET,
  settings: DEFAULT_SETTINGS,
  currentUser: 'you',
});

function loadData() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshData();
    // Merge over the defaults so a stored blob from an older build still boots.
    return { ...freshData(), ...JSON.parse(raw) };
  } catch {
    return freshData();
  }
}

export function useTracker() {
  // ── persisted household data ───────────────────────────────────────────────
  const [data, setData] = useState(loadData);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* private mode / quota — the app still works, it just won't remember */
    }
  }, [data]);
  const patch = useCallback((fields) => setData((d) => ({ ...d, ...fields })), []);

  // ── ephemeral UI state ─────────────────────────────────────────────────────
  const [person, setPerson] = useState('combined');
  const [homeView, setHomeView] = useState('overview');
  const [tab, setTab] = useState('home');
  const [screen, setScreen] = useState(null);
  const [txFilter, setTxFilter] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [smsIndex, setSmsIndex] = useState(0);

  const openScreen = useCallback((name) => setScreen(name), []);
  const closeScreen = useCallback(() => setScreen(null), []);

  // ── derived: spend ─────────────────────────────────────────────────────────
  const totals = useMemo(() => categoryTotals(data.transactions), [data.transactions]);
  const heroTotal = monthTotal(totals, person);
  const lastMonth = LAST_MONTH[person === 'combined' ? 'combined' : person];
  const trendPct = Math.round(((heroTotal - lastMonth) / lastMonth) * 100);
  const overallSpent = monthTotal(totals, 'combined');

  const transactions = useMemo(
    () => [...data.transactions].sort(byDateDesc).map((tx) => {
      const m = catMeta(tx.category);
      const isIncome = tx.type === 'income';
      return {
        ...tx,
        letter: m.letter, bg: m.bg, fg: m.fg,
        amountLabel: (isIncome ? '+' : '−') + inr(tx.amount),
        amountColor: isIncome ? 'var(--color-accent-2-700)' : 'var(--color-text)',
        subLabel: `${tx.category} · ${tx.account}`,
        sourceLabel: tx.source === 'auto' ? 'Auto' : 'Manual',
        canDelete: tx.person === data.currentUser,
      };
    }),
    [data.transactions, data.currentUser],
  );

  // ── derived: budgets ───────────────────────────────────────────────────────
  const budgets = useMemo(
    () => BUDGETS_DATA.map((b) => {
      const budget = data.budgetOverrides[b.category] ?? b.budget;
      const t = totals[b.category];
      const pct = Math.round((t.combined / budget) * 100);
      return { ...b, ...catMeta(b.category), budget, spent: t.combined, you: t.you, priya: t.priya, pct };
    }),
    [data.budgetOverrides, totals],
  );

  const budgetAlerts = useMemo(
    () => budgets
      .filter((b) => b.category !== 'Rent' && b.pct >= 90)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 2)
      .map((b) => ({
        category: b.category,
        pct: b.pct,
        text: `${b.category} is at ${b.pct}% of its ${inr(b.budget)} budget`,
        dotColor: b.pct > 100 ? 'var(--color-accent-700)' : 'var(--color-accent-500)',
      })),
    [budgets],
  );

  // ── derived: bills ─────────────────────────────────────────────────────────
  const bills = useMemo(
    () => data.bills.map((b) => {
      const d = daysUntil(b.dueDate, TODAY);
      return {
        ...b,
        days: d,
        dueLabel: shortDate(b.dueDate),
        amountLabel: inr(b.amount),
        countLabel: d < 0 ? `Overdue ${Math.abs(d)}d` : d === 0 ? 'Due today' : `In ${d}d`,
        countColor: d <= 2 ? 'var(--color-accent-700)'
          : d <= 7 ? 'var(--color-accent-600)'
            : muted(55),
      };
    }).sort((a, b) => a.days - b.days),
    [data.bills],
  );
  const openBills = bills.filter((b) => !b.paid);
  const upcomingBills = openBills.filter((b) => b.days <= 7);

  // ── derived: cards ─────────────────────────────────────────────────────────
  const cards = useMemo(
    () => CARDS_DATA.map((c) => {
      const utilPct = Math.round((c.outstanding / c.limit) * 100);
      return {
        ...c,
        utilPct,
        utilLabel: `${utilPct}%`,
        tagBg: utilPct > 60 ? 'var(--color-accent-200)' : 'var(--color-accent-2-100)',
        tagFg: utilPct > 60 ? 'var(--color-accent-800)' : 'var(--color-accent-2-800)',
        barColor: utilPct > 60 ? 'var(--color-accent-600)' : 'var(--color-accent-2-500)',
        minDueLabel: inr(c.minDue),
      };
    }),
    [],
  );
  const cardsOutstanding = CARDS_DATA.reduce((s, c) => s + c.outstanding, 0);
  const cardsLimit = CARDS_DATA.reduce((s, c) => s + c.limit, 0);
  const detailCard = cards.find((c) => c.id === selectedCardId) || null;

  // ── derived: notifications ─────────────────────────────────────────────────
  const notifications = useMemo(() => {
    const out = [];
    if (data.smsQueue.length) {
      out.push({
        id: 'n-sms', letter: String(data.smsQueue.length),
        bg: 'var(--color-accent)', fg: 'var(--color-bg)',
        title: `${data.smsQueue.length} new payment${data.smsQueue.length === 1 ? '' : 's'} detected from SMS`,
        time: '5 min ago',
      });
    }
    if (budgetAlerts[0]) {
      const a = budgetAlerts[0];
      out.push({
        id: 'n-budget-1', letter: catMeta(a.category).letter,
        bg: 'var(--color-accent-200)', fg: 'var(--color-accent-800)',
        title: a.pct > 100
          ? `${a.category} budget exceeded — ${a.pct}% used`
          : `${a.category} at ${a.pct}% of budget`,
        time: 'Today',
      });
    }
    const nextBill = upcomingBills[0];
    if (nextBill) {
      out.push({
        id: 'n-bill', letter: nextBill.name.charAt(0),
        bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)',
        title: `${nextBill.name} ${inr(nextBill.amount)} ${nextBill.days <= 0 ? 'is due now' : `due in ${nextBill.days} days`}`,
        time: 'Today',
      });
    }
    out.push(NOTIFS_HISTORICAL.recurringDetected);
    if (budgetAlerts[1]) {
      const a = budgetAlerts[1];
      out.push({
        id: 'n-budget-2', letter: catMeta(a.category).letter,
        bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)',
        title: `${a.category} at ${a.pct}% of budget`,
        time: 'Yesterday',
      });
    }
    out.push(NOTIFS_HISTORICAL.weekly);
    return out;
  }, [data.smsQueue.length, budgetAlerts, upcomingBills]);

  const hasNotifDot = data.smsQueue.length > 0
    || budgetAlerts.length > 0
    || upcomingBills.some((b) => b.days <= 2);

  // ── actions ────────────────────────────────────────────────────────────────
  const addTransaction = useCallback((tx) => {
    setData((d) => ({
      ...d,
      transactions: [{ id: Date.now(), date: TODAY_ISO, ...tx }, ...d.transactions],
    }));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setData((d) => {
      const tx = d.transactions.find((t) => t.id === id);
      // Belt and braces — the UI already hides the control on other people's rows.
      if (!tx || tx.person !== d.currentUser) return d;
      if (!window.confirm('Delete this transaction?')) return d;
      return { ...d, transactions: d.transactions.filter((t) => t.id !== id) };
    });
  }, []);

  const updateSmsItem = useCallback((index, fields) => {
    setData((d) => ({
      ...d,
      smsQueue: d.smsQueue.map((q, i) => (i === index ? { ...q, ...fields } : q)),
    }));
  }, []);

  const confirmSms = useCallback((index) => {
    setData((d) => {
      const item = d.smsQueue[index];
      if (!item) return d;
      const tx = {
        id: Date.now(), date: TODAY_ISO, merchant: item.merchant, category: item.category,
        amount: item.amount, person: item.person, account: item.account, source: 'auto',
      };
      return {
        ...d,
        transactions: [tx, ...d.transactions],
        smsQueue: d.smsQueue.filter((_, i) => i !== index),
      };
    });
    setSmsIndex(0);
  }, []);

  const discardSms = useCallback((index) => {
    setData((d) => ({ ...d, smsQueue: d.smsQueue.filter((_, i) => i !== index) }));
    setSmsIndex(0);
  }, []);

  const setBudget = useCallback((category, value) => {
    const v = parseFloat(value);
    if (!v || v <= 0) return false;
    setData((d) => ({ ...d, budgetOverrides: { ...d.budgetOverrides, [category]: v } }));
    return true;
  }, []);

  const setOverallBudget = useCallback((value) => {
    const v = parseFloat(value);
    if (!v || v <= 0) return false;
    patch({ overallBudget: v });
    return true;
  }, [patch]);

  const addBill = useCallback(({ name, amount, dueDate }) => {
    const v = parseFloat(amount);
    if (!v || !name || !dueDate) return false;
    setData((d) => ({
      ...d,
      bills: [...d.bills, { id: Date.now(), name, amount: v, dueDate, autoDetected: false, paid: false, category: 'Other' }],
    }));
    return true;
  }, []);

  const markBillPaid = useCallback((id) => {
    setData((d) => ({ ...d, bills: d.bills.map((b) => (b.id === id ? { ...b, paid: true } : b)) }));
  }, []);

  const deleteBill = useCallback((id) => {
    setData((d) => ({ ...d, bills: d.bills.filter((b) => b.id !== id) }));
  }, []);

  const addIou = useCallback(({ direction, person: who, amount, note }) => {
    const v = parseFloat(amount);
    if (!v || !who) return false;
    setData((d) => ({
      ...d,
      ious: [{ id: Date.now(), direction, person: who, amount: v, date: 'Today', note, status: 'pending' }, ...d.ious],
    }));
    return true;
  }, []);

  const markIouRepaid = useCallback((id) => {
    setData((d) => ({
      ...d,
      ious: d.ious.map((i) => (i.id === id ? { ...i, status: 'repaid' } : i)),
    }));
  }, []);

  const toggleSetting = useCallback((key) => {
    setData((d) => ({ ...d, settings: { ...d.settings, [key]: !d.settings[key] } }));
  }, []);

  const txGroups = useMemo(() => groupByDate(transactions), [transactions]);

  const openCard = useCallback((id) => {
    setSelectedCardId(id);
    setScreen('cardDetail');
  }, []);

  const resetDemo = useCallback(() => {
    if (!window.confirm('Reset the demo back to its seeded data?')) return;
    setData(freshData());
    setScreen(null);
    setTab('home');
  }, []);

  return {
    // raw data
    data,
    // person / view
    person, setPerson, homeView, setHomeView,
    personLabel: person === 'combined' ? 'Combined' : person === 'you' ? 'You' : 'Priya',
    // navigation
    tab, setTab, screen, openScreen, closeScreen,
    txFilter, setTxFilter, smsIndex, setSmsIndex, openCard, detailCard,
    // derived
    totals, heroTotal, trendPct, overallSpent, transactions, txGroups,
    budgets, budgetAlerts, bills, openBills, upcomingBills,
    cards, cardsOutstanding, cardsLimit, notifications, hasNotifDot,
    // actions
    addTransaction, deleteTransaction, updateSmsItem, confirmSms, discardSms,
    setBudget, setOverallBudget, addBill, markBillPaid, deleteBill,
    addIou, markIouRepaid, toggleSetting, resetDemo,
    setCurrentUser: (u) => patch({ currentUser: u }),
  };
}
