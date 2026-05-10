import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validators, validateForm } from '../utils/validators';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm({
      email: [() => validators.email(form.email)],
      password: [() => validators.required(form.password, 'Password')],
    });
    setErrors(errs);
    if (!isValid) return;

    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      setLoading(false);
      if (result.success) {
        toast.success('Welcome back! 🎉');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
        setErrors({ password: result.error });
      }
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1" />
        <div className="auth-bg-orb orb-2" />
        <div className="auth-bg-orb orb-3" />
      </div>

      <div className="auth-container animate-scaleIn">
        <div className="auth-card glass-strong">
          <div className="auth-header">
            <div className="auth-logo">
              <span>✈️</span>
              <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)' }}>
                Traveloop
              </span>
            </div>
            <h1 className="heading-3">Welcome Back</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Sign in to continue planning your adventures
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="auth-actions">
              <Link to="/forgot-password" className="auth-link" id="forgot-password-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="login-submit-btn">
              {loading ? <span className="spinner" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            <span style={{ color: 'var(--color-text-tertiary)' }}>Don't have an account?</span>
            <Link to="/signup" className="auth-link" id="signup-link">Create Account</Link>
          </div>

          <div className="auth-demo-hint">
            <p>Demo: <strong>demo@traveloop.com</strong> / <strong>Demo@123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
