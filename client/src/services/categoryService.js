import api from './api';

const CATEGORIES_URL = '/categories';

/**
 * Get all categories
 * @returns {Promise<Array>} List of all expense and income categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get(CATEGORIES_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

/**
 * Get categories filtered by type (income or expense)
 * @param {string} type - Transaction type ('income' or 'expense')
 * @returns {Promise<Array>} Filtered list of categories
 */
export const getCategoriesByType = async (type) => {
  try {
    const response = await api.get(`${CATEGORIES_URL}/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

/**
 * Get single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${CATEGORIES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch category' };
  }
};

/**
 * Create a new category (admin only)
 * @param {Object} categoryData - Category data (name, type, icon, color)
 * @returns {Promise<Object>} Created category object
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(CATEGORIES_URL, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create category' };
  }
};

/**
 * Update an existing category (admin only)
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category object
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`${CATEGORIES_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update category' };
  }
};

/**
 * Delete a category (admin only)
 * @param {string} id - Category ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`${CATEGORIES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete category' };
  }
};