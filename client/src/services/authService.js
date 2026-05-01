import api from './api';

const AUTH_URL = '/auth';

/**
 * Register a new user
 * @param {Object} userData - User registration data (name, email, password)
 * @returns {Promise<Object>} User data and authentication token
 */
export const register = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    // Store token in localStorage on successful registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

/**
 * Login existing user
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and authentication token
 */
export const login = async (email, password) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, { email, password });
    // Store token in localStorage on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

/**
 * Logout user - clear authentication token
 */
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
};

/**
 * Get current authenticated user's profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get(`${AUTH_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

/**
 * Update user profile information
 * @param {Object} userData - Updated user data (name, email)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put(`${AUTH_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Contains currentPassword and newPassword
 * @returns {Promise<Object>} Success message
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post(`${AUTH_URL}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists in localStorage
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} Authentication token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};