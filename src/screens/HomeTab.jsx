import {
  HEATMAP_COLORS, HEATMAP_SEED, MONTH_HISTORY, NET_WORTH,
} from '../data/seed.js';
import { forPerson, realMonthlyTotal } from '../lib/totals.js';
import { inr, muted } from '../lib/format.js';
import { Badge, Bar, Chevron, SectionHeading, Seg } from '../components/ui.jsx';

function Hero({ t }) {
  const netUp = t.netTotal >= 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div className="card elev-md" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', gap: 'var(--space-2)' }}>
        <div className="card-kicker" style={{ color: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}>
          Money out · This month · {t.personLabel}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 34, lineHeight: 1.1 }}>{inr(t.heroTotal)}</div>
        {t.trendPct != null && (
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            {(t.trendPct >= 0 ? '▲ ' : '▼ ') + Math.abs(t.trendPct)}% vs last month
          </div>
        )}
      </div>

      <div className="om-row" style={{ gap: 'var(--space-2)' }}>
        <div className="card elev-sm" style={{ flex: 1, gap: 2 }}>
          <div className="card-kicker" style={{ color: 'var(--color-accent-2-700)' }}>Money in</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: 'var(--color-accent-2-700)' }}>{inr(t.incomeTotal)}</div>
        </div>
        <div className="card elev-sm" style={{ flex: 1, gap: 2 }}>
          <div className="card-kicker">Net</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: netUp ? 'var(--color-accent-2-700)' : 'var(--color-accent-700)' }}>
            {netUp ? '+' : '−'}{inr(Math.abs(t.netTotal))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SmsBanner({ t }) {
  const count = t.data.smsQueue.length;
  if (!count) return null;
  return (
    <button
      type="button"
      onClick={() => { t.setSmsIndex(0); t.openScreen('sms'); }}
      style={{
        textAlign: 'left', cursor: 'pointer', border: '1px dashed var(--color-accent)',
        background: 'var(--color-accent-100)', borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', font: 'inherit',
      }}
    >
      <div style={{
        width: 34, height: 34, flexShrink: 0, borderRadius: 999, background: 'var(--color-accent)',
        color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-heading)', fontSize: 14,
      }}>{count}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-800)' }}>New payments detected from SMS</div>
        <div style={{ fontSize: 11, color: muted(55) }}>Tap to confirm and categorize</div>
      </div>
      <Chevron color="var(--color-accent-700)" opacity={1} />
    </button>
  );
}

