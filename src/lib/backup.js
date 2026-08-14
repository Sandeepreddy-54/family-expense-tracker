// A full, restorable snapshot of household content — deliberately separate
// from the CSV export in csv.js, which is a human-readable spending summary,
// not a lossless round-trip format. profile/settings/currentUser are left
// out on purpose: restoring a backup should bring your data back, not change
// who's logged in on this device or its notification/toggle preferences.
const BACKUP_KEYS = [
  'transactions', 'smsQueue', 'bills', 'ious', 'cardEmis', 'loans', 'forecastExtras',
  'accounts', 'categories', 'budgetOverrides', 'overallBudget',
];

export function buildBackup(data) {
  const snapshot = {};
  BACKUP_KEYS.forEach((key) => { snapshot[key] = data[key]; });
  return { version: 1, exportedAt: new Date().toISOString(), data: snapshot };
}

export function backupSummary(backup) {
  const d = backup?.data || {};
  return {
    exportedAt: backup?.exportedAt || null,
    transactions: d.transactions?.length || 0,
    bills: d.bills?.length || 0,
    accounts: d.accounts?.length || 0,
    cardEmis: d.cardEmis?.length || 0,
    ious: d.ious?.length || 0,
    loans: d.loans?.length || 0,
    categories: d.categories?.length || 0,
  };
}

/** Throws with a message safe to show the user if the file isn't a backup this app made. */
export function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file isn\'t valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || typeof parsed.data !== 'object' || !parsed.data) {
    throw new Error('That doesn\'t look like a Family Expense Tracker backup.');
  }
  return parsed;
}

export function downloadBackup(filename, data) {
  const json = JSON.stringify(buildBackup(data), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
