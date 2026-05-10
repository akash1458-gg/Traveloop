import db from '../utils/database';

const CITIES = [
  // ===== INDIA — North =====
  { id: 'in-delhi', name: 'Delhi', country: 'India', region: 'India — North', state: 'Delhi', cost_index: 45, popularity: 97, description: 'Capital city with Red Fort, Qutub Minar, India Gate, and vibrant street food culture of Chandni Chowk.', lat: 28.6139, lng: 77.209, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop' },
  { id: 'in-jaipur', name: 'Jaipur', country: 'India', region: 'India — North', state: 'Rajasthan', cost_index: 30, popularity: 95, description: 'The Pink City. Hawa Mahal, Amber Fort, City Palace, and royal Rajasthani heritage.', lat: 26.9124, lng: 75.7873, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop' },
  { id: 'in-agra', name: 'Agra', country: 'India', region: 'India — North', state: 'Uttar Pradesh', cost_index: 25, popularity: 96, description: 'Home of the Taj Mahal, Agra Fort, and Fatehpur Sikri — a UNESCO World Heritage marvel.', lat: 27.1767, lng: 78.0081, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop' },
  { id: 'in-varanasi', name: 'Varanasi', country: 'India', region: 'India — North', state: 'Uttar Pradesh', cost_index: 20, popularity: 93, description: 'Oldest living city. Sacred Ganges ghats, Kashi Vishwanath Temple, and evening Ganga Aarti.', lat: 25.3176, lng: 82.9739, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop' },
  { id: 'in-shimla', name: 'Shimla', country: 'India', region: 'India — North', state: 'Himachal Pradesh', cost_index: 35, popularity: 88, description: 'Queen of Hills. Mall Road, Ridge, Jakhoo Temple, and colonial-era charm.', lat: 31.1048, lng: 77.1734, image: 'https://images.unsplash.com/photo-1597074866923-dc0589150a51?w=400&h=300&fit=crop' },
  { id: 'in-manali', name: 'Manali', country: 'India', region: 'India — North', state: 'Himachal Pradesh', cost_index: 32, popularity: 90, description: 'Adventure capital with Rohtang Pass, Solang Valley, and Hadimba Temple.', lat: 32.2396, lng: 77.1887, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop' },
  { id: 'in-amritsar', name: 'Amritsar', country: 'India', region: 'India — North', state: 'Punjab', cost_index: 22, popularity: 91, description: 'Golden Temple (Harmandir Sahib), Jallianwala Bagh, and Wagah Border ceremony.', lat: 31.634, lng: 74.8723, image: 'https://images.unsplash.com/photo-1609947017136-9daf32a15c38?w=400&h=300&fit=crop' },
  { id: 'in-udaipur', name: 'Udaipur', country: 'India', region: 'India — North', state: 'Rajasthan', cost_index: 30, popularity: 92, description: 'City of Lakes. Lake Palace, City Palace, Jag Mandir, and sunset at Fateh Sagar.', lat: 24.5854, lng: 73.7125, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop' },
  { id: 'in-rishikesh', name: 'Rishikesh', country: 'India', region: 'India — North', state: 'Uttarakhand', cost_index: 20, popularity: 87, description: 'Yoga capital of the world. Laxman Jhula, river rafting, and spiritual retreats.', lat: 30.0869, lng: 78.2676, image: 'https://images.unsplash.com/photo-1600100397608-e4b1356e9952?w=400&h=300&fit=crop' },
  { id: 'in-leh', name: 'Leh-Ladakh', country: 'India', region: 'India — North', state: 'Ladakh', cost_index: 40, popularity: 89, description: 'Pangong Lake, Nubra Valley, Khardung La Pass, and Buddhist monasteries.', lat: 34.1526, lng: 77.5771, image: 'https://images.unsplash.com/photo-1626015365107-aa95e5d0ca01?w=400&h=300&fit=crop' },
  // ===== INDIA — South =====
  { id: 'in-mumbai', name: 'Mumbai', country: 'India', region: 'India — West', state: 'Maharashtra', cost_index: 55, popularity: 96, description: 'City of Dreams. Gateway of India, Marine Drive, Bollywood, and iconic Vada Pav.', lat: 19.076, lng: 72.8777, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop' },
  { id: 'in-goa', name: 'Goa', country: 'India', region: 'India — West', state: 'Goa', cost_index: 35, popularity: 94, description: 'Beach paradise. Baga, Calangute, Old Goa churches, and vibrant nightlife.', lat: 15.2993, lng: 74.124, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop' },
  { id: 'in-bengaluru', name: 'Bengaluru', country: 'India', region: 'India — South', state: 'Karnataka', cost_index: 45, popularity: 88, description: 'Silicon Valley of India. Lalbagh, Cubbon Park, breweries, and IT hub.', lat: 12.9716, lng: 77.5946, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop' },
  { id: 'in-mysuru', name: 'Mysuru', country: 'India', region: 'India — South', state: 'Karnataka', cost_index: 25, popularity: 86, description: 'City of Palaces. Mysore Palace, Chamundi Hills, Brindavan Gardens, and silk sarees.', lat: 12.2958, lng: 76.6394, image: 'https://images.unsplash.com/photo-1600112356196-bdce26380bc7?w=400&h=300&fit=crop' },
  { id: 'in-hampi', name: 'Hampi', country: 'India', region: 'India — South', state: 'Karnataka', cost_index: 15, popularity: 85, description: 'UNESCO ruins of Vijayanagara Empire. Vitthala Temple, Stone Chariot, and boulder landscapes.', lat: 15.335, lng: 76.46, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&h=300&fit=crop' },
  { id: 'in-kochi', name: 'Kochi', country: 'India', region: 'India — South', state: 'Kerala', cost_index: 30, popularity: 87, description: 'Queen of the Arabian Sea. Chinese fishing nets, Fort Kochi, and spice markets.', lat: 9.9312, lng: 76.2673, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop' },
  { id: 'in-alleppey', name: 'Alleppey', country: 'India', region: 'India — South', state: 'Kerala', cost_index: 28, popularity: 89, description: 'Venice of the East. Houseboat cruises, backwaters, paddy fields, and Kumarakom Bird Sanctuary.', lat: 9.4981, lng: 76.3388, image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&h=300&fit=crop' },
  { id: 'in-munnar', name: 'Munnar', country: 'India', region: 'India — South', state: 'Kerala', cost_index: 25, popularity: 88, description: 'Tea garden paradise. Eravikulam National Park, Mattupetty Dam, and misty hills.', lat: 10.0889, lng: 77.0595, image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop' },
  { id: 'in-chennai', name: 'Chennai', country: 'India', region: 'India — South', state: 'Tamil Nadu', cost_index: 35, popularity: 85, description: 'Gateway to South India. Marina Beach, Kapaleeshwarar Temple, and Carnatic music.', lat: 13.0827, lng: 80.2707, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop' },
  { id: 'in-madurai', name: 'Madurai', country: 'India', region: 'India — South', state: 'Tamil Nadu', cost_index: 18, popularity: 82, description: 'Temple city. Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, and ancient culture.', lat: 9.9252, lng: 78.1198, image: 'https://images.unsplash.com/photo-1621427639905-c390644ef3af?w=400&h=300&fit=crop' },
  { id: 'in-hyderabad', name: 'Hyderabad', country: 'India', region: 'India — South', state: 'Telangana', cost_index: 35, popularity: 89, description: 'City of Pearls. Charminar, Golconda Fort, Ramoji Film City, and Hyderabadi Biryani.', lat: 17.385, lng: 78.4867, image: 'https://images.unsplash.com/photo-1572711655622-5cf0b38fdbae?w=400&h=300&fit=crop' },
  // ===== INDIA — East & Northeast =====
  { id: 'in-kolkata', name: 'Kolkata', country: 'India', region: 'India — East', state: 'West Bengal', cost_index: 28, popularity: 87, description: 'City of Joy. Victoria Memorial, Howrah Bridge, Durga Puja, and Bengali cuisine.', lat: 22.5726, lng: 88.3639, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop' },
  { id: 'in-darjeeling', name: 'Darjeeling', country: 'India', region: 'India — East', state: 'West Bengal', cost_index: 25, popularity: 86, description: 'Tea capital. Tiger Hill sunrise, Toy Train, Kanchenjunga views, and Batasia Loop.', lat: 27.0410, lng: 88.2663, image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=400&h=300&fit=crop' },
  { id: 'in-guwahati', name: 'Guwahati', country: 'India', region: 'India — Northeast', state: 'Assam', cost_index: 22, popularity: 78, description: 'Gateway to Northeast. Kamakhya Temple, Brahmaputra River, and Assam tea gardens.', lat: 26.1445, lng: 91.7362, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' },
  { id: 'in-shillong', name: 'Shillong', country: 'India', region: 'India — Northeast', state: 'Meghalaya', cost_index: 25, popularity: 80, description: 'Scotland of the East. Living root bridges, Dawki River, and Cherrapunji waterfalls.', lat: 25.5788, lng: 91.8933, image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=400&h=300&fit=crop' },
  // ===== INDIA — Central & West =====
  { id: 'in-ahmedabad', name: 'Ahmedabad', country: 'India', region: 'India — West', state: 'Gujarat', cost_index: 25, popularity: 82, description: 'UNESCO Heritage City. Sabarmati Ashram, Adalaj Stepwell, and vibrant kite festival.', lat: 23.0225, lng: 72.5714, image: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=400&h=300&fit=crop' },
  { id: 'in-rann', name: 'Kutch (Rann)', country: 'India', region: 'India — West', state: 'Gujarat', cost_index: 20, popularity: 84, description: 'White desert of the Great Rann. Rann Utsav, handicrafts, and stunning salt flats.', lat: 23.7337, lng: 69.8597, image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&h=300&fit=crop' },
  { id: 'in-andaman', name: 'Port Blair', country: 'India', region: 'India — Islands', state: 'Andaman & Nicobar', cost_index: 45, popularity: 86, description: 'Cellular Jail, Radhanagar Beach, Havelock Island, and crystal-clear waters.', lat: 11.6234, lng: 92.7265, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' },
  // ===== WORLD — Europe =====
  { id: 'w-paris', name: 'Paris', country: 'France', region: 'Europe', cost_index: 85, popularity: 98, description: 'City of Light. Eiffel Tower, Louvre Museum, and world-class cuisine.', lat: 48.8566, lng: 2.3522, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
  { id: 'w-london', name: 'London', country: 'UK', region: 'Europe', cost_index: 88, popularity: 96, description: 'Royal palaces, world-class museums, and vibrant multicultural atmosphere.', lat: 51.5074, lng: -0.1278, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop' },
  { id: 'w-rome', name: 'Rome', country: 'Italy', region: 'Europe', cost_index: 70, popularity: 93, description: 'The Eternal City. Colosseum, Vatican, Trevi Fountain, and Italian cuisine.', lat: 41.9028, lng: 12.4964, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' },
  { id: 'w-barcelona', name: 'Barcelona', country: 'Spain', region: 'Europe', cost_index: 65, popularity: 91, description: 'Gaudí architecture, Mediterranean beaches, and lively tapas culture.', lat: 41.3874, lng: 2.1686, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop' },
  { id: 'w-istanbul', name: 'Istanbul', country: 'Turkey', region: 'Europe', cost_index: 40, popularity: 87, description: 'Grand Bazaar, Blue Mosque, Hagia Sophia — where East meets West.', lat: 41.0082, lng: 28.9784, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop' },
  // ===== WORLD — Asia =====
  { id: 'w-tokyo', name: 'Tokyo', country: 'Japan', region: 'Asia', cost_index: 78, popularity: 95, description: 'Ultramodern meets traditional. Shibuya, temples, cherry blossoms, and sushi.', lat: 35.6762, lng: 139.6503, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
  { id: 'w-bali', name: 'Bali', country: 'Indonesia', region: 'Asia', cost_index: 35, popularity: 92, description: 'Tropical paradise with temples, rice terraces, and beautiful beaches.', lat: -8.3405, lng: 115.092, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop' },
  { id: 'w-bangkok', name: 'Bangkok', country: 'Thailand', region: 'Asia', cost_index: 30, popularity: 89, description: 'Ornate temples, street markets, and vibrant nightlife.', lat: 13.7563, lng: 100.5018, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop' },
  { id: 'w-singapore', name: 'Singapore', country: 'Singapore', region: 'Asia', cost_index: 83, popularity: 86, description: 'Garden city with Marina Bay Sands, hawker food, and futuristic gardens.', lat: 1.3521, lng: 103.8198, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop' },
  // ===== WORLD — Middle East & Africa =====
  { id: 'w-dubai', name: 'Dubai', country: 'UAE', region: 'Middle East', cost_index: 82, popularity: 90, description: 'Burj Khalifa, luxury malls, desert safari, and futuristic skyline.', lat: 25.2048, lng: 55.2708, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop' },
  { id: 'w-capetown', name: 'Cape Town', country: 'South Africa', region: 'Africa', cost_index: 38, popularity: 82, description: 'Table Mountain, stunning coastlines, and rich cultural heritage.', lat: -33.9249, lng: 18.4241, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop' },
  // ===== WORLD — Americas & Oceania =====
  { id: 'w-newyork', name: 'New York', country: 'USA', region: 'North America', cost_index: 90, popularity: 97, description: 'The Big Apple. Statue of Liberty, Times Square, Central Park.', lat: 40.7128, lng: -74.006, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
  { id: 'w-sydney', name: 'Sydney', country: 'Australia', region: 'Oceania', cost_index: 80, popularity: 88, description: 'Opera House, Harbour Bridge, Bondi Beach, and stunning coastal scenery.', lat: -33.8688, lng: 151.2093, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop' },
  { id: 'w-rio', name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', cost_index: 45, popularity: 85, description: 'Christ the Redeemer, Copacabana Beach, and Carnival.', lat: -22.9068, lng: -43.1729, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop' },
];

const ACTIVITY_TEMPLATES = [
  { type: 'Sightseeing', items: ['Walking City Tour', 'Landmark Visit', 'Museum Visit', 'Architecture Tour', 'Sunset Viewpoint', 'Historical Site Tour'] },
  { type: 'Food & Drink', items: ['Street Food Tour', 'Fine Dining Experience', 'Cooking Class', 'Food Market Visit', 'Chai & Snacks Trail', 'Local Café Crawl'] },
  { type: 'Adventure', items: ['Hiking Trail', 'River Rafting', 'Zip-lining', 'Kayaking', 'Cycling Tour', 'Paragliding'] },
  { type: 'Culture', items: ['Temple Visit', 'Traditional Show', 'Art Gallery', 'Festival Experience', 'Local Workshop', 'Heritage Walk'] },
  { type: 'Relaxation', items: ['Beach Day', 'Spa & Ayurveda', 'Garden Visit', 'Boat Cruise', 'Yoga Session', 'Meditation Retreat'] },
  { type: 'Shopping', items: ['Local Bazaar', 'Handicraft Shopping', 'Designer Boutiques', 'Night Market', 'Artisan Crafts', 'Spice Market'] },
];

const generateActivities = () => {
  const activities = [];
  // Costs in INR
  const costs = { Sightseeing: [200, 1500], 'Food & Drink': [300, 3000], Adventure: [800, 5000], Culture: [100, 1000], Relaxation: [500, 4000], Shopping: [0, 0] };
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

  // Clear old seed data if exists
  db.clearAll();

  CITIES.forEach(city => db.insert('cities', city));
  generateActivities().forEach(act => db.insert('activities', act));

  db.insert('users', {
    id: 'user-demo',
    name: 'Demo Traveler',
    email: 'demo@traveloop.com',
    password: 'Demo@123',
    avatar: '',
    preferences: { language: 'en', currency: 'INR' },
  });

  db.insert('trips', {
    id: 'trip-sample',
    user_id: 'user-demo',
    name: 'Golden Triangle India 2026',
    description: 'A 10-day journey through Delhi, Agra, and Jaipur — the iconic Golden Triangle of India.',
    start_date: '2026-07-01',
    end_date: '2026-07-10',
    cover_image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop',
    budget: 75000,
    status: 'planning',
  });

  db.insert('stops', { id: 'stop-1', trip_id: 'trip-sample', city_id: 'in-delhi', order: 1, arrival_date: '2026-07-01', departure_date: '2026-07-04' });
  db.insert('stops', { id: 'stop-2', trip_id: 'trip-sample', city_id: 'in-agra', order: 2, arrival_date: '2026-07-04', departure_date: '2026-07-07' });
  db.insert('stops', { id: 'stop-3', trip_id: 'trip-sample', city_id: 'in-jaipur', order: 3, arrival_date: '2026-07-07', departure_date: '2026-07-10' });

  db.insert('trip_activities', { id: 'ta-1', stop_id: 'stop-1', activity_id: 'act-in-delhi-Sightseeing-0', day: '2026-07-01', time_slot: '09:00', cost: 500 });
  db.insert('trip_activities', { id: 'ta-2', stop_id: 'stop-1', activity_id: 'act-in-delhi-Food & Drink-0', day: '2026-07-02', time_slot: '12:00', cost: 800 });
  db.insert('trip_activities', { id: 'ta-3', stop_id: 'stop-2', activity_id: 'act-in-agra-Culture-0', day: '2026-07-05', time_slot: '10:00', cost: 300 });

  ['Passport', 'Phone Charger', 'Travel Adapter', 'Sunscreen', 'Comfortable Walking Shoes', 'Rain Jacket', 'First Aid Kit', 'Camera'].forEach((name, i) => {
    const cats = ['Documents', 'Electronics', 'Electronics', 'Toiletries', 'Clothing', 'Clothing', 'Health', 'Electronics'];
    db.insert('packing_items', { trip_id: 'trip-sample', name, category: cats[i], is_packed: i < 3 });
  });

  db.insert('notes', { trip_id: 'trip-sample', stop_id: 'stop-1', title: 'Hotel Info', content: 'Hotel Connaught, New Delhi. Check-in: 2 PM, Room 305.' });
  db.insert('notes', { trip_id: 'trip-sample', stop_id: null, title: 'Emergency Contacts', content: 'Police: 100\nAmbulance: 108\nTravel Insurance: 1800-123-4567' });

  db.markSeeded();
  console.log('✅ Traveloop database seeded with Indian & world destinations');
};
