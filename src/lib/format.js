/** Indian-format rupee amount, e.g. ₹1,23,456. */
export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/** A tint of the ink colour — the muted-text treatment used across the design. */
export const muted = (pct) => `color-mix(in srgb, var(--color-text) ${pct}%, transparent)`;

/** "10 Aug" — the en-IN reading order, used for bill due dates. */
export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

/** "Aug 10" — month first, used for the transaction date-group headings. */
export const monthDay = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** Whole days from `from` until the ISO date, negative when overdue. */
export const daysUntil = (iso, from) => Math.round((new Date(iso) - from) / 86400000);
