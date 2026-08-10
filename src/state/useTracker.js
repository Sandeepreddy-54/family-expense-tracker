import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ACCOUNTS_INITIAL, BILLS_INITIAL, CARD_EMIS_INITIAL, CATEGORIES_INITIAL, DEFAULT_BUDGETS,
  DEFAULT_OVERALL_BUDGET, DEFAULT_PROFILE, DEFAULT_SETTINGS, FALLBACK_BUDGET, IOU_INITIAL,
  LAST_MONTH, SMS_INITIAL, TODAY, TODAY_ISO, TX_INITIAL,
} from '../data/seed.js';
import { categoryTotals, monthTotal, realMonthlyTotal } from '../lib/totals.js';
import { buildCategory, catMeta as catMetaFor } from '../lib/categories.js';
import { daysUntil, inr, muted, shortDate } from '../lib/format.js';
import { byDateDesc, groupByDate } from '../lib/dates.js';
import { deriveEmi } from '../lib/emi.js';
import { cycleSpend, lastStatementDate, nextOccurrence } from '../lib/cardCycle.js';
import { parseSmsBatch } from '../lib/smsParser.js';

const STORAGE_KEY = 'family-expense-tracker/v1';
const HIGH_AMOUNT_THRESHOLD = 2000;

const freshData = () => ({
  transactions: TX_INITIAL,
  smsQueue: SMS_INITIAL,
  bills: BILLS_INITIAL,
  ious: IOU_INITIAL,
  cardEmis: CARD_EMIS_INITIAL,
  accounts: ACCOUNTS_INITIAL,
  categories: CATEGORIES_INITIAL,
  budgetOverrides: {},
  overallBudget: DEFAULT_OVERALL_BUDGET,
  settings: DEFAULT_SETTINGS,
  currentUser: 'you',
  profile: DEFAULT_PROFILE,
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
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [smsIndex, setSmsIndex] = useState(0);
  const [emiCardId, setEmiCardId] = useState(null);
  const [emiReturnScreen, setEmiReturnScreen] = useState('emis');

  const openScreen = useCallback((name) => setScreen(name), []);
  const closeScreen = useCallback(() => setScreen(null), []);
  // Add EMI can be reached from the combined EMIs overview or from a single card's
  // detail screen — remember which, so Save/Cancel return to the right place instead
  // of falling all the way back to the tab bar (the app has no navigation stack).
  const openAddEmi = useCallback((cardId, returnTo = 'emis') => {
    setEmiCardId(cardId);
    setEmiReturnScreen(returnTo);
    setScreen('addEmi');
  }, []);

  // ── derived: identity ───────────────────────────────────────────────────────
  // Seed data was written for a fixed demo household (Rohan + Priya); once someone
  // logs in we display their real names everywhere instead.
  const youName = data.profile.name.trim() || 'You';
  const partnerName = data.profile.partnerName.trim() || 'Partner';
  const personalizeAccount = useCallback(
    (name) => name.replace('Rohan', youName).replace('Priya', partnerName),
    [youName, partnerName],
  );

  // ── derived: categories ────────────────────────────────────────────────────
  const catMeta = useCallback((name) => catMetaFor(name, data.categories), [data.categories]);

  // ── derived: spend ─────────────────────────────────────────────────────────
  const totals = useMemo(
    () => categoryTotals(data.transactions, data.categories.map((c) => c.name)),
    [data.transactions, data.categories],
  );
  const heroTotal = monthTotal(totals, person);
  const lastMonth = LAST_MONTH[person === 'combined' ? 'combined' : person];
  // No baseline yet (fresh household) — there's nothing meaningful to compare
  // against, so the Home hero hides the trend line instead of showing ±Infinity%.
  const trendPct = lastMonth > 0 ? Math.round(((heroTotal - lastMonth) / lastMonth) * 100) : null;
  const overallSpent = monthTotal(totals, 'combined');

  // categoryTotals only tracks spend (money out) — this is the other half of
  // the picture: every "money in" entry, so income is visible somewhere too
  // instead of only showing up as a stray "+" row in Activity.
  const incomeTotal = useMemo(() => {
    const list = person === 'combined' ? data.transactions : data.transactions.filter((tx) => tx.person === person);
    return list.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
  }, [data.transactions, person]);
  const netTotal = incomeTotal - heroTotal;

  const transactions = useMemo(
    () => [...data.transactions].sort(byDateDesc).map((tx) => {
      const m = catMeta(tx.category);
      const isIncome = tx.type === 'income';
      // Large expenses get called out in the same warm "attention" color the
      // rest of the app already uses for over-budget states, so a big spend
      // is easy to spot while scanning a long list.
      const isLarge = !isIncome && tx.amount > HIGH_AMOUNT_THRESHOLD;
      return {
        ...tx,
        letter: m.letter, bg: m.bg, fg: m.fg,
        amountLabel: (isIncome ? '+' : '−') + inr(tx.amount),
        amountColor: isIncome ? 'var(--color-accent-2-700)' : isLarge ? 'var(--color-accent-700)' : 'var(--color-text)',
        isLarge,
        subLabel: `${tx.category} · ${personalizeAccount(tx.account)}`,
        sourceLabel: tx.source === 'auto' ? 'Auto' : 'Manual',
        canDelete: tx.person === data.currentUser,
      };
    }),
    [data.transactions, data.currentUser, personalizeAccount, catMeta],
  );

  // ── derived: budgets ───────────────────────────────────────────────────────
  const budgets = useMemo(
    () => data.categories.map((c) => {
      const budget = data.budgetOverrides[c.name] ?? DEFAULT_BUDGETS[c.name] ?? FALLBACK_BUDGET;
      const t = totals[c.name] || { you: 0, priya: 0, combined: 0 };
      const pct = Math.round((t.combined / budget) * 100);
      return { ...c, category: c.name, budget, spent: t.combined, you: t.you, priya: t.priya, pct };
    }),
    [data.categories, data.budgetOverrides, totals],
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

  // ── derived: accounts (bank + credit card) ────────────────────────────────
  const accounts = useMemo(
    () => data.accounts.map((a) => {
      const personLabel = a.person === 'you' ? youName : partnerName;
      if (a.type !== 'credit') {
        const monthSpend = realMonthlyTotal(
          data.transactions.filter((tx) => tx.account === a.name),
          TODAY_ISO.slice(0, 7),
        );
        return { ...a, personLabel, monthSpend, monthSpendLabel: inr(monthSpend) };
      }
      const spend = cycleSpend(data.transactions, a, TODAY_ISO);
      const utilPct = a.limit ? Math.round((spend / a.limit) * 100) : 0;
      const statementIso = lastStatementDate(a.statementDay, TODAY_ISO);
      const dueIso = nextOccurrence(a.dueDay, TODAY_ISO);
      return {
        ...a,
        personLabel,
        cycleSpend: spend,
        cycleSpendLabel: inr(spend),
        utilPct,
        utilLabel: `${utilPct}%`,
        tagBg: utilPct > 60 ? 'var(--color-accent-200)' : 'var(--color-accent-2-100)',
        tagFg: utilPct > 60 ? 'var(--color-accent-800)' : 'var(--color-accent-2-800)',
        barColor: utilPct > 60 ? 'var(--color-accent-600)' : 'var(--color-accent-2-500)',
        statementDate: statementIso,
        statementLabel: shortDate(statementIso),
        dueDate: dueIso,
        dueLabel: shortDate(dueIso),
      };
    }),
    [data.accounts, data.transactions, youName, partnerName],
  );
  const creditAccounts = useMemo(() => accounts.filter((a) => a.type === 'credit'), [accounts]);
  const bankAccounts = useMemo(() => accounts.filter((a) => a.type !== 'credit'), [accounts]);
  const cardsCycleSpend = creditAccounts.reduce((s, a) => s + a.cycleSpend, 0);
  const cardsLimit = creditAccounts.reduce((s, a) => s + a.limit, 0);
  const detailAccount = accounts.find((a) => a.id === selectedAccountId) || null;

  // ── derived: card EMIs ──────────────────────────────────────────────────────
  const emis = useMemo(
    () => data.cardEmis.map(deriveEmi).map((e) => {
      const card = creditAccounts.find((c) => c.id === e.cardId);
      return { ...e, cardName: card ? card.name : 'Unknown card' };
    }).sort((a, b) => (a.nextDueDate || '9999') < (b.nextDueDate || '9999') ? -1 : 1),
    [data.cardEmis, creditAccounts],
  );
  const activeEmis = emis.filter((e) => !e.completed);
  const monthlyEmiTotal = activeEmis.reduce((s, e) => s + e.emiAmount, 0);
  const emiCardsCount = new Set(activeEmis.map((e) => e.cardId)).size;

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
    if (budgetAlerts[1]) {
      const a = budgetAlerts[1];
      out.push({
        id: 'n-budget-2', letter: catMeta(a.category).letter,
        bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)',
        title: `${a.category} at ${a.pct}% of budget`,
        time: 'Yesterday',
      });
    }
    return out;
  }, [data.smsQueue.length, budgetAlerts, upcomingBills, catMeta]);

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
        id: Date.now(), date: item.date || TODAY_ISO, merchant: item.merchant, category: item.category,
        amount: item.amount, person: item.person, account: item.account, source: 'auto',
        type: item.type || 'expense',
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

  const addCardEmi = useCallback(({ cardId, item, amount, tenureMonths, paidMonths = 0, startDate }) => {
    const total = parseFloat(amount);
    const months = parseInt(tenureMonths, 10);
    if (!cardId || !item?.trim() || !total || !months || !startDate) return false;
    setData((d) => ({
      ...d,
      cardEmis: [
        ...d.cardEmis,
        { id: Date.now(), cardId, item: item.trim(), amount: total, tenureMonths: months, paidMonths: Math.min(paidMonths, months), startDate },
      ],
    }));
    return true;
  }, []);

  const markEmiPaid = useCallback((id) => {
    setData((d) => ({
      ...d,
      cardEmis: d.cardEmis.map((e) => (e.id === id ? { ...e, paidMonths: Math.min(e.paidMonths + 1, e.tenureMonths) } : e)),
    }));
  }, []);

  const deleteCardEmi = useCallback((id) => {
    setData((d) => ({ ...d, cardEmis: d.cardEmis.filter((e) => e.id !== id) }));
  }, []);

  const addAccount = useCallback(({ name, type, person, last4, limit, statementDay, dueDay }) => {
    if (!name?.trim() || !person) return false;
    if (type === 'credit') {
      const lim = parseFloat(limit);
      const sDay = parseInt(statementDay, 10);
      const dDay = parseInt(dueDay, 10);
      if (!lim || lim <= 0) return false;
      if (!sDay || sDay < 1 || sDay > 31) return false;
      if (!dDay || dDay < 1 || dDay > 31) return false;
    }
    setData((d) => ({
      ...d,
      accounts: [...d.accounts, {
        id: Date.now(), name: name.trim(), type, person, last4: (last4 || '').trim(),
        ...(type === 'credit' ? { limit: parseFloat(limit), statementDay: parseInt(statementDay, 10), dueDay: parseInt(dueDay, 10) } : {}),
      }],
    }));
    return true;
  }, []);

  const deleteAccount = useCallback((id) => {
    setData((d) => ({ ...d, accounts: d.accounts.filter((a) => a.id !== id) }));
  }, []);

  const addCategory = useCallback((name) => {
    const clean = (name || '').trim();
    if (!clean) return { ok: false, error: 'Enter a category name.' };
    let result = { ok: true };
    setData((d) => {
      if (d.categories.some((c) => c.name.toLowerCase() === clean.toLowerCase())) {
        result = { ok: false, error: 'That category already exists.' };
        return d;
      }
      return { ...d, categories: [...d.categories, buildCategory(clean, d.categories)] };
    });
    return result;
  }, []);

  // How many transactions + bills currently use a category — shown before
  // deletion so removing one doesn't silently orphan real entries.
  const categoryUsageCount = useCallback(
    (name) => data.transactions.filter((tx) => tx.category === name).length
      + data.bills.filter((b) => b.category === name).length,
    [data.transactions, data.bills],
  );

  const deleteCategory = useCallback((name) => {
    if (name === 'Other') return; // permanent — the reassignment target below
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.name !== name),
      transactions: d.transactions.map((tx) => (tx.category === name ? { ...tx, category: 'Other' } : tx)),
      bills: d.bills.map((b) => (b.category === name ? { ...b, category: 'Other' } : b)),
      budgetOverrides: Object.fromEntries(Object.entries(d.budgetOverrides).filter(([k]) => k !== name)),
    }));
  }, []);

  const importSmsBatch = useCallback((text) => {
    // Parsed inside the updater (not from the outer `data` closure) so it
    // reads accounts as of the latest state, same reason confirmSms reads
    // d.smsQueue there rather than closing over a possibly-stale `data`.
    let count = 0;
    setData((d) => {
      const parsed = parseSmsBatch(text, d.accounts);
      count = parsed.length;
      if (!parsed.length) return d;
      return {
        ...d,
        smsQueue: [
          ...d.smsQueue,
          ...parsed.map((p, i) => ({
            id: `import-${Date.now()}-${i}`,
            raw: p.raw,
            merchant: p.merchant,
            amount: p.amount,
            account: p.account,
            category: p.category,
            type: p.type,
            date: p.date,
            person: d.currentUser,
          })),
        ],
      };
    });
    return count;
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

  const login = useCallback(({ name, partnerName = '' }) => {
    if (!name?.trim()) return false;
    setData((d) => ({
      ...d,
      profile: { ...d.profile, loggedIn: true, name: name.trim(), partnerName: partnerName.trim() },
    }));
    return true;
  }, []);

  const logout = useCallback(() => {
    setData((d) => ({ ...d, profile: { ...d.profile, loggedIn: false } }));
  }, []);

  const toggleSetting = useCallback((key) => {
    setData((d) => ({ ...d, settings: { ...d.settings, [key]: !d.settings[key] } }));
  }, []);

  const txGroups = useMemo(() => groupByDate(transactions), [transactions]);

  const openAccount = useCallback((id) => {
    setSelectedAccountId(id);
    setScreen('cardDetail');
  }, []);

  const clearData = useCallback(() => {
    if (!window.confirm('Clear all transactions, SMS queue, bills, IOUs, and card EMIs? This can\'t be undone.')) return;
    // Only the activity data — login, partner sync, settings and budgets are
    // untouched, so this doesn't sign anyone out.
    setData((d) => ({
      ...d, transactions: [], smsQueue: [], bills: [], ious: [], cardEmis: [],
    }));
    setScreen(null);
    setTab('home');
  }, []);

  // Restores content from a backup produced by lib/backup.js's buildBackup —
  // replaces activity data + accounts wholesale, same "not touching
  // login/settings" boundary as clearData, just refilling instead of emptying.
  const restoreBackup = useCallback((snapshot) => {
    setData((d) => ({
      ...d,
      transactions: snapshot.transactions ?? [],
      smsQueue: snapshot.smsQueue ?? [],
      bills: snapshot.bills ?? [],
      ious: snapshot.ious ?? [],
      cardEmis: snapshot.cardEmis ?? [],
      accounts: snapshot.accounts ?? [],
      // Older backups (taken before categories were user-editable) won't have
      // this key — fall back to what's already on the device instead of
      // wiping the category list out.
      categories: snapshot.categories ?? d.categories,
      budgetOverrides: snapshot.budgetOverrides ?? {},
      overallBudget: snapshot.overallBudget ?? d.overallBudget,
    }));
    setScreen(null);
    setTab('home');
  }, []);

  return {
    // raw data
    data,
    // identity
    youName, partnerName, personalizeAccount,
    // person / view
    person, setPerson, homeView, setHomeView,
    personLabel: person === 'combined' ? 'Combined' : person === 'you' ? 'You' : partnerName,
    // navigation
    tab, setTab, screen, openScreen, closeScreen,
    txFilter, setTxFilter, smsIndex, setSmsIndex, openAccount, detailAccount,
    emiCardId, emiReturnScreen, openAddEmi,
    // derived
    totals, heroTotal, trendPct, overallSpent, incomeTotal, netTotal, transactions, txGroups,
    budgets, budgetAlerts, bills, openBills, upcomingBills, catMeta,
    accounts, creditAccounts, bankAccounts, cardsCycleSpend, cardsLimit, notifications, hasNotifDot,
    emis, activeEmis, monthlyEmiTotal, emiCardsCount,
    // actions
    addTransaction, deleteTransaction, updateSmsItem, confirmSms, discardSms, importSmsBatch,
    setBudget, setOverallBudget, addBill, markBillPaid, deleteBill,
    addCardEmi, markEmiPaid, deleteCardEmi, addAccount, deleteAccount,
    addCategory, deleteCategory, categoryUsageCount,
    addIou, markIouRepaid, toggleSetting, clearData, restoreBackup,
    setCurrentUser: (u) => patch({ currentUser: u }),
    login, logout,
  };
}
