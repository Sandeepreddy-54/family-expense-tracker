import { useState } from 'react';
import { rangeFor, rangeLabel } from '../lib/dates.js';
import { buildCsv, downloadCsv } from '../lib/csv.js';
import { downloadBackup } from '../lib/backup.js';
import { muted } from '../lib/format.js';
import { Seg, SheetHeader } from '../components/ui.jsx';

export default function ExportScreen({ t }) {
  const [period, setPeriod] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const changePeriod = (p) => { setPeriod(p); setStatus(''); setError(''); };

  const generate = () => {
    const range = rangeFor(period, from, to);
    if (period === 'custom' && (!range.from || !range.to)) {
      setError('Pick both a start and an end date.');
      return;
    }
    if (range.from && range.to && range.from > range.to) {
      setError('The start date has to come before the end date.');
      return;
    }

    const rows = t.transactions.filter((tx) => {
      if (range.from && tx.date < range.from) return false;
      if (range.to && tx.date > range.to) return false;
      return true;
    });

    const label = rangeLabel(period, range.from, range.to);
    const csv = buildCsv({
      transactions: rows,
      budgets: t.budgets,
      creditAccounts: t.creditAccounts,
      totals: t.totals,
      categories: t.data.categories,
      range,
      label,
      youName: t.youName,
      partnerName: t.partnerName,
    });
    downloadCsv(`family-expenses-${range.from || 'start'}-to-${range.to || 'today'}.csv`, csv);
    setError('');
    setStatus(`Export ready for ${label} — ${rows.length} transaction${rows.length === 1 ? '' : 's'} saved to your downloads.`);
  };

  return (
    <div className="om-sheet">
      <SheetHeader onBack={t.closeScreen} title="Export data" />

      <Seg
        name="exportPeriod"
        value={period}
        onChange={changePeriod}
        options={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'custom', label: 'Custom' },
        ]}
        style={{ marginBottom: 'var(--space-4)' }}
      />

      {period === 'custom' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-4)' }}>
          <div className="field" style={{ margin: 0, flex: 1 }}>
            <label htmlFor="export-from">From</label>
            <input id="export-from" className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="field" style={{ margin: 0, flex: 1 }}>
            <label htmlFor="export-to">To</label>
            <input id="export-to" className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-4)' }}>
        Includes all transactions, budgets, and card summaries — combined and per person — as a CSV.
      </div>

      <button type="button" onClick={generate} className="btn btn-primary btn-block" style={{ margin: 0 }}>
        Generate export
      </button>

      {error && (
        <div role="alert" style={{ marginTop: 'var(--space-3)', fontSize: 12.5, color: 'var(--color-accent-700)', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {status && (
        <div role="status" style={{ marginTop: 'var(--space-3)', fontSize: 12.5, color: 'var(--color-accent-2-700)', textAlign: 'center' }}>
          {status}
        </div>
      )}

      <div className="hr" style={{ margin: 'var(--space-5) 0' }} />

      <div style={{ fontSize: 12, color: muted(60), marginBottom: 'var(--space-3)' }}>
        The CSV above is for reading — a full backup is for restoring everything (transactions, bills,
        accounts, EMIs, loans, IOUs, categories, budgets) later via More → Restore backup, e.g. after
        switching phones.
      </div>
      <button
        type="button"
        onClick={() => downloadBackup(`family-expenses-backup-${new Date().toISOString().slice(0, 10)}.json`, t.data)}
        className="btn btn-secondary btn-block"
        style={{ margin: 0 }}
      >
        Download full backup (JSON)
      </button>
    </div>
  );
}
