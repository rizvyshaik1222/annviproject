import { useEffect, useMemo, useState } from 'react';
import { getEmployees, getSalaries, createOrUpdateSalary, calculateSalaryFromAttendance, getMonthlyAttendance, deleteSalary } from '../utils/dataStore.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

const defaultForm = {
  employee_id: '',
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear()),
  base_salary: '',
  bonus: '0',
  deductions: '0',
  paid_on: '',
  remarks: ''
};

function SalaryPage() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [autoCalcMode, setAutoCalcMode] = useState(false);

  const netSalaryPreview = useMemo(() => {
    const base = Number(form.base_salary || 0);
    const bonus = Number(form.bonus || 0);
    const deductions = Number(form.deductions || 0);
    return base + bonus - deductions;
  }, [form.base_salary, form.bonus, form.deductions]);

  const loadData = () => {
    try {
      const employees = getEmployees();
      const salaries = getSalaries();
      setEmployees(employees);
      setSalaries(salaries);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load salary data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLoadAttendance = () => {
    if (!form.employee_id || !form.month || !form.year) {
      setError('Please select employee, month, and year first');
      return;
    }

    try {
      setAttendanceLoading(true);
      setMonthlyAttendance(null);
      const data = getMonthlyAttendance(form.employee_id, form.month, form.year);
      setMonthlyAttendance(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleAutoCalculate = () => {
    if (!form.employee_id || !form.month || !form.year || !form.base_salary) {
      setError('Please select employee, month, year, and enter base salary');
      return;
    }

    try {
      setMessage('');
      const result = calculateSalaryFromAttendance({
        employee_id: form.employee_id,
        month: form.month,
        year: form.year,
        base_salary: form.base_salary,
        bonus: form.bonus || 0
      });

      setMessage(`Salary calculated automatically based on attendance. Deduction: ${formatCurrency(result.calculation.absenceDeduction)} for ${result.calculation.absenceDays} absent day(s).`);
      setForm(defaultForm);
      setMonthlyAttendance(null);
      loadData();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to calculate salary');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      createOrUpdateSalary(form);
      setMessage('Salary saved successfully. Existing month-year record gets updated automatically.');
      setForm(defaultForm);
      setMonthlyAttendance(null);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save salary');
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this salary record?');
    if (!confirmed) return;

    try {
      deleteSalary(id);
      setMessage('Salary record deleted successfully.');
      loadData();
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete salary record');
    }
  };

  return (
    <div className="page-stack fade-in">
      {message ? <div className="alert success">{message}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      <div className="split-grid">
        <section className="form-card">
          <h3>Salary Management</h3>
          
          <div className="mode-toggle">
            <label>
              <input 
                type="radio" 
                name="mode" 
                checked={!autoCalcMode} 
                onChange={() => setAutoCalcMode(false)} 
              />
              Manual Entry
            </label>
            <label>
              <input 
                type="radio" 
                name="mode" 
                checked={autoCalcMode} 
                onChange={() => setAutoCalcMode(true)} 
              />
              Auto Calculate
            </label>
          </div>

          <form onSubmit={handleSubmit} className="data-form">
            <select name="employee_id" value={form.employee_id} onChange={handleChange} required>
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>

            <div className="inline-grid">
              <input 
                name="month" 
                type="number" 
                min="1" 
                max="12" 
                placeholder="Month" 
                value={form.month} 
                onChange={handleChange} 
                required 
              />
              <input 
                name="year" 
                type="number" 
                min="2000" 
                max="2100" 
                placeholder="Year" 
                value={form.year} 
                onChange={handleChange} 
                required 
              />
            </div>

            <input 
              name="base_salary" 
              type="number" 
              step="0.01" 
              placeholder="Base Salary" 
              value={form.base_salary} 
              onChange={handleChange} 
              required 
            />

            {autoCalcMode ? (
              <>
                <input 
                  name="bonus" 
                  type="number" 
                  step="0.01" 
                  placeholder="Bonus (optional)" 
                  value={form.bonus} 
                  onChange={handleChange} 
                />
                <button type="button" className="btn primary" onClick={handleLoadAttendance}>
                  {attendanceLoading ? 'Loading...' : 'View Attendance'}
                </button>
                <button type="button" className="btn primary" onClick={handleAutoCalculate}>
                  Calculate Salary from Attendance
                </button>
              </>
            ) : (
              <>
                <input 
                  name="bonus" 
                  type="number" 
                  step="0.01" 
                  placeholder="Bonus" 
                  value={form.bonus} 
                  onChange={handleChange} 
                />
                <input 
                  name="deductions" 
                  type="number" 
                  step="0.01" 
                  placeholder="Deductions" 
                  value={form.deductions} 
                  onChange={handleChange} 
                />
                <input 
                  name="paid_on" 
                  type="date" 
                  value={form.paid_on} 
                  onChange={handleChange} 
                />
                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  rows="3"
                />
                <p className="net-preview">Net Salary Preview: {formatCurrency(netSalaryPreview)}</p>
                <button type="submit" className="btn primary">Save Salary</button>
              </>
            )}
          </form>
        </section>

        <section className="table-card">
          <h3>{autoCalcMode ? 'Monthly Attendance Report' : 'Salary Records'}</h3>

          {autoCalcMode && monthlyAttendance ? (
            <div className="attendance-report">
              <div className="report-summary">
                <div className="summary-item">
                  <span>Total Working Days</span>
                  <strong>{monthlyAttendance.totalWorkingDays}</strong>
                </div>
                <div className="summary-item">
                  <span>Present Days</span>
                  <strong>{monthlyAttendance.presentDays}</strong>
                </div>
                <div className="summary-item">
                  <span>Attendance %</span>
                  <strong>{monthlyAttendance.attendancePercentage}%</strong>
                </div>
              </div>

              <div className="attendance-breakdown">
                <h4>Attendance Breakdown</h4>
                <ul>
                  <li>Present: <strong>{monthlyAttendance.summary.present}</strong> days</li>
                  <li>Half Day: <strong>{monthlyAttendance.summary.halfDay}</strong> days</li>
                  <li>Absent: <strong>{monthlyAttendance.summary.absent}</strong> days</li>
                  <li>On Leave: <strong>{monthlyAttendance.summary.onLeave}</strong> days</li>
                  <li>Work From Home: <strong>{monthlyAttendance.summary.workFromHome}</strong> days</li>
                </ul>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyAttendance.attendance.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.status}</td>
                        <td>{record.notes || '-'}</td>
                      </tr>
                    ))}
                    {!monthlyAttendance.attendance.length ? (
                      <tr>
                        <td colSpan="3">No attendance records for this month.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !autoCalcMode ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Month / Year</th>
                    <th>Base</th>
                    <th>Bonus</th>
                    <th>Deductions</th>
                    <th>Net</th>
                    <th>Paid On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((row) => (
                    <tr key={row.id}>
                      <td>{row.first_name} {row.last_name}</td>
                      <td>{row.month}/{row.year}</td>
                      <td>{formatCurrency(row.base_salary)}</td>
                      <td>{formatCurrency(row.bonus)}</td>
                      <td>{formatCurrency(row.deductions)}</td>
                      <td>{formatCurrency(row.net_salary)}</td>
                      <td>{formatDate(row.paid_on)}</td>
                      <td>
                        <button className="btn tiny danger" onClick={() => handleDelete(row.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!salaries.length ? (
                    <tr>
                      <td colSpan="8">No salary records yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Select employee and click "View Attendance" to see monthly attendance report.</p>
          )}
        </section>
      </div>

      {/* Salary Records Summary */}
      {!autoCalcMode && (
        <section className="table-card">
          <h3>All Salary Records</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month / Year</th>
                  <th>Base</th>
                  <th>Bonus</th>
                  <th>Deductions</th>
                  <th>Net</th>
                  <th>Paid On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((row) => (
                  <tr key={row.id}>
                    <td>{row.first_name} {row.last_name}</td>
                    <td>{row.month}/{row.year}</td>
                    <td>{formatCurrency(row.base_salary)}</td>
                    <td>{formatCurrency(row.bonus)}</td>
                    <td>{formatCurrency(row.deductions)}</td>
                    <td>{formatCurrency(row.net_salary)}</td>
                    <td>{formatDate(row.paid_on)}</td>
                    <td>
                      <button className="btn tiny danger" onClick={() => handleDelete(row.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!salaries.length ? (
                  <tr>
                    <td colSpan="8">No salary records yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default SalaryPage;
