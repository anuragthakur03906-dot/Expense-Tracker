import api from './api';

const BUDGETS_URL = '/budgets';

// Get all budgets
export const getBudgets = async (month, year) => {
  try {
    const params = { month, year };
    const response = await api.get(BUDGETS_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch budgets' };
  }
};

// Create budget
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post(BUDGETS_URL, budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create budget' };
  }
};

// Update budget
export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.put(`${BUDGETS_URL}/${id}`, budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update budget' };
  }
};

// Delete budget
export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`${BUDGETS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete budget' };
  }
};

// Get budget alerts
export const getBudgetAlerts = async () => {
  try {
    const response = await api.get(`${BUDGETS_URL}/alerts`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch alerts' };
  }
};