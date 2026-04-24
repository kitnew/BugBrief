import { FormEvent, useState } from 'react'

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
  const [formData, setFormData] = useState<BugReportFormData>(initialFormData)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const updateField = (field: keyof BugReportFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.projectName.trim()) {
      setError('Project name is required.')
      return
    }

    if (!formData.rawDescription.trim()) {
      setError('Bug description is required.')
      return
    }

    setSuccessMessage('Form is ready. Backend API connection will be added in FE-03.')
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

      <button className="submit-button" type="submit">
        Generate structured report
      </button>
    </form>
  )
}

export default BugReportForm
