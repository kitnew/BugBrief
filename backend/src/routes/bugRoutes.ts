// src/routes/bugRoutes.ts
import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    res.status(500).send('Помилка RDS');
  }
});

export default router;