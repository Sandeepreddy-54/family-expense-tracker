import { muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function NotificationsScreen({ t }) {
  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} backLabel="Done" title="Notifications" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {t.notifications.map((note) => (
          <div key={note.id} className="card elev-sm" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999, background: note.bg, color: note.fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{note.letter}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{note.title}</div>
              <div style={{ fontSize: 11, color: muted(55) }}>{note.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
