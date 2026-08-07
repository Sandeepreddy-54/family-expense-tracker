import { useState } from 'react';
import { inr, muted } from '../lib/format.js';
import { Badge, Bar } from '../components/ui.jsx';

function OverallCard({ t }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const budget = t.data.overallBudget;
  const pct = Math.min(Math.round((t.overallSpent / budget) * 100), 100);

  const startEdit = () => { setValue(String(budget)); setEditing(true); };
  const save = () => { if (t.setOverallBudget(value)) setEditing(false); };

  return (
    <div className="card elev-md" style={{ gap: 'var(--space-2)' }}>
      <div className="card-kicker">Overall monthly budget</div>

      {editing && (
        <div className="om-row" style={{ gap: 8 }}>
          <input
            className="input"
            type="number"
            min="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Overall monthly budget"
            style={{ flex: 1 }}
          />
          <button type="button" onClick={save} className="btn btn-primary" style={{ padding: '8px 14px' }}>Save</button>
          <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary" style={{ padding: '8px 14px' }}>Cancel</button>
        </div>
      )}

      <div className="om-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>
          {inr(t.overallSpent)}{' '}
          <span style={{ fontSize: 14, fontWeight: 400, fontFamily: 'var(--font-body)', color: muted(55) }}>
            of {inr(budget)}
          </span>
        </div>
        {!editing && (
          <button type="button" onClick={startEdit} className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }}>Edit</button>
        )}
      </div>

      <Bar pct={pct} color="var(--color-accent-500)" />
    </div>
  );
}

function BudgetRow({ b, t }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEdit = () => { setValue(String(b.budget)); setEditing(true); };
  const save = () => { if (t.setBudget(b.category, value)) setEditing(false); };

  return (
    <div>
      <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
        <div className="om-row" style={{ gap: 8, minWidth: 0 }}>
          <Badge meta={b} size={20} font={9} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{b.category}</span>
          {b.pct > 100 && (
            <span className="tag" style={{ background: 'var(--color-accent-200)', color: 'var(--color-accent-800)' }}>over</span>
          )}
        </div>

        {editing ? (
          <div className="om-row" style={{ gap: 6, flexShrink: 0 }}>
            <input
              className="input"
              type="number"
              min="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={`${b.category} budget`}
              style={{ width: 80, minHeight: 26, padding: '2px 8px', fontSize: 12 }}
            />
            <button type="button" onClick={save} style={{ border: 'none', background: 'none', color: 'var(--color-accent-700)', fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' }}>Save</button>
          </div>
        ) : (
          <div className="om-row" style={{ gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 12 }}>{inr(b.spent)} / {inr(b.budget)}</span>
            <button type="button" onClick={startEdit} style={{ border: 'none', background: 'none', color: muted(50), cursor: 'pointer', fontSize: 12, font: 'inherit' }}>Edit</button>
          </div>
        )}
      </div>

      <Bar pct={b.pct} color={b.pct > 100 ? 'var(--color-accent-700)' : b.bg2} />
      <div style={{ fontSize: 10.5, color: muted(50), marginTop: 3 }}>
        You {inr(b.you)} · {t.partnerName} {inr(b.priya)}
      </div>
    </div>
  );
}

export default function BudgetsTab({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Budgets</h2>
      <OverallCard t={t} />
      {t.budgets.map((b) => <BudgetRow key={b.category} b={b} t={t} />)}
    </div>
  );
}
