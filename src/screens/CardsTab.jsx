import { inr, muted } from '../lib/format.js';
import { Bar } from '../components/ui.jsx';

export default function CardsTab({ t }) {
  const utilPct = Math.round((t.cardsOutstanding / t.cardsLimit) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Credit cards</h2>

      <div className="card elev-md" style={{ gap: 'var(--space-2)' }}>
        <div className="card-kicker">Combined outstanding</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{inr(t.cardsOutstanding)}</div>
        <Bar pct={utilPct} color="var(--color-accent-500)" />
        <div style={{ fontSize: 11, color: muted(55) }}>
          {utilPct}% of {inr(t.cardsLimit)} combined limit
        </div>
      </div>

      <button
        type="button"
        onClick={() => t.openScreen('emis')}
        style={{ textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'none', font: 'inherit' }}
      >
        <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Card EMIs</div>
            <div style={{ fontSize: 11, color: muted(55) }}>
              {t.activeEmis.length > 0
                ? `${t.activeEmis.length} active · across ${t.emiCardsCount} card${t.emiCardsCount === 1 ? '' : 's'}`
                : 'No EMIs yet — tap to add one'}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>
            {t.monthlyEmiTotal > 0 ? `${inr(t.monthlyEmiTotal)}/mo` : ''}
          </div>
        </div>
      </button>

      {t.cards.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => t.openCard(c.id)}
          style={{ textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'none', font: 'inherit' }}
        >
          <div className="card elev-sm" style={{ gap: 'var(--space-2)' }}>
            <div className="om-row" style={{ justifyContent: 'space-between' }}>
              <div>
                <div className="card-title">{c.name}</div>
                <div className="card-meta">{c.personLabel} · •••• {c.last4}</div>
              </div>
              <span className="tag" style={{ background: c.tagBg, color: c.tagFg }}>{c.utilLabel} used</span>
            </div>
            <Bar pct={c.utilPct} color={c.barColor} />
            <div className="om-row" style={{ justifyContent: 'space-between', fontSize: 11.5, color: muted(60) }}>
              <span>Due {c.dueDate}</span>
              <span>Min due {c.minDueLabel}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
