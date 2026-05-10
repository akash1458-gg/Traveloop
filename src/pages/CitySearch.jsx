import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../utils/database';
import { Search, MapPin, TrendingUp, DollarSign, Globe, Filter } from 'lucide-react';
import './CitySearch.css';

export default function CitySearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const allCities = db.getAll('cities');

  const regions = ['all', ...new Set(allCities.map(c => c.region))];

  const filtered = allCities
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
      const matchRegion = region === 'all' || c.region === region;
      return matchSearch && matchRegion;
    })
    .sort((a, b) => sortBy === 'popularity' ? b.popularity - a.popularity : sortBy === 'cost_low' ? a.cost_index - b.cost_index : b.cost_index - a.cost_index);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Explore Cities</h1>
      </div>

      <div className="search-toolbar animate-fadeIn">
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={18} className="input-icon" />
          <input className="form-input" style={{ paddingLeft: 44 }} placeholder="Search cities or countries..."
            value={search} onChange={e => setSearch(e.target.value)} id="city-search-input" />
        </div>
        <div className="filter-chips">
          {regions.map(r => (
            <button key={r} className={`chip ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}>
              {r === 'all' ? 'All Regions' : r}
            </button>
          ))}
        </div>
        <select className="form-input" style={{ width: 'auto', maxWidth: 180 }} value={sortBy}
          onChange={e => setSortBy(e.target.value)} id="sort-select">
          <option value="popularity">Most Popular</option>
          <option value="cost_low">Cheapest First</option>
          <option value="cost_high">Most Expensive</option>
        </select>
      </div>

      <div className="cities-grid animate-fadeInUp">
        {filtered.map((city, i) => (
          <div key={city.id} className="explore-city-card card card-interactive" style={{ animationDelay: `${i * 50}ms` }}
            id={`explore-city-${city.id}`}>
            <div className="explore-city-img">
              <img src={city.image} alt={city.name} loading="lazy" />
              <div className="explore-city-region badge badge-accent">{city.region}</div>
            </div>
            <div className="explore-city-body">
              <h3>{city.name}</h3>
              <span className="explore-city-country"><MapPin size={12} /> {city.country}</span>
              <p className="explore-city-desc">{city.description}</p>
              <div className="explore-city-stats">
                <div className="explore-stat">
                  <TrendingUp size={14} />
                  <span>{city.popularity}%</span>
                  <label>Popularity</label>
                </div>
                <div className="explore-stat">
                  <DollarSign size={14} />
                  <span>{city.cost_index}/100</span>
                  <label>Cost Index</label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state card">
          <Globe size={48} />
          <h3 className="heading-4">No cities found</h3>
          <p>Try a different search term or region filter</p>
        </div>
      )}
    </div>
  );
}
