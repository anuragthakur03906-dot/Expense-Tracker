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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
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
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="mt-2 opacity-90">Here's your financial overview for today</p>
        </div>

        {/* Balance Cards */}
        <BalanceCard summary={summary} />

        {/* AI Suggestion */}
        {aiSuggestion && <AISuggestion suggestion={aiSuggestion} />}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart transactions={transactions} />
          <MonthlySummary transactions={transactions} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <button 
              onClick={() => window.location.href = '/transactions'}
              className="text-primary-500 hover:text-primary-600 font-medium"
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