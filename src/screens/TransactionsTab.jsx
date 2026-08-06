import { muted } from '../lib/format.js';
import { TxRow } from '../components/ui.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'you', label: 'You' },
  { key: 'priya', label: 'Priya' },
  { key: 'auto', label: 'Auto' },
  { key: 'manual', label: 'Manual' },
];

const matches = (tx, filter) => {
  if (filter === 'all') return true;
  if (filter === 'you' || filter === 'priya') return tx.person === filter;
  return tx.source === filter;
};

export default function TransactionsTab({ t }) {
  const groups = t.txGroups
    .map((g) => ({ ...g, items: g.items.filter((tx) => matches(tx, t.txFilter)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Transactions</h2>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map((f) => {
          const active = t.txFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => t.setTxFilter(f.key)}
              aria-pressed={active}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 999, fontSize: 12,
                border: '1px solid var(--color-divider)', cursor: 'pointer', font: 'inherit',
                background: active ? 'var(--color-accent)' : 'var(--color-surface)',
                color: active ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >{f.label}</button>
          );
        })}
      </div>

      {groups.length === 0 && (
        <div style={{ fontSize: 12.5, color: muted(55) }}>Nothing matches this filter yet.</div>
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
