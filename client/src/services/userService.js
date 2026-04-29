// client/src/services/userService.js
import api from './api';

const USERS_URL = '/users';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get(`${USERS_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put(`${USERS_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete(`${USERS_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};