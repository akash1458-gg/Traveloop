import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../utils/database';
import { formatDate, formatCurrency, daysBetween, getDaysArray } from '../utils/helpers';
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Clock, Share2, List, CalendarDays } from 'lucide-react';
import './ItineraryView.css';

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [viewMode, setViewMode] = useState('timeline');

  useEffect(() => {
    const t = db.getById('trips', tripId);
    if (!t) { navigate('/trips'); return; }
    setTrip(t);
    const s = db.query('stops', s => s.trip_id === tripId).sort((a, b) => a.order - b.order);
    setStops(s);
  }, [tripId]);

  const getCity = (cityId) => db.getById('cities', cityId);
  const getStopActivities = (stopId) => {
    return db.query('trip_activities', a => a.stop_id === stopId).map(ta => ({
      ...ta,
      activity: db.getById('activities', ta.activity_id),
    }));
  };

  const totalCost = stops.reduce((sum, stop) => {
    const acts = getStopActivities(stop.id);
    return sum + acts.reduce((s, a) => s + (a.cost || 0), 0);
  }, 0);

  if (!trip) return null;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="itinerary-hero animate-fadeInUp">
        {trip.cover_image && (
          <div className="itinerary-hero-bg">
            <img src={trip.cover_image} alt={trip.name} />
            <div className="itinerary-hero-overlay" />
          </div>
        )}
        <div className="itinerary-hero-content">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/trips')} style={{ color: 'white' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="heading-1">{trip.name}</h1>
          {trip.description && <p className="itinerary-desc">{trip.description}</p>}
          <div className="itinerary-meta">
            <span><Calendar size={16} /> {formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
            <span><MapPin size={16} /> {stops.length} cities</span>
            <span><DollarSign size={16} /> {formatCurrency(totalCost)} spent / {formatCurrency(trip.budget)} budget</span>
            <span><Clock size={16} /> {daysBetween(trip.start_date, trip.end_date)} days</span>
          </div>
          <div className="itinerary-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/itinerary-builder/${tripId}`)} id="edit-itinerary-btn">
              <Edit size={16} /> Edit
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/budget?trip=${tripId}`)}>
              <DollarSign size={16} /> Budget
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/share/${tripId}`)}>
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="view-toggle">
        <button className={`chip ${viewMode === 'timeline' ? 'active' : ''}`} onClick={() => setViewMode('timeline')}>
          <List size={14} /> Timeline
        </button>
        <button className={`chip ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
          <CalendarDays size={14} /> By City
        </button>
      </div>

      {/* Budget Progress */}
      {trip.budget > 0 && (
        <div className="budget-bar card animate-fadeInUp">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Budget Usage</span>
            <span style={{ fontSize: 'var(--text-sm)', color: totalCost > trip.budget ? 'var(--color-danger-light)' : 'var(--color-success-light)' }}>
              {formatCurrency(totalCost)} / {formatCurrency(trip.budget)} ({Math.round(totalCost / trip.budget * 100)}%)
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{
              width: `${Math.min(100, (totalCost / trip.budget) * 100)}%`,
              background: totalCost > trip.budget ? 'var(--color-danger)' : undefined,
            }} />
          </div>
        </div>
      )}

      {/* Timeline View */}
      {stops.length === 0 ? (
        <div className="empty-state card">
          <MapPin size={48} />
          <h3 className="heading-4">No stops in this trip</h3>
          <p>Add cities in the itinerary builder</p>
          <button className="btn btn-primary" onClick={() => navigate(`/itinerary-builder/${tripId}`)}>
            <Edit size={16} /> Build Itinerary
          </button>
        </div>
      ) : (
        <div className="timeline animate-fadeInUp">
          {stops.map((stop, i) => {
            const city = getCity(stop.city_id);
            const activities = getStopActivities(stop.id);
            const stopDays = daysBetween(stop.arrival_date, stop.departure_date);

            return (
              <div key={stop.id} className="timeline-item" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="timeline-connector">
                  <div className="timeline-dot" style={{ background: `hsl(${i * 60}, 70%, 55%)` }} />
                  {i < stops.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content card">
                  <div className="timeline-city-header">
                    <img src={city?.image} alt={city?.name} className="timeline-city-img" />
                    <div>
                      <h3 className="heading-4">{city?.name}, {city?.country}</h3>
                      <div className="flex gap-4" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                        <span><Calendar size={12} /> {formatDate(stop.arrival_date)} — {formatDate(stop.departure_date)}</span>
                        <span><Clock size={12} /> {stopDays} {stopDays === 1 ? 'day' : 'days'}</span>
                      </div>
                    </div>
                  </div>

                  {activities.length > 0 ? (
                    <div className="timeline-activities">
                      {activities.map(act => (
                        <div key={act.id} className="timeline-activity">
                          <div className="timeline-activity-dot" />
                          <div className="timeline-activity-content">
                            <span className="timeline-activity-name">{act.activity?.name || 'Activity'}</span>
                            <div className="flex gap-3" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                              <span className="badge badge-primary" style={{ fontSize: '10px' }}>{act.activity?.type}</span>
                              <span>{act.activity?.duration}h</span>
                              <span style={{ color: 'var(--color-success-light)' }}>{formatCurrency(act.cost)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                      No activities planned yet
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
