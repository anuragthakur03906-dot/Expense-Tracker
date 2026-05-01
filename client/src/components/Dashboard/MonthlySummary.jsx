import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MonthlySummary = ({ transactions }) => {
  // Group transactions by month for chart display
  const monthlyData = React.useMemo(() => {
    const months = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
          year: date.getFullYear()
        };
      }
      
      // Add to income or expenses based on transaction type
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expenses += transaction.amount;
      }
    });
    
    // Convert to array and get last 6 months for display
    return Object.values(months).slice(-6);
  }, [transactions]);

  // Show empty state if no data
  if (monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Monthly Summary
        </h3>
        <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          No data available for chart
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Monthly Income vs Expenses
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySummary;