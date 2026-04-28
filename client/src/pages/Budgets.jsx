import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiAlertCircle, FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    alertThreshold: 80
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
    } catch (error) {
      toast.error('Failed to fetch budgets');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.filter(c => c.type === 'expense'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await axios.put(`/api/budgets/${editingBudget._id}`, formData);
        toast.success('Budget updated');
      } else {
        await axios.post('/api/budgets', formData);
        toast.success('Budget created');
      }
      fetchBudgets();
      setShowForm(false);
      setEditingBudget(null);
      setFormData({
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        alertThreshold: 80
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`/api/budgets/${id}`);
        toast.success('Budget deleted');
        fetchBudgets();
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Budget Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Set spending limits and track your budget progress
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBudget(null);
              setFormData({
                category: '',
                amount: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                alertThreshold: 80
              });
              setShowForm(true);
            }}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            + Set Budget
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Amount ($)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alert Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get alert when spending reaches this percentage
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {budgets.map((budget) => (
            <div key={budget._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {budget.category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(budget.year, budget.month - 1, 1).toLocaleString('default', { month: 'long' })} {budget.year}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingBudget(budget);
                      setFormData({
                        category: budget.category,
                        amount: budget.amount,
                        month: budget.month,
                        year: budget.year,
                        alertThreshold: budget.alertThreshold
                      });
                      setShowForm(true);
                    }}
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
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-semibold">${budget.amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-gray-400">Spent</p>
                    <p className={`font-semibold ${getStatusColor(budget.percentage, budget.isOverBudget)}`}>
                      ${budget.actual.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ${budget.remaining.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${getProgressColor(budget.percentage, budget.isOverBudget)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-500">{budget.percentage.toFixed(1)}% used</span>
                  </div>
                  {budget.isAlert && !budget.isOverBudget && (
                    <div className="flex items-center text-yellow-500 text-sm">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      Near limit!
                    </div>
                  )}
                  {budget.isOverBudget && (
                    <div className="flex items-center text-red-500 text-sm">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      Over budget!
                    </div>
                  )}
                  {budget.percentage <= 50 && budget.actual > 0 && (
                    <div className="flex items-center text-green-500 text-sm">
                      <FiCheckCircle className="w-4 h-4 mr-1" />
                      On track!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {budgets.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No budgets set yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Create your first budget to start tracking your spending
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;