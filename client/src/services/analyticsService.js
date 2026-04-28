import api from './api';

const ANALYTICS_URL = '/analytics';

// Get analytics dashboard data
export const getAnalyticsDashboard = async (year) => {
  try {
    const params = year ? { year } : {};
    const response = await api.get(`${ANALYTICS_URL}/dashboard`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch analytics data' };
  }
};

// Get income vs expense comparison
export const getIncomeExpenseCompare = async (period = 'month') => {
  try {
    const response = await api.get(`${ANALYTICS_URL}/compare`, { params: { period } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch comparison data' };
  }
};

// Get spending trends
export const getSpendingTrends = async (category, months = 6) => {
  try {
    const response = await api.get(`${ANALYTICS_URL}/trends`, {
      params: { category, months }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch spending trends' };
  }
};

// Get category insights
export const getCategoryInsights = async () => {
  try {
    const response = await api.get(`${ANALYTICS_URL}/insights`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch insights' };
  }
};