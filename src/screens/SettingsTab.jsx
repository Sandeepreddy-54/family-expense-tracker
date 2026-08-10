import { NOTIF_TOGGLES } from '../data/seed.js';
import { inr, muted } from '../lib/format.js';
import { Eyebrow, GridTile, Seg, Toggle } from '../components/ui.jsx';

const ICONS = {
  categories: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2.5" />
    </>
  ),
  budgets: <path d="M5 19V10M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />,
  bills: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.6" fill="currentColor" />
    </>
  ),
  cards: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth="2.5" />
    </>
  ),
  loans: (
    <>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  export: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  import: (
    <>
      <path d="M12 19V8M8 12l4-4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

function TileIcon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">{ICONS[name]}</svg>
  );
}

export default function SettingsTab({ t }) {
  const s = t.data.settings;
  const profile = t.data.profile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>More</h2>

      <div>
        <Eyebrow>Account</Eyebrow>
        <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.name || 'You'}</div>
            <div style={{ fontSize: 11, color: muted(55) }}>Logged in</div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={t.logout}>Log out</button>
        </div>
      </div>

      <div>
        <Eyebrow>SMS access</Eyebrow>
        <div className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.name ? `${profile.name}'s` : 'Your'} Android</div>
            <div style={{ fontSize: 11, color: muted(55) }}>Reads PhonePe &amp; bank SMS automatically</div>
          </div>
          <Toggle on={s.smsAndroid} onClick={() => t.toggleSetting('smsAndroid')} label={`${profile.name ? `${profile.name}'s` : 'Your'} Android SMS access`} />
        </div>
      </div>

      <div>
        <Eyebrow>Manage</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
          <GridTile title="Categories" subtitle="Add, remove, manage" icon={<TileIcon name="categories" />} onClick={() => t.openScreen('categories')} />
          <GridTile title="Budgets" subtitle="Per-category limits" icon={<TileIcon name="budgets" />} onClick={() => t.setTab('budgets')} />
          <GridTile title="Bills & reminders" subtitle="Auto-detected + your own" icon={<TileIcon name="bills" />} onClick={() => t.openScreen('bills')} />
          <GridTile
            title="Card EMIs"
            subtitle={t.monthlyEmiTotal > 0 ? `${t.activeEmis.length} active · ${inr(t.monthlyEmiTotal)}/mo` : 'Track EMIs on your cards'}
            icon={<TileIcon name="cards" />}
            onClick={() => t.openScreen('emis')}
          />
          <GridTile title="Loans & lending" subtitle="EMIs, ROI & IOUs" icon={<TileIcon name="loans" />} onClick={() => t.openScreen('loans')} />
          <GridTile title="Export data" subtitle="Week, month, or custom" icon={<TileIcon name="export" />} onClick={() => t.openScreen('export')} />
          <GridTile title="Import past messages" subtitle="Paste old SMS to backfill" icon={<TileIcon name="import" />} onClick={() => t.openScreen('import')} />
        </div>
      </div>

      <div>
        <Eyebrow>Using app as</Eyebrow>
        <Seg
          name="currentUser"
          value={t.data.currentUser}
          onChange={t.setCurrentUser}
          options={[
            { value: 'you', label: `You${profile.name ? ` (${profile.name})` : ''}` },
            { value: 'priya', label: profile.partnerName || 'Priya' },
          ]}
        />
        <div style={{ fontSize: 11, color: muted(55), marginTop: 6 }}>
          You can only delete entries you made yourself.
        </div>
      </div>

      <div>
        <Eyebrow>Notifications</Eyebrow>
        <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
          {NOTIF_TOGGLES.map((n) => (
            <div key={n.key} className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: 13 }}>{n.label}</div>
              <Toggle small on={s[n.key]} onClick={() => t.toggleSetting(n.key)} label={n.label} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Eyebrow>Data</Eyebrow>
        <button type="button" onClick={t.clearData} className="btn btn-secondary btn-block" style={{ marginTop: 0 }}>
          Clear all data
        </button>
      </div>
    </div>
  );
}
