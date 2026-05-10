import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../utils/database';
import { formatDate, formatCurrency, daysBetween } from '../utils/helpers';
import {
  PlusCircle, MapPin, Calendar, DollarSign, TrendingUp, Globe, ArrowRight,
  Compass, Mountain, Tent, Waves, Landmark, UtensilsCrossed, Heart, Camera,
  ChevronLeft, ChevronRight, Search, Sparkles, Star
} from 'lucide-react';
import './Dashboard.css';

const CATEGORIES = [
  { icon: Mountain, label: 'Adventure', color: '#FF6B35' },
  { icon: Landmark, label: 'Heritage', color: '#FFCC00' },
  { icon: Waves, label: 'Beaches', color: '#00B4D8' },
  { icon: Tent, label: 'Nature', color: '#10B981' },
  { icon: Heart, label: 'Spiritual', color: '#EC4899' },
  { icon: UtensilsCrossed, label: 'Food', color: '#F59E0B' },
  { icon: Camera, label: 'Culture', color: '#8B5CF6' },
  { icon: Compass, label: 'Explore', color: '#14B8A6' },
];

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&h=700&fit=crop', title: 'Taj Mahal, Agra', subtitle: 'A timeless symbol of love and architectural brilliance' },
  { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&h=700&fit=crop', title: 'Hawa Mahal, Jaipur', subtitle: 'The Palace of Winds — a pink sandstone masterpiece' },
  { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&h=700&fit=crop', title: 'Varanasi Ghats', subtitle: 'Experience the spiritual heart of India on the sacred Ganges' },
  { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&h=700&fit=crop', title: 'Beaches of Goa', subtitle: 'Sun, sand, and endless coastal beauty' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [indianCities, setIndianCities] = useState([]);
  const [worldCities, setWorldCities] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalCities: 0, totalBudget: 0, upcomingTrips: 0 });
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const userTrips = db.query('trips', t => t.user_id === user.id);
    setTrips(userTrips);

    const allCities = db.getAll('cities');
    setIndianCities(allCities.filter(c => c.country === 'India').sort((a, b) => b.popularity - a.popularity).slice(0, 10));
    setWorldCities(allCities.filter(c => c.country !== 'India').sort((a, b) => b.popularity - a.popularity).slice(0, 6));

    const stops = userTrips.flatMap(t => db.query('stops', s => s.trip_id === t.id));
    const uniqueCityIds = new Set(stops.map(s => s.city_id));
    const totalBudget = userTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
    const upcoming = userTrips.filter(t => new Date(t.start_date) > new Date()).length;
    setStats({ totalTrips: userTrips.length, totalCities: uniqueCityIds.size, totalBudget, upcomingTrips: upcoming });
  }, [user]);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollDestinations = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/cities?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="dashboard-page">
      {/* ===== HERO SECTION (Incredible India style) ===== */}
      <section className="hero-section" id="hero-section">
        {HERO_IMAGES.map((img, i) => (
          <div key={i} className={`hero-slide ${i === heroIndex ? 'active' : ''}`}>
            <img src={img.url} alt={img.title} />
          </div>
        ))}
        <div className="hero-overlay" />

        {/* Ghost/Outline text background */}
        <div className="hero-ghost-text" aria-hidden="true">INCREDIBLE</div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Namaste, {user?.name?.split(' ')[0] || 'Traveler'}
          </div>
          <h1 className="hero-title">
            Discover <span className="hero-highlight">India</span> &<br />
            The World
          </h1>
          <p className="hero-subtitle">{HERO_IMAGES[heroIndex].title} — {HERO_IMAGES[heroIndex].subtitle}</p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch} id="hero-search-form">
            <Search size={20} className="hero-search-icon" />
            <input className="hero-search-input" placeholder="Search destinations, cities, experiences..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} id="hero-search-input" />
            <button type="submit" className="hero-search-btn">Explore</button>
          </form>

          {/* Hero Indicators */}
          <div className="hero-indicators">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>

        {/* Hero Navigation Arrows */}
        <button className="hero-arrow hero-arrow-left" onClick={() => setHeroIndex(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}>
          <ChevronLeft size={24} />
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length)}>
          <ChevronRight size={24} />
        </button>
      </section>

      {/* ===== CATEGORY ICONS ===== */}
      <section className="categories-section">
        <div className="categories-strip">
          {CATEGORIES.map((cat, i) => (
            <button key={i} className="category-item" onClick={() => navigate('/activities')}
              style={{ '--cat-color': cat.color }} id={`cat-${cat.label.toLowerCase()}`}>
              <div className="category-icon-wrap">
                <cat.icon size={24} />
              </div>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { label: 'Trips Planned', value: stats.totalTrips, icon: Compass, color: '#FF6B35' },
            { label: 'Cities Explored', value: stats.totalCities, icon: MapPin, color: '#00B4D8' },
            { label: 'Total Budget', value: formatCurrency(stats.totalBudget), icon: DollarSign, color: '#10B981' },
            { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: '#FFCC00' },
          ].map((s, i) => (
            <div key={i} className="stat-card-v2" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="stat-icon-v2" style={{ background: `${s.color}18`, color: s.color }}>
                <s.icon size={20} />
              </div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-label-v2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== YOUR JOURNEYS ===== */}
      <section className="journey-section">
        <div className="section-ghost-text" aria-hidden="true">JOURNEYS</div>
        <div className="section-header-v2">
          <div>
            <h2 className="section-title-v2">Your <span className="text-accent-red">Journeys</span></h2>
            <p className="section-subtitle">Continue planning or start a new adventure</p>
          </div>
          <div className="section-actions">
            <button className="btn-incredible" onClick={() => navigate('/create-trip')} id="hero-create-trip">
              <PlusCircle size={16} /> Plan New Trip
            </button>
            {trips.length > 0 && (
              <button className="btn-ghost-v2" onClick={() => navigate('/trips')}>
                View All <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="empty-journey">
            <Globe size={56} />
            <h3>Start your first journey</h3>
            <p>Plan a trip across India or explore the world. Your adventure begins here.</p>
            <button className="btn-incredible" onClick={() => navigate('/create-trip')}>
              <PlusCircle size={18} /> Create Trip
            </button>
          </div>
        ) : (
          <div className="journey-cards">
            {trips.slice(0, 3).map((trip, i) => {
              const stops = db.query('stops', s => s.trip_id === trip.id);
              const days = daysBetween(trip.start_date, trip.end_date);
              return (
                <div key={trip.id} className="journey-card" onClick={() => navigate(`/itinerary/${trip.id}`)}
                  style={{ animationDelay: `${i * 100}ms` }} id={`journey-${trip.id}`}>
                  <div className="journey-card-img">
                    {trip.cover_image ? <img src={trip.cover_image} alt={trip.name} /> : (
                      <div className="journey-card-placeholder"><Globe size={32} /></div>
                    )}
                    <div className="journey-card-overlay">
                      <span className="journey-badge">{trip.status || 'planning'}</span>
                      <span className="journey-days">{days} Days</span>
                    </div>
                  </div>
                  <div className="journey-card-body">
                    <h3>{trip.name}</h3>
                    <div className="journey-meta">
                      <span><Calendar size={13} /> {formatDate(trip.start_date)}</span>
                      <span><MapPin size={13} /> {stops.length} cities</span>
                    </div>
                    {trip.budget > 0 && (
                      <div className="journey-budget">
                        {formatCurrency(trip.budget)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== EXPLORE INDIA (Horizontal Scroll) ===== */}
      <section className="explore-section">
        <div className="section-ghost-text" aria-hidden="true">INDIA</div>
        <div className="section-header-v2">
          <div>
            <h2 className="section-title-v2">Explore <span className="text-accent-gold">India</span></h2>
            <p className="section-subtitle">Discover the incredible diversity of Indian destinations</p>
          </div>
          <div className="scroll-arrows">
            <button className="scroll-arrow" onClick={() => scrollDestinations(-1)}><ChevronLeft size={20} /></button>
            <button className="scroll-arrow" onClick={() => scrollDestinations(1)}><ChevronRight size={20} /></button>
            <button className="btn-ghost-v2" onClick={() => navigate('/cities')}>See All <ArrowRight size={16} /></button>
          </div>
        </div>

        <div className="destination-scroll" ref={scrollRef}>
          {indianCities.map((city, i) => (
            <div key={city.id} className="destination-card" onClick={() => navigate(`/city/${city.id}`)}
              style={{ animationDelay: `${i * 60}ms` }} id={`dest-${city.id}`}>
              <div className="dest-img">
                <img src={city.image} alt={city.name} loading="lazy" />
                <div className="dest-gradient" />
                <div className="dest-info">
                  <span className="dest-state">{city.state}</span>
                  <h3 className="dest-name">{city.name}</h3>
                </div>
                <div className="dest-rating">
                  <Star size={12} fill="currentColor" /> {city.popularity}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WORLD DESTINATIONS ===== */}
      <section className="world-section">
        <div className="section-ghost-text" aria-hidden="true">WORLD</div>
        <div className="section-header-v2">
          <div>
            <h2 className="section-title-v2">Around the <span className="text-accent-red">World</span></h2>
            <p className="section-subtitle">Top global destinations from every continent</p>
          </div>
          <button className="btn-ghost-v2" onClick={() => navigate('/cities')}>
            Explore All <ArrowRight size={16} />
          </button>
        </div>

        <div className="world-grid">
          {worldCities.map((city, i) => (
            <div key={city.id} className="world-card" onClick={() => navigate(`/city/${city.id}`)}
              style={{ animationDelay: `${i * 80}ms` }} id={`world-${city.id}`}>
              <img src={city.image} alt={city.name} loading="lazy" />
              <div className="world-card-overlay">
                <span className="world-region">{city.region}</span>
                <h3>{city.name}</h3>
                <span className="world-country">{city.country}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
