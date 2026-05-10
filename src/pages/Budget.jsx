import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../utils/database';
import { formatCurrency } from '../utils/helpers';
import { DollarSign, TrendingUp, AlertTriangle, PieChart, GitGraph } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Budget.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Budget() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [selectedTrip, setSelectedTrip] = useState(params.get('trip') || '');
  const trips = db.query('trips', t => t.user_id === user?.id);

  const tripData = useMemo(() => {
    const trip = selectedTrip ? db.getById('trips', selectedTrip) : null;
    if (!trip) return null;

    const stops = db.query('stops', s => s.trip_id === trip.id);
    const breakdown = { Transport: 0, Stay: 0, Sightseeing: 0, 'Food & Drink': 0, Adventure: 0, Culture: 0, Relaxation: 0, Shopping: 0 };

    stops.forEach(stop => {
      const acts = db.query('trip_activities', a => a.stop_id === stop.id);
      acts.forEach(act => {
        const info = db.getById('activities', act.activity_id);
        if (info) breakdown[info.type] = (breakdown[info.type] || 0) + (act.cost || 0);
      });
    });

    const totalSpent = Object.values(breakdown).reduce((s, v) => s + v, 0);
    return { trip, stops, breakdown, totalSpent };
  }, [selectedTrip]);

  const pieData = tripData ? {
    labels: Object.keys(tripData.breakdown).filter(k => tripData.breakdown[k] > 0),
    datasets: [{
      data: Object.values(tripData.breakdown).filter(v => v > 0),
      backgroundColor: ['#FF6B35', '#00B4D8', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'],
      borderWidth: 0,
    }],
  } : null;

  const barData = tripData ? {
    labels: tripData.stops.map(s => db.getById('cities', s.city_id)?.name || 'Unknown'),
    datasets: [{
      label: 'Cost per City (₹)',
      data: tripData.stops.map(s => {
        const acts = db.query('trip_activities', a => a.stop_id === s.id);
        return acts.reduce((sum, a) => sum + (a.cost || 0), 0);
      }),
      backgroundColor: 'rgba(255, 107, 53, 0.6)',
      borderColor: '#FF6B35',
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#9CA3AF', font: { family: 'Inter' } } } },
    scales: barData ? {
      y: { ticks: { color: '#6B7280' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#6B7280' }, grid: { display: false } },
    } : undefined,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Budget & Costs</h1>
        <select className="form-input" style={{ width: 'auto', minWidth: 220 }} value={selectedTrip}
          onChange={e => setSelectedTrip(e.target.value)} id="budget-trip-select">
          <option value="">Select a trip</option>
          {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {!tripData ? (
        <div className="empty-state card"><PieChart size={48} /><h3 className="heading-4">Select a trip to view budget</h3></div>
      ) : (
        <div className="budget-layout animate-fadeInUp">
          {/* Summary Cards */}
          <div className="budget-summary">
            <div className="card budget-stat-card">
              <DollarSign size={24} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div className="stat-value">{formatCurrency(tripData.trip.budget)}</div>
                <div className="stat-label">Total Budget</div>
              </div>
            </div>
            <div className="card budget-stat-card">
              <TrendingUp size={24} style={{ color: 'var(--color-success)' }} />
              <div>
                <div className="stat-value">{formatCurrency(tripData.totalSpent)}</div>
                <div className="stat-label">Total Spent</div>
              </div>
            </div>
            <div className="card budget-stat-card">
              {tripData.totalSpent > tripData.trip.budget ? (
                <AlertTriangle size={24} style={{ color: 'var(--color-danger)' }} />
              ) : (
                <DollarSign size={24} style={{ color: 'var(--color-accent)' }} />
              )}
              <div>
                <div className="stat-value" style={{ color: tripData.totalSpent > tripData.trip.budget ? 'var(--color-danger-light)' : 'var(--color-success-light)' }}>
                  {formatCurrency(tripData.trip.budget - tripData.totalSpent)}
                </div>
                <div className="stat-label">{tripData.totalSpent > tripData.trip.budget ? 'Over Budget' : 'Remaining'}</div>
              </div>
            </div>
          </div>

          {/* Flow Chart Section */}
          <div className="card budget-flow-section animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <GitGraph size={20} className="text-primary" />
              <h3 className="heading-4">Budget Flow</h3>
            </div>
            
            <div className="flow-container">
              {/* Source */}
              <div className="flow-node source">
                <div className="node-label">Total Budget</div>
                <div className="node-value">{formatCurrency(tripData.trip.budget)}</div>
              </div>

              <div className="flow-connectors">
                <div className="connector-line main" />
              </div>

              {/* Categories */}
              <div className="flow-categories">
                {Object.entries(tripData.breakdown).filter(([_, val]) => val > 0).map(([cat, val], i) => (
                  <div key={cat} className="category-branch" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="branch-line" />
                    <div className="flow-node category" style={{ '--node-color': i === 0 ? '#FF6B35' : '#00B4D8' }}>
                      <div className="node-label">{cat}</div>
                      <div className="node-value">{formatCurrency(val)}</div>
                      <div className="node-percent">{tripData.totalSpent > 0 ? Math.round((val / tripData.totalSpent) * 100) : 0}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flow-footer">
                <div className="remaining-node">
                  <div className="node-label">Remaining</div>
                  <div className="node-value" style={{ color: tripData.trip.budget - tripData.totalSpent < 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                    {formatCurrency(tripData.trip.budget - tripData.totalSpent)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="budget-charts">
            <div className="card chart-card">
              <div className="section-header">
                <PieChart size={20} />
                <h3 className="heading-4">Category Distribution</h3>
              </div>
              <div className="chart-wrapper">
                {pieData && <Pie data={pieData} options={chartOptions} />}
              </div>
            </div>
            <div className="card chart-card">
              <div className="section-header">
                <TrendingUp size={20} />
                <h3 className="heading-4">City-wise Expenses</h3>
              </div>
              <div className="chart-wrapper">
                {barData && <Bar data={barData} options={chartOptions} />}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="card">
            <h3 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Detailed Breakdown</h3>
            <table className="budget-table">
              <thead>
                <tr><th>Category</th><th>Amount</th><th>% of Total</th></tr>
              </thead>
              <tbody>
                {Object.entries(tripData.breakdown).filter(([,v]) => v > 0).sort((a,b) => b[1] - a[1]).map(([cat, amt]) => (
                  <tr key={cat}>
                    <td>{cat}</td>
                    <td>{formatCurrency(amt)}</td>
                    <td>{tripData.totalSpent > 0 ? Math.round(amt / tripData.totalSpent * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
