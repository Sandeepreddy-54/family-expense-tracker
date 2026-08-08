import { Router } from 'express';
import { query } from '../db.js';

export const healthRoutes = Router();
const startedAt = Date.now();

healthRoutes.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'ok', uptimeSec: Math.round((Date.now() - startedAt) / 1000) });
  } catch {
    res.status(503).json({ status: 'error', db: 'error' });
  }
});
