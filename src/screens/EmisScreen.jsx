import { inr, muted } from '../lib/format.js';
import { Bar, SheetHeader } from '../components/ui.jsx';

export default function EmisScreen({ t }) {
  const byCard = t.cards
    .map((c) => ({ card: c, items: t.emis.filter((e) => e.cardId === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="om-sheet">
      <SheetHeader
        onBack={t.closeScreen}
        title="Card EMIs"
        action={(
          <button type="button" className="om-sheet-action om-sheet-action-strong" onClick={() => t.openAddEmi(t.cards[0]?.id)}>
            Add
          </button>
        )}
      />

      <div className="card elev-md" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <div className="card-kicker" style={{ color: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
          Due every month, across {t.emiCardsCount} card{t.emiCardsCount === 1 ? '' : 's'}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30 }}>{inr(t.monthlyEmiTotal)}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          {t.activeEmis.length} active EMI{t.activeEmis.length === 1 ? '' : 's'}
        </div>
      </div>

      {byCard.length === 0 && (
        <div style={{ fontSize: 12.5, color: muted(55), textAlign: 'center', padding: 'var(--space-6) 0' }}>
          No EMIs yet — tap Add to log one against a card.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {byCard.map(({ card, items }) => {
          const cardMonthly = items.filter((e) => !e.completed).reduce((s, e) => s + e.emiAmount, 0);
          return (
            <div key={card.id}>
              <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="om-eyebrow" style={{ marginBottom: 0 }}>{card.name}</div>
                <div style={{ fontSize: 11.5, color: muted(55) }}>{inr(cardMonthly)}/mo</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {items.map((e) => (
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
