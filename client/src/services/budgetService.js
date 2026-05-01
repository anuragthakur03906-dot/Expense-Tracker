import api from './api';

const BUDGETS_URL = '/budgets';

/**
 * Get all budgets for a specific month and year
 * @param {number} month - Month number (1-12)
 * @param {number} year - Year (e.g., 2024)
 * @returns {Promise<Array>} List of budgets for the specified period
 */
export const getBudgets = async (month, year) => {
  try {
    // Build query parameters
    const params = { month, year };
    const response = await api.get(BUDGETS_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budgets' };
  }
};

/**
 * Create a new budget
 * @param {Object} budgetData - Budget data (category, amount, month, year, alertThreshold)
 * @returns {Promise<Object>} Created budget object
 */
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post(BUDGETS_URL, budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create budget' };
  }
};

/**
 * Update an existing budget
 * @param {string} id - Budget ID
 * @param {Object} budgetData - Updated budget data
 * @returns {Promise<Object>} Updated budget object
 */
export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.put(`${BUDGETS_URL}/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update budget' };
  }
};

/**
 * Delete a budget
 * @param {string} id - Budget ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`${BUDGETS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete budget' };
  }
};

/**
 * Get budget alerts for current budgets
 * @returns {Promise<Array>} List of budget alerts (near limit, over budget)
 */
export const getBudgetAlerts = async () => {
  try {
    const response = await api.get(`${BUDGETS_URL}/alerts`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch alerts' };
  }
};