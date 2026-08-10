import { useState } from 'react';
import { muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function ImportScreen({ t }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const run = () => {
    const count = t.importSmsBatch(text);
    if (count === 0) {
      setStatus('No messages found — paste one or more SMS texts, ideally with a blank line between each.');
      return;
    }
    setText('');
    setStatus('');
    t.setSmsIndex(0);
    t.openScreen('sms');
  };

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title="Import past messages" />

      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
        <button type="button" className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }} onClick={() => t.openScreen('add')}>
          Enter manually instead
        </button>
      </div>

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
        A one-time way to backfill the last month or two: paste your bank / PhonePe SMS texts below —
        one per message, with a blank line between each. This is a best-effort reader — it guesses
        amount, merchant, category and date from what's there. You'll review every entry next, and
        amount / merchant are editable there if a guess is off.
      </div>

      <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
        <label htmlFor="import-text">SMS texts</label>
        <textarea
          id="import-text"
          className="input"
          style={{ minHeight: 220 }}
          value={text}
          onChange={(e) => { setText(e.target.value); setStatus(''); }}
          placeholder={'Rs.560.00 debited from A/c *3456 on 06-Aug-26 to VPA swiggy@ybl...\n\nYour HDFC Bank Credit Card XX4521 has been used for Rs 4,250.00 at DECATHLON on 05-Aug-26.'}
        />
      </div>

      {status && (
        <div role="alert" style={{ fontSize: 12, color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)', textAlign: 'center' }}>
          {status}
        </div>
      )}

      <button type="button" className="btn btn-primary btn-block" style={{ margin: 0 }} onClick={run}>
        Parse &amp; review
      </button>
    </div>
  );
}
