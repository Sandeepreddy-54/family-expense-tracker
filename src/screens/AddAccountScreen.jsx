import { useState } from 'react';
import { Eyebrow, Seg, SheetHeader } from '../components/ui.jsx';

export default function AddAccountScreen({ t }) {
  const [type, setType] = useState('credit');
  const [name, setName] = useState('');
  const [last4, setLast4] = useState('');
  const [person, setPerson] = useState(t.data.currentUser);
  const [limit, setLimit] = useState('');
  const [statementDay, setStatementDay] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim()) return setError('Name this account.');
    if (type === 'credit') {
      const lim = parseFloat(limit);
      const sDay = parseInt(statementDay, 10);
      const dDay = parseInt(dueDay, 10);
      if (!lim || lim <= 0) return setError('Enter the credit limit.');
      if (!sDay || sDay < 1 || sDay > 31) return setError('Statement day must be 1–31.');
      if (!dDay || dDay < 1 || dDay > 31) return setError('Due day must be 1–31.');
    }
    const ok = t.addAccount({ name, type, person, last4, limit, statementDay, dueDay });
    if (ok) t.closeScreen();
    return undefined;
  };

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        backLabel="Cancel"
        title="Add account"
        action={<button type="button" className="om-sheet-action om-sheet-action-strong" onClick={save}>Save</button>}
      />

      <Eyebrow>Account type</Eyebrow>
      <Seg
        name="accountType"
        value={type}
        onChange={(v) => { setType(v); setError(''); }}
        options={[
          { value: 'credit', label: 'Credit card' },
          { value: 'bank', label: 'Bank account' },
        ]}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      <div className="field">
        <label htmlFor="acct-name">Name</label>
        <input
          id="acct-name"
          className="input"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder={type === 'credit' ? 'e.g. SBI Credit Card' : 'e.g. HDFC Savings'}
        />
      </div>

      <div className="field">
        <label htmlFor="acct-last4">Last 4 digits (optional)</label>
        <input
          id="acct-last4"
          className="input"
          maxLength={4}
          value={last4}
          onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="6142"
        />
      </div>

      <Eyebrow>Person</Eyebrow>
      <Seg
        name="acctPerson"
        value={person}
        onChange={setPerson}
        options={[
          { value: 'you', label: 'You' },
          { value: 'priya', label: t.data.profile.partnerName || 'Priya' },
        ]}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      {type === 'credit' && (
        <>
          <div className="field">
            <label htmlFor="acct-limit">Credit limit (₹)</label>
            <input
              id="acct-limit"
              type="number"
              min="1"
              className="input"
              value={limit}
              onChange={(e) => { setLimit(e.target.value); setError(''); }}
              placeholder="300000"
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="acct-stmt">Statement day</label>
              <input
                id="acct-stmt"
                type="number"
                min="1"
                max="31"
                className="input"
                value={statementDay}
                onChange={(e) => { setStatementDay(e.target.value); setError(''); }}
                placeholder="12"
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="acct-due">Due day</label>
              <input
                id="acct-due"
                type="number"
                min="1"
                max="31"
                className="input"
                value={dueDay}
                onChange={(e) => { setDueDay(e.target.value); setError(''); }}
                placeholder="28"
              />
            </div>
          </div>
        </>
      )}

      {error && (
        <div role="alert" style={{ marginTop: 'var(--space-3)', fontSize: 12.5, color: 'var(--color-accent-700)', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
}
