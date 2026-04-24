import type { BugReport } from '../api/reportsApi'
import SeverityBadge from './SeverityBadge'
import StatusBadge from './StatusBadge'

type ReportCardProps = {
  report: BugReport
  onSelect: (report: BugReport) => void
}

function ReportCard({ report, onSelect }: ReportCardProps) {
  return (
    <article className="report-card">
      <div className="report-card-header">
        <div>
          <p className="report-project">{report.projectName ?? 'Unknown project'}</p>
          <h3>{report.title}</h3>
        </div>
        <SeverityBadge severity={report.severity} />
      </div>

      <div className="report-meta">
        <span>{report.category ?? 'Uncategorized'}</span>
        <StatusBadge status={report.status} />
        {report.createdAt && <span>{report.createdAt}</span>}
      </div>

      {report.suggestedFix && <p className="report-fix">{report.suggestedFix}</p>}

      <button className="view-detail-button" type="button" onClick={() => onSelect(report)}>
        View detail
      </button>
    </article>
  )
}

export default ReportCard
