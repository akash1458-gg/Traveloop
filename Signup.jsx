import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validators, validateForm } from '../utils/validators';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Plane } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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
      name: [() => validators.required(form.name, 'Name'), () => validators.minLength(form.name, 2, 'Name')],
      email: [() => validators.email(form.email)],
      password: [() => validators.password(form.password)],
      confirm: [
        () => validators.required(form.confirm, 'Confirm password'),
        () => form.password !== form.confirm ? 'Passwords do not match' : null,
      ],
    });
    setErrors(errs);
    if (!isValid) return;

    setLoading(true);
    setTimeout(() => {
      const result = signup(form.name, form.email, form.password);
      setLoading(false);
      if (result.success) {
        toast.success('Account created! Welcome aboard! ✈️');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
        setErrors({ email: result.error });
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
              <Plane size={24} fill="black" color="black" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'black' }}>
                Traveloop
              </span>
            </div>
            <h1 className="heading-3">Create Account</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              Start planning your dream trips today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input id="signup-name" name="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Nikolai Tesla" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input id="signup-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@gmail.com" value={form.email} onChange={handleChange} />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input id="signup-password" name="password" type={showPwd ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min 6 chars, 1 uppercase, 1 number" value={form.password} onChange={handleChange} />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input id="signup-confirm" name="confirm" type="password"
                  className={`form-input ${errors.confirm ? 'error' : ''}`}
                  placeholder="Re-enter your password" value={form.confirm} onChange={handleChange} />
              </div>
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="signup-submit-btn">
              {loading ? <span className="spinner" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            <span style={{ color: 'var(--color-text-tertiary)' }}>Already have an account?</span>
            <Link to="/login" className="auth-link" id="login-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
