import { inr, muted } from '../lib/format.js';
import { Badge, SheetHeader } from '../components/ui.jsx';

export default function CardDetailScreen({ t }) {
  const card = t.detailCard;
  if (!card) return null;

  const cardTx = t.transactions.filter((tx) => tx.account === card.name);

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title={card.name} />

      <div className="card elev-md" style={{ gap: 'var(--space-3)', background: 'var(--color-text)', color: 'var(--color-bg)' }}>
        <div className="card-meta" style={{ color: 'color-mix(in srgb, var(--color-bg) 65%, transparent)' }}>
          {card.personLabel} · •••• {card.last4}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{inr(card.outstanding)}</div>
        <div className="om-bar-track" style={{ background: 'color-mix(in srgb, var(--color-bg) 25%, transparent)' }}>
          <div className="om-bar-fill" style={{ width: `${card.utilPct}%`, background: 'var(--color-accent)' }} />
        </div>
        <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11, color: 'color-mix(in srgb, var(--color-bg) 75%, transparent)' }}>
          <span>Limit {inr(card.limit)}</span>
          <span>{card.utilPct}% used</span>
        </div>
        <div className="hr" style={{ margin: 0, background: 'color-mix(in srgb, var(--color-bg) 20%, transparent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
          <div>
            <div style={{ opacity: 0.65 }}>Statement date</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{card.statementDate}</div>
          </div>
          <div>
            <div style={{ opacity: 0.65 }}>Due date</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{card.dueDate}</div>
          </div>
          <div>
            <div style={{ opacity: 0.65 }}>Min due</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{card.minDueLabel}</div>
          </div>
        </div>
      </div>

      {/* Card payments run through the bank, not this app — the prototype's
          "Pay now" is a hand-off placeholder, so it's disabled rather than
          pretending to move money. */}
      <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 'var(--space-4)' }} disabled title="Payments are not wired up in this build">
        Pay now
      </button>

      <div className="om-eyebrow" style={{ margin: 'var(--space-5) 0 6px' }}>Transactions on this card</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {cardTx.length === 0 && (
          <div style={{ fontSize: 12.5, color: muted(55) }}>No transactions on this card yet.</div>
        )}
        {cardTx.map((tx) => (
          <div key={tx.id} className="om-row" style={{ justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}>
            <div className="om-row" style={{ gap: 10 }}>
              <Badge meta={tx} size={30} font={11} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.merchant}</div>
                <div style={{ fontSize: 11, color: muted(55) }}>{tx.subLabel}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.amountLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
