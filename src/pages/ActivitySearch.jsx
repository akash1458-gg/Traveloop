import { useState } from 'react';
import db from '../utils/database';
import { Search, Filter, DollarSign, Clock, Plus } from 'lucide-react';
import './ActivitySearch.css';

export default function ActivitySearch() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [costRange, setCostRange] = useState('all');
  const allActivities = db.getAll('activities');
  const types = ['all', ...new Set(allActivities.map(a => a.type))];

  const filtered = allActivities.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || a.type === type;
    const matchCost = costRange === 'all' || (costRange === 'free' && a.cost === 0) || (costRange === 'budget' && a.cost > 0 && a.cost <= 30) || (costRange === 'mid' && a.cost > 30 && a.cost <= 80) || (costRange === 'premium' && a.cost > 80);
    return matchSearch && matchType && matchCost;
  }).slice(0, 30);

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Discover Activities</h1></div>

      <div className="search-toolbar animate-fadeIn">
        <div className="input-with-icon" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={18} className="input-icon" />
          <input className="form-input" style={{ paddingLeft: 44 }} placeholder="Search activities..."
            value={search} onChange={e => setSearch(e.target.value)} id="activity-search-input" />
        </div>
        <div className="filter-chips">
          {types.map(t => (
            <button key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={costRange} onChange={e => setCostRange(e.target.value)}>
          <option value="all">Any Price</option>
          <option value="free">Free</option>
          <option value="budget">$1 - $30</option>
          <option value="mid">$31 - $80</option>
          <option value="premium">$80+</option>
        </select>
      </div>

      <div className="activities-grid animate-fadeInUp">
        {filtered.map((act, i) => {
          const city = db.getById('cities', act.city_id);
          return (
            <div key={act.id} className="activity-card card" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="activity-card-header">
                <span className={`badge badge-${act.type === 'Adventure' ? 'warning' : act.type === 'Food & Drink' ? 'success' : 'primary'}`}>
                  {act.type}
                </span>
                <span className="activity-cost">{act.cost === 0 ? 'Free' : `$${act.cost}`}</span>
              </div>
              <h3 className="activity-card-name">{act.name}</h3>
              <p className="activity-card-desc">{act.description}</p>
              <div className="activity-card-footer">
                <span><Clock size={12} /> {act.duration}h</span>
                <span><DollarSign size={12} /> {city?.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
