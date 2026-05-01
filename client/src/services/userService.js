// client/src/services/userService.js
import api from './api';

const USERS_URL = '/users';

/**
 * Get current user's profile information
 * @returns {Promise<Object>} User profile data including name, email, preferences
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get(`${USERS_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

/**
 * Update user profile information
 * @param {Object} userData - Updated user data (name, email, preferences)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put(`${USERS_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

/**
 * Delete user account permanently
 * @returns {Promise<Object>} Success message confirming deletion
 * @warning This action is irreversible
 */
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete(`${USERS_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};