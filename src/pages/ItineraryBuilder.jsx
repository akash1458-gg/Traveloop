import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import db from '../utils/database';
import { formatDate, formatCurrency } from '../utils/helpers';
import { Plus, Trash2, GripVertical, MapPin, Calendar, ArrowLeft, Eye, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import './ItineraryBuilder.css';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [showAddCity, setShowAddCity] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [expandedStop, setExpandedStop] = useState(null);
  const [activitySearch, setActivitySearch] = useState('');

  useEffect(() => {
    const t = db.getById('trips', tripId);
    if (!t) { navigate('/trips'); return; }
    setTrip(t);
    loadStops();
  }, [tripId]);

  const loadStops = () => {
    const s = db.query('stops', s => s.trip_id === tripId).sort((a, b) => a.order - b.order);
    setStops(s);
  };

  const allCities = db.getAll('cities');
  const usedCityIds = stops.map(s => s.city_id);
  const availableCities = allCities.filter(c =>
    !usedCityIds.includes(c.id) &&
    (c.name.toLowerCase().includes(citySearch.toLowerCase()) || c.country.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const addStop = (city) => {
    const order = stops.length + 1;
    db.insert('stops', {
      trip_id: tripId,
      city_id: city.id,
      order,
      arrival_date: trip?.start_date || '',
      departure_date: trip?.end_date || '',
    });
    loadStops();
    setShowAddCity(false);
    setCitySearch('');
    toast.success(`Added ${city.name} to your itinerary!`);
  };

  const removeStop = (stopId) => {
    db.delete('stops', stopId);
    db.deleteWhere('trip_activities', a => a.stop_id === stopId);
    loadStops();
    toast.success('Stop removed');
  };

  const updateStop = (stopId, updates) => {
    db.update('stops', stopId, updates);
    loadStops();
  };

  const moveStop = (index, direction) => {
    const newStops = [...stops];
    const target = index + direction;
    if (target < 0 || target >= newStops.length) return;
    [newStops[index], newStops[target]] = [newStops[target], newStops[index]];
    newStops.forEach((s, i) => db.update('stops', s.id, { order: i + 1 }));
    loadStops();
  };

  const getCity = (cityId) => allCities.find(c => c.id === cityId);

  const getStopActivities = (stopId) => db.query('trip_activities', a => a.stop_id === stopId);

  const addActivity = (stopId, activity) => {
    db.insert('trip_activities', {
      stop_id: stopId,
      activity_id: activity.id,
      day: '',
      time_slot: '10:00',
      cost: activity.cost,
    });
    setStops([...stops]);
    toast.success(`Added "${activity.name}"`);
  };

  const removeActivity = (actId) => {
    db.delete('trip_activities', actId);
    setStops([...stops]);
  };

  const getCityActivities = (cityId) => {
    return db.query('activities', a =>
      a.city_id === cityId &&
      a.name.toLowerCase().includes(activitySearch.toLowerCase())
    ).slice(0, 12);
  };

  if (!trip) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/trips')} id="back-to-trips">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">{trip.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => navigate(`/itinerary/${tripId}`)} id="view-itinerary-btn">
            <Eye size={18} /> View Itinerary
          </button>
        </div>
      </div>

      {/* Stops List */}
      <div className="builder-content animate-fadeInUp">
        <div className="stops-list">
          {stops.length === 0 ? (
            <div className="empty-state card">
              <MapPin size={48} />
              <h3 className="heading-4">No stops added yet</h3>
              <p>Add cities to build your itinerary</p>
            </div>
          ) : (
            stops.map((stop, index) => {
              const city = getCity(stop.city_id);
              const activities = getStopActivities(stop.id);
              const isExpanded = expandedStop === stop.id;

              return (
                <div key={stop.id} className="stop-card card animate-fadeInUp" style={{ animationDelay: `${index * 80}ms` }} id={`stop-${stop.id}`}>
                  <div className="stop-header">
                    <div className="stop-order">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => moveStop(index, -1)} disabled={index === 0}>
                        <ChevronUp size={16} />
                      </button>
                      <span className="stop-number">{index + 1}</span>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => moveStop(index, 1)} disabled={index === stops.length - 1}>
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <div className="stop-city-info" onClick={() => setExpandedStop(isExpanded ? null : stop.id)}>
                      <img src={city?.image} alt={city?.name} className="stop-city-img" />
                      <div>
                        <h3 className="stop-city-name">{city?.name}</h3>
                        <span className="stop-city-country">{city?.country}</span>
                      </div>
                    </div>

                    <div className="stop-dates">
                      <div className="form-group" style={{ gap: '4px' }}>
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Arrival</label>
                        <input type="date" className="form-input" style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
                          value={stop.arrival_date} onChange={e => updateStop(stop.id, { arrival_date: e.target.value })}
                          min={trip.start_date} max={trip.end_date} />
                      </div>
                      <div className="form-group" style={{ gap: '4px' }}>
                        <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Departure</label>
                        <input type="date" className="form-input" style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
                          value={stop.departure_date} onChange={e => updateStop(stop.id, { departure_date: e.target.value })}
                          min={stop.arrival_date || trip.start_date} max={trip.end_date} />
                      </div>
                    </div>

                    <div className="stop-actions">
                      <span className="badge badge-accent">{activities.length} activities</span>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeStop(stop.id)}
                        style={{ color: 'var(--color-danger-light)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded: activities */}
                  {isExpanded && (
                    <div className="stop-expanded animate-fadeIn">
                      <div className="divider" />

                      {/* Current activities */}
                      {activities.length > 0 && (
                        <div className="stop-activities">
                          <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                            Planned Activities
                          </h4>
                          {activities.map(act => {
                            const info = db.getById('activities', act.activity_id);
                            return (
                              <div key={act.id} className="activity-item">
                                <div>
                                  <span className="activity-name">{info?.name || 'Unknown'}</span>
                                  <span className="activity-type badge badge-primary" style={{ marginLeft: 8 }}>{info?.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-light)' }}>{formatCurrency(act.cost)}</span>
                                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeActivity(act.id)}>
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add activities */}
                      <div className="add-activities">
                        <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                          Add Activities in {city?.name}
                        </h4>
                        <div className="input-with-icon" style={{ marginBottom: 'var(--space-3)' }}>
                          <Search size={16} className="input-icon" />
                          <input className="form-input" style={{ paddingLeft: 38, fontSize: 'var(--text-sm)' }}
                            placeholder="Search activities..." value={activitySearch}
                            onChange={e => setActivitySearch(e.target.value)} />
                        </div>
                        <div className="available-activities">
                          {getCityActivities(stop.city_id).map(act => (
                            <div key={act.id} className="avail-activity" onClick={() => addActivity(stop.id, act)}>
                              <div>
                                <span className="activity-name">{act.name}</span>
                                <div className="flex gap-2" style={{ marginTop: 2 }}>
                                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>{act.type}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{act.duration}h</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-light)' }}>{formatCurrency(act.cost)}</span>
                                <Plus size={16} style={{ color: 'var(--color-primary)' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Stop Button */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          {showAddCity ? (
            <div className="add-city-panel card animate-scaleIn">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="heading-4">Add a City</h3>
                <button className="btn btn-ghost btn-icon" onClick={() => { setShowAddCity(false); setCitySearch(''); }}>
                  <X size={20} />
                </button>
              </div>
              <div className="input-with-icon" style={{ marginBottom: 'var(--space-4)' }}>
                <Search size={18} className="input-icon" />
                <input className="form-input" style={{ paddingLeft: 44 }} placeholder="Search cities..."
                  value={citySearch} onChange={e => setCitySearch(e.target.value)} autoFocus id="city-search-input" />
              </div>
              <div className="city-options">
                {availableCities.slice(0, 8).map(city => (
                  <div key={city.id} className="city-option" onClick={() => addStop(city)} id={`add-city-${city.id}`}>
                    <img src={city.image} alt={city.name} className="city-option-img" />
                    <div>
                      <span className="city-option-name">{city.name}</span>
                      <span className="city-option-country">{city.country} · {city.region}</span>
                    </div>
                    <Plus size={18} style={{ color: 'var(--color-primary)', marginLeft: 'auto' }} />
                  </div>
                ))}
                {availableCities.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>No cities found</p>
                )}
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary add-stop-btn" onClick={() => setShowAddCity(true)} id="add-stop-btn">
              <Plus size={18} /> Add Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
