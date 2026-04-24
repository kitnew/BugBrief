import { useEffect, useState } from 'react'
import type { BugReport } from '../api/reportsApi'
import { getReports } from '../api/reportsApi'
import { mockReports } from '../data/mockReports'
import ReportCard from './ReportCard'
import ReportDetail from './ReportDetail'

function ReportsList() {
  const [reports, setReports] = useState<BugReport[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(mockReports[0])
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
          setSelectedReport(apiReports[0] ?? null)
          setNotice('Reports loaded from backend API.')
        }
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setReports(mockReports)
          setSelectedReport(mockReports[0])
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

      <div className="reports-layout">
        <div className="reports-grid">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onSelect={setSelectedReport} />
          ))}
        </div>

        {selectedReport && (
          <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />
        )}
      </div>
    </section>
  )
}

export default ReportsList
