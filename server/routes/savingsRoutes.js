const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal
} = require('../controllers/savingsGoalController');

router.route('/')
  .get(protect, getSavingsGoals)
  .post(protect, createSavingsGoal);

router.route('/:id')
  .get(protect, getSavingsGoalById)
  .put(protect, updateSavingsGoal)
  .delete(protect, deleteSavingsGoal);

router.post('/:id/add-amount', protect, addToSavingsGoal);

module.exports = router;