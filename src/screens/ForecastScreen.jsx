import { useState } from 'react';
import { inr, muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function ForecastScreen({ t }) {
  const [formOpen, setFormOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const { total, groups } = t.forecast;
  const vsThisMonth = t.overallSpent > 0 ? Math.round((total / t.overallSpent) * 100) : null;

  const save = () => {
    if (!t.addForecastItem({ label, amount })) {
      setError('Give it a name and an amount.');
      return;
    }
    setFormOpen(false);
    setLabel(''); setAmount(''); setError('');
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        title="Next month forecast"
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={() => setFormOpen((o) => !o)}>
            + Add
          </button>
        )}
      />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        Pulled from your card EMIs, loans, unpaid bills, and merchants that keep showing up in your
        transaction history — plus anything you add by hand (an annual fee, school term, or trip you
        already know is coming).
      </div>

      {formOpen && (
        <div className="card elev-sm" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="forecast-label">What&rsquo;s coming up?</label>
            <input id="forecast-label" className="input" value={label} onChange={(e) => { setLabel(e.target.value); setError(''); }} placeholder="e.g. School term fee" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="forecast-amount">Expected amount</label>
            <input id="forecast-amount" className="input" type="number" min="1" value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }} placeholder="0" />
          </div>
          {error && <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{error}</div>}
          <button type="button" onClick={save} className="btn btn-primary btn-block" style={{ margin: 0 }}>Save</button>
        </div>
      )}

      <div className="card elev-md" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <div className="card-kicker" style={{ color: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
          Expected committed spend · next month
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>{inr(total)}</div>
        {vsThisMonth != null && (
          <div style={{ fontSize: 12, opacity: 0.9 }}>{vsThisMonth}% of what you&rsquo;ve spent this month so far</div>
        )}
      </div>

      {groups.length === 0 && (
        <div style={{ fontSize: 12.5, color: muted(55), textAlign: 'center', padding: 'var(--space-6) 0' }}>
          Nothing here yet — add card EMIs or bills, tap + Add above for a one-off, or keep logging
          transactions and repeat expenses will fill in on their own.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {groups.map((g) => {
          const groupTotal = g.items.reduce((s, i) => s + i.amount, 0);
          return (
            <div key={g.key}>
              <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="om-eyebrow" style={{ marginBottom: 0 }}>{g.label}</div>
                <div style={{ fontSize: 11.5, color: muted(55) }}>{inr(groupTotal)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {g.items.map((item) => (
                  <div key={item.key} className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                      {item.sublabel && <div style={{ fontSize: 11, color: muted(55) }}>{item.sublabel}</div>}
                    </div>
                    <div className="om-row" style={{ gap: 8, flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{inr(item.amount)}</div>
                      {item.removable && (
                        <button
                          type="button"
                          onClick={() => t.deleteForecastItem(item.id)}
                          aria-label={`Remove ${item.label}`}
                          style={{
                            width: 22, height: 22, flexShrink: 0, borderRadius: 999, border: 'none',
                            background: 'var(--color-neutral-200)', color: 'var(--color-text)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, lineHeight: 1,
                          }}
                        >×</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
