import db from '../utils/database';

const STATES = [
  { id: 'st-delhi', name: 'Delhi', region: 'North', tagline: 'The Heart of India', image: '/images/st_delhi.jpg', places: ['Red Fort', 'Qutub Minar', 'India Gate', 'Lotus Temple', 'Humayun\'s Tomb'], food: ['Butter Chicken', 'Chhole Bhature', 'Aloo Chat', 'Paranthas', 'Nihari'] },
  { id: 'st-rajasthan', name: 'Rajasthan', region: 'North', tagline: 'Land of Kings', image: '/images/img-dest-rajasthan.jpg', places: ['Amer Fort', 'Hawa Mahal', 'City Palace Udaipur', 'Jaisalmer Fort', 'Pushkar Lake'], food: ['Dal Bati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri', 'Piyush'] },
  { id: 'st-kerala', name: 'Kerala', region: 'South', tagline: "God's Own Country", image: '/images/img-dest-kerala.jpg', places: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Wayanad', 'Varkala Beach', 'Athirappilly Falls'], food: ['Appam with Stew', 'Kerala Prawn Curry', 'Puttu and Kadala Curry', 'Sadhya', 'Fish Moilee'] },
  { id: 'st-himachal', name: 'Himachal Pradesh', region: 'North', tagline: 'The Himalayan Wonderland', image: '/images/img-dest-himachal.jpg', places: ['Rohtang Pass', 'Hadimba Temple', 'Spiti Valley', 'Dal Lake (Dharamshala)', 'Khajjiar'], food: ['Siddu', 'Madra', 'Dham', 'Thukpa', 'Babru'] },
  { id: 'st-tamilnadu', name: 'Tamil Nadu', region: 'South', tagline: 'Land of Temples', image: '/images/img-dest-tamil.jpg', places: ['Meenakshi Temple', 'Mahabalipuram', 'Ooty', 'Kanyakumari', 'Brihadisvara Temple'], food: ['Dosa', 'Idli', 'Sambar', 'Chettinad Chicken', 'Filter Coffee'] },
  { id: 'st-goa', name: 'Goa', region: 'West', tagline: 'Sun, Sand, and Serenity', image: '/images/img-dest-goa.jpg', places: ['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Fort Aguada', 'Anjuna Flea Market'], food: ['Fish Recheado', 'Bebinca', 'Pork Vindaloo', 'Feni', 'Prawn Balchao'] },
  { id: 'st-maharashtra', name: 'Maharashtra', region: 'West', tagline: 'Land of Warriors', image: '/images/st_maharashtra.jpg', places: ['Gateway of India', 'Ajanta & Ellora Caves', 'Mahabaleshwar', 'Lonavala', 'Shirdi'], food: ['Vada Pav', 'Misal Pav', 'Puran Poli', 'Pav Bhaji', 'Modak'] },
  { id: 'st-gujarat', name: 'Gujarat', region: 'West', tagline: 'Jewel of the West', image: '/images/st_gujarat.jpg', places: ['Rann of Kutch', 'Gir National Park', 'Somnath Temple', 'Statue of Unity', 'Dwarka'], food: ['Dhokla', 'Khandvi', 'Thepla', 'Undhiyu', 'Gujarati Thali'] },
  { id: 'st-uttarakhand', name: 'Uttarakhand', region: 'North', tagline: 'Devbhoomi - Land of Gods', image: '/images/img-dest-uttarakhand.jpg', places: ['Rishikesh', 'Mussoorie', 'Valley of Flowers', 'Nainital', 'Kedarnath'], food: ['Kafuli', 'Phanu', 'Baadi', 'Kandalee Ka Saag', 'Aloo ke Gutke'] },
  { id: 'st-karnataka', name: 'Karnataka', region: 'South', tagline: 'One State, Many Worlds', image: '/images/st_karnataka.jpg', places: ['Hampi', 'Mysore Palace', 'Coorg', 'Jog Falls', 'Gokarna'], food: ['Bisi Bele Bath', 'Mysore Pak', 'Ragi Mudde', 'Dharwad Peda', 'Neer Dosa'] },
  { id: 'st-westbengal', name: 'West Bengal', region: 'East', tagline: 'Beautiful Bengal', image: '/images/st_westbengal.jpg', places: ['Victoria Memorial', 'Darjeeling', 'Sundarbans', 'Howrah Bridge', 'Digha'], food: ['Kosha Mangsho', 'Rosogolla', 'Mishti Doi', 'Shorshe Ilish', 'Jhalmuri'] },
  { id: 'st-assam', name: 'Assam', region: 'Northeast', tagline: 'Land of the Red River', image: '/images/st_assam.jpg', places: ['Kaziranga National Park', 'Kamakhya Temple', 'Majuli Island', 'Tea Gardens', 'Haflong'], food: ['Masor Tenga', 'Duck Meat Curry', 'Pitha', 'Khar', 'Silk Worms'] },
  { id: 'st-ladakh', name: 'Ladakh', region: 'North', tagline: 'The Land of High Passes', image: '/images/st_ladakh.jpg', places: ['Pangong Lake', 'Nubra Valley', 'Leh Palace', 'Magnetic Hill', 'Zanskar Valley'], food: ['Skyu', 'Chutagi', 'Butter Tea', 'Khambir', 'Momos'] },
  { id: 'st-sikkim', name: 'Sikkim', region: 'Northeast', tagline: 'Small but Beautiful', image: '/images/st_sikkim.jpg', places: ['Tsomgo Lake', 'Nathula Pass', 'Pelling', 'Gurudongmar Lake', 'Rumtek Monastery'], food: ['Thukpa', 'Phagshapa', 'Gundruk', 'Sha Phaley', 'Sel Roti'] },
  { id: 'st-punjab', name: 'Punjab', region: 'North', tagline: 'Land of Five Rivers', image: '/images/st_punjab.jpg', places: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh', 'Rock Garden', 'Qila Mubarak'], food: ['Makki di Roti & Sarson da Saag', 'Dal Makhani', 'Amritsari Kulcha', 'Lassi', 'Tandoori Chicken'] },
  { id: 'st-telangana', name: 'Telangana', region: 'South', tagline: 'Land of Nawabs', image: '/images/st_telangana.jpg', places: ['Charminar', 'Golconda Fort', 'Ramoji Film City', 'Warangal Fort', 'Nagarjuna Sagar'], food: ['Hyderabadi Biryani', 'Haleem', 'Qubani ka Meetha', 'Irani Chai', 'Mirchi ka Salan'] },
];

const CITIES = [
  { id: 'in-delhi', name: 'Delhi', country: 'India', region: 'India — North', state: 'Delhi', cost_index: 45, popularity: 97, description: 'Capital city with Red Fort, Qutub Minar, India Gate, and vibrant street food culture of Chandni Chowk.', lat: 28.6139, lng: 77.209, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop' },
  { id: 'in-jaipur', name: 'Jaipur', country: 'India', region: 'India — North', state: 'Rajasthan', cost_index: 30, popularity: 95, description: 'The Pink City. Hawa Mahal, Amber Fort, City Palace, and royal Rajasthani heritage.', lat: 26.9124, lng: 75.7873, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop' },
  { id: 'in-agra', name: 'Agra', country: 'India', region: 'India — North', state: 'Uttar Pradesh', cost_index: 25, popularity: 96, description: 'Home of the Taj Mahal, Agra Fort, and Fatehpur Sikri — a UNESCO World Heritage marvel.', lat: 27.1767, lng: 78.0081, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop' },
  { id: 'in-varanasi', name: 'Varanasi', country: 'India', region: 'India — North', state: 'Uttar Pradesh', cost_index: 20, popularity: 93, description: 'Oldest living city. Sacred Ganges ghats, Kashi Vishwanath Temple, and evening Ganga Aarti.', lat: 25.3176, lng: 82.9739, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop' },
  { id: 'in-mumbai', name: 'Mumbai', country: 'India', region: 'India — West', state: 'Maharashtra', cost_index: 55, popularity: 96, description: 'City of Dreams. Gateway of India, Marine Drive, Bollywood, and iconic Vada Pav.', lat: 19.076, lng: 72.8777, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop' },
  { id: 'in-goa', name: 'Goa', country: 'India', region: 'India — West', state: 'Goa', cost_index: 35, popularity: 94, description: 'Beach paradise. Baga, Calangute, Old Goa churches, and vibrant nightlife.', lat: 15.2993, lng: 74.124, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop' },
  { id: 'in-bengaluru', name: 'Bengaluru', country: 'India', region: 'India — South', state: 'Karnataka', cost_index: 45, popularity: 88, description: 'Silicon Valley of India. Lalbagh, Cubbon Park, breweries, and IT hub.', lat: 12.9716, lng: 77.5946, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop' },
  { id: 'in-kochi', name: 'Kochi', country: 'India', region: 'India — South', state: 'Kerala', cost_index: 30, popularity: 87, description: 'Queen of the Arabian Sea. Chinese fishing nets, Fort Kochi, and spice markets.', lat: 9.9312, lng: 76.2673, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop' },
  { id: 'in-chennai', name: 'Chennai', country: 'India', region: 'India — South', state: 'Tamil Nadu', cost_index: 35, popularity: 85, description: 'Gateway to South India. Marina Beach, Kapaleeshwarar Temple, and Carnatic music.', lat: 13.0827, lng: 80.2707, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop' },
  { id: 'in-kolkata', name: 'Kolkata', country: 'India', region: 'India — East', state: 'West Bengal', cost_index: 28, popularity: 87, description: 'City of Joy. Victoria Memorial, Howrah Bridge, Durga Puja, and Bengali cuisine.', lat: 22.5726, lng: 88.3639, image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop' },
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
  const costs = { Sightseeing: [200, 1500], 'Food & Drink': [300, 3000], Adventure: [800, 5000], Culture: [100, 1000], Relaxation: [500, 4000], Shopping: [0, 0] };
  const durations = { Sightseeing: [1, 3], 'Food & Drink': [1, 2.5], Adventure: [2, 5], Culture: [1, 2], Relaxation: [2, 4], Shopping: [1, 3] };

  CITIES.forEach(city => {
    ACTIVITY_TEMPLATES.forEach(tmpl => {
      tmpl.items.slice(0, 3).forEach((name, i) => {
        const [minC, maxC] = costs[tmpl.type] || [100, 1000];
        const [minD, maxD] = durations[tmpl.type] || [1, 3];
        const costVal = Math.round(minC + Math.random() * (maxC - minC));
        const dur = +(minD + Math.random() * (maxD - minD)).toFixed(1);
        activities.push({
          id: `act-${city.id}-${tmpl.type}-${i}`,
          city_id: city.id,
          name: `${name} in ${city.name}`,
          type: tmpl.type,
          cost: costVal,
          duration: dur,
          description: `Experience ${name.toLowerCase()} in the heart of ${city.name}.`,
        });
      });
    });
  });
  return activities;
};

export const seedDatabase = () => {
  if (db.isSeeded()) return;

  db.clearAll();

  STATES.forEach(state => db.insert('states', state));
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
    name: 'South India Expedition',
    description: 'A grand tour across the southern states of India.',
    start_date: '2026-10-01',
    end_date: '2026-10-15',
    cover_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=400&fit=crop',
    budget: 150000,
    status: 'planning',
  });

  db.insert('trips', {
    id: 'trip-past',
    user_id: 'user-demo',
    name: 'Rajasthan Heritage Tour',
    description: 'A historical journey through the palaces and forts of Rajasthan.',
    start_date: '2024-12-10',
    end_date: '2024-12-20',
    cover_image: '/images/img-dest-rajasthan.jpg',
    budget: 80000,
    status: 'completed',
  });

  // Stops for past trip
  const st1 = { id: 'stop-p1', trip_id: 'trip-past', city_id: 'in-jaipur', arrival_date: '2024-12-10', departure_date: '2024-12-15' };
  const st2 = { id: 'stop-p2', trip_id: 'trip-past', city_id: 'in-agra', arrival_date: '2024-12-15', departure_date: '2024-12-20' };
  db.insert('stops', st1);
  db.insert('stops', st2);

  // Activities for past trip
  db.insert('trip_activities', { id: 'tact-p1', stop_id: 'stop-p1', activity_id: 'act-in-jaipur-Sightseeing-0', cost: 1500, date: '2024-12-11' });
  db.insert('trip_activities', { id: 'tact-p2', stop_id: 'stop-p1', activity_id: 'act-in-jaipur-Food & Drink-0', cost: 2500, date: '2024-12-12' });
  db.insert('trip_activities', { id: 'tact-p3', stop_id: 'stop-p2', activity_id: 'act-in-agra-Sightseeing-0', cost: 1200, date: '2024-12-16' });
  db.insert('trip_activities', { id: 'tact-p4', stop_id: 'stop-p2', activity_id: 'act-in-agra-Food & Drink-0', cost: 1800, date: '2024-12-17' });

  db.markSeeded();
  console.log('✅ Traveloop database seeded with Indian States & Cities');
};
