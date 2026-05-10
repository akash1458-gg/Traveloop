import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validators, validateForm } from '../utils/validators';
import { User, Mail, Save, Trash2, Globe } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm({
      name: [() => validators.required(form.name, 'Name'), () => validators.minLength(form.name, 2, 'Name')],
      email: [() => validators.email(form.email)],
    });
    setErrors(errs);
    if (!isValid) return;
    updateProfile({ name: form.name, email: form.email });
    toast.success('Profile updated!');
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Profile & Settings</h1></div>

      <div className="profile-layout animate-fadeInUp">
        <div className="card profile-card">
          <div className="profile-avatar">
            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <h2 className="heading-3">{user?.name}</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
        </div>

        <form onSubmit={handleSave} className="card profile-form" id="profile-form">
          <h3 className="heading-4">Edit Profile</h3>
          <div className="form-group">
            <label className="form-label"><User size={16} /> Name</label>
            <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} id="profile-name" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={16} /> Email</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} id="profile-email" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label"><Globe size={16} /> Language</label>
            <select className="form-input" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" id="save-profile-btn"><Save size={16} /> Save Changes</button>
        </form>

        <div className="card">
          <h3 className="heading-4" style={{ color: 'var(--color-danger-light)' }}>Danger Zone</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 'var(--space-3) 0' }}>
            Permanently delete your account and all data.
          </p>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)} id="delete-account-btn">
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </div>

      {showDelete && (
        <div className="modal-backdrop" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="heading-4">Delete Account</h3>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0' }}>
              This action cannot be undone. All trips, notes, and data will be lost.
            </p>
            <div className="flex gap-3" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { localStorage.clear(); logout(); }}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
