# API Documentation - GoMate App

## Assignment Compliance

This app uses **free dummy APIs** as required by the assignment guidelines, specifically using:

- **DummyJSON** (https://dummyjson.com/docs) - For authentication and mock data
- **JSONPlaceholder** (https://jsonplaceholder.typicode.com/) - For additional mock data

## APIs Used

### 1. Authentication API - DummyJSON

**Base URL:** `https://dummyjson.com`

#### Login Endpoint

- **URL:** `/auth/login`
- **Method:** POST
- **Body:**
  ```json
  {
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 30
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    ...
  }
  ```

#### Test Credentials (from DummyJSON)

| Username | Password     | Description      |
| -------- | ------------ | ---------------- |
| emilys   | emilyspass   | Emily Johnson    |
| michaelw | michaelwpass | Michael Williams |
| sophiab  | sophiabpass  | Sophia Brown     |
| jamesd   | jamesdpass   | James Davis      |

**Full list:** https://dummyjson.com/users

#### Get Current User

- **URL:** `/auth/me`
- **Method:** GET
- **Headers:** `Authorization: Bearer {token}`

#### Refresh Token

- **URL:** `/auth/refresh`
- **Method:** POST
- **Headers:** `Authorization: Bearer {token}`

### 2. Transport Routes API - DummyJSON Products

**Base URL:** `https://dummyjson.com`

#### Get Routes

- **URL:** `/products?limit=12&select=title,description,price,thumbnail,category`
- **Method:** GET
- **Description:** Fetches products and transforms them into transport routes
- **Mapping:**
  - Product title → Route name
  - Product price → Route price (multiplied by 10 for Rs.)
  - Product thumbnail → Route thumbnail
  - Product description → Route description

### 3. Destinations API - JSONPlaceholder

**Base URL:** `https://jsonplaceholder.typicode.com`

#### Get Destinations

- **URL:** `/photos?_limit=10`
- **Method:** GET
- **Description:** Fetches photos and transforms them into tourist destinations
- **Mapping:**
  - Photo title → Destination description
  - Photo URL → Destination thumbnail
  - Index → Destination name (from predefined Sri Lankan locations)

## Implementation Details

### File Structure

```
src/
├── services/
│   ├── api.js              # Axios instances for all APIs
│   ├── authService.js      # Authentication methods using DummyJSON
│   └── transportService.js # Transport & destination data fetching
├── screens/
│   ├── LoginScreen.js      # Uses authService for login
│   ├── RegisterScreen.js   # Local registration (simulated)
│   └── HomeScreen.js       # Fetches routes & destinations from APIs
```

### API Service (api.js)

```javascript
// DummyJSON API for authentication
const dummyApi = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

// JSONPlaceholder for mock data
const jsonPlaceholderApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});
```

### Authentication Flow

1. User enters username/password in LoginScreen
2. App calls `loginUser(username, password)` from authService
3. authService makes POST request to DummyJSON `/auth/login`
4. On success: Store token and user data in AsyncStorage
5. On failure: Check local registered users or show error
6. Redux state updated with user information

### Data Fetching Flow

1. HomeScreen loads and calls `getRoutes()` and `getDestinations()`
2. Functions attempt to fetch from APIs (DummyJSON Products, JSONPlaceholder Photos)
3. Data is transformed to match app's data structure
4. If API fails: Fallback to demo data (getDemoRoutes/getDemoDestinations)
5. Data displayed with search, sort, and filter capabilities

## Fallback Strategy

The app implements a robust fallback mechanism:

1. **Primary:** Try to fetch from public APIs
2. **Secondary:** If API fails, use demo data stored locally
3. **Tertiary:** For auth, check locally registered users

This ensures the app works even without internet or if APIs are down.

## API Error Handling

- Network timeouts after 10 seconds
- Graceful degradation to demo data
- User-friendly error messages
- Console logging for debugging

## Testing the APIs

### Test Login

```javascript
// In LoginScreen, use these credentials:
Username: emilys;
Password: emilyspass;
```

### Test Data Fetching

```javascript
// Data automatically loads on HomeScreen mount
// Pull to refresh to re-fetch from APIs
```

### Verify API Calls

Check browser console/network tab or use React Native Debugger to see:

- POST request to `https://dummyjson.com/auth/login`
- GET request to `https://dummyjson.com/products?limit=12`
- GET request to `https://jsonplaceholder.typicode.com/photos?_limit=10`

## Assignment Requirements Met ✅

- ✅ Uses free public APIs (DummyJSON, JSONPlaceholder)
- ✅ Authentication via API (DummyJSON auth endpoints)
- ✅ Data fetching from APIs (Products for routes, Photos for destinations)
- ✅ Proper error handling and fallback mechanisms
- ✅ API documentation provided
- ✅ No API keys required (all free, no-auth APIs)
- ✅ Works offline with demo data fallback

## Future Enhancements

- Integrate Transport API UK for real transport data
- Add caching mechanism (React Query/SWR)
- Implement pagination for large datasets
- Add more sophisticated error retry logic
