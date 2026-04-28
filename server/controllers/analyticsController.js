const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { getAISuggestion } = require('../utils/aiSuggestions');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private
const getAnalyticsDashboard = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    // Monthly data for the year
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);
      
      const transactions = await Transaction.find({
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate }
      });

      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month,
        income,
        expenses,
        balance: income - expenses
      });
    }

    // Category breakdown for current month
    const currentMonthStart = new Date(currentYear, new Date().getMonth(), 1);
    const currentMonthEnd = new Date(currentYear, new Date().getMonth() + 1, 0);
    
    const currentMonthTransactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      type: 'expense'
    });

    const categoryBreakdown = {};
    currentMonthTransactions.forEach(t => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = 0;
      }
      categoryBreakdown[t.category] += t.amount;
    });

    // Top spending categories
    const topCategories = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Budget vs actual
    const budgets = await Budget.find({
      user: req.user._id,
      month: new Date().getMonth() + 1,
      year: currentYear
    });

    const budgetVsActual = await Promise.all(budgets.map(async (budget) => {
      const actual = currentMonthTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: budget.category,
        budgetAmount: budget.amount,
        actualAmount: actual,
        percentage: (actual / budget.amount) * 100,
        isOverBudget: actual > budget.amount
      };
    }));

    // AI Suggestions
    const aiSuggestion = await getAISuggestion(req.user._id);

    res.json({
      monthlyData,
      categoryBreakdown,
      topCategories,
      budgetVsActual,
      aiSuggestion
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get income vs expense comparison
// @route   GET /api/analytics/compare
// @access  Private
const getIncomeExpenseCompare = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let data = [];

    if (period === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const transactions = await Transaction.find({
          user: req.user._id,
          date: { $gte: startOfDay, $lte: endOfDay }
        });

        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        data.push({
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          income,
          expenses
        });
      }
    } else {
      // Last 6 months
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = today.getMonth() - i;
        const year = today.getFullYear() + Math.floor(month / 12);
        const adjustedMonth = ((month % 12) + 12) % 12;
        
        const startDate = new Date(year, adjustedMonth, 1);
        const endDate = new Date(year, adjustedMonth + 1, 0);

        const transactions = await Transaction.find({
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        });

        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        data.push({
          label: startDate.toLocaleDateString('en-US', { month: 'short' }),
          income,
          expenses
        });
      }
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalyticsDashboard,
  getIncomeExpenseCompare
};