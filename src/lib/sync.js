// Excludes visually ambiguous characters (0/O, 1/I) so a code is easy to read aloud or retype.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function genSyncCode(length = 6) {
  let out = '';
  for (let i = 0; i < length; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return out;
}
