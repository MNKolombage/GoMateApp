// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyApi } from './api';

/**
 * Authentication Service using DummyJSON API
 * Documentation: https://dummyjson.com/docs/auth
 * 
 * Test Users Available:
 * - Username: emilys, Password: emilyspass
 * - Username: michaelw, Password: michaelwpass
 * - See more at: https://dummyjson.com/users
 */

/**
 * Login user using DummyJSON API
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} User data with token
 */
export const loginUser = async (username, password) => {
  try {
    const response = await dummyApi.post('/auth/login', {
      username,
      password,
      expiresInMins: 30, // Token expires in 30 minutes
    });

    // Store token and user data
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));
    }

    return {
      success: true,
      user: response.data,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid username or password'
    };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return null;

    const response = await dummyApi.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get current user error:', error.message);
    return null;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} New token data
 */
export const refreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return null;

    const response = await dummyApi.post('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return null;
  }
};

/**
 * Register new user (simulated - DummyJSON doesn't support real registration)
 * In production, this would call a real registration endpoint
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export const registerUser = async (userData) => {
  try {
    // DummyJSON doesn't have a real registration endpoint
    // So we'll simulate it by storing locally and using a test user for API calls
    const simulatedUser = {
      id: Date.now(),
      username: userData.email.split('@')[0],
      email: userData.email,
      firstName: userData.name.split(' ')[0] || userData.name,
      lastName: userData.name.split(' ')[1] || '',
      city: userData.city || '',
      image: 'https://dummyjson.com/icon/emilys/128',
    };

    // Store user data locally
    await AsyncStorage.setItem(`user_${userData.email}`, JSON.stringify(simulatedUser));
    await AsyncStorage.setItem('registeredUser', JSON.stringify(simulatedUser));

    return {
      success: true,
      user: simulatedUser,
      message: 'Registration successful. You can now login.'
    };
  } catch (error) {
    console.error('Registration error:', error.message);
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

/**
 * Logout user
 * @returns {Promise<boolean>} Logout success
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Logout error:', error.message);
    return false;
  }
};

/**
 * Get all users from DummyJSON (for testing/demo purposes)
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async () => {
  try {
    const response = await dummyApi.get('/users?limit=10');
    return response.data.users;
  } catch (error) {
    console.error('Get users error:', error.message);
    return [];
  }
};
