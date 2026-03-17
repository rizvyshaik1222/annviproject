import { useEffect, useMemo, useState } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../utils/dataStore.js';
import { formatDate } from '../utils/formatters.js';

const defaultForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  hire_date: '',
  status: 'Active'
};

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const pageTitle = useMemo(() => (editingId ? 'Edit Employee' : 'Add Employee'), [editingId]);

  const loadEmployees = () => {
    try {
      setLoading(true);
      const employees = getEmployees();
      setEmployees(employees);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        updateEmployee(editingId, form);
        setMessage('Employee updated successfully.');
      } else {
        createEmployee(form);
        setMessage('Employee added successfully.');
      }

      resetForm();
      loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setForm({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      position: employee.position || '',
      hire_date: employee.hire_date?.slice(0, 10) || '',
      status: employee.status || 'Active'
    });
    setEditingId(employee.id);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this employee?');
    if (!confirmed) return;

    try {
      deleteEmployee(id);
      setMessage('Employee deleted successfully.');
      if (editingId === id) resetForm();
      loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return (
    <div className="page-stack fade-in">
      <div className="split-grid">
        <section className="form-card">
          <h3>{pageTitle}</h3>
          <form onSubmit={handleSubmit} className="data-form">
            <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
            <input name="hire_date" type="date" value={form.hire_date} onChange={handleChange} required />
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Resigned</option>
            </select>

            <div className="row-actions">
              <button type="submit" className="btn primary">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn" onClick={resetForm}>Reset</button>
            </div>
          </form>
        </section>

        <section className="table-card">
          <h3>Employee Directory</h3>
          {loading ? <p>Loading employees...</p> : null}
          {message ? <div className="alert success">{message}</div> : null}
          {error ? <div className="alert error">{error}</div> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((row) => (
                  <tr key={row.id}>
                    <td>{row.first_name} {row.last_name}</td>
                    <td>{row.email}</td>
                    <td>{row.department}</td>
                    <td>{row.position}</td>
                    <td>{formatDate(row.hire_date)}</td>
                    <td>{row.status}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn tiny" onClick={() => handleEdit(row)}>Edit</button>
                        <button className="btn tiny danger" onClick={() => handleDelete(row.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!employees.length && !loading ? (
                  <tr>
                    <td colSpan="7">No employees found.</td>
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

export default EmployeesPage;
