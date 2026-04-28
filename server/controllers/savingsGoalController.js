const SavingsGoal = require('../models/SavingsGoal');

// @desc    Get all savings goals
// @route   GET /api/savings
// @access  Private
const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single savings goal
// @route   GET /api/savings/:id
// @access  Private
const getSavingsGoalById = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create savings goal
// @route   POST /api/savings
// @access  Private
const createSavingsGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline } = req.body;
    
    const goal = await SavingsGoal.create({
      user: req.user._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      status: 'active'
    });
    
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update savings goal
// @route   PUT /api/savings/:id
// @access  Private
const updateSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    const updatedGoal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings/:id
// @access  Private
const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    await goal.deleteOne();
    res.status(200).json({ message: 'Savings goal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add amount to savings goal
// @route   POST /api/savings/:id/add-amount
// @access  Private
const addToSavingsGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    goal.currentAmount += amount;
    
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }
    
    await goal.save();
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal
};