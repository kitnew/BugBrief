import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import type { BugReport } from '../api/reportsApi';
import { getReports } from '../api/reportsApi';
import ReportCard from './ReportCard';
import ReportDetail from './ReportDetail';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<BugReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch user reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const openCount = reports.filter(r => r.status === 'open').length;
  const closedCount = reports.filter(r => r.status === 'resolved').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.email.split('@')[0]}!</h1>
        <p>Here is an overview of your bug reports.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p className="stat-value">{reports.length}</p>
        </div>
        <div className="stat-card">
          <h3>Open</h3>
          <p className="stat-value text-warning">{openCount}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p className="stat-value text-success">{closedCount}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Your Reports</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="secondary-button"
              style={{ padding: '8px 12px', minHeight: '36px', appearance: 'auto' }}
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="secondary-button"
              style={{ padding: '8px 12px', minHeight: '36px', appearance: 'auto' }}
            >
              <option value="All">All Categories</option>
              {Array.from(new Set(reports.map(r => r.category).filter(Boolean))).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="empty-state">You haven't generated any reports yet.</p>
        ) : (
          <div className="reports-layout">
            <div className="reports-grid">
              {reports
                .filter(r => severityFilter === 'All' || r.severity === severityFilter)
                .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
                .map((report) => (
                  <ReportCard key={report.id} report={report} onSelect={setSelectedReport} />
              ))}
            </div>

            {selectedReport && (
              <ReportDetail 
                report={selectedReport} 
                onClose={() => setSelectedReport(null)} 
                onUpdate={() => { 
                  setIsLoading(true); 
                  getReports().then(data => {
                    setReports(data);
                    const updated = data.find(r => r.id === selectedReport.id);
                    setSelectedReport(updated || null);
                  }).finally(() => setIsLoading(false));
                }} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
