import { useState } from 'react';
import { generateExcelFile } from '../utils/excelExport.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { getEmployees, getAttendance, getSalaries, getDashboardSummary } from '../utils/dataStore.js';

function ReportsPage() {
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

  const employees = getEmployees();
  const attendance = getAttendance();
  const salaries = getSalaries();
  const summary = getDashboardSummary();

  return (
    <div className="page-stack fade-in">
      <h2 style={{ marginBottom: '30px', fontSize: '2.2rem', color: '#1a5c2f' }}>
        Reports & Export
      </h2>

      {error ? <div className="alert error">{error}</div> : null}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <button 
          onClick={handleDownloadExcel} 
          disabled={downloading}
          style={{
            backgroundColor: '#1a5c2f',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: downloading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: downloading ? 0.7 : 1
          }}
          onMouseEnter={(e) => !downloading && (e.target.style.backgroundColor = '#0d4a1f')}
          onMouseLeave={(e) => !downloading && (e.target.style.backgroundColor = '#1a5c2f')}
        >
          {downloading ? 'Downloading...' : '⬇ Download Complete Report (Excel)'}
        </button>
      </div>

      {/* Reports Overview Cards */}
      <div className="cards-grid" style={{ marginBottom: '30px' }}>
        <article className="metric-card">
          <h3>Total Employees</h3>
          <p style={{ fontSize: '2.2rem', color: '#1a5c2f' }}>{employees.length}</p>
        </article>
        <article className="metric-card">
          <h3>Total Records</h3>
          <p style={{ fontSize: '2.2rem', color: '#d4a520' }}>{attendance.length}</p>
        </article>
        <article className="metric-card">
          <h3>Salary Entries</h3>
          <p style={{ fontSize: '2.2rem', color: '#00b4d8' }}>{salaries.length}</p>
        </article>
        <article className="metric-card">
          <h3>Monthly Payroll</h3>
          <p style={{ fontSize: '1.8rem', color: '#1a5c2f' }}>
            {formatCurrency(summary.totalPayroll)}
          </p>
        </article>
      </div>

      {/* Export Information */}
      <div style={{ 
        backgroundColor: 'rgba(26, 92, 47, 0.05)',
        border: '2px solid #1a5c2f',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#1a5c2f', marginBottom: '15px' }}>📊 Export Information</h3>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#333', marginBottom: '10px' }}>
          The Excel file contains comprehensive data organized in multiple sheets:
        </p>
        <ul style={{
          fontSize: '14px',
          lineHeight: '1.7',
          color: '#555',
          paddingLeft: '20px'
        }}>
          <li><strong>Employees:</strong> Complete employee database with IDs, names, emails, positions, departments, salaries, and join dates</li>
          <li><strong>Attendance:</strong> Full attendance records with dates, status, and notes for all employees</li>
          <li><strong>Salary:</strong> Detailed salary information including base salary, bonuses, deductions, net salary, and payment status</li>
          <li><strong>Summary:</strong> Dashboard metrics including total employees, payroll summary, and generation timestamp</li>
        </ul>
      </div>

      {/* Employees Preview */}
      <div className="table-card">
        <h3>Employees Database Preview</h3>
        {employees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employee records available.</p>
        )}
        {employees.length > 5 && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
            Showing 5 of {employees.length} employees. Download the complete report to see all records.
          </p>
        )}
      </div>

      {/* Recent Attendance */}
      <div className="table-card">
        <h3>Recent Attendance Records</h3>
        {attendance.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice(-5).map((att, idx) => (
                <tr key={idx}>
                  <td>{att.employee_id}</td>
                  <td>{formatDate(att.date)}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: att.status === 'Present' ? '#e8f5e9' : 
                                       att.status === 'Absent' ? '#ffebee' : '#fff3e0',
                      color: att.status === 'Present' ? '#2e7d32' : 
                             att.status === 'Absent' ? '#c62828' : '#e65100',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {att.status || '-'}
                    </span>
                  </td>
                  <td>{att.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No attendance records available.</p>
        )}
        {attendance.length > 5 && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
            Showing 5 of {attendance.length} records. Download the complete report to see all attendance data.
          </p>
        )}
      </div>

      {/* Recent Salaries */}
      <div className="table-card">
        <h3>Recent Salary Records</h3>
        {salaries.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Month/Year</th>
                <th>Base Salary</th>
                <th>Net Salary</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {salaries.slice(-5).map((sal, idx) => (
                <tr key={idx}>
                  <td>{sal.employee_id}</td>
                  <td>{sal.month}/{sal.year}</td>
                  <td>{sal.base_salary ? formatCurrency(sal.base_salary) : '-'}</td>
                  <td style={{ fontWeight: '600', color: '#1a5c2f' }}>
                    {sal.net_salary ? formatCurrency(sal.net_salary) : '-'}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: sal.paid_on ? '#e8f5e9' : '#fff3e0',
                      color: sal.paid_on ? '#2e7d32' : '#e65100',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {sal.paid_on ? formatDate(sal.paid_on) : 'Not Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No salary records available.</p>
        )}
        {salaries.length > 5 && (
          <p style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
            Showing 5 of {salaries.length} records. Download the complete report to see all salary data.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
