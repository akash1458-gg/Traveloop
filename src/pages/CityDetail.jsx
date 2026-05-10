import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Utensils, Camera, Map as MapIcon, Globe } from 'lucide-react';
import db from '../utils/database';
import { useMapModal } from '../context/MapModalContext';
import './CityDetail.css';

// Extended mock data for city details
const CITY_DETAILS = {
  'in-delhi': {
    description: 'Delhi, India\'s capital territory, is a massive metropolitan area in the country\'s north. In Old Delhi, a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people.',
    places: [
      { name: 'Red Fort', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=300&fit=crop', desc: 'Historic 17th-century fort' },
      { name: 'India Gate', image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=500&h=300&fit=crop', desc: 'War memorial' },
      { name: 'Qutub Minar', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=300&fit=crop', desc: 'UNESCO World Heritage tall minaret' },
      { name: 'Lotus Temple', image: 'https://images.unsplash.com/photo-1588616117293-68c1dcbe1a70?w=500&h=300&fit=crop', desc: 'Bahá\'í House of Worship' }
    ],
    food: [
      { name: 'Chole Bhature', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=300&h=300&fit=crop', popularAt: 'Chandni Chowk' },
      { name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=300&fit=crop', popularAt: 'Pandara Road' },
      { name: 'Parathas', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&h=300&fit=crop', popularAt: 'Paranthe Wali Gali' },
      { name: 'Chaat', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop', popularAt: 'Connaught Place' }
    ],
    activities: [
      { title: 'Old Delhi Heritage Walk', price: 1500, time: '3 hours' },
      { title: 'Street Food Tour', price: 2000, time: '2.5 hours' },
      { title: 'Akshardham Temple Evening Show', price: 800, time: '4 hours' }
    ]
  },
  'in-agra': {
    description: 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh. It is home to the iconic Taj Mahal, a mausoleum built for the Mughal ruler Shah Jahan\'s wife, Mumtaz Mahal.',
    places: [
      { name: 'Taj Mahal', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop', desc: 'Iconic marble mausoleum' },
      { name: 'Agra Fort', image: 'https://images.unsplash.com/photo-1585506942812-e72e34bee4d7?w=500&h=300&fit=crop', desc: 'Historic 16th-century fortress' },
      { name: 'Fatehpur Sikri', image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=500&h=300&fit=crop', desc: 'Abandoned Mughal capital' }
    ],
    food: [
      { name: 'Petha', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop', popularAt: 'Sadar Bazaar' },
      { name: 'Bedai & Jalebi', image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=300&h=300&fit=crop', popularAt: 'Local Sweet Shops' }
    ],
    activities: [
      { title: 'Taj Mahal Sunrise Tour', price: 2500, time: '3 hours' },
      { title: 'Mughal Heritage Walk', price: 1200, time: '2 hours' }
    ]
  },
  'in-mumbai': {
    description: 'Mumbai (formerly called Bombay) is a densely populated city on India\'s west coast. A financial center, it\'s India\'s largest city. On the Mumbai Harbour waterfront stands the iconic Gateway of India stone arch.',
    places: [
      { name: 'Gateway of India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=300&fit=crop', desc: 'Iconic waterfront arch' },
      { name: 'Marine Drive', image: 'https://images.unsplash.com/photo-1522436158019-3ee299f2df6b?w=500&h=300&fit=crop', desc: 'Queen\'s Necklace promenade' },
      { name: 'Elephanta Caves', image: 'https://images.unsplash.com/photo-1602495392471-5b29db42a4ee?w=500&h=300&fit=crop', desc: 'Ancient rock-cut temples' }
    ],
    food: [
      { name: 'Vada Pav', image: 'https://images.unsplash.com/photo-1626315570857-e1ee4ec36437?w=300&h=300&fit=crop', popularAt: 'Street stalls everywhere' },
      { name: 'Pav Bhaji', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop', popularAt: 'Juhu Beach / Chowpatty' },
      { name: 'Bombay Duck', image: 'https://images.unsplash.com/photo-1623869947118-a6d165f61765?w=300&h=300&fit=crop', popularAt: 'Coastal Restaurants' }
    ],
    activities: [
      { title: 'Dharavi Slum Tour', price: 1500, time: '2.5 hours' },
      { title: 'Elephanta Caves Ferry & Guide', price: 2000, time: '5 hours' },
      { title: 'Bollywood Studio Tour', price: 3500, time: '4 hours' }
    ]
  }
};

export default function CityDetail() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [activeTab, setActiveTab] = useState('places');
  const [wikiInfo, setWikiInfo] = useState('');
  const { showMap } = useMapModal();

  useEffect(() => {
    // Find the city in the database
    const foundCity = db.getById('cities', cityId);
    setCity(foundCity);
    
    if (foundCity) {
        // Try to fetch real wiki description if no local detail is present
        const detail = CITY_DETAILS[cityId.toLowerCase()];
        if (!detail) {
            fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(foundCity.name)}`)
              .then(res => res.json())
              .then(data => {
                  if (data.extract) setWikiInfo(data.extract);
              })
              .catch(err => console.error('Wiki fetch error', err));
        }
    }
  }, [cityId]);

  if (!city) {
    return <div className="page-container"><div className="app-loading"><span className="spinner" /></div></div>;
  }

  const details = CITY_DETAILS[cityId.toLowerCase()] || {
    description: wikiInfo || `${city.name} is a beautiful destination in ${city.country}. It offers a rich blend of culture, history, and vibrant local life.`,
    places: [
      { name: `${city.name} City Center`, image: city.image, desc: 'The bustling heart of the city' },
      { name: 'Local Museum', image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=500&h=300&fit=crop', desc: 'Explore the regional history' }
    ],
    food: [
      { name: 'Local Street Food', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop', popularAt: 'Main Market' },
      { name: 'Traditional Thali', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop', popularAt: 'Heritage Restaurants' }
    ],
    activities: [
      { title: `Guided Tour of ${city.name}`, price: 1500, time: '3 hours' },
      { title: 'Cultural Evening Show', price: 1000, time: '2 hours' }
    ]
  };

  return (
    <div className="city-detail-page animate-fadeIn">
      {/* Hero Header */}
      <div className="city-hero">
        <img src={city.image} alt={city.name} className="city-hero-bg" />
        <div className="city-hero-overlay" />
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="city-hero-content">
          <span className="city-region">{city.state || city.country}</span>
          <h1 className="city-title">{city.name}</h1>
          <div className="city-meta">
            <span className="city-rating"><Star size={14} fill="currentColor" /> {city.popularity}% Popularity</span>
            {city.state && <span className="city-location"><MapPin size={14} /> India</span>}
          </div>
        </div>
      </div>

      <div className="city-body">
        <div className="city-description-card">
          <p>{details.description}</p>
        </div>

        {/* Tabs */}
        <div className="city-tabs">
          <button className={`city-tab ${activeTab === 'places' ? 'active' : ''}`} onClick={() => setActiveTab('places')}>
            <Camera size={18} /> Places to Visit
          </button>
          <button className={`city-tab ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>
            <Utensils size={18} /> Local Food
          </button>
          <button className={`city-tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
            <Globe size={18} /> Activities
          </button>
          <button className={`city-tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <MapIcon size={18} /> Map
          </button>
        </div>

        <div className="city-tab-content animate-fadeInUp">
          {activeTab === 'places' && (
            <div className="places-grid">
              {details.places.map((place, i) => (
                <div key={i} className="place-card clickable" onClick={() => showMap(`${place.name}, ${city.name}`)}>
                  <img src={place.image} alt={place.name} loading="lazy" />
                  <div className="place-info">
                    <h4>{place.name}</h4>
                    <p>{place.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'food' && (
            <div className="food-grid">
              {details.food.map((item, i) => (
                <div key={i} className="food-card">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="food-info">
                    <h4>{item.name}</h4>
                    <p className="food-spot"><MapPin size={12} /> {item.popularAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="activities-list">
              {details.activities.map((act, i) => (
                <div key={i} className="activity-row">
                  <div className="act-details">
                    <h4>{act.title}</h4>
                    <span className="act-time">{act.time}</span>
                  </div>
                  <div className="act-price">
                    ₹{act.price}
                  </div>
                  <button className="btn-primary" onClick={() => navigate('/activities')}>Book</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="map-container">
              <iframe
                title={`${city.name} Map`}
                width="100%"
                height="400"
                frameBorder="0"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(city.name + ' ' + (city.state || city.country))}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