function Overview({ t }) {
  const topCategories = t.data.categories
    .map((c) => ({ ...c, amount: forPerson(t.totals, c.name, t.person) }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
  const topMax = Math.max(...topCategories.map((c) => c.amount), 1);

  const recentTx = (t.person === 'combined'
    ? t.transactions
    : t.transactions.filter((tx) => tx.person === t.person)
  ).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Hero t={t} />
      <SmsBanner t={t} />

      {t.budgetAlerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {t.budgetAlerts.map((alert) => (
            <div key={alert.category} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: alert.dotColor, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, flex: 1 }}>{alert.text}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <SectionHeading>Top categories</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {topCategories.map((cat) => (
            <div key={cat.name}>
              <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <div className="om-row" style={{ gap: 8 }}>
                  <Badge meta={cat} />
                  <span style={{ fontSize: 12.5 }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{inr(cat.amount)}</span>
              </div>
              <Bar pct={Math.round((cat.amount / topMax) * 100)} color={cat.bg2} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Upcoming bills — next 7 days</SectionHeading>
        {t.upcomingBills.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {t.upcomingBills.map((bill) => (
              <div key={bill.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                <div>
                  <div className="om-row" style={{ gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{bill.name}</span>
                    {bill.autoDetected && (
                      <span className="tag" style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-800)' }}>auto</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: muted(55) }}>Due {bill.dueLabel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{bill.amountLabel}</div>
                  <div style={{ fontSize: 10.5, color: bill.countColor }}>{bill.countLabel}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: muted(55), padding: 'var(--space-2) 0' }}>No bills due this week.</div>
        )}
      </div>

      <div>
        <SectionHeading
          action={(
            <button type="button" onClick={() => t.setTab('transactions')} className="btn btn-ghost" style={{ padding: 0, fontSize: 12 }}>
              See all
            </button>
          )}
        >
          Recent transactions
        </SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentTx.map((tx) => (
            <div key={tx.id} className="om-row" style={{ justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div className="om-row" style={{ gap: 10 }}>
                <Badge meta={tx} size={30} font={11} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tx.merchant}</div>
                  <div style={{ fontSize: 11, color: muted(55) }}>{tx.subLabel}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: tx.amountColor }}>{tx.amountLabel}</div>
                <div style={{ fontSize: 10, color: 'var(--color-accent-700)' }}>{tx.sourceLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Trends({ t }) {
  // Category breakdown follows the person selector above it, same as Overview.
  const categories = t.data.categories
    .map((c) => ({ ...c, amount: forPerson(t.totals, c.name, t.person) }))
    .sort((a, b) => b.amount - a.amount);
  const catMax = Math.max(...categories.map((c) => c.amount), 1);

  // Historical months start out seeded, but as soon as real transactions exist
  // for one (e.g. backfilled via SMS import) that real total takes over; the
  // current month is always live.
  const months = MONTH_HISTORY.map((m) => {
    if (m.amount == null) return { label: m.label, amount: t.overallSpent };
    const real = realMonthlyTotal(t.data.transactions, m.month);
    return { label: m.label, amount: real > 0 ? real : m.amount };
  });
  const monthMax = Math.max(...months.map((m) => m.amount), 1);

  const { savings, fds, cardDebt, goalSaved, goalTarget } = NET_WORTH;
  const goalPct = Math.round((goalSaved / goalTarget) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h3 style={{ fontSize: 14, margin: '0 0 var(--space-3)' }}>Last 6 months</h3>
        <div className="om-row" style={{ alignItems: 'flex-end', gap: 8, height: 100 }}>
          {months.map((m, i) => (
            <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div
                title={inr(m.amount)}
                style={{
                  width: '100%', maxWidth: 26, borderRadius: '6px 6px 0 0',
                  background: i === months.length - 1 ? 'var(--color-accent-600)' : 'var(--color-accent-200)',
                  height: `${Math.round((m.amount / monthMax) * 100)}%`,
                }}
              />
              <div style={{ fontSize: 9.5, color: muted(55) }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 14, margin: '0 0 var(--space-3)' }}>Spend by category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {categories.map((c) => (
            <div key={c.name}>
              <div className="om-row" style={{ justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{inr(c.amount)}</span>
              </div>
              <Bar pct={Math.round((c.amount / catMax) * 100)} color={c.bg2} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 14, margin: '0 0 var(--space-3)' }}>Weekly spend heatmap</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
          {HEATMAP_SEED.map((v, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: HEATMAP_COLORS[v] }} />
          ))}
        </div>
        <div className="om-row" style={{ justifyContent: 'space-between', marginTop: 6, fontSize: 9.5, color: muted(50) }}>
          <span>4 weeks ago</span><span>This week</span>
        </div>
      </div>

      <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
        <div className="card-kicker">Net worth snapshot</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>{inr(savings + fds - cardDebt)}</div>
        <div style={{ fontSize: 11, color: muted(55) }}>
          Savings {inr(savings)} + FDs {inr(fds)} − card debt {inr(cardDebt)}
        </div>
        <div className="hr" style={{ margin: '2px 0' }} />
        <div className="card-kicker">Goa Trip Fund</div>
        <Bar pct={goalPct} color="var(--color-accent-2-500)" />
        <div style={{ fontSize: 11 }}>{inr(goalSaved)} of {inr(goalTarget)} saved ({goalPct}%)</div>
      </div>
    </div>
  );
}

export default function HomeTab({ t }) {
  // Always greet the actual logged-in account holder (matches More →
  // Account) — "Using app as" only tags who a new transaction belongs to,
  // it doesn't mean someone else is now using this phone.
  const greetingName = t.youName;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="om-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: muted(55) }}>Good evening</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>{greetingName}</h2>
        </div>
        <button
          type="button"
          onClick={() => t.openScreen('notifications')}
          aria-label="Notifications"
          style={{
            position: 'relative', width: 38, height: 38, borderRadius: 999,
            background: 'var(--color-surface)', border: '1px solid var(--color-divider)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0-6 6v3.3c0 .6-.2 1.1-.6 1.6L4 16.5c-.6.7-.1 1.8.8 1.8h14.4c.9 0 1.4-1.1.8-1.8l-1.4-2.6a2.4 2.4 0 0 1-.6-1.6V9a6 6 0 0 0-6-6Z" stroke="var(--color-text)" strokeWidth="2.75" strokeLinejoin="round" />
            <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="var(--color-text)" strokeWidth="2.75" strokeLinecap="round" />
          </svg>
          {t.hasNotifDot && (
            <div style={{ position: 'absolute', top: 6, right: 7, width: 9, height: 9, borderRadius: 999, background: 'var(--color-accent)', border: '2px solid var(--color-bg)' }} />
          )}
        </button>
      </div>

      <Seg
        name="person"
        value={t.person}
        onChange={t.setPerson}
        options={[
          { value: 'combined', label: 'Combined' },
          { value: 'you', label: 'You' },
          { value: 'priya', label: t.partnerName },
        ]}
      />

      <Seg
        name="homeview"
        value={t.homeView}
        onChange={t.setHomeView}
        options={[
          { value: 'overview', label: 'Overview' },
          { value: 'trends', label: 'Trends' },
        ]}
      />

      {t.homeView === 'overview' ? <Overview t={t} /> : <Trends t={t} />}
    </div>
  );
}
