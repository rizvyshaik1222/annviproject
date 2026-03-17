import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avviLogo from '../assets/avvi-logo.png';
import { getPasswordStrength, signupUser, validatePasswordStrength } from '../utils/localAuth.js';

function SignupPage({ onSignupSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'hr' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const passwordCheck = validatePasswordStrength(form.password);
    if (!passwordCheck.ok) {
      setError(passwordCheck.message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = signupUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError('');
    onSignupSuccess(result.session);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-gradient" />
      <section className="auth-hero fade-in">
        <img className="auth-logo" src={avviLogo} alt="ANVVI Properties logo" />
        <h1>ANVVI Properties</h1>
        <p>Private Limited HR Portal</p>
      </section>

      <section className="auth-card fade-in">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up before entering the dashboard.</p>

        {error ? <div className="alert error">{error}</div> : null}

        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
          <div className="password-strength" aria-live="polite">
            <div className="password-strength-track">
              <div
                className={`password-strength-fill ${passwordStrength.level}`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <p className="password-strength-label">Strength: {passwordStrength.label}</p>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="password-rule-note">
            Use 8+ characters with uppercase, lowercase, number, and special character.
          </p>
          <button type="submit" className="btn primary auth-submit">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}

export default SignupPage;
