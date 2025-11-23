# GoMate - Travel & Transport App

A React Native mobile application for viewing public transport schedules and exploring destinations with **real API integration**.

## Features

- **Transport Routes**: Browse bus, train, and ferry routes with search and sorting
- **Destinations**: Explore tourist destinations with ratings and distances
- **Favorites**: Save your favorite routes and destinations
- **User Authentication**: Login with DummyJSON API or register locally
- **Dark Mode**: Full dark mode support across all screens
- **Pull to Refresh**: Update transport data from APIs with a simple pull gesture
- **API Integration**: Uses free public APIs (DummyJSON & JSONPlaceholder)

## API Integration ✅

This app uses **free dummy APIs** as per assignment requirements:

### 1. Authentication API - DummyJSON

- **URL:** https://dummyjson.com/docs/auth
- **Usage:** User login, token management, user data
- **Test Credentials:**
  - Username: `emilys` | Password: `emilyspass`
  - Username: `michaelw` | Password: `michaelwpass`

### 2. Data Fetching APIs

- **DummyJSON Products:** For transport routes (https://dummyjson.com/products)
- **JSONPlaceholder Photos:** For destinations (https://jsonplaceholder.typicode.com/photos)

### 3. Fallback Mechanism

- If APIs are unavailable, app uses demo data automatically
- No configuration needed - works out of the box!

**📖 See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API information**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App

```bash
npx expo start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

### 3. Test the App

#### Login with DummyJSON API:

- Username: `emilys`
- Password: `emilyspass`

Or register a new account locally!

#### Browse Data:

- Routes are fetched from DummyJSON Products API
- Destinations are fetched from JSONPlaceholder Photos API
- Pull down to refresh and fetch new data

**No API keys needed!** All APIs are free and public.

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

The app now uses **free public dummy APIs** instead of TransportAPI to comply with assignment requirements:

### Current API Implementation:

- **Authentication:** DummyJSON Auth API (https://dummyjson.com/docs/auth)
- **Transport Routes:** DummyJSON Products API (transformed into routes)
- **Destinations:** JSONPlaceholder Photos API (transformed into destinations)

### How it works:

1. **Login:** Real API authentication via DummyJSON
2. **Data Fetching:** Routes and destinations fetched from public APIs
3. **Fallback:** If APIs fail, app uses local demo data
4. **No Setup Required:** All APIs are free and don't need API keys

### API Service Files:

- `src/services/api.js` - Axios configuration for all APIs
- `src/services/authService.js` - Authentication methods using DummyJSON
- `src/services/transportService.js` - Data fetching with API integration

See `API_DOCUMENTATION.md` for detailed API usage and endpoints.

## Technologies Used

- React Native with Expo
- React Navigation for routing
- Redux Toolkit for state management
- Axios for API requests
- AsyncStorage for data persistence
- Formik & Yup for form validation

## Assignment Requirements Met

✅ **User Authentication** (DummyJSON API - login/register with React Hooks)  
✅ **API Integration** (DummyJSON & JSONPlaceholder for data fetching)  
✅ **Navigation Structure** (Stack & Bottom Tab navigation)  
✅ **Home Screen** (Dynamic item list from API with search & sort)  
✅ **Item Interaction** (Details screen with state management)  
✅ **Favorites** (Mark items as favorites with Redux)  
✅ **Styling & UI** (Consistent design with dark mode support)  
✅ **Dummy APIs** (Free public APIs - no keys required)  
✅ **Error Handling** (Fallback to demo data if APIs fail)

### APIs Used (Assignment Compliant):

- **DummyJSON** (https://dummyjson.com) - Authentication & mock transport data
- **JSONPlaceholder** (https://jsonplaceholder.typicode.com) - Mock destination data
- **No API Keys Required** - All free, public APIs

## Development

- Domain: **Travel & Transport**
- App Theme: **GoMate** - View public transport schedules & explore destinations
- Index Number: 224108R

## License

This project is for educational purposes (IN3210 Mobile Applications Development - Assignment 2).
