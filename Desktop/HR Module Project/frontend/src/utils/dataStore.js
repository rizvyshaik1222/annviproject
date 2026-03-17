// Simple localStorage-based data store for HR Module
// All data is stored locally in the browser

const STORAGE_KEYS = {
  EMPLOYEES: 'hr_employees',
  ATTENDANCE: 'hr_attendance',
  SALARIES: 'hr_salaries'
};

// ============ EMPLOYEES ============

export const getEmployees = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export const getEmployeeById = (id) => {
  const employees = getEmployees();
  return employees.find(emp => emp.id === Number(id));
};

export const createEmployee = (payload) => {
  const employees = getEmployees();
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  employees.push(newEmployee);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return newEmployee;
};

export const updateEmployee = (id, payload) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === Number(id));
  if (index === -1) throw new Error('Employee not found');
  
  employees[index] = {
    ...employees[index],
    ...payload,
    id: employees[index].id,
    created_at: employees[index].created_at,
    updated_at: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return employees[index];
};

export const deleteEmployee = (id) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === Number(id));
  if (index === -1) throw new Error('Employee not found');
  
  employees.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return true;
};

// ============ ATTENDANCE ============

export const getAttendance = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
};

export const markAttendance = (payload) => {
  const attendance = getAttendance();
  const employees = getEmployees();
  const employee = employees.find(e => e.id === Number(payload.employee_id));
  
  if (!employee) throw new Error('Employee not found');

  // Check if already exists for this date
  const existingIndex = attendance.findIndex(
    a => a.employee_id === Number(payload.employee_id) && a.date === payload.date
  );

  const attendanceRecord = {
    id: existingIndex === -1 
      ? (attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1)
      : attendance[existingIndex].id,
    ...payload,
    employee_id: Number(payload.employee_id),
    first_name: employee.first_name,
    last_name: employee.last_name,
    department: employee.department,
    created_at: existingIndex === -1 ? new Date().toISOString() : attendance[existingIndex].created_at,
    updated_at: new Date().toISOString()
  };

  if (existingIndex === -1) {
    attendance.push(attendanceRecord);
  } else {
    attendance[existingIndex] = attendanceRecord;
  }

  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  return attendanceRecord;
};

export const deleteAttendance = (id) => {
  const attendance = getAttendance();
  const index = attendance.findIndex(a => a.id === Number(id));
  if (index === -1) throw new Error('Attendance record not found');
  
  attendance.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  return true;
};

export const getMonthlyAttendance = (employeeId, month, year) => {
  const attendance = getAttendance();
  const employees = getEmployees();
  const employee = employees.find(e => e.id === Number(employeeId));
  
  if (!employee) throw new Error('Employee not found');

  const monthlyRecords = attendance.filter(a => {
    const date = new Date(a.date);
    return a.employee_id === Number(employeeId) &&
           date.getMonth() + 1 === Number(month) &&
           date.getFullYear() === Number(year);
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const summary = {
    present: 0,
    halfDay: 0,
    absent: 0,
    onLeave: 0,
    workFromHome: 0
  };

  monthlyRecords.forEach(record => {
    switch (record.status) {
      case 'Present':
        summary.present++;
        break;
      case 'Half Day':
        summary.halfDay++;
        break;
      case 'Absent':
        summary.absent++;
        break;
      case 'On Leave':
        summary.onLeave++;
        break;
      case 'Work From Home':
        summary.workFromHome++;
        break;
    }
  });

  const totalWorkingDays = 22;
  const presentDays = summary.present + summary.workFromHome + (summary.halfDay * 0.5);
  const attendancePercentage = (presentDays / totalWorkingDays) * 100;

  return {
    employee,
    month,
    year,
    attendance: monthlyRecords,
    summary,
    totalWorkingDays,
    presentDays,
    attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
  };
};

// ============ SALARIES ============

export const getSalaries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALARIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return [];
  }
};

