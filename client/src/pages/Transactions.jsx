// client/src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import api from "../services/api";
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver'; // Keep only for CSV export

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

  useEffect(() => {
    fetchTransactions();
  }, []);

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

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(t => 
        new Date(t.date) >= new Date(filters.startDate) &&
        new Date(t.date) <= new Date(filters.endDate)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

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
      fetchTransactions();
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

  // Export to CSV only (PDF removed)
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
      
      // Create CSV content
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

  // Calculate summary statistics
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
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transactions
          </h1>
          <div className="space-x-2 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingTransaction(null);
                setShowForm(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              + Add Transaction
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={filteredTransactions.length === 0 || loading}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expense</p>
              <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <TransactionFilters filters={filters} setFilters={setFilters} />

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