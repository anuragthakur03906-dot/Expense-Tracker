import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const BalanceCard = ({ summary }) => {
  const { totalIncome, totalExpense, balance } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold opacity-90">Total Balance</h3>
          <FiDollarSign className="w-8 h-8 opacity-75" />
        </div>
        <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        <p className="text-sm opacity-75 mt-2">Current available balance</p>
      </div>

      {/* Income Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Income</h3>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          +${totalIncome.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All time income</p>
      </div>

      {/* Expense Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Expense</h3>
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <FiTrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          -${totalExpense.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All time expenses</p>
      </div>
    </div>
  );
};

export default BalanceCard;