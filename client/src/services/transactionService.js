import api from './api';

const TRANSACTIONS_URL = '/transactions';

// Get all transactions with filters
export const getTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${TRANSACTIONS_URL}?${params}` : TRANSACTIONS_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions' };
  }
};

// Get single transaction
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transaction' };
  }
};

// Create transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(TRANSACTIONS_URL, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create transaction' };
  }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`${TRANSACTIONS_URL}/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update transaction' };
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`${TRANSACTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transaction' };
  }
};

// Get monthly summary
export const getMonthlySummary = async (year, month) => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/monthly/${year}/${month}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch monthly summary' };
  }
};

// Get transaction statistics
export const getTransactionStats = async () => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch statistics' };
  }
};

// Bulk delete transactions
export const bulkDeleteTransactions = async (ids) => {
  try {
    const response = await api.post(`${TRANSACTIONS_URL}/bulk-delete`, { ids });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transactions' };
  }
};
