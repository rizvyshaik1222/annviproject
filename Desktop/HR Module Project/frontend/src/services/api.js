import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

export const dashboardApi = {
  getSummary: () => api.get('/dashboard')
};

export const employeeApi = {
  getAll: () => api.get('/employees'),
  create: (payload) => api.post('/employees', payload),
  update: (id, payload) => api.put(`/employees/${id}`, payload),
  remove: (id) => api.delete(`/employees/${id}`)
};

export const attendanceApi = {
  getAll: () => api.get('/attendance'),
  upsert: (payload) => api.post('/attendance', payload),
  remove: (id) => api.delete(`/attendance/${id}`)
};

export const salaryApi = {
  getAll: () => api.get('/salaries'),
  upsert: (payload) => api.post('/salaries', payload),
  calculateFromAttendance: (payload) => api.post('/salaries/calculate', payload),
  getMonthlyAttendance: (employeeId, month, year) => api.get(`/salaries/attendance/${employeeId}/${month}/${year}`),
  remove: (id) => api.delete(`/salaries/${id}`)
};

export default api;
