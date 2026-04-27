// src/routes/bugRoutes.ts
import { Router } from 'express';
import { query } from '../db.js';
import { analyzeBugWithAzureAI } from '../services/azureOpenAI.service.js';

const router = Router();

type DbBugReport = {
  id: number;
  project_name: string | null;
  raw_description: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string | null;
  steps_to_reproduce: string[] | null;
  expected_result: string | null;
  actual_result: string | null;
  technical_notes: string | null;
  suggested_fix: string | null;
  status: 'open' | 'in progress' | 'resolved';
  created_at: string;
  updated_at: string;
};

function mapBugReport(row: DbBugReport) {
  return {
    id: row.id,
    projectName: row.project_name ?? undefined,
    rawDescription: row.raw_description,
    title: row.title,
    severity: row.severity,
    category: row.category ?? undefined,
    stepsToReproduce: row.steps_to_reproduce ?? [],
    expectedResult: row.expected_result ?? '',
    actualResult: row.actual_result ?? '',
    technicalNotes: row.technical_notes ?? '',
    suggestedFix: row.suggested_fix ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/test-db', async (_req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    console.error('RDS Error:', err);
    res.status(500).json({ error: 'RDS Error' });
  }
});

/**
 * Main AI endpoint used by frontend:
 * POST /api/reports/analyze
 */
router.post('/api/reports/analyze', async (req, res) => {
  const { projectName, environment, rawDescription } = req.body;

  if (!rawDescription || typeof rawDescription !== 'string') {
    return res.status(400).json({
      error: 'rawDescription field is required',
    });
  }

  try {
    const aiReport = await analyzeBugWithAzureAI({
      projectName,
      environment,
      rawDescription,
    });

    const sql = `
      INSERT INTO bug_reports (
        project_name,
        raw_description,
        title,
        severity,
        category,
        steps_to_reproduce,
        expected_result,
        actual_result,
        technical_notes,
        suggested_fix,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      projectName ?? null,
      rawDescription,
      aiReport.title,
      aiReport.severity,
      aiReport.category,
      JSON.stringify(aiReport.stepsToReproduce ?? []),
      aiReport.expectedResult,
      aiReport.actualResult,
      aiReport.technicalNotes,
      aiReport.suggestedFix,
      'open',
    ];

    const result = await query(sql, values);
    const savedReport = result.rows[0] as DbBugReport;

    res.status(201).json(mapBugReport(savedReport));
  } catch (err) {
    console.error('AI analyze error:', err);

    res.status(500).json({
      error: 'Failed to analyze and create bug report',
    });
  }
});

/**
 * GET /api/reports
 */
router.get('/api/reports', async (_req, res) => {
  try {
    const sql = `
      SELECT *
      FROM bug_reports
      ORDER BY created_at DESC;
    `;

    const result = await query(sql);
    const reports = result.rows.map((row) => mapBugReport(row as DbBugReport));

    res.status(200).json(reports);
  } catch (err) {
    console.error('DB Read Error:', err);

    res.status(500).json({
      error: 'Failed to fetch bug reports list',
    });
  }
});

/**
 * GET /api/reports/:id
 */
router.get('/api/reports/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT *
      FROM bug_reports
      WHERE id = $1;
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Report not found',
      });
    }

    res.status(200).json(mapBugReport(result.rows[0] as DbBugReport));
  } catch (err) {
    console.error('Search Error:', err);

    res.status(500).json({
      error: 'Failed to fetch report details',
    });
  }
});

/**
 * PATCH /api/reports/:id/status
 */
router.patch('/api/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['open', 'in progress', 'resolved'];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Status must be one of: open, in progress, resolved',
    });
  }

  try {
    const sql = `
      UPDATE bug_reports
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(sql, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Report not found',
      });
    }

    res.status(200).json(mapBugReport(result.rows[0] as DbBugReport));
  } catch (err) {
    console.error('Status Update Error:', err);

    res.status(500).json({
      error: 'Failed to update status',
    });
  }
});

/**
 * DELETE /api/reports/:id
 */
router.delete('/api/reports/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      DELETE FROM bug_reports
      WHERE id = $1
      RETURNING id;
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Report not found, nothing to delete',
      });
    }

    res.status(200).json({
      message: 'Report successfully deleted',
      deletedId: Number(id),
    });
  } catch (err) {
    console.error('Deletion Error:', err);

    res.status(500).json({
      error: 'Failed to delete report',
    });
  }
});

export default router;