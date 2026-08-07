// Best-effort parser for pasted bank/PhonePe SMS text — used to backfill past
// months in one sitting instead of confirming each auto-detected SMS live.
// Real bank SMS formats vary a lot, so this favours "good guess, easy to
// correct in review" over trying to be exhaustive.

const AMOUNT_RE = /(?:Rs\.?|INR)\s?([\d,]+(?:\.\d{1,2})?)/i;
const VPA_RE = /to\s+VPA\s+([\w.\-]+)@/i;
const AT_MERCHANT_RE = /\bat\s+([A-Z][A-Z0-9 &.'\-]{2,30}?)\s+on\b/i;
// Money coming in vs going out — everything not matched here defaults to an
// expense, so a message with neither word (rare) still lands somewhere sane.
const CREDIT_WORDS = /credited|deposited|received|refunded|refund|cashback|reversed/i;
const DEBIT_WORDS = /debited|spent|used for|paid|withdrawn|purchase/i;
const KNOWN_ACCOUNTS = ['PhonePe', 'HDFC', 'ICICI'];
const DATE_RE = /\b(\d{1,2})[-/](\w{3}|\d{1,2})[-/](\d{2,4})\b/;
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

const CATEGORY_HINTS = [
  { cat: 'Food & Dining', words: ['swiggy', 'zomato', 'restaurant', 'cafe'] },
  { cat: 'Groceries', words: ['grocery', 'bazaar', 'mart', 'supermarket', 'grofers', 'blinkit', 'zepto'] },
  { cat: 'Transport', words: ['uber', 'ola', 'petrol', 'fuel', 'metro', 'irctc', 'rapido'] },
  { cat: 'Shopping', words: ['amazon', 'flipkart', 'myntra', 'decathlon', 'ajio'] },
  { cat: 'Subscriptions', words: ['netflix', 'spotify', 'prime video', 'hotstar'] },
  { cat: 'Bills & Utilities', words: ['electricity', 'wifi', 'broadband', 'water bill', 'gas bill', 'recharge'] },
  { cat: 'Entertainment', words: ['bookmyshow', 'pvr', 'inox'] },
  { cat: 'Health', words: ['pharmacy', 'apollo', 'hospital', 'clinic', 'medic'] },
  { cat: 'Travel', words: ['makemytrip', 'goibibo', 'indigo', 'airlines', 'hotel'] },
];

function splitMessages(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const byBlank = trimmed.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  if (byBlank.length > 1) return byBlank;

  // No blank-line separators. A single pasted SMS often wraps onto more than
  // one line by itself — splitting on every newline would shred it into
  // fragments that mostly fail to parse. Count how many amounts appear in the
  // whole paste: exactly one means it's one message, however many lines it
  // spans; more than one (with no blank lines) means one message per line.
  const amountHits = trimmed.match(new RegExp(AMOUNT_RE.source, 'gi')) || [];
  if (amountHits.length <= 1) return [trimmed];
  return trimmed.split(/\n+/).map((s) => s.trim()).filter(Boolean);
}

function guessMerchant(raw) {
  const vpa = raw.match(VPA_RE);
  if (vpa) return vpa[1].replace(/[._-]/g, ' ').trim();
  const at = raw.match(AT_MERCHANT_RE);
  if (at) return at[1].trim();
  return 'Unknown merchant';
}

function guessAccount(raw) {
  return KNOWN_ACCOUNTS.find((k) => raw.toLowerCase().includes(k.toLowerCase())) || 'Unknown';
}

function guessCategory(raw, merchant) {
  const s = `${raw} ${merchant}`.toLowerCase();
  const hit = CATEGORY_HINTS.find((h) => h.words.some((w) => s.includes(w)));
  return hit ? hit.cat : 'Other';
}

function guessDate(raw) {
  const m = raw.match(DATE_RE);
  if (!m) return null;
  const [, d, mon, y] = m;
  const month = /^\d+$/.test(mon) ? parseInt(mon, 10) : MONTHS[mon.toLowerCase().slice(0, 3)];
  const day = parseInt(d, 10);
  let year = parseInt(y, 10);
  if (year < 100) year += 2000;
  if (!month || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseSmsMessage(raw) {
  const amountMatch = raw.match(AMOUNT_RE);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
  const merchant = guessMerchant(raw);
  // "Debited"/"spent" style wording wins ties — banks are far more consistent
  // about that phrasing than about the various credit verbs.
  const type = DEBIT_WORDS.test(raw) ? 'expense' : CREDIT_WORDS.test(raw) ? 'income' : 'expense';
  return {
    raw,
    merchant,
    amount,
    account: guessAccount(raw),
    category: guessCategory(raw, merchant),
    type,
    date: guessDate(raw),
  };
}

export function parseSmsBatch(text) {
  return splitMessages(text).map(parseSmsMessage);
}
