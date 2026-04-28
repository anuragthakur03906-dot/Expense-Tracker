import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const IncomeVsExpense = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Income vs Expenses Trend</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No data available for the selected year
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Income vs Expenses Trend
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(month) => {
              const date = new Date(2000, month - 1, 1);
              return date.toLocaleString('default', { month: 'short' });
            }}
          />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10B981" 
            name="Income"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#EF4444" 
            name="Expenses"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#3B82F6" 
            name="Balance"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeVsExpense;