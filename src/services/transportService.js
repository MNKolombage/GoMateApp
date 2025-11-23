// src/services/transportService.js
import { dummyApi } from './api';

/**
 * Transport Service using Free Public APIs
 * Using DummyJSON and JSONPlaceholder as recommended in assignment
 * Documentation: 
 * - https://dummyjson.com/docs
 * - https://jsonplaceholder.typicode.com/
 */

/**
 * Fetch transport routes from DummyJSON Products API
 * Maps products to transport routes for demo purposes
 */
export const getRoutes = async () => {
  try {
    // Using DummyJSON products API as mock transport data
    const response = await dummyApi.get('/products?limit=12&select=title,description,price,thumbnail,category');
    
    // Transform products into transport routes
    const routes = response.data.products.map((product, index) => {
      const types = ['train', 'bus', 'ferry'];
      const cities = [
        { from: 'Colombo Fort', to: 'Galle Fort' },
        { from: 'Colombo', to: 'Kandy City' },
        { from: 'Bandaranaike Airport', to: 'Colombo Fort' },
        { from: 'Pettah', to: 'Negombo Beach' },
        { from: 'Colombo Fort', to: 'Badulla' },
        { from: 'Colombo', to: 'Jaffna' },
        { from: 'Ella Town', to: 'Nuwara Eliya' },
        { from: 'Colombo', to: 'Bentota' },
        { from: 'Kandy', to: 'Nuwara Eliya' },
        { from: 'Trincomalee', to: 'Pigeon Island' },
        { from: 'Colombo', to: 'Anuradhapura' },
        { from: 'Galle', to: 'Mirissa' },
      ];
      
      const route = cities[index % cities.length];
      
      return {
        id: product.id,
        routeNumber: `${100 + product.id}`,
        name: `${route.from} - ${route.to} Express`,
        from: route.from,
        to: route.to,
        schedule: index % 2 === 0 ? 'Every 30 min' : 'Every 45 min',
        status: 'Active',
        price: `Rs. ${Math.round(product.price * 10)}`,
        thumbnail: product.thumbnail,
        operator: index % 3 === 0 ? 'Sri Lanka Railways' : 'SLTB',
        type: types[index % 3],
        description: product.description || 'Comfortable journey with scenic views along the route.'
      };
    });
    
    return routes;
  } catch (error) {
    console.error('Error fetching routes from API:', error.message);
    // Fallback to demo data if API fails
    return getDemoRoutes();
  }
};

/**
 * Fetch tourist destinations - Using demo data with actual Sri Lankan images
 * API integration available but demo data has better matching images
 */
export const getDestinations = async () => {
  // Using demo data for better image accuracy
  // DummyJSON products don't have Sri Lankan destination images
  return getDemoDestinations();
};

/**
 * Get bus stops near a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (max 5000)
 */
export const getNearbyStops = async (lat = 51.5074, lon = -0.1278, radius = 1000) => {
  try {
    if (isUsingTransportAPI()) {
      const response = await transportApi.get('/places.json', {
        params: {
          lat,
          lon,
          type: 'bus_stop,train_station',
          radius,
        }
      });
      return response.data.member || [];
    } else {
      // Demo fallback data
      return [
        { name: 'Central Station', distance: 150, type: 'train_station' },
        { name: 'Main Street Bus Stop', distance: 300, type: 'bus_stop' },
        { name: 'City Center Terminal', distance: 500, type: 'bus_stop' },
      ];
    }
  } catch (error) {
    console.error('Error fetching nearby stops:', error);
    return [];
  }
};

/**
 * Get live bus departures from a stop
 * @param {string} atcocode - ATCO code of the bus stop
 */
export const getLiveBusDepartures = async (atcocode = '490000235W') => {
  try {
    if (isUsingTransportAPI()) {
      const response = await transportApi.get(`/uk/bus/stop/${atcocode}/live.json`);
      return response.data.departures?.all || [];
    } else {
      // Demo fallback data
      return [
        { 
          line: '24', 
          direction: 'City Center', 
          aimed_departure_time: '10:30',
          expected_departure_time: '10:32',
          operator: 'City Transport'
        },
        { 
          line: '156', 
          direction: 'Airport', 
          aimed_departure_time: '10:45',
          expected_departure_time: '10:45',
          operator: 'Express Lines'
        },
      ];
    }
  } catch (error) {
    console.error('Error fetching live departures:', error);
    return [];
  }
};

/**
 * Get train station departures
 * @param {string} stationCode - CRS code of train station (e.g., 'PAD' for Paddington)
 */
