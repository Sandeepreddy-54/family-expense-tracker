import { inr, muted } from '../lib/format.js';
import { Bar } from '../components/ui.jsx';

export default function CardsTab({ t }) {
  const hasAccounts = t.accounts.length > 0;
  const hasCreditAccounts = t.creditAccounts.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="om-row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Cards &amp; accounts</h2>
        <button type="button" className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }} onClick={() => t.openScreen('addAccount')}>
          + Add account
        </button>
      </div>

      {!hasAccounts && (
        <div style={{ fontSize: 12.5, color: muted(55), textAlign: 'center', padding: 'var(--space-6) 0' }}>
          No cards or accounts yet — tap "+ Add account" to add your first one.
        </div>
      )}

      {hasCreditAccounts && (
        <div className="card elev-md" style={{ gap: 'var(--space-2)' }}>
          <div className="card-kicker">This cycle's credit-card spend</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{inr(t.cardsCycleSpend)}</div>
          <Bar pct={Math.round((t.cardsCycleSpend / t.cardsLimit) * 100)} color="var(--color-accent-500)" />
          <div style={{ fontSize: 11, color: muted(55) }}>
            {Math.round((t.cardsCycleSpend / t.cardsLimit) * 100)}% of {inr(t.cardsLimit)} combined limit
          </div>
        </div>
      )}

      {hasCreditAccounts && (
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
      )}

      {t.creditAccounts.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => t.openAccount(c.id)}
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
              <span>Statement {c.statementLabel}</span>
              <span>Due {c.dueLabel}</span>
            </div>
          </div>
        </button>
      ))}

      {t.bankAccounts.length > 0 && <div className="om-eyebrow">Bank accounts</div>}
      {t.bankAccounts.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => t.openAccount(a.id)}
          style={{ textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'none', font: 'inherit' }}
        >
          <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title">{a.name}</div>
              <div className="card-meta">{a.personLabel} · •••• {a.last4}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>{a.monthSpendLabel}</div>
              <div style={{ fontSize: 10.5, color: muted(55) }}>this month</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
