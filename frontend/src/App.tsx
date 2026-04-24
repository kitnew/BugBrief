import BugReportForm from './components/BugReportForm'
import ReportsList from './components/ReportsList'
import './App.css'

function App() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const handleNavClick = (sectionId: string, button: HTMLButtonElement) => {
    scrollToSection(sectionId)
    button.blur()
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand brand-button" type="button" onClick={(event) => handleNavClick('about', event.currentTarget)}>
          <span className="brand-mark">BB</span>
          <span className="brand-text">BugBrief</span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <button type="button" onClick={(event) => handleNavClick('create-report', event.currentTarget)}>Create Report</button>
          <button type="button" onClick={(event) => handleNavClick('reports', event.currentTarget)}>Reports</button>
          <button type="button" onClick={(event) => handleNavClick('about', event.currentTarget)}>About</button>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="about">
          <div className="hero-content">
            <p className="eyebrow">AI-powered bug reporting</p>
            <h1>Turn messy bug descriptions into clear QA reports.</h1>
            <p className="hero-description">
              BugBrief helps teams convert unstructured software bug reports into
              structured reports with severity, reproduction steps, expected result,
              actual result and suggested fixes.
            </p>

            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={(event) => handleNavClick('create-report', event.currentTarget)}>
                Create bug report
              </button>
              <button className="secondary-button" type="button" onClick={(event) => handleNavClick('reports', event.currentTarget)}>
                View reports
              </button>
            </div>
          </div>

          <aside className="hero-card" aria-label="Example bug report summary">
            <div className="card-header">
              <span className="status-dot"></span>
              <span>Generated report preview</span>
            </div>
            <h2>Login request fails</h2>
            <dl>
              <div>
                <dt>Severity</dt>
                <dd>High</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>Authentication</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Open</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="form-section" id="create-report">
          <div className="section-heading">
            <p className="eyebrow">Create report</p>
            <h2>Describe the bug and structure the report.</h2>
            <p>
              Enter the project context and raw bug description. The API connection
              will be added in the next frontend task.
            </p>
          </div>
          <BugReportForm />
        </section>

        <ReportsList />
      </main>
    </div>
  )
}

export default App
