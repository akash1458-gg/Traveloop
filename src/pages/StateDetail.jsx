import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db from '../utils/database';
import { MapPin, Utensils, ArrowLeft, Train, Plane, Sparkles } from 'lucide-react';

export default function StateDetail() {
  const { stateId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    const data = db.getById('states', stateId);
    if (data) {
      setState(data);
    }
  }, [stateId]);

  if (!state) return <div className="p-10 text-center">State not found.</div>;

  return (
    <div className="min-h-screen bg-[#F5F0EB] pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={state.image} 
          alt={state.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-12 left-12 text-white">
          <span className="text-orange-400 font-inter text-sm tracking-widest uppercase mb-2 block">{state.region} India</span>
          <h1 className="text-6xl font-cinzel mb-4">{state.name}</h1>
          <p className="text-xl font-inter text-white/80 italic">{state.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Popular Places */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <MapPin size={24} />
              </div>
              <h2 className="text-3xl font-cinzel text-stone-900">Popular Places to Visit</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.places.map((place, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-cinzel text-orange-600 border border-orange-100 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <span className="text-stone-800 font-inter font-medium text-lg">{place}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <Utensils size={24} />
              </div>
              <h2 className="text-3xl font-cinzel text-stone-900">Must-Try Food</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.food.map((dish, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:rotate-12 transition-transform">
                    🍛
                  </div>
                  <span className="text-stone-800 font-inter font-medium text-lg">{dish}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <h3 className="text-2xl font-cinzel mb-6">Plan Your Trip</h3>
             
             <div className="space-y-4">
               <button 
                onClick={() => navigate('/bookings?type=flight&to=' + state.name)}
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group"
               >
                 <div className="flex items-center gap-4">
                   <Plane className="text-orange-400" size={20} />
                   <span className="font-inter">Book Flight</span>
                 </div>
                 <ArrowLeft className="rotate-180 text-stone-500 group-hover:translate-x-1 transition-transform" size={16} />
               </button>

               <button 
                onClick={() => navigate('/bookings?type=train&to=' + state.name)}
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between transition-all group"
               >
                 <div className="flex items-center gap-4">
                   <Train className="text-emerald-400" size={20} />
                   <span className="font-inter">Book Train</span>
                 </div>
                 <ArrowLeft className="rotate-180 text-stone-500 group-hover:translate-x-1 transition-transform" size={16} />
               </button>

               <button 
                onClick={() => navigate('/ai-manager')}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-2xl flex items-center justify-between transition-all shadow-lg group"
               >
                 <div className="flex items-center gap-4 text-white">
                   <Sparkles size={20} />
                   <span className="font-inter font-bold">AI Trip Manager</span>
                 </div>
                 <ArrowLeft className="rotate-180 text-white/50 group-hover:translate-x-1 transition-transform" size={16} />
               </button>
             </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
            <h4 className="font-cinzel text-orange-900 text-lg mb-2">Did you know?</h4>
            <p className="text-stone-700 font-inter text-sm leading-relaxed">
              {state.name} has some of the most vibrant festivals in India. Check our Festivals section for more details!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
