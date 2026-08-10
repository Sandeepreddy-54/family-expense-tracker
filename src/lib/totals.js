const ZERO = () => ({ you: 0, priya: 0 });

/**
 * Sum of expense transactions per category, split by person. `categoryNames`
 * seeds a zero bucket for every known category (so the UI can show ₹0 rows
 * for categories with no spend yet); a transaction whose category was since
 * deleted/renamed still gets summed under its own (now orphaned) name rather
 * than silently dropped.
 */
function sumByCategory(transactions, categoryNames) {
  const out = {};
  categoryNames.forEach((name) => { out[name] = ZERO(); });
  transactions.forEach((tx) => {
    if (tx.type === 'income') return; // income never counts against a spend category
    if (!out[tx.category]) out[tx.category] = ZERO();
    out[tx.category][tx.person] += tx.amount;
  });
  return out;
}

/** Live month-to-date spend per category, straight off the real transaction list. */
export function categoryTotals(transactions, categoryNames) {
  const summed = sumByCategory(transactions, categoryNames);
  const out = {};
  Object.keys(summed).forEach((name) => {
    const { you, priya } = summed[name];
    out[name] = { you, priya, combined: you + priya };
  });
  return out;
}

/** Pull one person's slice (or the combined figure) out of a totals map. */
export const forPerson = (totals, category, person) =>
  totals[category] ? totals[category][person === 'combined' ? 'combined' : person] : 0;

/** Month-to-date total across every category present in the totals map. */
export const monthTotal = (totals, person) =>
  Object.keys(totals).reduce((sum, name) => sum + forPerson(totals, name, person), 0);

/**
 * Actual combined spend for one calendar month (YYYY-MM), read straight off the
 * transaction list — unlike categoryTotals this isn't blended with a seeded
 * baseline, so it's only meaningful for months that have real transactions in
 * them (e.g. backfilled via SMS import). Returns 0 when there's nothing yet.
 */
export function realMonthlyTotal(transactions, monthPrefix) {
  return transactions
    .filter((tx) => tx.type !== 'income' && tx.date.startsWith(monthPrefix))
    .reduce((s, tx) => s + tx.amount, 0);
}
