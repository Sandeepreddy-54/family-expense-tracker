import { useState } from 'react';
import { inr } from '../lib/format.js';
import { Eyebrow, Seg, SheetHeader } from '../components/ui.jsx';

export default function AddEmiScreen({ t }) {
  const [cardId, setCardId] = useState(t.emiCardId || t.cards[0]?.id || '');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [tenureMonths, setTenureMonths] = useState('');
  const [paidMonths, setPaidMonths] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');

  const totalNum = parseFloat(amount);
  const tenureNum = parseInt(tenureMonths, 10);
  const preview = totalNum > 0 && tenureNum > 0 ? Math.round(totalNum / tenureNum) : null;

  const save = () => {
    if (!item.trim()) return setError('What did you buy?');
    if (!totalNum) return setError('Enter the total purchase amount.');
    if (!tenureNum) return setError('Enter the number of months.');
    if (!startDate) return setError('Pick the EMI start date.');
    const ok = t.addCardEmi({
      cardId,
      item,
      amount: totalNum,
      tenureMonths: tenureNum,
      paidMonths: parseInt(paidMonths || '0', 10),
      startDate,
    });
    if (ok) t.openScreen(t.emiReturnScreen);
    return undefined;
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={() => t.openScreen(t.emiReturnScreen)}
        backLabel="Cancel"
        title="Add card EMI"
        action={<button type="button" className="om-sheet-action om-sheet-action-strong" onClick={save}>Save</button>}
      />

      <Eyebrow>Card</Eyebrow>
      <Seg
        name="emiCard"
        value={cardId}
        onChange={setCardId}
        options={t.cards.map((c) => ({ value: c.id, label: c.name }))}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      <div className="field">
        <label htmlFor="emi-item">What did you buy?</label>
        <input
          id="emi-item"
          className="input"
          value={item}
          onChange={(e) => { setItem(e.target.value); setError(''); }}
          placeholder="e.g. MacBook Air M2"
        />
      </div>

      <div className="field">
        <label htmlFor="emi-amount">Total purchase amount (₹)</label>
        <input
          id="emi-amount"
          type="number"
          min="1"
          className="input"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          placeholder="89999"
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="emi-tenure">Tenure (months)</label>
          <input
            id="emi-tenure"
            type="number"
            min="1"
            className="input"
            value={tenureMonths}
            onChange={(e) => { setTenureMonths(e.target.value); setError(''); }}
            placeholder="12"
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor="emi-paid">Already paid</label>
          <input
            id="emi-paid"
            type="number"
            min="0"
            className="input"
            value={paidMonths}
            onChange={(e) => setPaidMonths(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="emi-start">EMI start date</label>
        <input
          id="emi-start"
          type="date"
          className="input"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setError(''); }}
        />
      </div>

      {preview != null && (
        <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginTop: 2 }}>
          ≈ {inr(preview)} / month for {tenureNum} months
        </div>
      )}

      {error && (
        <div role="alert" style={{ marginTop: 'var(--space-3)', fontSize: 12.5, color: 'var(--color-accent-700)', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
}
