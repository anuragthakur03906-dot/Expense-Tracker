const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  setBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, setBudget);

router.route('/:id')
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router;