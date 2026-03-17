import { useEffect, useState } from 'react';
import { getDashboardSummary, getSalaries } from '../utils/dataStore.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { generateExcelFile } from '../utils/excelExport.js';

const initialSummary = {
  totalEmployees: 0,
  activeEmployees: 0,
  todayPresent: 0,
  totalPayroll: 0,
  avgSalary: 0,
  recentEmployees: [],
  recentAttendance: []
};

function DashboardPage() {
  const [summary, setSummary] = useState(initialSummary);
  const [currentMonthSalaries, setCurrentMonthSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadExcel = () => {
    try {
      setDownloading(true);
      const result = generateExcelFile();
      if (result.ok) {
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to download Excel file');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      
      // Get dashboard summary
      const dashSummary = getDashboardSummary();
      setSummary(dashSummary);

      // Get current month salaries
      const currentDate = new Date();
      const allSalaries = getSalaries();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const thisMonthSalaries = allSalaries.filter(
        salary => salary.month === currentMonth && salary.year === currentYear
      );
      setCurrentMonthSalaries(thisMonthSalaries);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="page-stack fade-in">
      {error ? <div className="alert error">{error}</div> : null}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={handleDownloadExcel} 
          disabled={downloading}
          style={{
            backgroundColor: '#1a5c2f',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: downloading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => !downloading && (e.target.style.backgroundColor = '#0d4a1f')}
          onMouseLeave={(e) => !downloading && (e.target.style.backgroundColor = '#1a5c2f')}
        >
          {downloading ? 'Downloading...' : '⬇ Download Report (Excel)'}
        </button>
      </div>

      <div className="cards-grid">
        <article className="metric-card">
          <h3>Total Employees</h3>
          <p>{summary.totalEmployees}</p>
        </article>
        <article className="metric-card">
          <h3>Active Employees</h3>
          <p>{summary.activeEmployees}</p>
        </article>
        <article className="metric-card">
          <h3>Present Today</h3>
          <p>{summary.todayPresent}</p>
        </article>
        <article className="metric-card">
          <h3>Monthly Payroll</h3>
          <p>{formatCurrency(summary.totalPayroll)}</p>
        </article>
        <article className="metric-card">
          <h3>Average Salary</h3>
          <p>{formatCurrency(summary.avgSalary)}</p>
        </article>
      </div>

      <div className="two-col-grid">
        <div className="table-card">
          <h3>Recent Hires</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentEmployees.map((row) => (
                <tr key={row.id}>
                  <td>{row.first_name} {row.last_name}</td>
                  <td>{row.department}</td>
                  <td>{formatDate(row.hire_date)}</td>
                </tr>
              ))}
              {!summary.recentEmployees.length ? (
                <tr>
                  <td colSpan="3">No employee records yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Latest Attendance</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentAttendance.map((row) => (
                <tr key={row.id}>
                  <td>{row.first_name} {row.last_name}</td>
                  <td>{formatDate(row.date)}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
              {!summary.recentAttendance.length ? (
                <tr>
                  <td colSpan="3">No attendance records yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Month Salary Summary */}
      <div className="table-card">
        <h3>Current Month Salary Summary</h3>
        {currentMonthSalaries.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthSalaries.map((row) => (
                <tr key={row.id}>
                  <td>{row.first_name} {row.last_name}</td>
                  <td>{formatCurrency(row.base_salary)}</td>
                  <td>{formatCurrency(row.bonus)}</td>
                  <td>{formatCurrency(row.deductions)}</td>
                  <td style={{ fontWeight: 'bold', color: '#1a7d2e' }}>{formatCurrency(row.net_salary)}</td>
                  <td>{row.paid_on ? formatDate(row.paid_on) : 'Not Paid'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No salary records for the current month yet. Go to Salary page to calculate salaries.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