export const getTrainDepartures = async (stationCode = 'PAD') => {
  try {
    if (isUsingTransportAPI()) {
      const response = await transportApi.get(`/uk/train/station/${stationCode}/live.json`);
      return response.data.departures?.all || [];
    } else {
      // Demo fallback data
      return [
        {
          destination_name: 'Reading',
          aimed_departure_time: '11:00',
          expected_departure_time: '11:05',
          platform: '3',
          operator_name: 'Great Western Railway'
        },
        {
          destination_name: 'Oxford',
          aimed_departure_time: '11:15',
          expected_departure_time: '11:15',
          platform: '5',
          operator_name: 'Great Western Railway'
        },
      ];
    }
  } catch (error) {
    console.error('Error fetching train departures:', error);
    return [];
  }
};

/**
 * Get journey planner results
 * @param {string} from - Origin (postcode or place name)
 * @param {string} to - Destination (postcode or place name)
 */
export const planJourney = async (from, to) => {
  try {
    if (isUsingTransportAPI()) {
      const response = await transportApi.get('/uk/public/journey/from', {
        params: {
          from,
          to,
          modes: 'bus-train-tube-coach',
        }
      });
      return response.data.routes || [];
    } else {
      // Demo fallback data
      return [
        {
          duration: 45,
          route_parts: [
            { mode: 'bus', line_name: '24', from_point_name: 'City Center', to_point_name: 'Central Station' },
            { mode: 'train', line_name: 'Express', from_point_name: 'Central Station', to_point_name: 'Airport' }
          ]
        }
      ];
    }
  } catch (error) {
    console.error('Error planning journey:', error);
    return [];
  }
};

/**
 * Generate demo transport routes for fallback - Sri Lankan Routes
 */
export const getDemoRoutes = () => {
  return [
    { 
      id: 1, 
      routeNumber: '138', 
      name: 'Colombo - Galle Express', 
      from: 'Fort Railway Station', 
      to: 'Galle Fort', 
      schedule: 'Every 30 min', 
      status: 'Active', 
      price: 'Rs. 250', 
      thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
      operator: 'Sri Lanka Railways',
      type: 'train',
      description: 'Scenic coastal railway journey from Colombo to Galle with stunning ocean views along the Southern coast.'
    },
    { 
      id: 2, 
      routeNumber: '187', 
      name: 'Colombo - Kandy Intercity', 
      from: 'Colombo Fort', 
      to: 'Kandy City', 
      schedule: 'Every 45 min', 
      status: 'Active', 
      price: 'Rs. 300', 
      thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
      operator: 'Sri Lanka Transport Board (SLTB)',
      type: 'bus',
      description: 'Air-conditioned express bus service through hill country connecting the commercial capital to the cultural capital.'
    },
    { 
      id: 3, 
      routeNumber: '245', 
      name: 'Airport Express Highway', 
      from: 'Bandaranaike International Airport', 
      to: 'Colombo Fort', 
      schedule: 'Every 20 min', 
      status: 'Active', 
      price: 'Rs. 150', 
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      operator: 'Airport Express Services',
      type: 'bus',
      description: 'Direct highway express service from BIA to Colombo city center via Katunayake Expressway.'
    },
    { 
      id: 4, 
      routeNumber: '99', 
      name: 'Colombo - Negombo Coastal', 
      from: 'Pettah Central Bus Stand', 
      to: 'Negombo Beach', 
      schedule: 'Every 15 min', 
      status: 'Active', 
      price: 'Rs. 80', 
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      operator: 'Western Provincial Transport',
      type: 'bus',
      description: 'Popular route to Negombo fishing town and beaches. Frequent service throughout the day.'
    },
    { 
      id: 5, 
      routeNumber: 'UP1', 
      name: 'Udarata Menike', 
      from: 'Colombo Fort', 
      to: 'Badulla', 
      schedule: 'Daily at 8:55 AM', 
      status: 'Active', 
      price: 'Rs. 450', 
      thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
      operator: 'Sri Lanka Railways',
      type: 'train',
      description: 'One of the most scenic train journeys in the world through tea plantations and misty mountains.'
    },
    { 
      id: 6, 
      routeNumber: '1-1', 
      name: 'Colombo - Jaffna A9 Express', 
      from: 'Colombo Bastian Mawatha', 
      to: 'Jaffna Bus Terminal', 
      schedule: 'Every 2 hours', 
      status: 'Active', 
      price: 'Rs. 800', 
      thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
      operator: 'NTC Luxury Express',
      type: 'bus',
      description: 'Long-distance luxury coach service to the Northern Province via A9 highway.'
    },
    { 
      id: 7, 
      routeNumber: '2', 
      name: 'Colombo - Anuradhapura', 
      from: 'Colombo Fort', 
      to: 'Anuradhapura New Town', 
      schedule: 'Every hour', 
      status: 'Active', 
      price: 'Rs. 450', 
      thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
      operator: 'SLTB Intercity',
      type: 'bus',
      description: 'Direct service to the ancient city of Anuradhapura, a UNESCO World Heritage Site.'
    },
    { 
      id: 8, 
      routeNumber: 'ELA1', 
      name: 'Ella - Nuwara Eliya Scenic', 
      from: 'Ella Town', 
      to: 'Nuwara Eliya', 
      schedule: 'Every 90 min', 
      status: 'Active', 
      price: 'Rs. 120', 
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      operator: 'Upcountry Transport',
      type: 'bus',
      description: 'Breathtaking journey through tea estates connecting two popular hill country destinations.'
    },
    { 
      id: 9, 
      routeNumber: '177', 
      name: 'Colombo - Bentota Beach', 
      from: 'Colombo Fort', 
      to: 'Bentota Station', 
      schedule: 'Every 25 min', 
      status: 'Active', 
      price: 'Rs. 180', 
      thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400',
      operator: 'Sri Lanka Railways',
      type: 'train',
      description: 'Coastal railway to popular beach resort town of Bentota on the Southern coast.'
    },
    { 
      id: 10, 
      routeNumber: '355', 
      name: 'Kandy - Nuwara Eliya', 
      from: 'Kandy Bus Stand', 
      to: 'Nuwara Eliya Town', 
      schedule: 'Every 30 min', 
      status: 'Active', 
      price: 'Rs. 150', 
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      operator: 'Hill Country Transport',
      type: 'bus',
      description: 'Winding mountain route through tea country to Little England of Sri Lanka.'
    },
    { 
      id: 11, 
      routeNumber: 'F-101', 
      name: 'Colombo - Jaffna Ferry', 
      from: 'Colombo Port', 
      to: 'Jaffna KKS Harbor', 
      schedule: 'Daily at 11:00 PM', 
      status: 'Active', 
      price: 'Rs. 2,500', 
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      operator: 'Ceylon Shipping Corporation',
      type: 'Ferry',
      description: 'Overnight ferry service connecting Colombo to the Northern Peninsula with comfortable cabin options.'
    },
    { 
      id: 12, 
      routeNumber: 'F-55', 
      name: 'Trincomalee Island Hopper', 
      from: 'Trincomalee Harbor', 
      to: 'Pigeon Island', 
      schedule: 'Every 2 hours', 
      status: 'Active', 
      price: 'Rs. 500', 
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      operator: 'East Coast Marine Services',
      type: 'Ferry',
      description: 'Short ferry ride to the pristine Pigeon Island National Park, perfect for snorkeling and diving.'
    },
  ];
};

