/**
 * Whether an already-active card EMI still owes a payment next calendar
 * month. Most active EMIs obviously do (more than one instalment left); the
 * only ambiguous case is the very last instalment (`pendingMonths === 1`) —
 * that one only counts if its due date hasn't already landed in the current
 * month (i.e. it's the payment still coming, not the one just made).
 */
function emiContinuesNextMonth(emi, todayIso) {
  if (emi.completed) return false;
  if (emi.pendingMonths > 1) return true;
  const currentMonth = todayIso.slice(0, 7);
  const dueMonth = emi.nextDueDate ? emi.nextDueDate.slice(0, 7) : null;
  return !!dueMonth && dueMonth > currentMonth;
}

/**
 * Recurring expenses inferred straight from transaction history: the same
 * merchant + category combo seen in at least `minMonths` distinct calendar
 * months. Rent only needs one month's history — a single rent payment is
 * still a strong signal next month's rent is coming, unlike an ordinary
 * expense. The predicted amount is whichever charge was most recent, since
 * subscriptions/rent/utilities tend to repeat near-exactly rather than
 * average out like variable spend (groceries, dining) would.
 */
export function detectRecurringExpenses(transactions, minMonths = 2) {
  const groups = new Map();
  transactions
    .filter((tx) => tx.type !== 'income')
    .forEach((tx) => {
      const key = `${tx.merchant.trim().toLowerCase()}|${tx.category}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(tx);
    });

  const out = [];
  groups.forEach((txs) => {
    const distinctMonths = new Set(txs.map((tx) => tx.date.slice(0, 7)));
    const required = txs[0].category === 'Rent' ? 1 : minMonths;
    if (distinctMonths.size < required) return;
    const [latest] = [...txs].sort((a, b) => (a.date < b.date ? 1 : -1));
    out.push({
      key: `recur-${latest.merchant.trim().toLowerCase()}-${latest.category}`,
      merchant: latest.merchant,
      category: latest.category,
      amount: latest.amount,
      months: distinctMonths.size,
    });
  });
  return out.sort((a, b) => b.amount - a.amount);
}

/**
 * Everything already committed for next month: card EMIs still running,
 * loan EMIs, bills currently unpaid, merchants detected as recurring from
 * transaction history, and one-off items added by hand. `bills` should be
 * the enriched, still-open bill list (t.openBills) so each item already
 * carries a due-date label. `loans` and `extras` are the raw user-entered
 * lists (data.loans / data.forecastExtras) — both start empty until the
 * user adds their own, same as every other real list in this app.
 */
export function buildForecast({ transactions, activeEmis, bills, loans, extras, todayIso }) {
  const emiItems = activeEmis
    .filter((e) => emiContinuesNextMonth(e, todayIso))
    .map((e) => ({ key: `emi-${e.id}`, label: e.item, sublabel: e.cardName, amount: e.emiAmount }));

  const loanItems = loans.map((l) => ({
    key: `loan-${l.id}`, label: l.name, sublabel: `${l.roi}% ROI${l.tenureLeft ? ` · ${l.tenureLeft} left` : ''}`, amount: l.emi,
  }));

  const billItems = bills.map((b) => ({
    key: `bill-${b.id}`, label: b.name, sublabel: `Due ${b.dueLabel}`, amount: b.amount,
  }));

  const recurringItems = detectRecurringExpenses(transactions).map((r) => ({
    key: r.key, label: r.merchant, sublabel: `${r.category} · seen ${r.months} month${r.months === 1 ? '' : 's'}`, amount: r.amount,
  }));

  const extraItems = extras.map((x) => ({
    key: `extra-${x.id}`, id: x.id, label: x.label, sublabel: 'Added by you', amount: x.amount, removable: true,
  }));

  const groups = [
    { key: 'emi', label: 'Card EMIs', items: emiItems },
    { key: 'loans', label: 'Loan EMIs', items: loanItems },
    { key: 'bills', label: 'Bills & subscriptions', items: billItems },
    { key: 'recurring', label: 'Repeated expenses (detected)', items: recurringItems },
    { key: 'extras', label: 'Added by you', items: extraItems },
  ].filter((g) => g.items.length > 0);

  const total = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.amount, 0), 0);

  return { total, groups };
}
