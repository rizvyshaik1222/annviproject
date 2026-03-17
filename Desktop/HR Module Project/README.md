# HR Management System - Secure HR Control Center

A lightweight, browser-based HR Management System with no backend dependencies. All data is stored securely in the browser's localStorage.

## Features

### ✅ Complete HR Module Suite
- **Employee Management** - CRUD operations with department, position, hire date, and status tracking
- **Attendance System** - Mark attendance by date (Present, Absent, Half Day, Work From Home, On Leave)
- **Monthly Attendance Reports** - View detailed attendance breakdown with percentage calculation
- **Salary Management** - Manual or automatic salary calculation based on actual attendance
- **Smart Deductions** - Auto-calculate deductions based on absences (Absent = salary deduction)
- **Dashboard** - Summary metrics and current month salary overview

### 🔐 Security Features
- Secure login/signup with strong password validation (8+ chars, mixed case, numbers, special chars)
- Password visibility toggle
- Session-based authentication
- Local storage-based data persistence

### 🎨 Premium UI Design
- Dark green professional sidebar with company branding
- Two-column login/signup layout with large logo display
- White content background with green/yellow accents
- Password strength meter (Weak, Medium, Strong)
- Responsive grid-based layouts
- Dark green and dark yellow premium color scheme

## Tech Stack

- **Frontend**: React 18 + Vite
- **Storage**: Browser localStorage (no database required)
- **Styling**: CSS Grid/Flexbox with custom properties
- **Routing**: React Router v6
- **State Management**: React Hooks

## Project Structure

```
HR Module Project/
  frontend/
    src/
      components/
        AppLayout.jsx           # Main layout with sidebar & topbar
      pages/
        LoginPage.jsx           # User login
        SignupPage.jsx          # User registration
        DashboardPage.jsx       # Dashboard with metrics & salary summary
        EmployeesPage.jsx       # Employee management (add, edit, delete)
        AttendancePage.jsx      # Mark attendance
        SalaryPage.jsx          # Salary management & auto-calculation
      services/
        api.js                  # Future API integration
      utils/
        dataStore.js            # localStorage-based data management
        localAuth.js            # Authentication utilities
        formatters.js           # Date/currency formatting
      styles/
        global.css              # Global styling & components
    package.json
    vite.config.js
    index.html
  IMG-20241028-WA0009.png      # AVVI Properties logo
  README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
cd frontend
npm run build
```

## How to Use

### 1. Login/Signup
- First time: Click "Sign up" to create an account
- Strong password required: 8+ chars, uppercase, lowercase, numbers, special characters
- Use password visibility toggle to see/hide password
- Existing users: Click "Log in" with credentials

### 2. Employee Management
1. Go to **Employees** page
2. Fill in employee details (name, email, department, position, hire date, status)
3. Click "Create" to add employee
4. Edit: Click "Edit" button next to employee
5. Delete: Click "Delete" button (with confirmation)

### 3. Mark Attendance
1. Go to **Attendance** page
2. Select employee and date
3. Choose status: Present, Absent, Half Day, Work From Home, or On Leave
4. Optional: Add check-in/check-out times and notes
5. Click "Save Attendance"
6. Same employee-date: Auto-updates existing record

### 4. Calculate Salary

#### Option A: Automatic Calculation (Recommended)
1. Go to **Salary** page
2. Select "Auto Calculate" mode
3. Choose employee, month, year, and base salary
4. Click "View Attendance" to see breakdown (present/absent/half days)
5. Click "Calculate Salary from Attendance"
6. System auto-deducts for absences: `(Absent Days ÷ 22) × Base Salary`

#### Option B: Manual Entry
1. Go to **Salary** page
2. Select "Manual Entry" mode
3. Enter all details: employee, month, year, base salary, bonus, deductions
4. See net salary preview
5. Click "Save Salary"

#### Salary Calculation Example:
- Base Salary: $10,000
- Bonus: $500
- Present Days: 20
- Absent Days: 2
- **Deduction**: (2 ÷ 22) × $10,000 = $909.10
- **Net Salary**: $10,000 + $500 - $909.10 = **$9,590.90**

### 5. View Reports
- **Dashboard**: See total employees, active employees, today's attendance, payroll, average salary
- **Dashboard Current Month**: Table showing all current month salary records
- **Salary Page**: View all salary records with deductions and net amounts
- **Monthly Attendance**: Auto Calculate mode → View Attendance button

## Data Storage

All data is stored in **browser localStorage** under these keys:
- `hr_employees` - Employee master data
- `hr_attendance` - Attendance records
- `hr_salaries` - Salary records

### Important Notes:
- Data persists across browser sessions
- Each user account has separate data in localStorage
- **Privacy**: Data stays on user's device, not sent to any server
- **Backup**: Export browser data or copy from DevTools Console

### Clearing Data (if needed):
```javascript
// Open browser DevTools (F12) → Console and run:
localStorage.removeItem('hr_employees');
localStorage.removeItem('hr_attendance');
localStorage.removeItem('hr_salaries');
localStorage.removeItem('user_session'); // Logout
```

## Color Scheme

- **Primary Green**: #1a5c2f (professional darker green)
- **Light Green**: #2d8659 (display text)
- **Dark Yellow/Gold**: #d4a520 (accents)
- **White**: #ffffff (backgrounds)
- **Light Gray**: #f5f5f5 (page background)

## Future Enhancements

- Export salary/attendance to Excel/PDF
- Email month-end reports to employees
- Bulk attendance marking
- Attendance patterns analysis
- Late/early leave tracking
- Overtime calculation
- Mobile app version
- Cloud sync for multiple devices

## Support & Contribution

Built with ❤️ for AVVI Properties HR Team

---

**Version**: 1.0.0 (Simplified localStorage edition)
**Last Updated**: March 2026
**License**: Internal Use Only
        DashboardPage.jsx
        EmployeesPage.jsx
        SalaryPage.jsx
      services/
        api.js
      styles/
        global.css
      utils/
        formatters.js
  README.md
```

## Backend Setup

1. Open terminal in `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` from `.env.example` and set your MySQL credentials.
3. Create database tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
4. (Optional) Insert sample data:
   ```bash
   mysql -u root -p < database/seed.sql
   ```
5. Start backend:
   ```bash
   npm run dev
   ```

Backend runs on `http://localhost:5000`.

## Frontend Setup

1. Open terminal in `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` from `.env.example`.
3. Start frontend:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`.

## API Endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/attendance`
- `POST /api/attendance`
- `DELETE /api/attendance/:id`
- `GET /api/salaries`
- `POST /api/salaries`
- `DELETE /api/salaries/:id`

## Notes
- Salary net amount is calculated as: `base_salary + bonus - deductions`.
- Attendance and salary records are automatically updated if a duplicate period entry exists.