/**
 * Generate demo destinations for fallback - Sri Lankan Tourist Destinations
 */
export const getDemoDestinations = () => {
  return [
    { 
      id: 1001, 
      name: 'Sigiriya Rock Fortress', 
      description: 'Ancient rock fortress and palace ruins built by King Kashyapa in the 5th century. UNESCO World Heritage Site featuring stunning frescoes, the Mirror Wall, and breathtaking 360° views from the summit. A must-visit archaeological wonder.',
      category: 'Historical', 
      rating: '4.9', 
      distance: '169 km from Colombo',
      hours: '7:00 AM - 5:30 PM',
      accessibility: 'Challenging climb (1,200 steps)',
      thumbnail: 'https://www.lovidhu.com/uploads/posts/2021/03//sigiria-sri-lanka-945x630.jpg'
    },
    { 
      id: 1002, 
      name: 'Temple of the Tooth (Sri Dalada Maligawa)', 
      description: 'Sacred Buddhist temple in Kandy housing the relic of the tooth of Buddha. UNESCO World Heritage Site and one of the most venerated places of worship in the Buddhist world. Daily pooja ceremonies at 5:30 AM, 9:30 AM, and 6:30 PM.',
      category: 'Religious', 
      rating: '4.8', 
      distance: '115 km from Colombo',
      hours: '5:30 AM - 8:00 PM',
      accessibility: 'Fully accessible',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT32SCzWjoRExhCTaAgsFlflHmGxRfLXemzw&s'
    },
    { 
      id: 1003, 
      name: 'Galle Fort', 
      description: 'Magnificent 16th-century Portuguese fort, later fortified by the Dutch. UNESCO World Heritage Site with cobblestone streets, colonial buildings, boutique hotels, cafes, and art galleries. Perfect for sunset walks along the ramparts.',
      category: 'Historical', 
      rating: '4.7', 
      distance: '119 km from Colombo',
      hours: 'Open 24 hours',
      accessibility: 'Mostly accessible',
      thumbnail: 'https://media.istockphoto.com/id/2133225433/photo/clock-tower-of-dutch-fort-galle-sri-lanka.jpg?s=612x612&w=0&k=20&c=L4eNQ_wGNLQW7QFLMefgAAjuljkE5T6cqSMvn8tddyE='
    },
    { 
      id: 1004, 
      name: 'Yala National Park', 
      description: 'Premier wildlife safari destination famous for having one of the highest leopard densities in the world. Home to elephants, sloth bears, crocodiles, and over 200 bird species. Best visited February to July.',
      category: 'Nature', 
      rating: '4.6', 
      distance: '265 km from Colombo',
      hours: '6:00 AM - 6:00 PM (Safari times)',
      accessibility: 'Safari vehicle required',
      thumbnail: 'https://srilankatravelpages.com/my_content/uploads/2025/02/How-to-Reach-Yala-National-Park.jpg'
    },
    { 
      id: 1005, 
      name: 'Mirissa Beach', 
      description: 'Stunning crescent-shaped beach on the South coast, famous for whale watching (November to April), surfing, and vibrant nightlife. Crystal-clear waters perfect for swimming and snorkeling. Fresh seafood restaurants along the shore.',
      category: 'Beach', 
      rating: '4.7', 
      distance: '150 km from Colombo',
      hours: 'Open 24 hours',
      accessibility: 'Beach accessible',
      thumbnail: 'https://destinationlesstravel.com/wp-content/uploads/2021/10/Bailey-at-Parrot-Rock-in-Mirissa-Sri-Lanka.jpg.webp'
    },
    { 
      id: 1006, 
      name: 'Horton Plains National Park', 
      description: 'High-altitude plateau at 2,100-2,300m featuring World\'s End viewpoint with a sheer 880m drop, Baker\'s Falls, and unique cloud forest ecosystem. UNESCO World Heritage Site. Early morning visits recommended for clear views.',
      category: 'Nature', 
      rating: '4.8', 
      distance: '180 km from Colombo',
      hours: '6:00 AM - 6:00 PM',
      accessibility: 'Moderate hiking required',
      thumbnail: 'https://besttimetovisitsrilanka.com/wp-content/uploads/2021/04/Hiking-Through-Horton-Plains.jpg'
    },
    { 
      id: 1007, 
      name: 'Ella Rock & Nine Arch Bridge', 
      description: 'Charming hill country town surrounded by tea plantations. Famous for Ella Rock hiking trail, iconic Nine Arch Bridge (best at 9 AM & 12 PM for trains), Little Adam\'s Peak, and Ravana Falls. Cool climate and stunning valley views.',
      category: 'Mountain', 
      rating: '4.9', 
      distance: '200 km from Colombo',
      hours: 'Open 24 hours (trails close at dusk)',
      accessibility: 'Hiking trails - moderate difficulty',
      thumbnail: 'https://d1ynolcus8dvgv.cloudfront.net/2019/01/nine-arch-2-5.jpg'
    },
    { 
      id: 1008, 
      name: 'Pinnawala Elephant Orphanage', 
      description: 'Conservation center caring for orphaned and injured elephants. Watch elephants bathing in the river (10 AM & 2 PM daily), feeding sessions, and baby elephants playing. Home to over 80 elephants across three generations.',
      category: 'Nature', 
      rating: '4.5', 
      distance: '90 km from Colombo',
      hours: '8:30 AM - 5:30 PM',
      accessibility: 'Fully accessible',
      thumbnail: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/5b/ae/47/the-orphanage-was-founded.jpg?w=900&h=500&s=1'
    },
    { 
      id: 1009, 
      name: 'Arugam Bay', 
      description: 'World-renowned surfing destination on the East coast. Consistent waves from April to October attract surfers globally. Relaxed beach vibe, yoga retreats, and nearby wildlife safaris. Named one of the top 10 surf points in the world.',
      category: 'Beach', 
      rating: '4.6', 
      distance: '320 km from Colombo',
      hours: 'Open 24 hours',
      accessibility: 'Beach accessible',
      thumbnail: 'https://tuktukrental.com/wp-content/uploads/2025/03/ARUGAM-BAY-1-1-1024x576.jpg.webp'
    },
    { 
      id: 1010, 
      name: 'Adam\'s Peak (Sri Pada)', 
      description: 'Sacred 2,243m mountain with a distinctive conical shape. Pilgrimage site for multiple religions. Famous for the "Sri Pada" (sacred footprint) at the summit. Night climb tradition to reach peak for sunrise. Season: December to May.',
      category: 'Mountain', 
      rating: '4.8', 
      distance: '130 km from Colombo',
      hours: 'Open 24 hours (climbing season Dec-May)',
      accessibility: 'Challenging - 5,500 steps',
      thumbnail: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/9d/cc/c2.jpg'
    },
  ];
};
