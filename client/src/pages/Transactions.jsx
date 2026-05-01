// client/src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import api from "../services/api";
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: '',
    search: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters whenever filters or transactions change
  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
    } catch (error) {
      console.error('Fetch transactions error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Date range filter
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(t => 
        new Date(t.date) >= new Date(filters.startDate) &&
        new Date(t.date) <= new Date(filters.endDate)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Transaction type filter
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Search by description
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, transactionData);
        toast.success('Transaction updated successfully');
      } else {
        await api.post('/transactions', transactionData);
        toast.success('Transaction added successfully');
      }
      fetchTransactions(); // Refresh list
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Transaction operation error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        console.error('Delete transaction error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // Export filtered transactions to CSV file
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    try {
      // Define CSV headers
      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes'];
      
      // Convert transactions to CSV rows
      const rows = filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        t.amount.toFixed(2),
        t.notes || ''
      ]);
      
      // Create CSV content with proper escaping
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Add BOM for UTF-8 to handle special characters
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success(`${filteredTransactions.length} transactions exported to CSV successfully`);
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV');
    }
  };

  // Calculate summary statistics for filtered transactions
  const getSummary = () => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, balance };
  };

  const { totalIncome, totalExpense, balance } = getSummary();

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
              className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
            >
              + Add Transaction
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={filteredTransactions.length === 0 || loading}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Expense</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <p className={`text-lg sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <TransactionFilters filters={filters} setFilters={setFilters} />

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
            initialData={editingTransaction}
          />
        )}

        {/* Transactions List */}
        <TransactionList
          transactions={filteredTransactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default Transactions;