import api from './api';

const CATEGORIES_URL = '/categories';

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get(CATEGORIES_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

// Get categories by type
export const getCategoriesByType = async (type) => {
  try {
    const response = await api.get(`${CATEGORIES_URL}/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch categories' };
  }
};

// Get single category
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${CATEGORIES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch category' };
  }
};

// Create category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(CATEGORIES_URL, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create category' };
  }
};

// Update category (admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`${CATEGORIES_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update category' };
  }
};

// Delete category (admin only)
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`${CATEGORIES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete category' };
  }
};