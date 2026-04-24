import { useEffect, useState } from 'react'
import { BugReport, getReports } from '../api/reportsApi'
import { mockReports } from '../data/mockReports'
import ReportCard from './ReportCard'

function ReportsList() {
  const [reports, setReports] = useState<BugReport[]>(mockReports)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('Showing demo reports until the backend API is available.')

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      try {
        setIsLoading(true)
        const apiReports = await getReports()

        if (isMounted) {
          setReports(apiReports)
          setNotice('Reports loaded from backend API.')
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setReports(mockReports)
          setNotice('Backend API is not available yet. Showing demo reports.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="reports-section" id="reports">
      <div className="section-heading reports-heading">
        <div>
          <p className="eyebrow">Reports</p>
          <h2>Generated bug reports</h2>
          <p>{notice}</p>
        </div>
        {isLoading && <span className="loading-pill">Loading...</span>}
      </div>

      <div className="reports-grid">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  )
}

export default ReportsList
