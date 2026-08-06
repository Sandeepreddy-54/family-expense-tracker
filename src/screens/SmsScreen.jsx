import { SMS_CATEGORY_CHOICES, catMeta } from '../data/seed.js';
import { inr, muted } from '../lib/format.js';
import { Seg } from '../components/ui.jsx';

export default function SmsScreen({ t }) {
  const queue = t.data.smsQueue;
  const index = Math.min(t.smsIndex, Math.max(queue.length - 1, 0));
  const current = queue[index] || null;

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
            <div className="om-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{current.merchant}</div>
                <div style={{ fontSize: 11, color: muted(55) }}>{current.account}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>{inr(current.amount)}</div>
            </div>

            <div className="hr" style={{ margin: 0 }} />

            <div className="om-eyebrow" style={{ marginBottom: 0 }}>Category</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SMS_CATEGORY_CHOICES.map((name) => {
                const m = catMeta(name);
                const active = current.category === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => t.updateSmsItem(index, { category: name })}
                    aria-pressed={active}
                    style={{
                      padding: '6px 12px', borderRadius: 999, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                      border: `1.5px solid ${active ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                      background: active ? m.bg : 'transparent',
                      color: active ? m.fg : 'var(--color-text)',
                    }}
                  >{name}</button>
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
                { value: 'priya', label: 'Priya' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => t.discardSms(index)} className="btn btn-secondary" style={{ flex: 1 }}>Discard</button>
            <button type="button" onClick={() => t.confirmSms(index)} className="btn btn-primary" style={{ flex: 1 }}>Confirm</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: muted(55), fontSize: 13 }}>
          All caught up — no pending payments to review.
        </div>
      )}
    </div>
  );
}
