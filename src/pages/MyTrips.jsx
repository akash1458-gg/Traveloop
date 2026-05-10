import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { formatDate, formatCurrency } from '../utils/helpers';
import { PlusCircle, MapPin, Calendar, DollarSign, Trash2, Eye, Edit, Globe, Search, Filter } from 'lucide-react';
import './MyTrips.css';

export default function MyTrips() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);

  const loadTrips = () => {
    if (!user) return;
    setTrips(db.query('trips', t => t.user_id === user.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  };

  useEffect(loadTrips, [user]);

  const handleDelete = (tripId) => {
    db.delete('trips', tripId);
    db.deleteWhere('stops', s => s.trip_id === tripId);
    db.deleteWhere('trip_activities', a => {
      const stops = db.query('stops', s => s.trip_id === tripId);
      return stops.some(s => s.id === a.stop_id);
    });
    db.deleteWhere('packing_items', p => p.trip_id === tripId);
    db.deleteWhere('notes', n => n.trip_id === tripId);
    setDeleteModal(null);
    loadTrips();
    toast.success('Trip deleted');
  };

  const filtered = trips.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Trips</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create-trip')} id="new-trip-btn">
          <PlusCircle size={18} /> New Trip
        </button>
      </div>

      {/* Filters */}
      <div className="trips-toolbar animate-fadeIn">
        <div className="input-with-icon" style={{ maxWidth: 320 }}>
          <Search size={18} className="input-icon" />
          <input className="form-input" style={{ paddingLeft: 44 }} placeholder="Search trips..." value={search}
            onChange={e => setSearch(e.target.value)} id="search-trips-input" />
        </div>
        <div className="filter-chips">
          {['all', 'planning', 'ongoing', 'completed'].map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}
              id={`filter-${f}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trip List */}
      {filtered.length === 0 ? (
        <div className="empty-state card animate-fadeInUp">
          <Globe size={48} />
          <h3 className="heading-4">{search || filter !== 'all' ? 'No matching trips' : 'No trips yet'}</h3>
          <p>Create a trip to start planning your next adventure!</p>
          <button className="btn btn-primary" onClick={() => navigate('/create-trip')}>
            <PlusCircle size={18} /> Create Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid animate-fadeInUp">
          {filtered.map((trip, i) => {
            const stops = db.query('stops', s => s.trip_id === trip.id);
            return (
              <div key={trip.id} className="trip-list-card card" style={{ animationDelay: `${i * 50}ms` }} id={`my-trip-${trip.id}`}>
                <div className="trip-list-image">
                  {trip.cover_image ? <img src={trip.cover_image} alt={trip.name} /> : (
                    <div className="trip-card-placeholder"><Globe size={28} /></div>
                  )}
                </div>
                <div className="trip-list-content">
                  <div className="trip-list-top">
                    <h3>{trip.name}</h3>
                    <span className={`badge badge-${trip.status === 'completed' ? 'success' : trip.status === 'ongoing' ? 'accent' : 'primary'}`}>
                      {trip.status || 'planning'}
                    </span>
                  </div>
                  {trip.description && <p className="trip-list-desc">{trip.description}</p>}
                  <div className="trip-list-meta">
                    <span><Calendar size={14} /> {formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
                    <span><MapPin size={14} /> {stops.length} stops</span>
                    {trip.budget > 0 && <span><DollarSign size={14} /> {formatCurrency(trip.budget)}</span>}
                  </div>
                </div>
                <div className="trip-list-actions">
                  <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/itinerary/${trip.id}`)} title="View">
                    <Eye size={18} />
                  </button>
                  <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/itinerary-builder/${trip.id}`)} title="Edit">
                    <Edit size={18} />
                  </button>
                  <button className="btn btn-ghost btn-icon" onClick={() => setDeleteModal(trip.id)} title="Delete"
                    style={{ color: 'var(--color-danger-light)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="heading-4">Delete Trip</h3>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0' }}>
              Are you sure? This will permanently delete this trip and all its data.
            </p>
            <div className="flex gap-3" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteModal)} id="confirm-delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
