import { useState } from 'react';
import { ACCOUNT_NAMES, CATS, INCOME_CATS } from '../data/seed.js';
import { Eyebrow, Seg, SheetHeader } from '../components/ui.jsx';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export default function AddScreen({ t }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(null);
  const [person, setPerson] = useState(t.data.currentUser);
  const [account, setAccount] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const categories = type === 'income' ? INCOME_CATS : CATS;

  const pressKey = (k) => {
    setAmount((a) => {
      if (k === '⌫') return a.slice(0, -1);
      if (k === '.' && a.includes('.')) return a;
      if (a.length >= 8) return a;
      return a + k;
    });
    setError('');
  };

  const save = () => {
    const value = parseFloat(amount);
    if (!value) return setError('Enter an amount.');
    if (!category) return setError('Pick a category.');
    if (!account) return setError('Pick an account.');
    t.addTransaction({
      merchant: note || category,
      category,
      amount: value,
      person,
      account,
      source: 'manual',
      type,
    });
    t.closeScreen();
    return undefined;
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        backLabel="Cancel"
        title={type === 'income' ? 'Add income' : 'Add expense'}
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={save}>Save</button>
        )}
      />

      <Seg
        name="addType"
        value={type}
        onChange={(v) => { setType(v); setCategory(null); setError(''); }}
        options={[
          { value: 'expense', label: 'Expense' },
          { value: 'income', label: 'Income' },
        ]}
      />

      <div style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 44, margin: 'var(--space-4) 0' }}>
        ₹{amount || '0'}
      </div>

      <Seg
        name="addPerson"
        value={person}
        onChange={setPerson}
        options={[
          { value: 'you', label: 'You' },
          { value: 'priya', label: 'Priya' },
        ]}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      <Eyebrow>Category</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 'var(--space-4)' }}>
        {categories.map((c) => {
          const active = category === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => { setCategory(c.name); setError(''); }}
              aria-pressed={active}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 2px', borderRadius: 'var(--radius-md)', cursor: 'pointer', font: 'inherit',
                border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                background: active ? c.bg : 'var(--color-surface)',
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 999, background: c.bg, color: c.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
              }}>{c.letter}</div>
              <span style={{ fontSize: 9.5, textAlign: 'center', lineHeight: 1.15 }}>{c.name}</span>
            </button>
          );
        })}
      </div>

      <Eyebrow>Account</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-4)' }}>
        {ACCOUNT_NAMES.map((name) => {
          const active = account === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => { setAccount(name); setError(''); }}
              aria-pressed={active}
              style={{
                textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                background: active ? 'var(--color-accent-100)' : 'var(--color-surface)',
              }}
            >{name}</button>
          );
        })}
      </div>

      <div className="field">
        <label htmlFor="add-note">Remarks (optional)</label>
        <input
          id="add-note"
          className="input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
        />
      </div>

      {error && (
        <div role="alert" style={{ marginTop: 'var(--space-2)', fontSize: 12, color: 'var(--color-accent-700)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 'var(--space-4)' }}>
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => pressKey(k)}
            aria-label={k === '⌫' ? 'Delete last digit' : k}
            style={{
              height: 48, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)',
              background: 'var(--color-surface)', fontSize: 18, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{k}</button>
        ))}
      </div>
    </div>
  );
}
