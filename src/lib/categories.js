import { INCOME_CATS } from '../data/seed.js';

// Visual styling for user-added categories, cycling through the same
// bg/fg/bg2 token combinations the original curated category list used —
// keeps new categories on-brand without hand-picking colors per name.
const PALETTE = [
  { bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-500)' },
  { bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-500)' },
  { bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-500)' },
  { bg: 'var(--color-accent-200)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-600)' },
  { bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-600)' },
  { bg: 'var(--color-neutral-300)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-600)' },
  { bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)', bg2: 'var(--color-accent-2-400)' },
  { bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)', bg2: 'var(--color-accent-400)' },
  { bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-700)' },
  { bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-800)', bg2: 'var(--color-neutral-400)' },
];

// One-letter badge by default; falls back to two letters only if the first
// letter collides with an existing category (e.g. "Transport" already took
// "T", so a new "Travel" becomes "Tr" instead of a duplicate badge).
function deriveLetter(name, existing) {
  const used = new Set(existing.map((c) => c.letter));
  const one = name.charAt(0).toUpperCase();
  if (!used.has(one)) return one;
  const two = one + name.charAt(1).toLowerCase();
  if (name.length > 1 && !used.has(two)) return two;
  return one;
}

export function buildCategory(name, existing) {
  const clean = name.trim();
  const palette = PALETTE[existing.length % PALETTE.length];
  return { name: clean, letter: deriveLetter(clean, existing), ...palette };
}

/** Look up display meta for a category name — expense (dynamic) first, then the static income list, then a safe fallback. */
export function catMeta(name, categories) {
  return categories.find((c) => c.name === name)
    || INCOME_CATS.find((c) => c.name === name)
    || categories[categories.length - 1]
    || { name, letter: '?', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)', bg2: 'var(--color-neutral-500)' };
}
