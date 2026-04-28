import { useState } from 'react'
import type { FormEvent } from 'react'
import { analyzeBugReport } from '../api/reportsApi'

import { useAuth } from '../AuthContext'

type BugReportFormData = {
  projectName: string
  environment: string
  rawDescription: string
}

const initialFormData: BugReportFormData = {
  projectName: '',
  environment: '',
  rawDescription: '',
}

function BugReportForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<BugReportFormData>(initialFormData)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof BugReportFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.projectName.trim()) {
      setError('Project name is required.')
      return
    }

    if (!formData.rawDescription.trim()) {
      setError('Bug description is required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccessMessage('')

      const report = await analyzeBugReport({
        projectName: formData.projectName.trim(),
        environment: formData.environment.trim(),
        rawDescription: formData.rawDescription.trim(),
        saveToDb: !!user,
      })

      if (!user) {
        const existing = JSON.parse(sessionStorage.getItem('localBugReports') || '[]')
        sessionStorage.setItem('localBugReports', JSON.stringify([report, ...existing]))
        window.dispatchEvent(new Event('localBugReportsUpdated'))
      } else {
        // We could dispatch an event for the dashboard if needed, but it re-fetches on mount
      }

      setSuccessMessage(`Report generated: ${report.title}`)
      setFormData(initialFormData)
    } catch (requestError: any) {
      console.error(requestError)
      const errorMsg = requestError.response?.data?.details || requestError.message || '';

      if (errorMsg.includes('400')) {
        setError('Nice try, hacker! But our AI only speaks the language of real bugs. Please provide a valid description.');
      } else {
        setError('Oops, the bug squasher tripped over a cable! The backend API seems unreachable right now.');
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="bug-report-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field" htmlFor="projectName">
          <span>Project name</span>
          <input
            id="projectName"
            name="projectName"
            type="text"
            placeholder="Student Portal"
            value={formData.projectName}
            onChange={(event) => updateField('projectName', event.target.value)}
          />
        </label>

        <label className="form-field" htmlFor="environment">
          <span>Environment</span>
          <input
            id="environment"
            name="environment"
            type="text"
            placeholder="Chrome, Windows, production"
            value={formData.environment}
            onChange={(event) => updateField('environment', event.target.value)}
          />
        </label>
      </div>

      <label className="form-field" htmlFor="rawDescription">
        <span>Raw bug description</span>
        <textarea
          id="rawDescription"
          name="rawDescription"
          rows={8}
          placeholder="Example: When I click login, the page refreshes but nothing happens. Console shows 401 Unauthorized."
          value={formData.rawDescription}
          onChange={(event) => updateField('rawDescription', event.target.value)}
        />
      </label>

      {error && <p className="form-message error-message">{error}</p>}
      {successMessage && <p className="form-message success-message">{successMessage}</p>}

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Generating report...' : 'Generate structured report'}
      </button>
    </form>
  )
}

export default BugReportForm
