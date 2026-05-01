import axios from 'axios';

// Vite uses import.meta.env instead of process.env
// Fallback to localhost if environment variable not set
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Configured axios instance with base URL and default headers
 * @constant
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout for requests
});

/**
 * Request interceptor to automatically add authentication token
 * Runs before each request is sent
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors globally
 * Processes responses and handles authentication failures
 */
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle request timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      window.location.href = '/login?error=timeout';
    }
    
    // Handle unauthorized errors (401) - token expired or invalid
    if (error.response?.status === 401) {
      // Clear stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Log server errors (500+) for debugging
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic GET request wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} Response data
 */
export const get = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

/**
 * Generic POST request wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise<any>} Response data
 */
export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

/**
 * Generic PUT request wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise<any>} Response data
 */
export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

/**
 * Generic DELETE request wrapper with error handling
 * @param {string} url - API endpoint
 * @returns {Promise<any>} Response data
 */
export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

/**
 * Generic PATCH request wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload
 * @returns {Promise<any>} Response data
 */
export const patch = async (url, data = {}) => {
  try {
    const response = await api.patch(url, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error occurred' };
  }
};

export default api;