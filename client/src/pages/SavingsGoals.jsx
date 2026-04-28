import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiTarget, FiPlus, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { MdSavings } from 'react-icons/md';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/api/savings');
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to fetch savings goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await axios.put(`/api/savings/${editingGoal._id}`, formData);
        toast.success('Goal updated');
      } else {
        await axios.post('/api/savings', formData);
        toast.success('Goal created');
      }
      fetchGoals();
      setShowForm(false);
      setEditingGoal(null);
      setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/api/savings/${id}`);
        toast.success('Goal deleted');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Savings Goals
          </h1>
          <button
            onClick={() => {
              setEditingGoal(null);
              setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            <FiPlus />
            <span>Add Goal</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'New Savings Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Amount ($)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Current Amount ($)</label>
                  <input
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                />
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
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <FiTarget className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.name}
                      </h3>
                      {progress >= 100 && (
                        <span className="inline-flex items-center text-xs text-green-500">
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          Completed!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setFormData({
                          name: goal.name,
                          targetAmount: goal.targetAmount,
                          currentAmount: goal.currentAmount,
                          deadline: goal.deadline.split('T')[0]
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${getProgressColor(progress)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Saved</p>
                      <p className="font-semibold">${goal.currentAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 dark:text-gray-400">Target</p>
                      <p className="font-semibold">${goal.targetAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining:</span>
                      <span className="font-medium">${(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Days left:</span>
                      <span className="font-medium">{daysLeft} days</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {goals.length === 0 && !loading && (
            <div className="col-span-2 text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <FiTarget className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No savings goals yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first savings goal to start tracking</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SavingsGoals;