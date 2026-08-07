import { useState } from 'react';
import { genSyncCode } from '../lib/sync.js';

export default function LoginScreen({ t }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [error, setError] = useState('');

  const goToSync = () => {
    if (!name.trim()) return setError('Enter your name to continue.');
    setError('');
    setStep(2);
    return undefined;
  };

  const finish = (withSync) => {
    if (withSync) {
      if (!partnerName.trim()) return setError("Enter your partner's name.");
      if (!syncCode.trim()) return setError('Enter or generate a sync code.');
    }
    setError('');
    t.login({ name, partnerName: withSync ? partnerName : '', syncCode: withSync ? syncCode : '' });
    return undefined;
  };

  return (
    <div className="db-login">
      <div className="db-top">
        {step === 2 ? (
          <button type="button" className="db-back" onClick={() => setStep(1)}>← Back</button>
        ) : (
          <div className="db-badge">₹</div>
        )}
        <div className="db-dots">
          <span className={`db-dot${step === 1 ? ' is-active' : ''}`} />
          <span className={`db-dot${step === 2 ? ' is-active' : ''}`} />
        </div>
      </div>

      {step === 1 ? (
        <>
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
            <li>Stays on your phone until you sync with your partner</li>
          </ul>

          <div className="db-field">
            <label htmlFor="login-name">Your name</label>
            <input
              id="login-name"
              className="db-input"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && goToSync()}
              placeholder="e.g. Rohan"
              autoFocus
            />
          </div>
          {error && <p className="db-error" role="alert">{error}</p>}

          <div className="db-spacer" />
          <button type="button" className="db-btn" onClick={goToSync}>Continue</button>
        </>
      ) : (
        <>
          <div>
            <h2 className="db-heading">Sync your ledger with your partner.</h2>
            <hr className="db-rule" />
          </div>
          <p className="db-subtitle">
            Link {partnerName.trim() || 'their'} app so you both see the same shared ledger, tagged by person automatically.
          </p>

          <div className="db-field">
            <label htmlFor="login-partner">Partner&rsquo;s name</label>
            <input
              id="login-partner"
              className="db-input"
              value={partnerName}
              onChange={(e) => { setPartnerName(e.target.value); setError(''); }}
              placeholder="e.g. Priya"
              autoFocus
            />
          </div>
          <div className="db-field">
            <label htmlFor="login-code">Sync code</label>
            <div className="db-code-row">
              <input
                id="login-code"
                className="db-input"
                value={syncCode}
                onChange={(e) => { setSyncCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="e.g. K3F9QX"
                maxLength={8}
              />
              <button type="button" className="db-gen" onClick={() => { setSyncCode(genSyncCode()); setError(''); }}>
                Generate
              </button>
            </div>
            <p className="db-hint">
              Share this code with your partner, or enter the one they generated — matching codes keep both apps in sync. (Simulated for this demo.)
            </p>
          </div>
          {error && <p className="db-error" role="alert">{error}</p>}

          <div className="db-spacer" />
          <button type="button" className="db-btn" onClick={() => finish(true)}>Start syncing</button>
          <p className="db-foot">
            Setting up alone? <button type="button" onClick={() => finish(false)}>Skip for now</button>
          </p>
        </>
      )}
    </div>
  );
}
