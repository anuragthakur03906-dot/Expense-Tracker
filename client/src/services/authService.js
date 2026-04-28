import api from './api';

const AUTH_URL = '/auth';

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get(`${AUTH_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put(`${AUTH_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post(`${AUTH_URL}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};