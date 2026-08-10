import { useState } from 'react';

export default function LoginScreen({ t }) {
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [error, setError] = useState('');

  const finish = () => {
    if (!name.trim()) return setError('Enter your name to continue.');
    setError('');
    t.login({ name, partnerName });
    return undefined;
  };

  return (
    <div className="db-login">
      <div className="db-top">
        <div className="db-badge">₹</div>
      </div>

      <div>
        <h2 className="db-heading">Keep a clear record of every rupee.</h2>
        <hr className="db-rule" />
      </div>
      <p className="db-subtitle">
        Add expenses from a bank SMS or by hand — the ledger keeps the totals, split by person, automatically.
      </p>
      <ul className="db-list">
        <li>Expenses auto-tagged by person</li>
        <li>Budgets, bills and cards in one place</li>
        <li>Stays on your phone — nothing leaves this device</li>
      </ul>

      <div className="db-field">
        <label htmlFor="login-name">Your name</label>
        <input
          id="login-name"
          className="db-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && finish()}
          placeholder="e.g. Rohan"
          autoFocus
        />
      </div>
      <div className="db-field">
        <label htmlFor="login-partner">Partner&rsquo;s name (optional)</label>
        <input
          id="login-partner"
          className="db-input"
          value={partnerName}
          onChange={(e) => { setPartnerName(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && finish()}
          placeholder="e.g. Priya"
        />
        <p className="db-hint">Just a label for their share of spend — no account or syncing needed.</p>
      </div>
      {error && <p className="db-error" role="alert">{error}</p>}

      <div className="db-spacer" />
      <button type="button" className="db-btn" onClick={finish}>Continue</button>
    </div>
  );
}
