import type { BugReport } from '../api/reportsApi'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'

type ReportDetailProps = {
  report: BugReport
  onClose: () => void
}

function ReportDetail({ report, onClose }: ReportDetailProps) {
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
        {report.createdAt && <span className="detail-chip">{report.createdAt}</span>}
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
    </section>
  )
}

export default ReportDetail
