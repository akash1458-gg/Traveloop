/* Seed data for Traveloop — realistic cities, activities */
import db from '../utils/database';

const CITIES = [
  { id: 'city-1', name: 'Paris', country: 'France', region: 'Europe', cost_index: 85, popularity: 98, description: 'The City of Light. Famous for the Eiffel Tower, Louvre Museum, and world-class cuisine.', lat: 48.8566, lng: 2.3522, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { id: 'city-2', name: 'Tokyo', country: 'Japan', region: 'Asia', cost_index: 78, popularity: 95, description: 'A dazzling mix of ultramodern and traditional, from neon-lit skyscrapers to historic temples.', lat: 35.6762, lng: 139.6503, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
  { id: 'city-3', name: 'New York', country: 'USA', region: 'North America', cost_index: 90, popularity: 97, description: 'The Big Apple. Iconic skyline, Broadway shows, Central Park, and endless energy.', lat: 40.7128, lng: -74.006, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
  { id: 'city-4', name: 'Bali', country: 'Indonesia', region: 'Asia', cost_index: 35, popularity: 92, description: 'Tropical paradise with stunning temples, rice terraces, and beautiful beaches.', lat: -8.3405, lng: 115.092, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
  { id: 'city-5', name: 'London', country: 'UK', region: 'Europe', cost_index: 88, popularity: 96, description: 'Royal palaces, world-class museums, and a vibrant multicultural atmosphere.', lat: 51.5074, lng: -0.1278, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { id: 'city-6', name: 'Dubai', country: 'UAE', region: 'Middle East', cost_index: 82, popularity: 90, description: 'Futuristic skyline, luxury shopping, and desert adventures.', lat: 25.2048, lng: 55.2708, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
  { id: 'city-7', name: 'Rome', country: 'Italy', region: 'Europe', cost_index: 70, popularity: 93, description: 'The Eternal City. Ancient ruins, Renaissance art, and incredible Italian food.', lat: 41.9028, lng: 12.4964, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
  { id: 'city-8', name: 'Bangkok', country: 'Thailand', region: 'Asia', cost_index: 30, popularity: 89, description: 'Ornate temples, bustling street markets, and vibrant nightlife.', lat: 13.7563, lng: 100.5018, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop' },
  { id: 'city-9', name: 'Barcelona', country: 'Spain', region: 'Europe', cost_index: 65, popularity: 91, description: 'Gaudí architecture, Mediterranean beaches, and lively tapas culture.', lat: 41.3874, lng: 2.1686, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop' },
  { id: 'city-10', name: 'Sydney', country: 'Australia', region: 'Oceania', cost_index: 80, popularity: 88, description: 'Harbour Bridge, Opera House, and stunning coastal scenery.', lat: -33.8688, lng: 151.2093, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop' },
  { id: 'city-11', name: 'Istanbul', country: 'Turkey', region: 'Europe', cost_index: 40, popularity: 87, description: 'Where East meets West. Grand Bazaar, Blue Mosque, and rich history.', lat: 41.0082, lng: 28.9784, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop' },
  { id: 'city-12', name: 'Marrakech', country: 'Morocco', region: 'Africa', cost_index: 32, popularity: 84, description: 'Vibrant souks, stunning riads, and the magical Sahara nearby.', lat: 31.6295, lng: -7.9811, image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=300&fit=crop' },
  { id: 'city-13', name: 'Singapore', country: 'Singapore', region: 'Asia', cost_index: 83, popularity: 86, description: 'Garden city with futuristic architecture and incredible food hawker centers.', lat: 1.3521, lng: 103.8198, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop' },
  { id: 'city-14', name: 'Cape Town', country: 'South Africa', region: 'Africa', cost_index: 38, popularity: 82, description: 'Table Mountain, stunning coastlines, and rich cultural heritage.', lat: -33.9249, lng: 18.4241, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop' },
  { id: 'city-15', name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', cost_index: 45, popularity: 85, description: 'Christ the Redeemer, Copacabana Beach, and Carnival celebrations.', lat: -22.9068, lng: -43.1729, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop' },
  { id: 'city-16', name: 'Kyoto', country: 'Japan', region: 'Asia', cost_index: 72, popularity: 83, description: 'Ancient temples, traditional tea houses, and beautiful bamboo groves.', lat: 35.0116, lng: 135.7681, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop' },
];

const ACTIVITY_TEMPLATES = [
  { type: 'Sightseeing', items: ['Walking City Tour', 'Landmark Visit', 'Museum Visit', 'Architecture Tour', 'Sunset Viewpoint', 'Historical Site Tour'] },
  { type: 'Food & Drink', items: ['Street Food Tour', 'Fine Dining Experience', 'Cooking Class', 'Food Market Visit', 'Wine Tasting', 'Local Café Crawl'] },
  { type: 'Adventure', items: ['Hiking Trail', 'Snorkeling Trip', 'Zip-lining', 'Kayaking', 'Cycling Tour', 'Parasailing'] },
  { type: 'Culture', items: ['Temple Visit', 'Traditional Show', 'Art Gallery', 'Festival Experience', 'Local Workshop', 'Heritage Walk'] },
  { type: 'Relaxation', items: ['Beach Day', 'Spa & Wellness', 'Garden Visit', 'Boat Cruise', 'Hot Springs', 'Yoga Session'] },
  { type: 'Shopping', items: ['Local Market', 'Souvenir Shopping', 'Designer Boutiques', 'Night Market', 'Artisan Crafts', 'Flea Market'] },
];

const generateActivities = () => {
  const activities = [];
  const costs = { Sightseeing: [10, 30], 'Food & Drink': [15, 80], Adventure: [25, 120], Culture: [5, 25], Relaxation: [20, 100], Shopping: [0, 0] };
  const durations = { Sightseeing: [1, 3], 'Food & Drink': [1, 2.5], Adventure: [2, 5], Culture: [1, 2], Relaxation: [2, 4], Shopping: [1, 3] };

  CITIES.forEach(city => {
    ACTIVITY_TEMPLATES.forEach(tmpl => {
      tmpl.items.forEach((name, i) => {
        const [minC, maxC] = costs[tmpl.type];
        const [minD, maxD] = durations[tmpl.type];
        const costVal = Math.round(minC + Math.random() * (maxC - minC));
        const dur = +(minD + Math.random() * (maxD - minD)).toFixed(1);
        activities.push({
          id: `act-${city.id}-${tmpl.type}-${i}`,
          city_id: city.id,
          name: `${name} in ${city.name}`,
          type: tmpl.type,
          cost: costVal,
          duration: dur,
          description: `Experience ${name.toLowerCase()} in the heart of ${city.name}, ${city.country}.`,
        });
      });
    });
  });
  return activities;
};

export const seedDatabase = () => {
  if (db.isSeeded()) return;

  CITIES.forEach(city => db.insert('cities', city));
  generateActivities().forEach(act => db.insert('activities', act));

  // Create demo user
  db.insert('users', {
    id: 'user-demo',
    name: 'Demo Traveler',
    email: 'demo@traveloop.com',
    password: 'Demo@123',
    avatar: '',
    preferences: { language: 'en', currency: 'USD' },
  });

  // Create a sample trip
  const sampleTrip = db.insert('trips', {
    id: 'trip-sample',
    user_id: 'user-demo',
    name: 'European Adventure 2026',
    description: 'A 10-day journey through the most beautiful cities in Europe.',
    start_date: '2026-07-01',
    end_date: '2026-07-10',
    cover_image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&h=400&fit=crop',
    budget: 3500,
    status: 'planning',
  });

  // Add stops to sample trip
  db.insert('stops', { id: 'stop-1', trip_id: 'trip-sample', city_id: 'city-1', order: 1, arrival_date: '2026-07-01', departure_date: '2026-07-04' });
  db.insert('stops', { id: 'stop-2', trip_id: 'trip-sample', city_id: 'city-7', order: 2, arrival_date: '2026-07-04', departure_date: '2026-07-07' });
  db.insert('stops', { id: 'stop-3', trip_id: 'trip-sample', city_id: 'city-9', order: 3, arrival_date: '2026-07-07', departure_date: '2026-07-10' });

  // Add activities to stops
  db.insert('trip_activities', { id: 'ta-1', stop_id: 'stop-1', activity_id: 'act-city-1-Sightseeing-0', day: '2026-07-01', time_slot: '09:00', cost: 25 });
  db.insert('trip_activities', { id: 'ta-2', stop_id: 'stop-1', activity_id: 'act-city-1-Food & Drink-0', day: '2026-07-02', time_slot: '12:00', cost: 45 });
  db.insert('trip_activities', { id: 'ta-3', stop_id: 'stop-2', activity_id: 'act-city-7-Culture-0', day: '2026-07-05', time_slot: '10:00', cost: 15 });

  // Add packing items
  ['Passport', 'Phone Charger', 'Travel Adapter', 'Sunscreen', 'Comfortable Walking Shoes', 'Rain Jacket', 'First Aid Kit', 'Camera'].forEach((name, i) => {
    const cats = ['Documents', 'Electronics', 'Electronics', 'Toiletries', 'Clothing', 'Clothing', 'Health', 'Electronics'];
    db.insert('packing_items', { trip_id: 'trip-sample', name, category: cats[i], is_packed: i < 3 });
  });

  // Add notes
  db.insert('notes', { trip_id: 'trip-sample', stop_id: 'stop-1', title: 'Hotel Info', content: 'Hotel Le Marais, Check-in: 2 PM, Room 305. WiFi password: ParisLove2026' });
  db.insert('notes', { trip_id: 'trip-sample', stop_id: null, title: 'Emergency Contacts', content: 'Embassy: +33 1 43 12 22 22\nTravel Insurance: 1-800-555-0199' });

  db.markSeeded();
  console.log('✅ Traveloop database seeded successfully');
};
