import { useEffect, useState } from 'react';
import { getEmployees, getAttendance, markAttendance, deleteAttendance } from '../utils/dataStore.js';
import { formatDate } from '../utils/formatters.js';

const defaultForm = {
  employee_id: '',
  date: new Date().toISOString().slice(0, 10),
  check_in: '',
  check_out: '',
  status: 'Present',
  notes: ''
};

function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = () => {
    try {
      const employees = getEmployees();
      const attendanceRecords = getAttendance();
      setEmployees(employees);
      setAttendance(attendanceRecords);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load attendance data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      markAttendance(form);
      setMessage('Attendance saved successfully. Existing record for the same day gets updated automatically.');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this attendance record?');
    if (!confirmed) return;

    try {
      deleteAttendance(id);
      setMessage('Attendance deleted successfully.');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete attendance');
    }
  };

  return (
    <div className="page-stack fade-in">
      <div className="split-grid">
        <section className="form-card">
          <h3>Mark Attendance</h3>
          <form onSubmit={handleSubmit} className="data-form">
            <select name="employee_id" value={form.employee_id} onChange={handleChange} required>
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
            <input name="check_in" type="time" value={form.check_in} onChange={handleChange} />
            <input name="check_out" type="time" value={form.check_out} onChange={handleChange} />
            <select name="status" value={form.status} onChange={handleChange} required>
              <option>Present</option>
              <option>Absent</option>
              <option>Work From Home</option>
              <option>Half Day</option>
              <option>On Leave</option>
            </select>
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
            />

            <button type="submit" className="btn primary">Save Attendance</button>
          </form>
        </section>

        <section className="table-card">
          <h3>Attendance Records</h3>
          {message ? <div className="alert success">{message}</div> : null}
          {error ? <div className="alert error">{error}</div> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((row) => (
                  <tr key={row.id}>
                    <td>{row.first_name} {row.last_name}</td>
                    <td>{formatDate(row.date)}</td>
                    <td>{row.check_in || '-'}</td>
                    <td>{row.check_out || '-'}</td>
                    <td>{row.status}</td>
                    <td>
                      <button className="btn tiny danger" onClick={() => handleDelete(row.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!attendance.length ? (
                  <tr>
                    <td colSpan="6">No attendance entries yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AttendancePage;
