import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

// Color palette for chart categories
const COLORS = ['#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'];

const CategoryBreakdown = ({ categoryBreakdown, topCategories }) => {
  // Transform category object into array format for pie chart
  const pieData = Object.entries(categoryBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Show empty state if no data available
  if (!categoryBreakdown || Object.keys(categoryBreakdown).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Category Breakdown</h2>
        <div className="h-64 sm:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No expense data available for this month
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Category Breakdown (Current Month)
      </h2>
      
      {/* Responsive grid: stacked on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart Section */}
        <div className="order-2 lg:order-1">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Spending Categories Section */}
        <div className="order-1 lg:order-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">Top Spending Categories</h3>
          <div className="space-y-3">
            {(topCategories || []).map((category, index) => (
              <div key={category.category} className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{category.category}</span>
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ${category.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Expenses Summary */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Expenses</span>
              <span className="font-bold text-red-500 text-base sm:text-lg">
                ${pieData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;