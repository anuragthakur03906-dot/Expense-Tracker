import api from './api';

const TRANSACTIONS_URL = '/transactions';

/**
 * Get all transactions with optional filters
 * @param {Object} filters - Filter criteria (startDate, endDate, category, type, search)
 * @returns {Promise<Object>} Transactions list and pagination info
 */
export const getTransactions = async (filters = {}) => {
  try {
    // Convert filters object to URLSearchParams
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${TRANSACTIONS_URL}?${params}` : TRANSACTIONS_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transactions' };
  }
};

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise<Object>} Transaction object
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transaction' };
  }
};

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data (amount, type, category, description, date, notes)
 * @returns {Promise<Object>} Created transaction object
 */
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(TRANSACTIONS_URL, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create transaction' };
  }
};

/**
 * Update an existing transaction
 * @param {string} id - Transaction ID
 * @param {Object} transactionData - Updated transaction data
 * @returns {Promise<Object>} Updated transaction object
 */
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`${TRANSACTIONS_URL}/${id}`, transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update transaction' };
  }
};

/**
 * Delete a transaction
 * @param {string} id - Transaction ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`${TRANSACTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transaction' };
  }
};

/**
 * Get monthly summary for income and expenses
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month number (1-12)
 * @returns {Promise<Object>} Monthly totals for income and expenses
 */
export const getMonthlySummary = async (year, month) => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/monthly/${year}/${month}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch monthly summary' };
  }
};

/**
 * Get transaction statistics (totals, averages, etc.)
 * @returns {Promise<Object>} Statistics including total income, expenses, and balance
 */
export const getTransactionStats = async () => {
  try {
    const response = await api.get(`${TRANSACTIONS_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch statistics' };
  }
};

/**
 * Bulk delete multiple transactions
 * @param {Array<string>} ids - Array of transaction IDs to delete
 * @returns {Promise<Object>} Success message with count of deleted transactions
 */
export const bulkDeleteTransactions = async (ids) => {
  try {
    const response = await api.post(`${TRANSACTIONS_URL}/bulk-delete`, { ids });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete transactions' };
  }
};