const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Set budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year, alertThreshold } = req.body;
    
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { amount, alertThreshold: alertThreshold || 80 },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month: currentMonth,
      year: currentYear
    });

    // Get actual spending for each budget
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    });

    const budgetsWithActual = budgets.map(budget => {
      const actual = transactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const percentage = (actual / budget.amount) * 100;
      const isAlert = percentage >= budget.alertThreshold;

      return {
        ...budget.toObject(),
        actual,
        percentage,
        isAlert,
        remaining: budget.amount - actual,
        isOverBudget: actual > budget.amount
      };
    });

    res.json(budgetsWithActual);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setBudget,
  getBudgets,
  updateBudget,
  deleteBudget
};