import { verifyToken } from './jwt.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    const payload = verifyToken(token);
    req.user = { slot: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
