import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db.js';
import { signToken } from '../auth/jwt.js';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res, next) => {
  try {
    const { slot, password } = req.body || {};
    if (!slot || !password) return res.status(400).json({ error: 'slot and password are required' });

    const { rows } = await query('SELECT slot, display_name, password_hash FROM users WHERE slot = $1', [slot]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user.slot);
    res.json({ token, user: { slot: user.slot, displayName: user.display_name } });
  } catch (err) {
    next(err);
  }
});
