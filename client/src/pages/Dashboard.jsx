import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import BalanceCard from '../components/Dashboard/BalanceCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import MonthlySummary from '../components/Dashboard/MonthlySummary';
import AISuggestion from '../components/Dashboard/AISuggestion';
import TransactionList from '../components/Transactions/TransactionList';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch both transactions and analytics in parallel
      const [transactionsRes, analyticsRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/analytics/dashboard')
      ]);
      
      setTransactions(transactionsRes.data.transactions);
      setSummary(transactionsRes.data.summary);
      setAiSuggestion(analyticsRes.data.aiSuggestion);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchDashboardData(); // Refresh data after deletion
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.name}! </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base opacity-90">Here's your financial overview for today</p>
        </div>

        {/* Balance Cards */}
        <BalanceCard summary={summary} />

        {/* AI Suggestion */}
        {aiSuggestion && <AISuggestion suggestion={aiSuggestion} />}

        {/* Charts Section - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ExpenseChart transactions={transactions} />
          <MonthlySummary transactions={transactions} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <button 
              onClick={() => window.location.href = '/transactions'}
              className="text-primary-500 hover:text-primary-600 font-medium text-sm sm:text-base"
            >
              View All →
            </button>
          </div>
          <TransactionList 
            transactions={transactions.slice(0, 5)} 
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;