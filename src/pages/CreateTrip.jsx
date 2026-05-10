import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { validators, validateForm } from '../utils/validators';
import { ArrowLeft, Save, Image, Calendar, DollarSign, FileText } from 'lucide-react';
import './CreateTrip.css';

export default function CreateTrip() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', start_date: '', end_date: '', budget: '', cover_image: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: errs, isValid } = validateForm({
      name: [() => validators.required(form.name, 'Trip name'), () => validators.minLength(form.name, 3, 'Trip name')],
      start_date: [() => validators.required(form.start_date, 'Start date')],
      end_date: [() => validators.required(form.end_date, 'End date'), () => validators.dateRange(form.start_date, form.end_date)],
      budget: [() => form.budget && validators.positiveNumber(form.budget, 'Budget')],
    });
    setErrors(errs);
    if (!isValid) return;

    const trip = db.insert('trips', {
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      budget: Number(form.budget) || 0,
      cover_image: form.cover_image.trim(),
      status: 'planning',
    });

    toast.success('Trip created successfully! 🎉');
    navigate(`/itinerary-builder/${trip.id}`);
  };

  const coverImages = [
    'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=400&fit=crop',
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} id="back-btn">
            <ArrowLeft size={20} />
          </button>
          <h1 className="page-title">Create New Trip</h1>
        </div>
      </div>

      <div className="create-trip-layout animate-fadeInUp">
        <form onSubmit={handleSubmit} className="create-trip-form card" id="create-trip-form">
          <div className="form-group">
            <label className="form-label" htmlFor="trip-name">
              <FileText size={16} /> Trip Name *
            </label>
            <input id="trip-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g., Golden Triangle India 2026" value={form.name} onChange={handleChange} maxLength={100} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trip-desc">Description</label>
            <textarea id="trip-desc" name="description" className="form-input form-textarea"
              placeholder="Describe your trip..." value={form.description} onChange={handleChange} maxLength={500} />
            <span className="char-count">{form.description.length}/500</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="trip-start">
                <Calendar size={16} /> Start Date *
              </label>
              <input id="trip-start" name="start_date" type="date" className={`form-input ${errors.start_date ? 'error' : ''}`}
                value={form.start_date} onChange={handleChange} />
              {errors.start_date && <span className="form-error">{errors.start_date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="trip-end">
                <Calendar size={16} /> End Date *
              </label>
              <input id="trip-end" name="end_date" type="date" className={`form-input ${errors.end_date ? 'error' : ''}`}
                value={form.end_date} onChange={handleChange} min={form.start_date} />
              {errors.end_date && <span className="form-error">{errors.end_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trip-budget">
              <DollarSign size={16} /> Budget (₹ INR)
            </label>
            <input id="trip-budget" name="budget" type="number" min="0" className={`form-input ${errors.budget ? 'error' : ''}`}
              placeholder="e.g., 50000" value={form.budget} onChange={handleChange} />
            {errors.budget && <span className="form-error">{errors.budget}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><Image size={16} /> Cover Image</label>
            <input name="cover_image" className="form-input" placeholder="Paste image URL or pick below"
              value={form.cover_image} onChange={handleChange} />
            <div className="cover-picker">
              {coverImages.map((url, i) => (
                <div key={i} className={`cover-option ${form.cover_image === url ? 'selected' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, cover_image: url }))} id={`cover-option-${i}`}>
                  <img src={url} alt={`Cover ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" id="create-trip-submit">
              <Save size={18} /> Create Trip
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="trip-preview card animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Preview</h3>
          <div className="preview-card">
            <div className="preview-image">
              {form.cover_image ? <img src={form.cover_image} alt="Preview" /> : <div className="preview-placeholder">No cover image</div>}
            </div>
            <div className="preview-body">
              <h4>{form.name || 'Trip Name'}</h4>
              <p className="preview-desc">{form.description || 'Add a description...'}</p>
              {form.start_date && form.end_date && (
                <span className="preview-dates"><Calendar size={14} /> {form.start_date} to {form.end_date}</span>
              )}
              {form.budget && <span className="preview-budget"><DollarSign size={14} /> Budget: ₹{form.budget}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
