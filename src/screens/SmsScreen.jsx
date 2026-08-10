import { useState } from 'react';
import { TODAY_ISO } from '../data/seed.js';
import { inr, muted, shortDate } from '../lib/format.js';
import { ConfirmDialog, Seg } from '../components/ui.jsx';
import { findDuplicates } from '../lib/duplicates.js';

export default function SmsScreen({ t }) {
  const queue = t.data.smsQueue;
  const index = Math.min(t.smsIndex, Math.max(queue.length - 1, 0));
  const current = queue[index] || null;
  const [duplicates, setDuplicates] = useState(null);

  const tryConfirm = () => {
    const dupes = findDuplicates(t.data.transactions, current.amount, current.date || TODAY_ISO, current.type || 'expense');
    if (dupes.length > 0) { setDuplicates(dupes); return; }
    t.confirmSms(index);
  };

  return (
    <div className="om-sheet">
      <div className="om-sheet-head" style={{ marginBottom: 'var(--space-2)' }}>
        <button type="button" className="om-sheet-action" onClick={t.closeScreen}>Close</button>
        <h3>Review payments</h3>
        <div className="om-sheet-spacer" />
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: muted(55), marginBottom: 'var(--space-4)' }}>
        {current ? `${index + 1} of ${queue.length}` : 'Done'}
      </div>

      {current ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{
            background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
            fontSize: 11.5, fontFamily: 'ui-monospace,monospace', color: muted(70), lineHeight: 1.5,
          }}>{current.raw}</div>

          <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
            <div className="om-row" style={{ justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <input
                  className="input"
                  value={current.merchant}
                  onChange={(e) => t.updateSmsItem(index, { merchant: e.target.value })}
                  aria-label="Merchant"
                  style={{ fontSize: 15, fontWeight: 700, border: 'none', background: 'transparent', padding: '2px 0', minHeight: 'auto' }}
                />
                <div style={{ fontSize: 11, color: muted(55) }}>{t.personalizeAccount(current.account)}</div>
              </div>
              <input
                type="number"
                className="input"
                value={current.amount}
                onChange={(e) => t.updateSmsItem(index, { amount: parseFloat(e.target.value) || 0 })}
                aria-label="Amount"
                style={{
                  width: 96, flexShrink: 0, fontFamily: 'var(--font-heading)', fontSize: 20, textAlign: 'right',
                  border: 'none', background: 'transparent', padding: '2px 0', minHeight: 'auto',
                }}
              />
            </div>

            <div className="hr" style={{ margin: 0 }} />

            <div className="om-eyebrow" style={{ marginBottom: 0 }}>Type</div>
            <Seg
              name="smsType"
              value={current.type || 'expense'}
              onChange={(v) => t.updateSmsItem(index, { type: v })}
              options={[
                { value: 'expense', label: 'Money out' },
                { value: 'income', label: 'Money in' },
              ]}
            />

            <div className="om-eyebrow" style={{ marginTop: 4, marginBottom: 0 }}>Category</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {t.data.categories.map((c) => {
                const active = current.category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => t.updateSmsItem(index, { category: c.name })}
                    aria-pressed={active}
                    style={{
                      padding: '6px 12px', borderRadius: 999, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                      border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                      background: active ? c.bg : 'transparent',
                      color: active ? c.fg : 'var(--color-text)',
                    }}
                  >{c.name}</button>
                );
              })}
            </div>

            <div className="om-eyebrow" style={{ marginTop: 4, marginBottom: 0 }}>Person</div>
            <Seg
              name="smsPerson"
              value={current.person}
              onChange={(v) => t.updateSmsItem(index, { person: v })}
              options={[
                { value: 'you', label: 'You' },
                { value: 'priya', label: t.partnerName },
              ]}
            />

            {t.data.accounts.length > 0 && (
              <>
                <div className="om-eyebrow" style={{ marginTop: 4, marginBottom: 0 }}>Account</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {t.data.accounts.map((a) => {
                    const active = current.account === a.name;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => t.updateSmsItem(index, { account: a.name })}
                        aria-pressed={active}
                        style={{
                          padding: '6px 12px', borderRadius: 999, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                          border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                          background: active ? 'var(--color-accent-100)' : 'transparent',
                          color: active ? 'var(--color-accent-800)' : 'var(--color-text)',
                        }}
                      >{t.personalizeAccount(a.name)}</button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => t.discardSms(index)} className="btn btn-secondary" style={{ flex: 1 }}>Discard</button>
            <button type="button" onClick={tryConfirm} className="btn btn-primary" style={{ flex: 1 }}>Confirm</button>
          </div>

          {duplicates && (
            <ConfirmDialog
              title="Possible duplicate"
              body={`You already logged ${inr(duplicates[0].amount)} on ${shortDate(duplicates[0].date)} (${duplicates[0].merchant}). Add this one too?`}
              confirmLabel="Add anyway"
              onConfirm={() => { setDuplicates(null); t.confirmSms(index); }}
              onCancel={() => setDuplicates(null)}
            />
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: muted(55), fontSize: 13 }}>
          All caught up — no pending payments to review.
          <div style={{ marginTop: 'var(--space-3)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => t.openScreen('import')}>
              Import past messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
