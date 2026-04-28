import { useState } from 'react'
import type { BugReport } from '../api/reportsApi'
import { updateReportStatus, deleteReport } from '../api/reportsApi'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'
import { useAuth } from '../AuthContext'

type ReportDetailProps = {
  report: BugReport
  onClose: () => void
  onUpdate?: () => void
  isDemo?: boolean
}

function ReportDetail({ report, onClose, onUpdate, isDemo }: ReportDetailProps) {
  const { user } = useAuth();
  const [copyStatus, setCopyStatus] = useState('Copy Markdown');

  const handleStatusChange = async (newStatus: 'open' | 'in progress' | 'resolved') => {
    try {
      if (user && report.id < 1000000000000) { // arbitrary threshold for Date.now() vs DB id
        await updateReportStatus(report.id, newStatus);
      } else {
        const local = JSON.parse(sessionStorage.getItem('localBugReports') || '[]');
        const updated = local.map((r: BugReport) => r.id === report.id ? { ...r, status: newStatus } : r);
        sessionStorage.setItem('localBugReports', JSON.stringify(updated));
      }
      window.dispatchEvent(new Event('localBugReportsUpdated'));
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
    }
  }

  const handleDelete = async () => {
    try {
      if (user && report.id < 1000000000000) {
        await deleteReport(report.id);
      } else {
        const local = JSON.parse(sessionStorage.getItem('localBugReports') || '[]');
        const updated = local.filter((r: BugReport) => r.id !== report.id);
        sessionStorage.setItem('localBugReports', JSON.stringify(updated));
      }
      window.dispatchEvent(new Event('localBugReportsUpdated'));
      if (onUpdate) onUpdate();
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const handleExport = async () => {
    const markdown = `# ${report.title}
**Project:** ${report.projectName || 'N/A'}
**Severity:** ${report.severity}
**Category:** ${report.category || 'N/A'}
**Status:** ${report.status}

## Steps to Reproduce
${report.stepsToReproduce?.map(step => `1. ${step}`).join('\n') || 'N/A'}

## Expected Result
${report.expectedResult || 'N/A'}

## Actual Result
${report.actualResult || 'N/A'}

## Technical Notes
${report.technicalNotes || 'N/A'}

## Suggested Fix
${report.suggestedFix || 'N/A'}
`;
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('Copied! ✓');
      setTimeout(() => setCopyStatus('Copy Markdown'), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      setCopyStatus('Failed to copy');
    }
  }

  return (
    <section className="report-detail-section" aria-label="Report detail">
      <div className="report-detail-header">
        <div>
          <p className="report-project">{report.projectName ?? 'Unknown project'}</p>
          <h2>{report.title}</h2>
        </div>
        <button className="close-detail-button" type="button" onClick={onClose}>
          Close detail
        </button>
      </div>

      <div className="detail-badges">
        <SeverityBadge severity={report.severity} />
        <StatusBadge status={report.status} />
        <span className="detail-chip">{report.category ?? 'Uncategorized'}</span>
        {report.createdAt && <span className="detail-chip">{new Date(report.createdAt).toLocaleDateString()}</span>}
      </div>

      {report.stepsToReproduce && report.stepsToReproduce.length > 0 && (
        <div className="detail-block">
          <h3>Steps to reproduce</h3>
          <ol>
            {report.stepsToReproduce.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="detail-grid">
        <div className="detail-block">
          <h3>Expected result</h3>
          <p>{report.expectedResult ?? 'No expected result provided.'}</p>
        </div>

        <div className="detail-block">
          <h3>Actual result</h3>
          <p>{report.actualResult ?? 'No actual result provided.'}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-block">
          <h3>Technical notes</h3>
          <p>{report.technicalNotes ?? 'No technical notes provided.'}</p>
        </div>

        <div className="detail-block">
          <h3>Suggested fix</h3>
          <p>{report.suggestedFix ?? 'No suggested fix provided.'}</p>
        </div>
      </div>

      {!isDemo && (
        <div className="detail-actions" style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <select 
            className="secondary-button" 
            value={report.status} 
            onChange={(e) => handleStatusChange(e.target.value as 'open' | 'in progress' | 'resolved')}
            style={{ appearance: 'auto' }}
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="secondary-button" onClick={handleExport}>
            {copyStatus}
          </button>
          <button className="secondary-button" onClick={handleDelete} style={{ borderColor: '#ef4444', color: '#ef4444', marginLeft: 'auto' }}>
            Delete
          </button>
        </div>
      )}
    </section>
  )
}

export default ReportDetail
