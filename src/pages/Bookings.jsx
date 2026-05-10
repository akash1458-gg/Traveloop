import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plane, Train, Search, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function Bookings() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || 'flight');
  const [to, setTo] = useState(searchParams.get('to') || '');

  return (
    <div className="min-h-screen bg-[#F5F0EB] p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-cinzel text-stone-900 mb-4">Book Your Travel</h1>
        <p className="text-stone-600 font-inter text-lg mb-12">Seamless flight and train bookings for your Indian odyssey.</p>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setType('flight')}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-inter font-bold ${type === 'flight' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}
          >
            <Plane size={20} /> Flights
          </button>
          <button 
            onClick={() => setType('train')}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-inter font-bold ${type === 'train' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}
          >
            <Train size={20} /> Trains
          </button>
        </div>

        {/* Booking Form Card */}
        <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400 font-bold ml-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input type="text" placeholder="Origin City" className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-5 focus:ring-2 focus:ring-stone-200 outline-none font-inter text-stone-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400 font-bold ml-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-5 focus:ring-2 focus:ring-stone-200 outline-none font-inter text-stone-900" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400 font-bold ml-2">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input type="date" className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-5 focus:ring-2 focus:ring-stone-200 outline-none font-inter text-stone-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-400 font-bold ml-2">Travelers</label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <select className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-14 pr-5 focus:ring-2 focus:ring-stone-200 outline-none font-inter text-stone-900 appearance-none">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>Family (2+2)</option>
                </select>
              </div>
            </div>
          </div>

          <button className={`w-full py-6 rounded-3xl flex items-center justify-center gap-4 text-xl font-cinzel text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl ${type === 'flight' ? 'bg-orange-600 shadow-orange-600/30' : 'bg-emerald-600 shadow-emerald-600/30'}`}>
            Search {type === 'flight' ? 'Flights' : 'Trains'} <ArrowRight size={24} />
          </button>
        </div>

        {/* Promo Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">OFFER</span>
              <h4 className="text-2xl font-cinzel mt-2 mb-4">First Flight Discount</h4>
              <p className="text-stone-400 text-sm">Get up to 20% off on your first domestic booking with code INCREDIBLE.</p>
            </div>
            <Plane className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-125 transition-transform" size={160} />
          </div>
          <div className="bg-stone-200 rounded-3xl p-8 relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">RAILWAY</span>
              <h4 className="text-2xl font-cinzel mt-2 mb-4">Luxe Train Experiences</h4>
              <p className="text-stone-600 text-sm">Book Palace on Wheels or Maharaja Express directly from here.</p>
            </div>
            <Train className="absolute -bottom-6 -right-6 text-black/5 group-hover:scale-125 transition-transform" size={160} />
          </div>
        </div>
      </div>
    </div>
  );
}
