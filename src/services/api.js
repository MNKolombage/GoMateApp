// src/services/api.js
import axios from 'axios';

// TransportAPI configuration
// Sign up at https://developer.transportapi.com/ to get API keys
// Free tier provides 1000 requests per day

const TRANSPORT_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const TRANSPORT_APP_ID = 'YOUR_APP_ID_HERE'; // Replace with your actual app ID

const transportApi = axios.create({
  baseURL: 'https://transportapi.com/v3/uk',
  timeout: 10000,
  params: {
    app_id: TRANSPORT_APP_ID,
    app_key: TRANSPORT_API_KEY,
  }
});

// Fallback API for demo purposes when TransportAPI key is not configured
const demoApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 5000,
});

// Export the appropriate API instance
const api = TRANSPORT_API_KEY !== 'YOUR_API_KEY_HERE' ? transportApi : demoApi;

export default api;
export { demoApi, transportApi };

