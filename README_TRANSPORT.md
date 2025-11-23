# GoMate - Travel & Transport App

A React Native mobile application for viewing public transport schedules and exploring destinations.

## Features

- **Transport Routes**: Browse bus, train, and ferry routes with real-time schedules
- **Destinations**: Explore tourist destinations with ratings and distances
- **Favorites**: Save your favorite routes and destinations
- **User Authentication**: Login and registration with Redux state management
- **Pull to Refresh**: Update transport data with a simple pull gesture

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure TransportAPI (Optional)

This app is configured to work with [TransportAPI](https://developer.transportapi.com/) for real transport data.

#### To get API credentials:

1. Visit [https://developer.transportapi.com/](https://developer.transportapi.com/)
2. Sign up for a free account (1000 requests/day)
3. Get your `app_id` and `app_key`
4. Open `src/services/api.js`
5. Replace the placeholder values:
   ```javascript
   const TRANSPORT_API_KEY = "your_actual_api_key";
   const TRANSPORT_APP_ID = "your_actual_app_id";
   ```

**Note**: The app works with demo data if you don't configure the API keys.

### 3. Run the App

```bash
npx expo start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## Project Structure

```
src/
├── screens/
│   ├── HomeScreen.js          # Main screen with routes/destinations
│   ├── DetailsScreen.js       # Detailed view of route/destination
│   ├── FavouritesScreen.js    # Saved favorites
│   ├── ProfileScreen.js       # User profile
│   ├── LoginScreen.js         # Authentication
│   └── RegisterScreen.js      # User registration
├── services/
│   ├── api.js                 # API configuration
│   └── transportService.js    # TransportAPI helper functions
├── redux/
│   ├── store.js              # Redux store
│   └── slices/
│       ├── authSlice.js      # Authentication state
│       ├── favouritesSlice.js # Favorites state
│       └── themeSlice.js     # Theme state
├── navigation/
│   └── index.js              # Navigation configuration
└── AppBootstrap.js           # App initialization

```

## TransportAPI Integration

The app includes helper functions for TransportAPI in `src/services/transportService.js`:

- `getNearbyStops(lat, lon, radius)` - Find bus stops and train stations
- `getLiveBusDepartures(atcocode)` - Get real-time bus departures
- `getTrainDepartures(stationCode)` - Get train station departures
- `planJourney(from, to)` - Plan multi-modal journeys

### Example Usage:

```javascript
import { getLiveBusDepartures } from "../services/transportService";

const departures = await getLiveBusDepartures("490000235W");
```

## Demo Data

Without API keys, the app uses demo data with:

- 6 sample transport routes (buses, shuttles, ferry)
- 6 sample destinations (beaches, mountains, historical sites)

## Technologies Used

- React Native with Expo
- React Navigation for routing
- Redux Toolkit for state management
- Axios for API requests
- AsyncStorage for data persistence
- Formik & Yup for form validation

## Assignment Requirements Met

✅ User Authentication (login/register with React Hooks)  
✅ Navigation Structure (Stack & Bottom Tab navigation)  
✅ Home Screen (Dynamic item list from API)  
✅ Item Interaction (Details screen with state management)  
✅ Favorites (Mark items as favorites with Redux)  
✅ Styling & UI (Consistent design with Feather/Ionicons)  
✅ API Integration (TransportAPI.com for travel data)

## Development

- Domain: **Travel & Transport**
- App Theme: **GoMate** - View public transport schedules & explore destinations
- Index Number: 224108R

## License

This project is for educational purposes (IN3210 Mobile Applications Development - Assignment 2).
