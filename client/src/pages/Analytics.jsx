import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import IncomeVsExpense from '../components/Analytics/IncomeVsExpense';
import CategoryBreakdown from '../components/Analytics/CategoryBreakdown';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard', {
        params: { year: selectedYear }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <IncomeVsExpense monthlyData={analyticsData?.monthlyData} />
        
        <CategoryBreakdown 
          categoryBreakdown={analyticsData?.categoryBreakdown}
          topCategories={analyticsData?.topCategories}
        />

        {analyticsData?.budgetVsActual && analyticsData.budgetVsActual.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Budget Performance
            </h2>
            <div className="space-y-4">
              {analyticsData.budgetVsActual.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className={item.isOverBudget ? 'text-red-500' : 'text-green-500'}>
                      ${item.actualAmount.toFixed(2)} / ${item.budgetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.percentage.toFixed(1)}% of budget used
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;