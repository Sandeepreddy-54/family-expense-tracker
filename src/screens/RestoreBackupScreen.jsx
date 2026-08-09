import { useState } from 'react';
import { backupSummary, parseBackup } from '../lib/backup.js';
import { muted } from '../lib/format.js';
import { SheetHeader } from '../components/ui.jsx';

export default function RestoreBackupScreen({ t }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null); // { backup, summary }

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the same file be picked again after an error
    if (!file) return;
    setError('');
    setPending(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = parseBackup(String(reader.result));
        setPending({ backup, summary: backupSummary(backup) });
      } catch (err) {
        setError(err.message);
      }
    };
    reader.onerror = () => setError('Could not read that file.');
    reader.readAsText(file);
  };

  const restore = () => {
    const when = pending.summary.exportedAt ? new Date(pending.summary.exportedAt).toLocaleDateString() : 'an unknown date';
    const msg = `Restore this backup from ${when}?\n\n`
      + `${pending.summary.transactions} transactions, ${pending.summary.bills} bills, ${pending.summary.accounts} accounts, `
      + `${pending.summary.cardEmis} EMIs, ${pending.summary.ious} IOUs.\n\n`
      + 'This replaces your current transactions, bills, accounts, EMIs, IOUs and budgets. '
      + "It won't touch your login or settings.";
    if (!window.confirm(msg)) return;
    t.restoreBackup(pending.backup.data);
  };

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title="Restore backup" />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        Pick a backup file from Settings → Export data → "Download full backup." Restoring replaces your
        current transactions, bills, accounts, EMIs, IOUs and budgets — it won't touch your login or
        settings.
      </div>

      <input type="file" accept="application/json,.json" onChange={onFile} style={{ marginBottom: 'var(--space-4)' }} />

      {error && (
        <div role="alert" style={{ fontSize: 12.5, color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
          {error}
        </div>
      )}

      {pending && (
        <div className="card elev-sm" style={{ gap: 'var(--space-2)' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Backup from {pending.summary.exportedAt ? new Date(pending.summary.exportedAt).toLocaleDateString() : 'unknown date'}
          </div>
          <div style={{ fontSize: 12, color: muted(60) }}>
            {pending.summary.transactions} transactions · {pending.summary.bills} bills · {pending.summary.accounts} accounts
            {' '}· {pending.summary.cardEmis} EMIs · {pending.summary.ious} IOUs
          </div>
          <button type="button" onClick={restore} className="btn btn-primary btn-block" style={{ marginTop: 'var(--space-2)' }}>
            Restore this backup
          </button>
        </div>
      )}
    </div>
  );
}
