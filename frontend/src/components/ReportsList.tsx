import { useEffect, useState } from 'react'
import type { BugReport } from '../api/reportsApi'
import { getReports } from '../api/reportsApi'
import { mockReports } from '../data/mockReports'
import ReportCard from './ReportCard'
import ReportDetail from './ReportDetail'
import { useAuth } from '../AuthContext'

function ReportsList() {
  const { user } = useAuth()
  const [reports, setReports] = useState<BugReport[]>([])
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const loadReports = async () => {
    setIsLoading(true)
    if (user) {
      try {
        const apiReports = await getReports()
        const recent = apiReports.slice(0, 3)
        if (recent.length > 0) {
          setReports(recent)
          setNotice('Showing your 3 most recent reports.')
          // preserve selection if possible
          setSelectedReport(current => {
            if (current) {
              const updated = recent.find(r => r.id === current.id);
              if (updated) return updated;
            }
            return recent[0];
          });
        } else {
          setReports([])
          setSelectedReport(null)
          setNotice("You don't have any reports yet.")
        }
      } catch (error) {
        console.error(error)
        setNotice('Failed to load your reports.')
      }
    } else {
      const local = JSON.parse(sessionStorage.getItem('localBugReports') || '[]')
      if (local.length > 0) {
        setReports(local)
        setNotice('Showing your locally generated reports (session only).')
        setSelectedReport(current => {
          if (current) {
            const updated = local.find((r: BugReport) => r.id === current.id);
            if (updated) return updated;
          }
          return local[0];
        });
      } else {
        setReports(mockReports)
        setNotice('Showing demo reports. Generate a new report to see it here.')
        setSelectedReport(current => {
          if (current) {
            const updated = mockReports.find((r: BugReport) => r.id === current.id);
            if (updated) return updated;
          }
          return mockReports[0];
        });
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadReports()
    window.addEventListener('localBugReportsUpdated', loadReports)
    return () => {
      window.removeEventListener('localBugReportsUpdated', loadReports)
    }
  }, [user])

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
          <ReportDetail 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
            onUpdate={loadReports} 
            isDemo={mockReports.some(m => m.id === selectedReport.id)} 
          />
        )}
      </div>
    </section>
  )
}

export default ReportsList
