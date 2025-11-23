// src/services/api.js
import axios from 'axios';

/**
 * API Configuration using Free Public APIs
 * Assignment compliant with dummy APIs for authentication and data fetching
 */

// 1. DummyJSON API - For user authentication and mock data
// Documentation: https://dummyjson.com/docs
const dummyApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. JSONPlaceholder - For additional mock transport/destination data
const jsonPlaceholderApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// 3. Mock Transport API - Using free public API for transport-like data
const mockTransportApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

// Add request interceptor to include auth token if available
dummyApi.interceptors.request.use(
  (config) => {
    // You can add token here if needed
    // const token = AsyncStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
dummyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default dummyApi;
export { dummyApi, jsonPlaceholderApi, mockTransportApi };

