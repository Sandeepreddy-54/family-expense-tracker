import { useState } from 'react';
import { CATS, INCOME_CATS, TODAY_ISO } from '../data/seed.js';
import { ConfirmDialog, Eyebrow, Seg, SheetHeader } from '../components/ui.jsx';
import { findDuplicates } from '../lib/duplicates.js';
import { inr, shortDate } from '../lib/format.js';

export default function AddScreen({ t }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(null);
  const [person, setPerson] = useState(t.data.currentUser);
  const [account, setAccount] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [duplicates, setDuplicates] = useState(null);

  const categories = type === 'income' ? INCOME_CATS : CATS;
  const accountNames = t.data.accounts.map((a) => t.personalizeAccount(a.name));

  const commit = (value) => {
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
  };

  const save = () => {
    const value = parseFloat(amount);
    if (!value) return setError('Enter an amount.');
    if (!category) return setError('Pick a category.');
    if (!account) return setError('Pick an account.');
    const dupes = findDuplicates(t.data.transactions, value, TODAY_ISO, type);
    if (dupes.length > 0) { setDuplicates(dupes); return undefined; }
    commit(value);
    return undefined;
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        backLabel="Cancel"
        title={type === 'income' ? 'Add: money in' : 'Add: money out'}
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={save}>Save</button>
        )}
      />

      <Seg
        name="addType"
        value={type}
        onChange={(v) => { setType(v); setCategory(null); setError(''); }}
        options={[
          { value: 'expense', label: 'Money out' },
          { value: 'income', label: 'Money in' },
        ]}
      />

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <button type="button" className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }} onClick={() => t.openScreen('import')}>
          Paste from SMS instead
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, margin: 'var(--space-4) 0' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 44 }}>₹</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          placeholder="0"
          autoFocus
          aria-label="Amount"
          style={{
            width: 160, fontFamily: 'var(--font-heading)', fontSize: 44, color: 'var(--color-text)',
            border: 'none', background: 'transparent', padding: 0, minHeight: 'auto',
          }}
        />
      </div>

      <Seg
        name="addPerson"
        value={person}
        onChange={setPerson}
        options={[
          { value: 'you', label: 'You' },
          { value: 'priya', label: t.data.profile.partnerName || 'Priya' },
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
      {accountNames.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
          No accounts yet —{' '}
          <button type="button" className="btn btn-ghost" style={{ padding: 0, fontSize: 12, display: 'inline' }} onClick={() => t.openScreen('addAccount')}>
            add one
          </button>{' '}
          first.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-4)' }}>
        {accountNames.map((name) => {
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

      {duplicates && (
        <ConfirmDialog
          title="Possible duplicate"
          body={`You already logged ${inr(duplicates[0].amount)} on ${shortDate(duplicates[0].date)} (${duplicates[0].merchant}). Add this one too?`}
          confirmLabel="Add anyway"
          onConfirm={() => { setDuplicates(null); commit(parseFloat(amount)); }}
          onCancel={() => setDuplicates(null)}
        />
      )}
    </div>
  );
}
