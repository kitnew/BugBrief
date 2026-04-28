// src/routes/bugRoutes.ts
import { Router } from 'express';
import { query } from '../db.js';
import { analyzeBugWithAzureAI } from '../services/azureOpenAI.service.js';
import { authenticateToken, optionalAuthenticateToken, type AuthRequest } from '../middleware/authMiddleware.js';

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
router.post('/api/reports/analyze', optionalAuthenticateToken, async (req: AuthRequest, res) => {
  const { projectName, environment, rawDescription, saveToDb = true } = req.body;

  if (saveToDb && !req.user) {
    return res.status(401).json({ error: 'Authentication required to save reports' });
  }

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

    if (!saveToDb) {
      return res.status(200).json({
        id: Date.now(),
        projectName: projectName ?? undefined,
        rawDescription,
        title: aiReport.title,
        severity: aiReport.severity,
        category: aiReport.category ?? undefined,
        stepsToReproduce: aiReport.stepsToReproduce ?? [],
        expectedResult: aiReport.expectedResult ?? '',
        actualResult: aiReport.actualResult ?? '',
        technicalNotes: aiReport.technicalNotes ?? '',
        suggestedFix: aiReport.suggestedFix ?? '',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const sql = `
      INSERT INTO bug_reports (
        user_id,
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
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
      req.user?.id,
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
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';

    res.status(500).json({
      error: 'Failed to analyze and create bug report',
      details: errorMessage,
    });
  }
});

/**
 * GET /api/reports
 */
router.get('/api/reports', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sql = `
      SELECT *
      FROM bug_reports
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await query(sql, [req.user?.id]);
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
router.get('/api/reports/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT *
      FROM bug_reports
      WHERE id = $1 AND user_id = $2;
    `;

    const result = await query(sql, [id, req.user?.id]);

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
router.patch('/api/reports/:id/status', authenticateToken, async (req: AuthRequest, res) => {
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
      WHERE id = $2 AND user_id = $3
      RETURNING *;
    `;

    const result = await query(sql, [status, id, req.user?.id]);

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
router.delete('/api/reports/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const sql = `
      DELETE FROM bug_reports
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await query(sql, [id, req.user?.id]);

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