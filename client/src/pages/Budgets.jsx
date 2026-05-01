import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import api from "../services/api";
import toast from 'react-hot-toast';
import { FiAlertCircle, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertThreshold: 80
  });

  // Fetch budgets and categories on mount and when month/year changes
  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [selectedMonth, selectedYear]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/budgets', {
        params: { month: selectedMonth, year: selectedYear }
      });
      console.log('Fetched budgets:', response.data);
      setBudgets(response.data);
    } catch (error) {
      console.error('Fetch budgets error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // Filter to only expense categories for budget setting
      const expenseCategories = response.data.filter(c => c.type === 'expense');
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, formData);
        toast.success('Budget updated successfully');
      } else {
        await api.post('/budgets', formData);
        toast.success('Budget created successfully');
      }
      
      // Reset form and refresh list
      setShowForm(false);
      setEditingBudget(null);
      setFormData({
        category: '',
        amount: '',
        month: selectedMonth,
        year: selectedYear,
        alertThreshold: 80
      });
      
      await fetchBudgets();
    } catch (error) {
      console.error('Submit budget error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setLoading(true);
      try {
        await api.delete(`/budgets/${id}`);
        toast.success('Budget deleted successfully');
        await fetchBudgets();
      } catch (error) {
        console.error('Delete budget error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete budget');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
      alertThreshold: budget.alertThreshold || 80
    });
    setShowForm(true);
  };

  const handleMonthYearChange = () => {
    fetchBudgets();
  };

  // Helper functions for styling based on budget status
  const getStatusColor = (percentage, isOverBudget) => {
    if (isOverBudget) return 'text-red-600 dark:text-red-400';
    if (percentage >= 90) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = (percentage, isOverBudget) => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Budget Management
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              Set spending limits and track your budget progress
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBudget(null);
              setFormData({
                category: '',
                amount: '',
                month: selectedMonth,
                year: selectedYear,
                alertThreshold: 80
              });
              setShowForm(true);
            }}
            disabled={loading}
            className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 text-sm sm:text-base"
          >
            + Set Budget
          </button>
        </div>

        {/* Month/Year Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg dark:bg-gray-700"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg dark:bg-gray-700"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleMonthYearChange}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Budget Form Modal */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id || cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Budget Amount ($)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                    Alert Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get alert when spending reaches this percentage
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBudget(null);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && budgets.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-500">Loading budgets...</p>
          </div>
        )}

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {budgets.map((budget) => (
            <div key={budget._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {budget.category}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {new Date(budget.year, budget.month - 1, 1).toLocaleString('default', { month: 'long' })} {budget.year}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-semibold text-gray-900 dark:text-white">${budget.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Spent</p>
                    <p className={`font-semibold ${getStatusColor(budget.percentage, budget.isOverBudget)}`}>
                      ${budget.actual?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ${budget.remaining?.toFixed(2) || budget.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${getProgressColor(budget.percentage, budget.isOverBudget)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                  />
                </div>
                
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-500">{(budget.percentage || 0).toFixed(1)}% used</span>
                  </div>
                  {budget.isAlert && !budget.isOverBudget && (
                    <div className="flex items-center text-yellow-500 text-xs sm:text-sm">
                      <FiAlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Near limit!
                    </div>
                  )}
                  {budget.isOverBudget && (
                    <div className="flex items-center text-red-500 text-xs sm:text-sm">
                      <FiAlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Over budget!
                    </div>
                  )}
                  {budget.percentage <= 50 && budget.actual > 0 && (
                    <div className="flex items-center text-green-500 text-xs sm:text-sm">
                      <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      On track!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {!loading && budgets.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-xl">
              <FiAlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No budgets set for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Click "Set Budget" to create your first budget
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;