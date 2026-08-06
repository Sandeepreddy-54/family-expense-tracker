import { useState } from 'react';
import { muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function BillsScreen({ t }) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    if (!t.addBill({ name, amount, dueDate: due })) {
      setError('Name, amount and due date are all required.');
      return;
    }
    setFormOpen(false);
    setName(''); setAmount(''); setDue(''); setError('');
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        title="Bills & reminders"
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={() => setFormOpen((o) => !o)}>
            + Add
          </button>
        )}
      />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        We watch your transaction history for repeating merchants (subscriptions, utilities, rent) and add
        them here automatically — tagged &ldquo;auto&rdquo;. Add anything else by hand.
      </div>

      {formOpen && (
        <div className="card elev-sm" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="bill-name">Bill name</label>
            <input id="bill-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gym membership" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="bill-amount">Amount</label>
            <input id="bill-amount" className="input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="bill-due">Due date</label>
            <input id="bill-due" className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          {error && <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)' }}>{error}</div>}
          <button type="button" onClick={save} className="btn btn-primary btn-block" style={{ margin: 0 }}>Save</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {t.openBills.length === 0 && (
          <div style={{ fontSize: 12.5, color: muted(55) }}>Nothing outstanding — every bill is marked paid.</div>
        )}
        {t.openBills.map((bill) => (
          <div key={bill.id} className="card elev-sm" style={{ gap: 'var(--space-2)' }}>
            <div className="om-row" style={{ justifyContent: 'space-between' }}>
              <div className="om-row" style={{ gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{bill.name}</span>
                {bill.autoDetected && (
                  <span className="tag" style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-800)' }}>auto</span>
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{bill.amountLabel}</span>
            </div>
            <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11.5 }}>
              <span style={{ color: muted(60) }}>Due {bill.dueLabel}</span>
              <span style={{ color: bill.countColor, fontWeight: 600 }}>{bill.countLabel}</span>
            </div>
            <div className="om-row" style={{ gap: 8, marginTop: 2 }}>
              <button type="button" onClick={() => t.markBillPaid(bill.id)} className="btn btn-secondary" style={{ flex: 1, padding: 6, fontSize: 12 }}>Mark paid</button>
              <button type="button" onClick={() => t.deleteBill(bill.id)} className="btn btn-ghost" style={{ flex: 1, padding: 6, fontSize: 12 }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