export const createOrUpdateSalary = (payload) => {
  const salaries = getSalaries();
  const employees = getEmployees();
  const employee = employees.find(e => e.id === Number(payload.employee_id));
  
  if (!employee) throw new Error('Employee not found');

  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const base = toNumber(payload.base_salary);
  const bonus = toNumber(payload.bonus || 0);
  const deductions = toNumber(payload.deductions || 0);
  const net_salary = base + bonus - deductions;

  // Check if already exists
  const existingIndex = salaries.findIndex(
    s => s.employee_id === Number(payload.employee_id) &&
         s.month === Number(payload.month) &&
         s.year === Number(payload.year)
  );

  const salaryRecord = {
    id: existingIndex === -1
      ? (salaries.length > 0 ? Math.max(...salaries.map(s => s.id)) + 1 : 1)
      : salaries[existingIndex].id,
    employee_id: Number(payload.employee_id),
    month: Number(payload.month),
    year: Number(payload.year),
    base_salary: base,
    bonus: bonus,
    deductions: deductions,
    net_salary: net_salary,
    paid_on: payload.paid_on || null,
    remarks: payload.remarks || null,
    first_name: employee.first_name,
    last_name: employee.last_name,
    department: employee.department,
    position: employee.position,
    created_at: existingIndex === -1 ? new Date().toISOString() : salaries[existingIndex].created_at,
    updated_at: new Date().toISOString()
  };

  if (existingIndex === -1) {
    salaries.push(salaryRecord);
  } else {
    salaries[existingIndex] = salaryRecord;
  }

  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
  return salaryRecord;
};

export const calculateSalaryFromAttendance = (payload) => {
  const salaries = getSalaries();
  const employees = getEmployees();
  const attendance = getAttendance();

  const employee = employees.find(e => e.id === Number(payload.employee_id));
  if (!employee) throw new Error('Employee not found');

  // Get attendance records for the month
  const monthAttendance = attendance.filter(a => {
    const date = new Date(a.date);
    return a.employee_id === Number(payload.employee_id) &&
           date.getMonth() + 1 === Number(payload.month) &&
           date.getFullYear() === Number(payload.year);
  });

  let presentDays = 0;
  let absenceDays = 0;

  monthAttendance.forEach(record => {
    switch (record.status) {
      case 'Present':
      case 'Work From Home':
        presentDays += 1;
        break;
      case 'Half Day':
        presentDays += 0.5;
        break;
      case 'Absent':
        absenceDays += 1;
        break;
    }
  });

  const totalWorkingDays = 22;
  const base = Number(payload.base_salary || 0);
  const bonus = Number(payload.bonus || 0);

  const deductionPerDay = base / totalWorkingDays;
  const absenceDeduction = absenceDays * deductionPerDay;
  const net_salary = base + bonus - absenceDeduction;

  // Update or create salary
  const existingIndex = salaries.findIndex(
    s => s.employee_id === Number(payload.employee_id) &&
         s.month === Number(payload.month) &&
         s.year === Number(payload.year)
  );

  const salaryRecord = {
    id: existingIndex === -1
      ? (salaries.length > 0 ? Math.max(...salaries.map(s => s.id)) + 1 : 1)
      : salaries[existingIndex].id,
    employee_id: Number(payload.employee_id),
    month: Number(payload.month),
    year: Number(payload.year),
    base_salary: base,
    bonus: bonus,
    deductions: Math.round(absenceDeduction * 100) / 100,
    net_salary: Math.round(net_salary * 100) / 100,
    paid_on: null,
    remarks: null,
    first_name: employee.first_name,
    last_name: employee.last_name,
    department: employee.department,
    position: employee.position,
    created_at: existingIndex === -1 ? new Date().toISOString() : salaries[existingIndex].created_at,
    updated_at: new Date().toISOString()
  };

  if (existingIndex === -1) {
    salaries.push(salaryRecord);
  } else {
    salaries[existingIndex] = salaryRecord;
  }

  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));

  return {
    data: salaryRecord,
    calculation: {
      presentDays,
      absenceDays,
      totalWorkingDays,
      deductionPerDay: Math.round(deductionPerDay * 100) / 100,
      absenceDeduction: Math.round(absenceDeduction * 100) / 100
    }
  };
};

export const deleteSalary = (id) => {
  const salaries = getSalaries();
  const index = salaries.findIndex(s => s.id === Number(id));
  if (index === -1) throw new Error('Salary record not found');
  
  salaries.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
  return true;
};

// ============ DASHBOARD ============

export const getDashboardSummary = () => {
  const employees = getEmployees();
  const attendance = getAttendance();
  const salaries = getSalaries();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayPresent = attendance.filter(a => 
    a.date === today && (a.status === 'Present' || a.status === 'Work From Home')
  ).length;

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentMonthSalaries = salaries.filter(s => s.month === currentMonth && s.year === currentYear);
  const totalPayroll = currentMonthSalaries.reduce((sum, s) => sum + s.net_salary, 0);
  const avgSalary = currentMonthSalaries.length > 0 ? totalPayroll / currentMonthSalaries.length : 0;

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentAttendance = [...attendance]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return {
    totalEmployees,
    activeEmployees,
    todayPresent,
    totalPayroll,
    avgSalary,
    recentEmployees,
    recentAttendance
  };
};
