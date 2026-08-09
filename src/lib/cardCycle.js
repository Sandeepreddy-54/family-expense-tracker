// Statement-cycle math for credit cards. Pure ISO-string logic — tx.date and
// TODAY_ISO are already zero-padded ISO (YYYY-MM-DD), so lexical comparison
// is exact and there's no Date-object timezone drift to worry about.

function ymd(iso) { return iso.split('-').map(Number); }
function daysInMonth(y, m1) { return new Date(Date.UTC(y, m1, 0)).getUTCDate(); }
function isoOf(y, m1, day) {
  const d = Math.min(day, daysInMonth(y, m1)); // clamp 31 -> the month's real last day
  return `${y}-${String(m1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Most recent occurrence of `day` on or before `todayIso`. */
export function lastStatementDate(day, todayIso) {
  const [y, m] = ymd(todayIso);
  const thisMonth = isoOf(y, m, day);
  if (thisMonth <= todayIso) return thisMonth;
  return m === 1 ? isoOf(y - 1, 12, day) : isoOf(y, m - 1, day);
}

/** Next occurrence of `day` on or after `todayIso`. */
export function nextOccurrence(day, todayIso) {
  const [y, m] = ymd(todayIso);
  const thisMonth = isoOf(y, m, day);
  if (thisMonth >= todayIso) return thisMonth;
  return m === 12 ? isoOf(y + 1, 1, day) : isoOf(y, m + 1, day);
}

/** Real spend on `account` since its last statement, through today. */
export function cycleSpend(transactions, account, todayIso) {
  const since = lastStatementDate(account.statementDay, todayIso);
  return transactions
    .filter((tx) => tx.account === account.name && tx.type !== 'income' && tx.date > since)
    .reduce((s, tx) => s + tx.amount, 0);
}
