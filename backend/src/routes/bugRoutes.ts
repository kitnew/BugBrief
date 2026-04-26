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
    res.status(500).send('RDS Error');
  }
});

router.post('/bugs', async (req, res) => {
  // 1. Get data sent by the user
  const { project_name, title, severity, raw_description } = req.body;

  try {
    // 2. Write SQL query
    const sql = `
      INSERT INTO bug_reports (project_name, title, severity, raw_description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    // 3. Send to AWS RDS
    const result = await query(sql, [project_name, title, severity, raw_description]);

    // 4. Return successful response
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error('DB Write Error:', err);
    res.status(500).json({ error: 'Failed to create bug report' });
  }
});

router.get('/bugs', async (req, res) => {
  try {
    // 1. Simple SQL query to select all data
    // Sort by date (newest first) for convenience
    const sql = 'SELECT * FROM bug_reports ORDER BY created_at DESC;';

    // 2. Execute query
    const result = await query(sql);

    // 3. Send array of reports to the client
    res.status(200).json(result.rows);
    
  } catch (err) {
    console.error('DB Read Error:', err);
    res.status(500).json({ error: 'Failed to fetch bug reports list' });
  }
});

router.get('/bugs/:id', async (req, res) => {
  // 1. Get ID from URL parameters
  const { id } = req.params;

  try {
    // 2. Search for record in the database
    const sql = 'SELECT * FROM bug_reports WHERE id = $1;';
    const result = await query(sql, [id]);

    // 3. Check if the bug actually exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // 4. Return found report
    res.status(200).json(result.rows[0]);
    
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ error: 'Failed to fetch report details' });
  }
});

router.patch('/bugs/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Simple check: did the user provide a new status
  if (!status) {
    return res.status(400).json({ error: 'Status field is required' });
  }

  try {
    // 2. Update status and automatically set current time in updated_at
    const sql = `
      UPDATE bug_reports 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    
    const result = await query(sql, [status, id]);

    // 3. Check if the bug exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // 4. Return updated object
    res.status(200).json(result.rows[0]);
    
  } catch (err) {
    console.error('Status Update Error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/bugs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Execute deletion
    const sql = 'DELETE FROM bug_reports WHERE id = $1 RETURNING id;';
    const result = await query(sql, [id]);

    // 2. Check if there was anything to delete
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found, nothing to delete' });
    }

    // 3. Return success confirmation
    res.status(200).json({ 
      message: 'Report successfully deleted', 
      deletedId: id 
    });
    
  } catch (err) {
    console.error('Deletion Error:', err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;