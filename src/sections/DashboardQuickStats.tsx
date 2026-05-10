import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../utils/database';
import { Search, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';

export default function DashboardQuickStats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trips: 0, cities: 0, budget: 0 });
  const [activeTrips, setActiveTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      const trips = db.query('trips', (t) => t.user_id === user.id);
      const cities = new Set(trips.map(t => t.destination)).size;
      const totalBudget = trips.reduce((sum, t) => sum + (Number(t.budget) || 0), 0);
      
      setStats({ trips: trips.length, cities, budget: totalBudget });
      setActiveTrips(trips.slice(0, 2)); // Show only top 2 active trips
    }
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Check if it matches a state
    const states = db.getAll('states');
    const matchedState = states.find(s => 
      s.name.toLowerCase().includes(query) || 
      query.includes(s.name.toLowerCase())
    );

    if (matchedState) {
      navigate(`/state/${matchedState.id}`);
    } else {
      navigate(`/activities?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full px-[5vw] py-12 bg-[#F5F0EB]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome & Search */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <h2 className="font-cinzel text-3xl text-stone-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}</h2>
              <p className="text-stone-600 mb-8">Where would you like to wander next?</p>
              
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for cities, states or experiences..."
                  className="w-full bg-stone-100 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none text-stone-900"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Explore
                </button>
              </form>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Trips', value: stats.trips, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Cities Visited', value: stats.cities, icon: ChevronRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Total Budget', value: `₹${stats.budget.toLocaleString()}`, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((s, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg flex items-center gap-4">
                  <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">{s.label}</p>
                    <p className="text-xl font-bold text-stone-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Active Trips */}
          <div className="space-y-6">
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 shadow-2xl relative overflow-hidden h-full">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-cinzel text-xl">Active Journeys</h3>
                <button onClick={() => navigate('/trips')} className="text-stone-400 hover:text-orange-400 text-sm flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {activeTrips.length > 0 ? (
                <div className="space-y-4">
                  {activeTrips.map((trip) => (
                    <div 
                      key={trip.id} 
                      onClick={() => navigate(`/itinerary/${trip.id}`)}
                      className="group bg-stone-800/50 hover:bg-stone-800 rounded-xl p-4 border border-stone-700/50 cursor-pointer transition-all"
                    >
                      <h4 className="font-semibold text-stone-100 group-hover:text-orange-400 transition-colors">{trip.destination}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(trip.start_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> ₹{Number(trip.budget).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-stone-600" />
                  </div>
                  <p className="text-stone-400 text-sm mb-6">No active trips found.</p>
                  <button 
                    onClick={() => navigate('/create-trip')}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Start Planning
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
