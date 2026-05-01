import api from './api';

const ANALYTICS_URL = '/analytics';

/**
 * Get analytics dashboard data
 * @param {number} year - Optional year to filter analytics data
 * @returns {Promise<Object>} Dashboard analytics data including trends, breakdowns, and insights
 */
export const getAnalyticsDashboard = async (year) => {
  try {
    // Build query parameters if year is provided
    const params = year ? { year } : {};
    // Make API request to get dashboard analytics
    const response = await api.get(`${ANALYTICS_URL}/dashboard`, { params });
    return response.data;
  } catch (error) {
    // Throw formatted error message
    throw error.response?.data || { message: 'Failed to fetch analytics data' };
  }
};

/**
 * Get income vs expense comparison data
 * @param {string} period - Time period for comparison (day, week, month, year)
 * @returns {Promise<Object>} Comparison data between income and expenses
 */
export const getIncomeExpenseCompare = async (period = 'month') => {
  try {
    // Make API request with period parameter
    const response = await api.get(`${ANALYTICS_URL}/compare`, { params: { period } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch comparison data' };
  }
};

/**
 * Get spending trends over time
 * @param {string} category - Category to analyze (optional, returns all if not specified)
 * @param {number} months - Number of months to look back (default: 6)
 * @returns {Promise<Object>} Spending trend data over specified period
 */
export const getSpendingTrends = async (category, months = 6) => {
  try {
    // Make API request with query parameters
    const response = await api.get(`${ANALYTICS_URL}/trends`, {
      params: { category, months }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch spending trends' };
  }
};

/**
 * Get AI-powered category insights and suggestions
 * @returns {Promise<Object>} Insights including spending patterns and saving opportunities
 */
export const getCategoryInsights = async () => {
  try {
    const response = await api.get(`${ANALYTICS_URL}/insights`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch insights' };
  }
};