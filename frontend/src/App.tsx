import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import BugReportForm from './components/BugReportForm'
import ReportsList from './components/ReportsList'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import { useAuth } from './AuthContext'
import './App.css'

function App() {
  const { user, logout } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100);
    }
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      // Optionally update url hash without triggering full navigation
      window.history.pushState({}, '', `/#${sectionId}`)
    }
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

        <div className="header-actions">
          {location.pathname === '/' && (
            <nav className="main-nav" aria-label="Main navigation">
              <button type="button" onClick={(event) => handleNavClick('create-report', event.currentTarget)}>Create Report</button>
              <button type="button" onClick={(event) => handleNavClick('reports', event.currentTarget)}>Reports</button>
              <button type="button" onClick={(event) => handleNavClick('about', event.currentTarget)}>About</button>
            </nav>
          )}

          {user ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => { navigate('/dashboard'); setIsDropdownOpen(false); }}>Dashboard</button>
                  <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }}>Settings</button>
                  <hr />
                  <button onClick={() => { logout(); navigate('/'); setIsDropdownOpen(false); }}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="primary-button login-button" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </button>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <>
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
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={(event) => {
                        if (user) {
                          navigate('/dashboard');
                        } else {
                          handleNavClick('reports', event.currentTarget);
                        }
                      }}
                    >
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
            </>
          } />

          <Route path="/dashboard" element={
            user ? <Dashboard /> : <div className="settings-section"><h2>Please sign in to view your dashboard.</h2></div>
          } />

          <Route path="/settings" element={
            user ? (
              <div className="settings-section">
                <h2>Settings</h2>
                <div className="settings-card">
                  <h3>Account Management</h3>
                  <p>Email: <strong>{user?.email}</strong></p>
                  <button className="secondary-button" disabled>Change Name (Coming soon)</button>
                  <button className="secondary-button text-warning" style={{ marginLeft: '10px' }} disabled>Delete Account</button>
                </div>
              </div>
            ) : (
              <div className="settings-section"><h2>Please sign in to view settings.</h2></div>
            )
          } />
        </Routes>
      </main>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

      <footer className="site-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} BugBrief. Developed by Nikita Chernysh, Yaroslav Tsaryk, Vladyslav Rudion.</p>
          <a href="https://github.com/kitnew/BugBrief" target="_blank" rel="noopener noreferrer" className="github-link">
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
