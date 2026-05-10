import { useState } from 'react';
import { CalendarDays, MapPin, Filter, Sparkles, Star } from 'lucide-react';
import { useMapModal } from '../context/MapModalContext';
import './Festivals.css';

const FESTIVALS = [
  { id: 'f1', name: 'Diwali', month: 'October/November', region: 'Pan India', type: 'Religious', image: 'https://images.unsplash.com/photo-1545129139-1beb780cf337?w=800&h=600&fit=crop', description: 'Festival of Lights. Homes illuminate with diyas, fireworks fill the sky, and families gather for prayers and feasts.', bestPlaces: ['Jaipur', 'Varanasi', 'Amritsar'] },
  { id: 'f2', name: 'Holi', month: 'March', region: 'North India', type: 'Religious', image: 'https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=800&h=600&fit=crop', description: 'Festival of Colors. People throw vibrant gulal powder, dance to dhol beats, and celebrate the arrival of spring.', bestPlaces: ['Mathura', 'Vrindavan', 'Jaipur'] },
  { id: 'f3', name: 'Durga Puja', month: 'October', region: 'East India', type: 'Religious', image: 'https://images.unsplash.com/photo-1603525281743-911915994f72?w=800&h=600&fit=crop', description: 'Grand celebration of Goddess Durga with elaborate pandals, cultural performances, and artistic idol-making.', bestPlaces: ['Kolkata', 'Siliguri', 'Agartala'] },
  { id: 'f4', name: 'Ganesh Chaturthi', month: 'August/September', region: 'West India', type: 'Religious', image: 'https://images.unsplash.com/photo-1567591370504-83a0d3cfc037?w=800&h=600&fit=crop', description: 'Celebration of Lord Ganesha with massive idol installations, processions, and immersion ceremonies.', bestPlaces: ['Mumbai', 'Pune', 'Hyderabad'] },
  { id: 'f5', name: 'Pushkar Camel Fair', month: 'November', region: 'Rajasthan', type: 'Cultural', image: 'https://images.unsplash.com/photo-1524613032530-449a5d94c285?w=800&h=600&fit=crop', description: 'One of the world\'s largest camel fairs with cultural events, competitions, and vibrant desert atmosphere.', bestPlaces: ['Pushkar', 'Ajmer'] },
  { id: 'f6', name: 'Onam', month: 'August/September', region: 'South India', type: 'Harvest', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&h=600&fit=crop', description: 'Kerala\'s grand harvest festival with boat races, Pookalam flower carpets, and traditional Sadya feasts.', bestPlaces: ['Kochi', 'Alleppey', 'Thrissur'] },
  { id: 'f7', name: 'Rann Utsav', month: 'November-February', region: 'Gujarat', type: 'Cultural', image: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=800&h=600&fit=crop', description: 'A vibrant festival on the white salt desert of Kutch with folk music, dance, and local crafts.', bestPlaces: ['Kutch', 'Bhuj'] },
  { id: 'f8', name: 'Hornbill Festival', month: 'December', region: 'Northeast', type: 'Cultural', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Nagaland\'s Festival of Festivals showcasing the rich tribal heritage of all 17 Naga tribes.', bestPlaces: ['Kohima', 'Kisama'] },
  { id: 'f9', name: 'Pongal', month: 'January', region: 'South India', type: 'Harvest', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop', description: 'Tamil Nadu\'s harvest festival with traditional kolam art, bull-taming (Jallikattu), and sweet pongal dishes.', bestPlaces: ['Madurai', 'Chennai', 'Thanjavur'] },
  { id: 'f10', name: 'Baisakhi', month: 'April', region: 'North India', type: 'Harvest', image: 'https://images.unsplash.com/photo-1609947017136-9daf32a15c38?w=800&h=600&fit=crop', description: 'Punjabi New Year and harvest festival with Bhangra dances, fairs, and gurudwara celebrations.', bestPlaces: ['Amritsar', 'Chandigarh', 'Delhi'] },
  { id: 'f11', name: 'Navratri & Garba', month: 'September/October', region: 'West India', type: 'Religious', image: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=800&h=600&fit=crop', description: 'Nine nights of devotion with energetic Garba and Dandiya Raas dances across Gujarat and India.', bestPlaces: ['Ahmedabad', 'Vadodara', 'Mumbai'] },
  { id: 'f12', name: 'Republic Day Parade', month: 'January', region: 'Delhi', type: 'National', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop', description: 'Grand military parade on Rajpath showcasing India\'s defense strength, cultural tableaux from every state.', bestPlaces: ['Delhi'] },
];

const TYPES = ['All', 'Religious', 'Cultural', 'Harvest', 'National'];
const MONTHS = ['All Months', 'January', 'March', 'April', 'August/September', 'September/October', 'October', 'October/November', 'November', 'November-February', 'December'];

export default function Festivals() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const { showMap } = useMapModal();

  const filtered = FESTIVALS.filter(f => typeFilter === 'All' || f.type === typeFilter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Festivals & Events</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Experience India's vibrant celebrations throughout the year</p>
        </div>
      </div>

      {/* Filters */}
      <div className="fest-filters animate-fadeIn">
        {TYPES.map(t => (
          <button key={t} className={`chip ${typeFilter === t ? 'active' : ''}`}
            onClick={() => setTypeFilter(t)}>{t}</button>
        ))}
      </div>

      {/* Timeline Layout */}
      <div className="fest-timeline animate-fadeInUp">
        {filtered.map((fest, i) => (
          <div key={fest.id} className="fest-card" style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => setSelected(selected === fest.id ? null : fest.id)} id={`fest-${fest.id}`}>
            <div className="fest-card-img">
              <img src={fest.image} alt={fest.name} loading="lazy" />
              <div className="fest-card-overlay">
                <span className="fest-month"><CalendarDays size={12} /> {fest.month}</span>
                <span className="fest-type-badge">{fest.type}</span>
              </div>
            </div>
            <div className="fest-card-body">
              <h3>{fest.name}</h3>
              <p className="fest-region"><MapPin size={12} /> {fest.region}</p>
              <p className="fest-desc">{fest.description}</p>

              {selected === fest.id && (
                <div className="fest-detail animate-fadeIn">
                  <h4><Star size={14} fill="currentColor" /> Best Places to Experience</h4>
                  <div className="fest-places">
                    {fest.bestPlaces.map((place, j) => (
                      <span key={j} className="fest-place-chip clickable" onClick={(e) => { e.stopPropagation(); showMap(place); }}>
                        <MapPin size={11} /> {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
