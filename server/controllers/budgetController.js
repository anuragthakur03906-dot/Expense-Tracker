const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction'); // Changed from TransactionModel to Transaction
const mongoose = require('mongoose');

// @desc    Get budgets for a user (with optional month/year filter)
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = { user: req.user.id };
    
    // Add month/year filter if provided
    if (month && year) {
      filter.month = parseInt(month);
      filter.year = parseInt(year);
    }
    
    const budgets = await Budget.find(filter);
    
    // Calculate actual spending for each budget category
    const budgetsWithActuals = await Promise.all(
      budgets.map(async (budget) => {
        // Get all transactions for this category in the budget period
        const transactions = await Transaction.find({
          user: req.user.id,
          category: budget.category,
          type: 'expense',
          date: {
            $gte: new Date(budget.year, budget.month - 1, 1),
            $lt: new Date(budget.year, budget.month, 1)
          }
        });
        
        const actual = transactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = budget.amount - actual;
        const percentage = (actual / budget.amount) * 100;
        const isOverBudget = actual > budget.amount;
        const isAlert = !isOverBudget && percentage >= budget.alertThreshold;
        
        return {
          ...budget.toObject(),
          actual,
          remaining: Math.max(0, remaining),
          percentage: Math.min(percentage, 100),
          isOverBudget,
          isAlert
        };
      })
    );
    
    res.json(budgetsWithActuals);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};

// @desc    Set/create a budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year, alertThreshold } = req.body;
    
    // Check if budget already exists for this category/month/year
    let existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
      year
    });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      existingBudget.alertThreshold = alertThreshold || 80;
      await existingBudget.save();
      
      // Calculate actual spending
      const transactions = await Transaction.find({
        user: req.user.id,
        category: category,
        type: 'expense',
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      });
      
      const actual = transactions.reduce((sum, t) => sum + t.amount, 0);
      const remaining = amount - actual;
      const percentage = (actual / amount) * 100;
      const isOverBudget = actual > amount;
      const isAlert = !isOverBudget && percentage >= (alertThreshold || 80);
      
      const response = {
        ...existingBudget.toObject(),
        actual,
        remaining: Math.max(0, remaining),
        percentage: Math.min(percentage, 100),
        isOverBudget,
        isAlert
      };
      
      return res.json(response);
    }
    
    // Create new budget
    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      month,
      year,
      alertThreshold: alertThreshold || 80
    });
    
    // Calculate initial actual spending (0 for new budget)
    const response = {
      ...budget.toObject(),
      actual: 0,
      remaining: amount,
      percentage: 0,
      isOverBudget: false,
      isAlert: false
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Create budget error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Budget already exists for this category and month' });
    }
    res.status(500).json({ message: 'Failed to create budget' });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check user ownership
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { category, amount, month, year, alertThreshold } = req.body;
    
    budget.category = category || budget.category;
    budget.amount = amount || budget.amount;
    budget.month = month || budget.month;
    budget.year = year || budget.year;
    budget.alertThreshold = alertThreshold || budget.alertThreshold;
    
    await budget.save();
    
    // Calculate actual spending
    const transactions = await Transaction.find({
      user: req.user.id,
      category: budget.category,
      type: 'expense',
      date: {
        $gte: new Date(budget.year, budget.month - 1, 1),
        $lt: new Date(budget.year, budget.month, 1)
      }
    });
    
    const actual = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - actual;
    const percentage = (actual / budget.amount) * 100;
    const isOverBudget = actual > budget.amount;
    const isAlert = !isOverBudget && percentage >= budget.alertThreshold;
    
    const response = {
      ...budget.toObject(),
      actual,
      remaining: Math.max(0, remaining),
      percentage: Math.min(percentage, 100),
      isOverBudget,
      isAlert
    };
    
    res.json(response);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await budget.deleteOne();
    res.json({ message: 'Budget removed successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
};

module.exports = {
  getBudgets,
  setBudget,
  updateBudget,
  deleteBudget
};