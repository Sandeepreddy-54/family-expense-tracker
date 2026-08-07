import { TODAY } from '../data/seed.js';
import { daysUntil, inr, shortDate } from './format.js';

function addMonths(iso, n) {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

/** Turns a stored EMI (item, total amount, tenure, months paid) into everything the UI shows. */
export function deriveEmi(e) {
  const paidMonths = Math.min(e.paidMonths, e.tenureMonths);
  const pendingMonths = e.tenureMonths - paidMonths;
  const completed = pendingMonths === 0;
  const emiAmount = Math.round(e.amount / e.tenureMonths);
  const endDateIso = addMonths(e.startDate, e.tenureMonths);
  const nextDueIso = completed ? null : addMonths(e.startDate, paidMonths + 1);
  const days = nextDueIso ? daysUntil(nextDueIso, TODAY) : null;

  return {
    ...e,
    paidMonths,
    pendingMonths,
    completed,
    pct: Math.round((paidMonths / e.tenureMonths) * 100),
    emiAmount,
    emiAmountLabel: `${inr(emiAmount)}/mo`,
    totalLabel: inr(e.amount),
    startDateLabel: shortDate(e.startDate),
    endDate: endDateIso,
    endDateLabel: shortDate(endDateIso),
    nextDueDate: nextDueIso,
    nextDueLabel: nextDueIso ? shortDate(nextDueIso) : '—',
    dueColor: days != null && days <= 2 ? 'var(--color-accent-700)' : days != null && days <= 7 ? 'var(--color-accent-600)' : undefined,
  };
}
