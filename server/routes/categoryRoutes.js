const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByType
} = require('../controllers/categoryController');

// Seed default categories on first run
const Category = require('../models/Category');
Category.seedDefaultCategories();

router.route('/')
  .get(protect, getCategories)
  .post(protect, admin, createCategory);

router.get('/type/:type', protect, getCategoriesByType);
router.route('/:id')
  .get(protect, getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;