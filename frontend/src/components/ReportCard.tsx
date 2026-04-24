import { BugReport } from '../api/reportsApi'

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
        <span className={`severity-pill severity-${report.severity.toLowerCase()}`}>
          {report.severity}
        </span>
      </div>

      <div className="report-meta">
        <span>{report.category ?? 'Uncategorized'}</span>
        <span>{report.status}</span>
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
