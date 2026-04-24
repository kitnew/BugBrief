import { BugReport } from '../api/reportsApi'

type ReportCardProps = {
  report: BugReport
}

function ReportCard({ report }: ReportCardProps) {
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
    </article>
  )
}

export default ReportCard
