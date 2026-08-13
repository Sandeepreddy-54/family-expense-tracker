import { inr, muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function ForecastScreen({ t }) {
  const { total, groups } = t.forecast;
  const vsThisMonth = t.overallSpent > 0 ? Math.round((total / t.overallSpent) * 100) : null;

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title="Next month forecast" />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        Pulled from your card EMIs, loans, unpaid bills, and merchants that keep showing up in your
        transaction history — a heads-up on what&rsquo;s already committed before next month starts.
      </div>

      <div className="card elev-md" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <div className="card-kicker" style={{ color: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
          Expected committed spend · next month
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32 }}>{inr(total)}</div>
        {vsThisMonth != null && (
          <div style={{ fontSize: 12, opacity: 0.9 }}>{vsThisMonth}% of what you&rsquo;ve spent this month so far</div>
        )}
      </div>

      {groups.length === 0 && (
        <div style={{ fontSize: 12.5, color: muted(55), textAlign: 'center', padding: 'var(--space-6) 0' }}>
          Nothing recurring detected yet — add card EMIs or bills, or keep logging transactions and
          this will fill in on its own.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {groups.map((g) => {
          const groupTotal = g.items.reduce((s, i) => s + i.amount, 0);
          return (
            <div key={g.key}>
              <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="om-eyebrow" style={{ marginBottom: 0 }}>{g.label}</div>
                <div style={{ fontSize: 11.5, color: muted(55) }}>{inr(groupTotal)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {g.items.map((item) => (
                  <div key={item.key} className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                      {item.sublabel && <div style={{ fontSize: 11, color: muted(55) }}>{item.sublabel}</div>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{inr(item.amount)}</div>
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
