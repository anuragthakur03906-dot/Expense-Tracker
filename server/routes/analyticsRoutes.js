const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAnalyticsDashboard,
  getIncomeExpenseCompare
} = require('../controllers/analyticsController');

router.get('/dashboard', protect, getAnalyticsDashboard);
router.get('/compare', protect, getIncomeExpenseCompare);

module.exports = router;