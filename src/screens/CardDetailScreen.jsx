import { inr, muted } from '../lib/format.js';
import { Badge, Bar, SheetHeader } from '../components/ui.jsx';

export default function CardDetailScreen({ t }) {
  const account = t.detailAccount;
  if (!account) return null;

  const accountTx = t.transactions.filter((tx) => tx.account === account.name);

  const deleteAndClose = () => {
    t.deleteAccount(account.id);
    t.closeScreen();
  };

  if (account.type !== 'credit') {
    return (
      <div className="om-sheet">
        <SheetHeader onBack={t.closeScreen} title={account.name} />

        <div className="card elev-md" style={{ gap: 'var(--space-3)' }}>
          <div className="card-meta">{account.personLabel} · •••• {account.last4}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{account.monthSpendLabel}</div>
          <div style={{ fontSize: 11, color: muted(55) }}>spent this month</div>
        </div>

        <button type="button" className="btn btn-ghost" style={{ marginTop: 'var(--space-4)' }} onClick={deleteAndClose}>
          Delete account
        </button>

        <div className="om-eyebrow" style={{ margin: 'var(--space-5) 0 6px' }}>Transactions on this account</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {accountTx.length === 0 && (
            <div style={{ fontSize: 12.5, color: muted(55) }}>No transactions on this account yet.</div>
          )}
          {accountTx.map((tx) => (
            <div
              key={tx.id}
              className="om-row"
              style={{
                justifyContent: 'space-between', padding: 'var(--space-2)', margin: '0 calc(var(--space-2) * -1)',
                borderBottom: '1px solid var(--color-divider)', borderRadius: 'var(--radius-sm)',
                background: tx.isLarge ? 'color-mix(in srgb, var(--color-accent-700) 6%, transparent)' : 'transparent',
              }}
            >
              <div className="om-row" style={{ gap: 10 }}>
                <Badge meta={tx} size={30} font={11} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.merchant}</div>
                  <div style={{ fontSize: 11, color: muted(55) }}>{tx.subLabel}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: tx.amountColor }}>{tx.amountLabel}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cardEmis = t.emis.filter((e) => e.cardId === account.id);
  const cardMonthlyEmi = cardEmis.filter((e) => !e.completed).reduce((s, e) => s + e.emiAmount, 0);

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title={account.name} />

      <div className="card elev-md" style={{ gap: 'var(--space-3)', background: 'var(--color-text)', color: 'var(--color-bg)' }}>
        <div className="card-meta" style={{ color: 'color-mix(in srgb, var(--color-bg) 65%, transparent)' }}>
          {account.personLabel} · •••• {account.last4}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{account.cycleSpendLabel}</div>
        <div className="om-bar-track" style={{ background: 'color-mix(in srgb, var(--color-bg) 25%, transparent)' }}>
          <div className="om-bar-fill" style={{ width: `${account.utilPct}%`, background: 'var(--color-accent)' }} />
        </div>
        <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11, color: 'color-mix(in srgb, var(--color-bg) 75%, transparent)' }}>
          <span>Limit {inr(account.limit)}</span>
          <span>{account.utilPct}% used</span>
        </div>
        <div className="hr" style={{ margin: 0, background: 'color-mix(in srgb, var(--color-bg) 20%, transparent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
          <div>
            <div style={{ opacity: 0.65 }}>Statement date</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{account.statementLabel}</div>
          </div>
          <div>
            <div style={{ opacity: 0.65 }}>Due date</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{account.dueLabel}</div>
          </div>
        </div>
      </div>

      {/* Card payments run through the bank, not this app — the prototype's
          "Pay now" is a hand-off placeholder, so it's disabled rather than
          pretending to move money. */}
      <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 'var(--space-4)' }} disabled title="Payments are not wired up in this build">
        Pay now
      </button>

      <div className="om-row" style={{ justifyContent: 'space-between', margin: 'var(--space-5) 0 6px' }}>
        <div className="om-eyebrow" style={{ marginBottom: 0 }}>
          EMIs on this card{cardMonthlyEmi > 0 ? ` · ${inr(cardMonthlyEmi)}/mo` : ''}
        </div>
        <button type="button" className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }} onClick={() => t.openAddEmi(account.id, 'cardDetail')}>
          + Add EMI
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        {cardEmis.length === 0 && (
          <div style={{ fontSize: 12.5, color: muted(55) }}>No EMIs on this card yet.</div>
        )}
        {cardEmis.map((e) => (
          <div key={e.id} className="card elev-sm" style={{ gap: 6 }}>
            <div className="om-row" style={{ justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{e.item}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{e.emiAmountLabel}</span>
            </div>
            <Bar pct={e.pct} color={e.completed ? 'var(--color-accent-2-500)' : 'var(--color-accent-500)'} />
            <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11, color: e.dueColor || muted(55) }}>
              <span>{e.completed ? 'Completed' : `${e.pendingMonths} of ${e.tenureMonths} left`}</span>
              <span>{e.completed ? `Ended ${e.endDateLabel}` : `Next ${e.nextDueLabel}`}</span>
            </div>
            {!e.completed && (
              <button type="button" onClick={() => t.markEmiPaid(e.id)} className="btn btn-secondary" style={{ marginTop: 2 }}>
                Mark this month paid
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="om-eyebrow" style={{ margin: 'var(--space-5) 0 6px' }}>Transactions on this card</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {accountTx.length === 0 && (
          <div style={{ fontSize: 12.5, color: muted(55) }}>No transactions on this card yet.</div>
        )}
        {accountTx.map((tx) => (
          <div
            key={tx.id}
            className="om-row"
            style={{
              justifyContent: 'space-between', padding: 'var(--space-2)', margin: '0 calc(var(--space-2) * -1)',
              borderBottom: '1px solid var(--color-divider)', borderRadius: 'var(--radius-sm)',
              background: tx.isLarge ? 'color-mix(in srgb, var(--color-accent-700) 6%, transparent)' : 'transparent',
            }}
          >
            <div className="om-row" style={{ gap: 10 }}>
              <Badge meta={tx} size={30} font={11} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.merchant}</div>
                <div style={{ fontSize: 11, color: muted(55) }}>{tx.subLabel}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: tx.amountColor }}>{tx.amountLabel}</div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-ghost" style={{ marginTop: 'var(--space-4)' }} onClick={deleteAndClose}>
        Delete account
      </button>
    </div>
  );
}
