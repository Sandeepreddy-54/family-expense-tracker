import { useState } from 'react';
import { CATS, NOTIF_TOGGLES } from '../data/seed.js';
import { inr, muted } from '../lib/format.js';
import { genSyncCode } from '../lib/sync.js';
import { Eyebrow, NavCard, Seg, Toggle } from '../components/ui.jsx';

export default function SettingsTab({ t }) {
  const s = t.data.settings;
  const profile = t.data.profile;
  const [partnerName, setPartnerName] = useState(profile.partnerName || '');
  const [syncCode, setSyncCode] = useState(profile.syncCode || '');
  const [syncError, setSyncError] = useState('');

  const connect = () => {
    if (!partnerName.trim() || !syncCode.trim()) {
      setSyncError('Enter a name and code to sync.');
      return;
    }
    t.syncPartner({ partnerName, syncCode });
    setSyncError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Settings</h2>

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
        <Eyebrow>Partner sync</Eyebrow>
        <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
          {profile.synced ? (
            <div className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Synced with {profile.partnerName}</div>
                <div style={{ fontSize: 11, color: muted(55) }}>Code {profile.syncCode}</div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={t.unsyncPartner}>Unsync</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: muted(55) }}>
                Enter your partner's name and share a code to keep both apps in sync.
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="settings-partner-name">Partner's name</label>
                <input
                  id="settings-partner-name"
                  className="input"
                  value={partnerName}
                  onChange={(e) => { setPartnerName(e.target.value); setSyncError(''); }}
                  placeholder="e.g. Priya"
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="settings-sync-code">Sync code</label>
                <div className="om-row" style={{ gap: 8 }}>
                  <input
                    id="settings-sync-code"
                    className="input"
                    style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    value={syncCode}
                    onChange={(e) => { setSyncCode(e.target.value.toUpperCase()); setSyncError(''); }}
                    placeholder="e.g. K3F9QX"
                    maxLength={8}
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => { setSyncCode(genSyncCode()); setSyncError(''); }}>
                    Generate
                  </button>
                </div>
              </div>
              {syncError && <div role="alert" style={{ fontSize: 11, color: 'var(--color-accent-700)' }}>{syncError}</div>}
              <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 0 }} onClick={connect}>
                Connect
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <NavCard title="Budgets" subtitle="Per-category limits & progress" onClick={() => t.setTab('budgets')} />
        <NavCard title="Bills & reminders" subtitle="Auto-detected recurring bills + your own" onClick={() => t.openScreen('bills')} />
        <NavCard title="Card EMIs" subtitle={t.monthlyEmiTotal > 0 ? `${t.activeEmis.length} active · ${inr(t.monthlyEmiTotal)}/mo across your cards` : 'Track EMIs on your credit cards'} onClick={() => t.openScreen('emis')} />
        <NavCard title="Loans & lending" subtitle="EMIs, ROI, and money with friends & family" onClick={() => t.openScreen('loans')} />
        <NavCard title="Export data" subtitle="Week, month, or a custom range" onClick={() => t.openScreen('export')} />
        <NavCard title="Import past messages" subtitle="Paste old SMS to backfill a month or two" onClick={() => t.openScreen('import')} />
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
        <Eyebrow>Linked accounts</Eyebrow>
        <div className="card elev-sm" style={{ gap: 'var(--space-3)' }}>
          <div className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.name ? `${profile.name}'s` : 'Your'} Android — SMS access</div>
              <div style={{ fontSize: 11, color: muted(55) }}>Reads PhonePe &amp; bank SMS automatically</div>
            </div>
            <Toggle on={s.smsAndroid} onClick={() => t.toggleSetting('smsAndroid')} label={`${profile.name ? `${profile.name}'s` : 'Your'} Android SMS access`} />
          </div>
          <div className="hr" style={{ margin: 0 }} />
          <div className="om-row" style={{ justifyContent: 'space-between', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.partnerName ? `${profile.partnerName}'s` : "Partner's"} iPhone — SMS forwarding</div>
              <div style={{ fontSize: 11, color: muted(55) }}>iOS can't read SMS directly — forwards bank texts to a tracked number</div>
            </div>
            <Toggle on={s.iphoneForward} onClick={() => t.toggleSetting('iphoneForward')} label={`${profile.partnerName ? `${profile.partnerName}'s` : "Partner's"} iPhone SMS forwarding`} />
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
            <div style={{ fontSize: 13 }}>Shared with {profile.partnerName || 'partner'}</div>
            <Toggle on={s.shared} onClick={() => t.toggleSetting('shared')} label={`Shared with ${profile.partnerName || 'partner'}`} />
          </div>
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
