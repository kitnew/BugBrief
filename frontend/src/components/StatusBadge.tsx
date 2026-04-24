import { ReportStatus } from '../api/reportsApi'

type StatusBadgeProps = {
  status: ReportStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass = status.replaceAll(' ', '-')

  return <span className={`badge status-badge status-${statusClass}`}>{status}</span>
}

export default StatusBadge
