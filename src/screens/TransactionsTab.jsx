import { useState } from 'react';
import { inr, muted } from '../lib/format.js';
import { TxRow } from '../components/ui.jsx';

const matchesFilter = (tx, filter) => {
  if (filter === 'all') return true;
  if (filter === 'you' || filter === 'priya') return tx.person === filter;
  return tx.source === filter;
};

const matchesSearch = (tx, query) => {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return tx.merchant.toLowerCase().includes(q)
    || tx.category.toLowerCase().includes(q)
    || tx.account.toLowerCase().includes(q);
};

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flexShrink: 0, padding: '6px 14px', borderRadius: 999, fontSize: 12,
        border: '1px solid var(--color-divider)', cursor: 'pointer', font: 'inherit',
        background: active ? 'var(--color-accent)' : 'var(--color-surface)',
        color: active ? 'var(--color-bg)' : 'var(--color-text)',
      }}
    >{children}</button>
  );
}

export default function TransactionsTab({ t }) {
  const [search, setSearch] = useState('');

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'you', label: 'You' },
    { key: 'priya', label: t.partnerName },
    { key: 'auto', label: 'Auto' },
    { key: 'manual', label: 'Manual' },
  ];

  const SORTS = [
    { key: 'date', label: 'Newest' },
    { key: 'amountDesc', label: 'Amount ↓' },
    { key: 'amountAsc', label: 'Amount ↑' },
  ];

  // Date sort keeps the existing "grouped by day" layout; amount sort flattens
  // everything into one list ranked by amount, since ascending/descending
  // amount doesn't map onto date sections.
  const groups = t.txSort === 'date'
    ? t.txGroups
      .map((g) => ({ ...g, items: g.items.filter((tx) => matchesFilter(tx, t.txFilter) && matchesSearch(tx, search)) }))
      .filter((g) => g.items.length > 0)
    : [{
      label: t.txSort === 'amountDesc' ? 'Highest amount first' : 'Lowest amount first',
      items: t.transactions
        .filter((tx) => matchesFilter(tx, t.txFilter) && matchesSearch(tx, search))
        .sort((a, b) => (t.txSort === 'amountDesc' ? b.amount - a.amount : a.amount - b.amount)),
    }].filter((g) => g.items.length > 0);

  const visibleCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const total = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, tx) => s + (tx.type === 'income' ? tx.amount : -tx.amount), 0),
    0,
  );
  const totalUp = total >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Transactions</h2>

      <input
        className="input"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search merchant, category, or account"
        aria-label="Search transactions"
      />

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map((f) => (
          <Pill key={f.key} active={t.txFilter === f.key} onClick={() => t.setTxFilter(f.key)}>{f.label}</Pill>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {SORTS.map((s) => (
          <Pill key={s.key} active={t.txSort === s.key} onClick={() => t.setTxSort(s.key)}>{s.label}</Pill>
        ))}
      </div>

      {visibleCount > 0 && (
        <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 12, color: muted(60) }}>
          <span>{visibleCount} transaction{visibleCount === 1 ? '' : 's'}</span>
          <span style={{ fontWeight: 600, color: totalUp ? 'var(--color-accent-2-700)' : 'var(--color-text)' }}>
            {totalUp ? '+' : '−'}{inr(Math.abs(total))}
          </span>
        </div>
      )}

      {groups.length === 0 && (
        <div style={{ fontSize: 12.5, color: muted(55) }}>Nothing matches your search or filter yet.</div>
      )}

      {groups.map((grp) => (
        <div key={grp.label}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: muted(55), marginBottom: 6 }}>
            {grp.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {grp.items.map((tx) => (
              <TxRow key={tx.id} tx={tx} onDelete={t.deleteTransaction} showDelete />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
