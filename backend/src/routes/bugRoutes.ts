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

router.post('/bugs', async (req, res) => {
  // 1. Отримуємо дані, які прислав користувач
  const { project_name, title, severity, raw_description } = req.body;

  try {
    // 2. Пишемо SQL-запит
    const sql = `
      INSERT INTO bug_reports (project_name, title, severity, raw_description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    // 3. Відправляємо в AWS RDS
    const result = await query(sql, [project_name, title, severity, raw_description]);

    // 4. Повертаємо успішну відповідь
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error('Помилка запису в БД:', err);
    res.status(500).json({ error: 'Не вдалося створити баг' });
  }
});

export default router;