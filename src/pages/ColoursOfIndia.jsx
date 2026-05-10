import { useState } from 'react';
import { Palette, Eye, MapPin } from 'lucide-react';
import { useMapModal } from '../context/MapModalContext';
import './ColoursOfIndia.css';

const COLOURS = [
  {
    id: 'saffron', name: 'Saffron', hex: '#FF6B35', region: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop',
    description: 'The color of courage and sacrifice. Seen in Rajasthani turbans, temple flags, and desert sunsets.',
    places: ['Jaipur — The Pink City', 'Jodhpur — Fort Mehrangarh', 'Pushkar — Holy Lake']
  },
  {
    id: 'gold', name: 'Gold', hex: '#FFCC00', region: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop',
    description: 'The color of prosperity. Gleaming temple gopurams, silk sarees, and harvest celebrations.',
    places: ['Madurai — Meenakshi Temple', 'Thanjavur — Big Temple', 'Kanchipuram — Silk Capital']
  },
  {
    id: 'blue', name: 'Royal Blue', hex: '#1E40AF', region: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop',
    description: 'The iconic blue of Jodhpur. Entire neighborhoods painted in shades of indigo and cobalt.',
    places: ['Jodhpur — The Blue City', 'Udaipur — Lake Palace', 'Chefchaouen influence']
  },
  {
    id: 'green', name: 'Emerald Green', hex: '#10B981', region: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
    description: 'God\'s Own Country. Lush tea plantations, backwaters, and coconut groves define Kerala\'s green.',
    places: ['Munnar — Tea Gardens', 'Alleppey — Backwaters', 'Wayanad — Forests']
  },
  {
    id: 'pink', name: 'Pink', hex: '#EC4899', region: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&h=400&fit=crop',
    description: 'Jaipur was painted pink to welcome Prince Albert in 1876. The tradition lives on in every building.',
    places: ['Jaipur — Hawa Mahal', 'Jaipur — City Palace', 'Jaipur — Nahargarh Fort']
  },
  {
    id: 'white', name: 'Marble White', hex: '#F0F0F0', region: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
    description: 'The pristine white of the Taj Mahal, Jain temples, and the Rann of Kutch white desert.',
    places: ['Agra — Taj Mahal', 'Ranakpur — Jain Temple', 'Kutch — White Desert']
  },
  {
    id: 'red', name: 'Vermillion Red', hex: '#DC2626', region: 'Pan India',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=400&fit=crop',
    description: 'Sacred sindoor, Holi colors, Red Fort sandstone — red runs through India\'s spiritual and historical veins.',
    places: ['Delhi — Red Fort', 'Mathura — Holi Festival', 'Varanasi — Sindoor Traditions']
  },
  {
    id: 'turquoise', name: 'Turquoise', hex: '#06B6D4', region: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1626015365107-aa95e5d0ca01?w=600&h=400&fit=crop',
    description: 'The stunning turquoise of Pangong Lake, prayer flags fluttering against clear Himalayan skies.',
    places: ['Pangong Lake', 'Nubra Valley', 'Tso Moriri Lake']
  },
];

export default function ColoursOfIndia() {
  const [active, setActive] = useState(null);
  const { showMap } = useMapModal();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Palette size={28} style={{ color: '#FF6B35' }} /> Colours of India</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Every region tells its story through color</p>
        </div>
      </div>

      {/* Color Palette Bar */}
      <div className="colour-palette-bar animate-fadeIn">
        {COLOURS.map(c => (
          <button key={c.id} className={`colour-swatch ${active === c.id ? 'active' : ''}`}
            style={{ '--swatch-color': c.hex }} onClick={() => setActive(active === c.id ? null : c.id)}
            title={c.name} />
        ))}
      </div>

      {/* Color Cards Grid */}
      <div className="colour-grid animate-fadeInUp">
        {COLOURS.filter(c => !active || c.id === active).map((c, i) => (
          <div key={c.id} className="colour-card" style={{ '--card-accent': c.hex, animationDelay: `${i * 60}ms` }}
            id={`colour-${c.id}`}>
            <div className="colour-card-img">
              <img src={c.image} alt={c.name} loading="lazy" />
              <div className="colour-card-gradient" style={{ background: `linear-gradient(to top, ${c.hex}DD 0%, transparent 70%)` }} />
              <div className="colour-card-badge" style={{ background: c.hex, color: c.id === 'white' ? '#333' : 'white' }}>
                {c.name}
              </div>
            </div>
            <div className="colour-card-body">
              <div className="colour-header-row">
                <h3>{c.name}</h3>
                <span className="colour-region"><MapPin size={12} /> {c.region}</span>
              </div>
              <p className="colour-desc">{c.description}</p>
              <div className="colour-places">
                {c.places.map((p, j) => (
                  <span key={j} className="colour-place clickable" style={{ borderColor: c.hex }} onClick={() => showMap(p)}>
                    <Eye size={11} /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
