import type { ReportSeverity } from '../api/reportsApi'
import './Badges.css'

type SeverityBadgeProps = {
  severity: ReportSeverity
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={`badge severity-badge severity-${severity.toLowerCase()}`}>
      {severity}
    </span>
  )
}

export default SeverityBadge
