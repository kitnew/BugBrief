import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="BugBrief home">
          <span className="brand-mark">BB</span>
          <span className="brand-text">BugBrief</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#create-report">Create Report</a>
          <a href="#reports">Reports</a>
          <a href="#about">About</a>
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
              <a className="primary-button" href="#create-report">
                Create bug report
              </a>
              <a className="secondary-button" href="#reports">
                View reports
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Example bug report summary">
            <div className="card-header">
              <span className="status-dot"></span>
              <span>Generated report preview</span>
            </div>
            <h2>Login fails with 401 Unauthorized</h2>
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

        <section className="placeholder-grid" aria-label="Frontend sections">
          <article className="placeholder-card" id="create-report">
            <span className="step-number">01</span>
            <h2>Create Report</h2>
            <p>
              A form will be added here for project name, environment and raw bug
              description.
            </p>
          </article>

          <article className="placeholder-card" id="reports">
            <span className="step-number">02</span>
            <h2>Reports List</h2>
            <p>
              This section will show generated bug reports received from the backend API.
            </p>
          </article>

          <article className="placeholder-card">
            <span className="step-number">03</span>
            <h2>Report Detail</h2>
            <p>
              Each report will have a detail page with severity, status, steps and AI
              suggestions.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
