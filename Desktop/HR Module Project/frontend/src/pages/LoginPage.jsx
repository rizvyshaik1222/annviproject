import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avviLogo from '../assets/avvi-logo.png';
import { loginUser } from '../utils/localAuth.js';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'hr' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = loginUser(form);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError('');
    onLoginSuccess(result.session);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-gradient" />
      <section className="auth-hero fade-in">
        <img className="auth-logo" src={avviLogo} alt="ANVVI Properties logo" />
        <h1>ANVVI Properties</h1>
        <p>Secure HR Control Center</p>
      </section>

      <section className="auth-card fade-in">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to access your dashboard.</p>

        {error ? <div className="alert error">{error}</div> : null}

        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="role-select"
          >
            <option value="hr">HR Manager</option>
            <option value="admin">Admin</option>
          </select>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="btn primary auth-submit">Login</button>
        </form>

        <p className="auth-switch">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
