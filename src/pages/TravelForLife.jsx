import { Leaf, Droplets, Recycle, TreePine, Heart, Globe, Lightbulb, Shield } from 'lucide-react';
import './TravelForLife.css';

const TIPS = [
  { icon: Leaf, title: 'Choose Eco-Friendly Stays', desc: 'Support homestays, eco-lodges, and certified green hotels that minimize environmental impact.', color: '#10B981' },
  { icon: Droplets, title: 'Conserve Water', desc: 'Carry a reusable water bottle. Avoid single-use plastic at tourist spots and use water wisely.', color: '#00B4D8' },
  { icon: Recycle, title: 'Reduce, Reuse, Recycle', desc: 'Carry cloth bags, avoid plastic straws, and properly dispose of waste during your travels.', color: '#F59E0B' },
  { icon: TreePine, title: 'Respect Nature', desc: 'Stay on marked trails, don\'t litter in national parks, and follow wildlife observation guidelines.', color: '#059669' },
  { icon: Heart, title: 'Support Local Communities', desc: 'Buy from local artisans, eat at family-run restaurants, and hire local guides for authentic experiences.', color: '#EC4899' },
  { icon: Globe, title: 'Carbon-Conscious Travel', desc: 'Prefer trains over flights for short distances. India\'s railway network is one of the world\'s largest.', color: '#8B5CF6' },
  { icon: Lightbulb, title: 'Travel During Off-Peak', desc: 'Visit popular destinations during shoulder seasons to reduce overcrowding and support year-round tourism.', color: '#FF6B35' },
  { icon: Shield, title: 'Preserve Heritage', desc: 'Don\'t touch or deface historical monuments. Follow photography rules at heritage sites.', color: '#FFCC00' },
];

const INITIATIVES = [
  { title: 'Swachh Bharat at Tourist Sites', desc: 'Cleanliness drives and waste management at 100+ iconic tourist destinations.' },
  { title: 'Indian Railway Green Corridors', desc: 'Bio-toilet equipped trains reducing rail track pollution across the country.' },
  { title: 'Responsible Tourism Kerala', desc: 'Community-based tourism model that empowers local communities and protects ecosystems.' },
  { title: 'Ladakh Waste-Free Zone', desc: 'Initiative to make Ladakh a zero-waste tourism destination with strict plastic bans.' },
];

export default function TravelForLife() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Travel for LiFE</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Lifestyle for Environment — Sustainable travel practices</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="tfl-hero animate-fadeInUp">
        <div className="tfl-hero-bg">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop" alt="Sustainable travel" />
          <div className="tfl-hero-overlay" />
        </div>
        <div className="tfl-hero-content">
          <Leaf size={32} />
          <h2>Travel Responsibly, Travel Sustainably</h2>
          <p>Every journey you take can make a positive impact on the environment and local communities.</p>
        </div>
      </div>

      {/* Tips Grid */}
      <section className="tfl-section">
        <h2 className="section-title-v2">Sustainable Travel <span style={{ color: '#10B981' }}>Tips</span></h2>
        <div className="tfl-tips-grid">
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="tfl-tip-card animate-fadeInUp" style={{ animationDelay: `${i * 60}ms`, '--tip-color': tip.color }}>
                <div className="tfl-tip-icon" style={{ background: `${tip.color}15`, color: tip.color }}>
                  <Icon size={22} />
                </div>
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Initiatives */}
      <section className="tfl-section">
        <h2 className="section-title-v2">Green <span style={{ color: '#10B981' }}>Initiatives</span></h2>
        <div className="tfl-initiatives">
          {INITIATIVES.map((init, i) => (
            <div key={i} className="tfl-init-card animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="tfl-init-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3>{init.title}</h3>
                <p>{init.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
