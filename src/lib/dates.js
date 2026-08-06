import { TODAY, TODAY_ISO } from '../data/seed.js';
import { monthDay } from './format.js';

/** The group heading a transaction sits under: "Today, Aug 6" or "Aug 5". */
export const dateGroupOf = (iso) =>
  iso === TODAY_ISO ? `Today, ${monthDay(iso)}` : monthDay(iso);

/** Newest first; ties broken by id so freshly added rows land at the top. */
export const byDateDesc = (a, b) =>
  a.date === b.date ? Number(b.id) - Number(a.id) : (a.date < b.date ? 1 : -1);

/** Transactions grouped into the design's date sections, newest section first. */
export function groupByDate(transactions) {
  const sorted = [...transactions].sort(byDateDesc);
  const groups = [];
  const index = new Map();
  sorted.forEach((tx) => {
    const label = dateGroupOf(tx.date);
    if (!index.has(label)) {
      index.set(label, { label, items: [] });
      groups.push(index.get(label));
    }
    index.get(label).items.push(tx);
  });
  return groups;
}

/** Inclusive ISO date range for an export period. */
export function rangeFor(period, from, to) {
  if (period === 'custom') {
    return { from: from || null, to: to || null };
  }
  const end = new Date(TODAY);
  const start = new Date(TODAY);
  if (period === 'week') start.setDate(start.getDate() - 6);
  else start.setDate(1); // month-to-date
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(start), to: iso(end) };
}

/** Human label for a range, used in the export confirmation line. */
export const rangeLabel = (period, from, to) =>
  period === 'week' ? 'this week'
    : period === 'month' ? 'this month'
      : `${from || '...'} to ${to || '...'}`;
