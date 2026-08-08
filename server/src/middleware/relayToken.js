import { createHash, timingSafeEqual } from 'crypto';
import { config } from '../config.js';

// Constant-time compare via fixed-length digests, so a mismatched header
// length can't itself leak timing information.
const digest = (s) => createHash('sha256').update(s).digest();

export function requireRelayToken(req, res, next) {
  const token = req.headers['x-relay-token'] || '';
  if (!timingSafeEqual(digest(token), digest(config.relayToken))) {
    return res.status(401).json({ error: 'Invalid relay token' });
  }
  return next();
}
