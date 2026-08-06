import { CATS, NOTIF_TOGGLES } from '../data/seed.js';
import { muted } from '../lib/format.js';
import { Eyebrow, NavCard, Seg, Toggle } from '../components/ui.jsx';

export default function SettingsTab({ t }) {
  const s = t.data.settings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NavCard title="Budgets" subtitle="Per-category limits & progress" onClick={() => t.setTab('budgets')} />
        <NavCard title="Bills & reminders" subtitle="Auto-detected recurring bills + your own" onClick={() => t.openScreen('bills')} />
        <NavCard title="Loans & lending" subtitle="EMIs, ROI, and money with friends & family" onClick={() => t.openScreen('loans')} />
        <NavCard title="Export data" subtitle="Week, month, or a custom range" onClick={() => t.openScreen('export')} />
      </div>

      <div>
        <Eyebrow>Using app as</Eyebrow>
        <Seg
          name="currentUser"
          value={t.data.currentUser}
          onChange={t.setCurrentUser}
          options={[
            { value: 'you', label: 'You (Rohan)' },
            { value: 'priya', label: 'Priya' },
          ]}
        />
        <div style={{ fontSize: 11, color: muted(55), marginTop: 6 }}>
          You can only delete entries you made yourself.
        </div>
      </div>

      <div>
        <Eyebrow>Linked accounts</Eyebrow>
        <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
          <div className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Rohan's Android — SMS access</div>
              <div style={{ fontSize: 11, color: muted(55) }}>Reads PhonePe &amp; bank SMS automatically</div>
            </div>
            <Toggle on={s.smsAndroid} onClick={() => t.toggleSetting('smsAndroid')} label="Rohan's Android SMS access" />
          </div>
          <div className="hr" style={{ margin: 0 }} />
          <div className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Priya's iPhone — SMS forwarding</div>
              <div style={{ fontSize: 11, color: muted(55) }}>iOS can't read SMS directly — forwards bank texts to a tracked number</div>
            </div>
            <Toggle on={s.iphoneForward} onClick={() => t.toggleSetting('iphoneForward')} label="Priya's iPhone SMS forwarding" />
          </div>
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
        <Eyebrow>Categories</Eyebrow>
        <div className="card elev-sm" style={{ gap: 0, padding: 'var(--space-2) var(--space-3)' }}>
          {CATS.map((c) => (
            <div key={c.name} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)', fontSize: 13 }}>
              {c.name}
            </div>
          ))}
          <div style={{ padding: 'var(--space-2) 0', fontSize: 13, color: 'var(--color-accent-700)' }}>+ Add category</div>
        </div>
      </div>

      <div>
        <Eyebrow>Household</Eyebrow>
        <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
          <div className="om-row" style={{ justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13 }}>Shared with Priya</div>
            <Toggle on={s.shared} onClick={() => t.toggleSetting('shared')} label="Shared with Priya" />
          </div>
        </div>
      </div>

      <div>
        <Eyebrow>Demo</Eyebrow>
        <button type="button" onClick={t.resetDemo} className="btn btn-secondary btn-block" style={{ marginTop: 0 }}>
          Reset to seeded data
        </button>
      </div>
    </div>
  );
}
