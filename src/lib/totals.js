import { CATS, CAT_TOTALS, TX_INITIAL } from '../data/seed.js';

const ZERO = () => ({ you: 0, priya: 0 });

/** Sum of expense transactions per category, split by person. */
function sumByCategory(transactions) {
  const out = {};
  CATS.forEach((c) => { out[c.name] = ZERO(); });
  transactions.forEach((tx) => {
    if (tx.type === 'income') return;      // income never counts against a spend category
    const bucket = out[tx.category];
    if (!bucket) return;                   // income-only categories have no spend bucket
    bucket[tx.person] += tx.amount;
  });
  return out;
}

/**
 * Month-to-date spend that predates the visible transaction list.
 *
 * The seeded CAT_TOTALS are full-month figures while TX_INITIAL only covers the
 * last week, so backing the listed transactions out of the totals leaves the
 * earlier-in-month remainder. Adding the live list back on top reproduces the
 * seeded numbers exactly on first load, and moves for real from then on.
 */
export const BASELINES = (() => {
  const listed = sumByCategory(TX_INITIAL);
  const out = {};
  CATS.forEach((c) => {
    out[c.name] = {
      you: CAT_TOTALS[c.name].you - listed[c.name].you,
      priya: CAT_TOTALS[c.name].priya - listed[c.name].priya,
    };
  });
  return out;
})();

/** Live month-to-date spend per category: baseline + everything in the list now. */
export function categoryTotals(transactions) {
  const listed = sumByCategory(transactions);
  const out = {};
  CATS.forEach((c) => {
    const you = BASELINES[c.name].you + listed[c.name].you;
    const priya = BASELINES[c.name].priya + listed[c.name].priya;
    out[c.name] = { you, priya, combined: you + priya };
  });
  return out;
}

/** Pull one person's slice (or the combined figure) out of a totals map. */
export const forPerson = (totals, category, person) =>
  totals[category] ? totals[category][person === 'combined' ? 'combined' : person] : 0;

/** Month-to-date total across every category. */
export const monthTotal = (totals, person) =>
  CATS.reduce((sum, c) => sum + forPerson(totals, c.name, person), 0);
