import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../utils/database';
import { Sparkles, Mountain, Heart, Waves, Tent, UtensilsCrossed, Camera, Music, Palette, TreePine } from 'lucide-react';
import './Experiences.css';

const EXPERIENCE_DATA = [
  {
    id: 'spiritual', icon: Heart, label: 'Spiritual & Wellness', color: '#EC4899',
    cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=500&fit=crop',
    description: 'Discover the spiritual heart of India through ancient temples, yoga retreats, and meditation centers.',
    highlights: ['Varanasi Ganga Aarti', 'Rishikesh Yoga Retreat', 'Golden Temple, Amritsar', 'Bodh Gaya Meditation', 'Tirupati Darshan', 'Haridwar Kumbh Mela'],
  },
  {
    id: 'adventure', icon: Mountain, label: 'Adventure & Outdoors', color: '#FF6B35',
    cover: 'https://images.unsplash.com/photo-1626015365107-aa95e5d0ca01?w=800&h=500&fit=crop',
    description: 'From the Himalayas to the Western Ghats, India offers thrilling adventures for every level.',
    highlights: ['Ladakh Bike Trip', 'Manali Paragliding', 'Rishikesh River Rafting', 'Goa Water Sports', 'Spiti Valley Trek', 'Andaman Scuba Diving'],
  },
  {
    id: 'heritage', icon: Camera, label: 'Heritage & Architecture', color: '#FFCC00',
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=500&fit=crop',
    description: 'Explore UNESCO World Heritage Sites, ancient forts, palaces, and architectural masterpieces.',
    highlights: ['Taj Mahal, Agra', 'Hampi Ruins', 'Khajuraho Temples', 'Fatehpur Sikri', 'Ajanta & Ellora Caves', 'Mysore Palace'],
  },
  {
    id: 'beaches', icon: Waves, label: 'Beaches & Islands', color: '#00B4D8',
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=500&fit=crop',
    description: 'Sun-kissed coastlines from Goa to Andaman — India has 7,500 km of stunning beaches.',
    highlights: ['Goa Beaches', 'Andaman Islands', 'Kovalam Beach', 'Radhanagar Beach', 'Varkala Cliff Beach', 'Lakshadweep Lagoons'],
  },
  {
    id: 'culinary', icon: UtensilsCrossed, label: 'Culinary Journeys', color: '#F59E0B',
    cover: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=500&fit=crop',
    description: 'Taste the incredible diversity of Indian cuisine — from street food to royal kitchens.',
    highlights: ['Delhi Street Food Walk', 'Hyderabadi Biryani Trail', 'Kerala Sadya Feast', 'Rajasthani Thali', 'Kolkata Mishti Tour', 'Mumbai Vada Pav Trail'],
  },
  {
    id: 'nature', icon: TreePine, label: 'Nature & Wildlife', color: '#10B981',
    cover: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&h=500&fit=crop',
    description: 'Explore national parks, tiger reserves, and breathtaking landscapes across India.',
    highlights: ['Jim Corbett Tiger Safari', 'Kaziranga Rhino Spotting', 'Kerala Backwaters', 'Valley of Flowers', 'Sundarbans Mangroves', 'Rann of Kutch White Desert'],
  },
  {
    id: 'arts', icon: Palette, label: 'Arts & Crafts', color: '#8B5CF6',
    cover: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&h=500&fit=crop',
    description: 'Discover centuries-old craft traditions, handlooms, paintings, and artisan workshops.',
    highlights: ['Jaipur Block Printing', 'Varanasi Silk Weaving', 'Madhubani Painting', 'Kutch Embroidery', 'Blue Pottery Workshop', 'Channapatna Toy Making'],
  },
  {
    id: 'music', icon: Music, label: 'Music & Dance', color: '#14B8A6',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',
    description: 'Experience India\'s rich performing arts — from classical ragas to vibrant folk dances.',
    highlights: ['Kathak Performance, Delhi', 'Bharatanatyam, Chennai', 'Rajasthani Folk Night', 'Kerala Kathakali Show', 'Carnatic Music Concert', 'Bhangra in Punjab'],
  },
];

export default function Experiences() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Experiences</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Curated travel experiences across India</p>
        </div>
      </div>

      {/* Experience Categories Grid */}
      <div className="exp-grid animate-fadeInUp">
        {EXPERIENCE_DATA.map((exp, i) => {
          const Icon = exp.icon;
          const isSelected = selected === exp.id;
          return (
            <div key={exp.id} className={`exp-card ${isSelected ? 'expanded' : ''}`}
              style={{ animationDelay: `${i * 60}ms`, '--exp-color': exp.color }}
              onClick={() => setSelected(isSelected ? null : exp.id)} id={`exp-${exp.id}`}>
              <div className="exp-card-img">
                <img src={exp.cover} alt={exp.label} loading="lazy" />
                <div className="exp-card-gradient" />
                <div className="exp-card-content">
                  <div className="exp-icon-wrap" style={{ background: `${exp.color}20`, color: exp.color }}>
                    <Icon size={22} />
                  </div>
                  <h3>{exp.label}</h3>
                  <p className="exp-desc">{exp.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="exp-highlights animate-fadeIn">
                  <h4><Sparkles size={14} /> Top Highlights</h4>
                  <ul className="exp-highlights-list">
                    {exp.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                  <button className="btn-incredible" onClick={(e) => { e.stopPropagation(); navigate('/activities'); }}>
                    Browse Activities
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
