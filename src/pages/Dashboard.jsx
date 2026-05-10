import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../utils/database';
import { formatDate, formatCurrency, daysBetween } from '../utils/helpers';
import { PlusCircle, MapPin, Calendar, DollarSign, TrendingUp, Globe, ArrowRight, Compass } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalCities: 0, totalBudget: 0, upcomingTrips: 0 });

  useEffect(() => {
    if (!user) return;
    const userTrips = db.query('trips', t => t.user_id === user.id);
    setTrips(userTrips);

    const allCities = db.getAll('cities');
    setCities(allCities.sort((a, b) => b.popularity - a.popularity).slice(0, 6));

    const stops = userTrips.flatMap(t => db.query('stops', s => s.trip_id === t.id));
    const uniqueCityIds = new Set(stops.map(s => s.city_id));
    const totalBudget = userTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
    const upcoming = userTrips.filter(t => new Date(t.start_date) > new Date()).length;

    setStats({ totalTrips: userTrips.length, totalCities: uniqueCityIds.size, totalBudget, upcomingTrips: upcoming });
  }, [user]);

  const getCity = (cityId) => db.getById('cities', cityId);

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="dashboard-welcome animate-fadeInUp">
        <div>
          <h1 className="heading-2">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Traveler'}</span> 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Ready to plan your next adventure?
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create-trip')} id="dashboard-new-trip-btn">
          <PlusCircle size={18} /> Plan New Trip
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        {[
          { label: 'Total Trips', value: stats.totalTrips, icon: Compass, color: 'var(--color-primary)' },
          { label: 'Cities Visited', value: stats.totalCities, icon: MapPin, color: 'var(--color-accent)' },
          { label: 'Total Budget', value: formatCurrency(stats.totalBudget), icon: DollarSign, color: 'var(--color-success)' },
          { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: 'var(--color-warning)' },
        ].map((stat, i) => (
          <div key={i} className="stat-card card" id={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <section className="dashboard-section animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <div className="section-header">
          <h2 className="heading-4">Recent Trips</h2>
          {trips.length > 0 && (
            <button className="btn btn-ghost" onClick={() => navigate('/trips')} id="view-all-trips-btn">
              View All <ArrowRight size={16} />
            </button>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="empty-state card">
            <Compass size={48} />
            <h3 className="heading-4">No trips yet</h3>
            <p>Create your first trip and start exploring the world!</p>
            <button className="btn btn-primary" onClick={() => navigate('/create-trip')}>
              <PlusCircle size={18} /> Create First Trip
            </button>
          </div>
        ) : (
          <div className="trip-cards-grid">
            {trips.slice(0, 3).map(trip => {
              const stops = db.query('stops', s => s.trip_id === trip.id);
              return (
                <div key={trip.id} className="trip-card card card-interactive" onClick={() => navigate(`/itinerary/${trip.id}`)} id={`trip-card-${trip.id}`}>
                  <div className="trip-card-image">
                    {trip.cover_image ? (
                      <img src={trip.cover_image} alt={trip.name} />
                    ) : (
                      <div className="trip-card-placeholder">
                        <Globe size={32} />
                      </div>
                    )}
                    <div className="trip-card-badge badge badge-primary">{trip.status || 'planning'}</div>
                  </div>
                  <div className="trip-card-body">
                    <h3 className="trip-card-title">{trip.name}</h3>
                    <div className="trip-card-meta">
                      <span><Calendar size={14} /> {formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
                      <span><MapPin size={14} /> {stops.length} {stops.length === 1 ? 'stop' : 'stops'}</span>
                    </div>
                    {trip.budget > 0 && (
                      <div className="trip-card-budget">
                        <DollarSign size={14} /> Budget: {formatCurrency(trip.budget)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Cities */}
      <section className="dashboard-section animate-fadeInUp" style={{ animationDelay: '300ms' }}>
        <div className="section-header">
          <h2 className="heading-4">Recommended Destinations</h2>
          <button className="btn btn-ghost" onClick={() => navigate('/cities')} id="explore-cities-btn">
            Explore All <ArrowRight size={16} />
          </button>
        </div>
        <div className="city-cards-grid">
          {cities.map(city => (
            <div key={city.id} className="city-card card card-interactive" onClick={() => navigate('/cities')} id={`city-card-${city.id}`}>
              <div className="city-card-image">
                <img src={city.image} alt={city.name} loading="lazy" />
                <div className="city-card-overlay">
                  <span className="badge badge-accent">{city.region}</span>
                </div>
              </div>
              <div className="city-card-body">
                <h3>{city.name}</h3>
                <span className="city-country">{city.country}</span>
                <div className="city-card-stats">
                  <span className="city-stat">
                    <TrendingUp size={12} /> {city.popularity}% popular
                  </span>
                  <span className="city-stat">
                    <DollarSign size={12} /> Cost: {city.cost_index}/100
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
