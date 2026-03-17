import { NavLink } from 'react-router-dom';
import avviLogo from '../assets/avvi-logo.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/salary', label: 'Salary' },
  { to: '/reports', label: 'Reports' }
];

function AppLayout({ children, onLogout, userName, userRole }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <img className="brand-logo" src={avviLogo} alt="ANVVI Properties logo" />
          <h1>ANVVI Properties</h1>
          <p>{userRole === 'admin' ? 'Admin Portal' : 'HR Portal'}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div className="topbar-title">
            <h2>HR Management System</h2>
            <p>HR Management Workspace</p>
          </div>
          <div className="topbar-meta">
            <img className="topbar-logo" src={avviLogo} alt="ANVVI Properties mark" />
            <span className="topbar-user">{userName || 'User'}</span>
            <span className="topbar-role">({userRole === 'admin' ? 'Admin' : 'HR Manager'})</span>
            <span>{new Date().toLocaleDateString()}</span>
            <button type="button" className="btn tiny topbar-logout" onClick={onLogout}>Logout</button>
          </div>
        </header>
        <section className="content-panel">{children}</section>
        <footer className="app-footer">
          <p>&copy; 2026 ANVVI Properties Private Limited. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default AppLayout;
