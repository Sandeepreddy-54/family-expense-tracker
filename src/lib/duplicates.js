// Same amount + same day + same direction (money in/out) is the cheap,
// good-enough signal for "you might have already logged this" — exact
// merchant/account matching would miss the most common real case (a bank
// SMS that fires twice, or the same message pasted into Import a second
// time by accident). `type` is required so an unrelated expense and income
// that happen to share an amount and date (e.g. salary in, rent out, both
// round numbers) never get flagged against each other.
export function findDuplicates(transactions, amount, date, type) {
  return transactions.filter((tx) => tx.amount === amount && tx.date === date && tx.type === type);
}
