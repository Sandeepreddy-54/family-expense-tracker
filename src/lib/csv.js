import { CATS } from '../data/seed.js';

const esc = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (cells) => cells.map(esc).join(',');

/**
 * Build the export the design promises: "all transactions, budgets, and card
 * summaries — combined and per person — as a CSV".
 */
export function buildCsv({ transactions, budgets, cards, totals, range, label }) {
  const lines = [];

  lines.push(row(['Family Expense Tracker export']));
  lines.push(row(['Period', label]));
  lines.push(row(['From', range.from || 'beginning']));
  lines.push(row(['To', range.to || 'today']));
  lines.push('');

  lines.push(row(['TRANSACTIONS']));
  lines.push(row(['Date', 'Merchant', 'Category', 'Person', 'Account', 'Source', 'Type', 'Amount (INR)']));
  transactions.forEach((tx) => {
    lines.push(row([
      tx.date,
      tx.merchant,
      tx.category,
      tx.person === 'you' ? 'Rohan' : 'Priya',
      tx.account,
      tx.source === 'auto' ? 'Auto' : 'Manual',
      tx.type === 'income' ? 'Income' : 'Expense',
      tx.amount,
    ]));
  });
  lines.push('');

  lines.push(row(['CATEGORY TOTALS (month to date)']));
  lines.push(row(['Category', 'Combined (INR)', 'Rohan (INR)', 'Priya (INR)', 'Budget (INR)', 'Used %']));
  CATS.forEach((c) => {
    const t = totals[c.name];
    const b = budgets.find((x) => x.category === c.name);
    const budget = b ? b.budget : '';
    lines.push(row([
      c.name,
      t.combined,
      t.you,
      t.priya,
      budget,
      budget ? Math.round((t.combined / budget) * 100) : '',
    ]));
  });
  lines.push('');

  lines.push(row(['CREDIT CARDS']));
  lines.push(row(['Card', 'Holder', 'Last 4', 'Outstanding (INR)', 'Limit (INR)', 'Used %', 'Due date', 'Min due (INR)']));
  cards.forEach((c) => {
    lines.push(row([
      c.name,
      c.personLabel,
      c.last4,
      c.outstanding,
      c.limit,
      Math.round((c.outstanding / c.limit) * 100),
      c.dueDate,
      c.minDue,
    ]));
  });

  return lines.join('\r\n');
}

/** Hand the CSV to the browser as a download. BOM so Excel reads UTF-8. */
export function downloadCsv(filename, text) {
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
