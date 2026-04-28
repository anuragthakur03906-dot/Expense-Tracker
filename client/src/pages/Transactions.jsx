import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
    } catch (error) {
      toast.error('Failed to fetch transactions');
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
        await axios.put(`/api/transactions/${editingTransaction._id}`, transactionData);
        toast.success('Transaction updated');
      } else {
        await axios.post('/api/transactions', transactionData);
        toast.success('Transaction added');
      }
      fetchTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        toast.success('Transaction deleted');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    // Define CSV headers
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes'];
    
    // Convert transactions to CSV rows
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount,
      t.notes || ''
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('CSV exported successfully');
  };

  // Export to PDF
  const exportToPDF = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transactions Report', 14, 15);
    
    // Add date range if filters applied
    doc.setFontSize(10);
    let yOffset = 25;
    if (filters.startDate && filters.endDate) {
      doc.text(`Date Range: ${filters.startDate} to ${filters.endDate}`, 14, yOffset);
      yOffset += 5;
    }
    
    // Add generation date
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yOffset);
    
    // Prepare table data
    const tableData = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      `$${t.amount.toFixed(2)}`
    ]);
    
    // Add table
    doc.autoTable({
      startY: yOffset + 5,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      }
    });
    
    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    
    doc.setFontSize(10);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, finalY);
    doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, finalY + 5);
    doc.text(`Balance: $${balance.toFixed(2)}`, 14, finalY + 10);
    
    // Save PDF
    doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully');
  };

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
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
            >
              + Add Transaction
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              disabled={filteredTransactions.length === 0}
            >
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              disabled={filteredTransactions.length === 0}
            >
              Export PDF
            </button>
          </div>
        </div>

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