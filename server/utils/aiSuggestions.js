const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const getAISuggestion = async (userId) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get current month's transactions
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    // Get previous month's transactions
    const previousStart = new Date(currentYear, currentMonth - 1, 1);
    const previousEnd = new Date(currentYear, currentMonth, 0);
    const previousTransactions = await Transaction.find({
      user: userId,
      date: { $gte: previousStart, $lte: previousEnd }
    });
    
    // Analyze spending patterns
    const categorySpending = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categorySpending[t.category]) {
          categorySpending[t.category] = 0;
        }
        categorySpending[t.category] += t.amount;
      }
    });
    
    const previousCategorySpending = {};
    previousTransactions.forEach(t => {
      if (t.type === 'expense') {
        if (!previousCategorySpending[t.category]) {
          previousCategorySpending[t.category] = 0;
        }
        previousCategorySpending[t.category] += t.amount;
      }
    });
    
    // Generate suggestions
    const suggestions = [];
    
    // Check for increased spending
    for (const [category, amount] of Object.entries(categorySpending)) {
      const previousAmount = previousCategorySpending[category] || 0;
      if (previousAmount > 0) {
        const increase = ((amount - previousAmount) / previousAmount) * 100;
        if (increase > 30) {
          suggestions.push({
            type: 'warning',
            message: `Your ${category} spending increased by ${increase.toFixed(0)}% compared to last month. Consider reviewing your expenses in this category.`
          });
        }
      }
    }
    
    // Check budget alerts
    const budgets = await Budget.find({
      user: userId,
      month: currentMonth + 1,
      year: currentYear
    });
    
    for (const budget of budgets) {
      const spent = categorySpending[budget.category] || 0;
      const percentage = (spent / budget.amount) * 100;
      
      if (percentage >= 90) {
        suggestions.push({
          type: 'alert',
          message: `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget. Consider reducing spending in this category.`
        });
      } else if (percentage <= 50 && spent > 0) {
        suggestions.push({
          type: 'info',
          message: `Great job! You've only used ${percentage.toFixed(0)}% of your ${budget.category} budget. Keep it up!`
        });
      }
    }
    
    // General suggestions
    const totalExpense = Object.values(categorySpending).reduce((a, b) => a + b, 0);
    const averageDailySpending = totalExpense / currentDate.getDate();
    
    if (averageDailySpending > 100) {
      suggestions.push({
        type: 'tip',
        message: `Your average daily spending is $${averageDailySpending.toFixed(2)}. Try to reduce unnecessary expenses.`
      });
    }
    
    // Return the most important suggestion
    if (suggestions.length === 0) {
      return {
        type: 'positive',
        message: 'Great job managing your finances! Keep tracking your expenses to maintain this healthy habit.'
      };
    }
    
    // Prioritize alerts over warnings over info/tips
    const priorityOrder = { alert: 0, warning: 1, tip: 2, info: 3, positive: 4 };
    suggestions.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);
    
    return suggestions[0];
  } catch (error) {
    console.error('AI suggestion error:', error);
    return {
      type: 'info',
      message: 'Continue tracking your expenses to get personalized insights and suggestions!'
    };
  }
};

module.exports = { getAISuggestion };