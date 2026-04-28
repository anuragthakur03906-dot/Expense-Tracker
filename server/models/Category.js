const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: '💰'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: true
  }
});

const defaultCategories = [
  { name: 'Food', icon: '🍔', color: '#EF4444', type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#8B5CF6', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#EC4899', type: 'expense' },
  { name: 'Bills', icon: '📄', color: '#F59E0B', type: 'expense' },
  { name: 'Healthcare', icon: '🏥', color: '#10B981', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#6366F1', type: 'expense' },
  { name: 'Salary', icon: '💼', color: '#10B981', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#14B8A6', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#06B6D4', type: 'income' }
];

// Seed default categories if none exist
categorySchema.statics.seedDefaultCategories = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.insertMany(defaultCategories);
    console.log('Default categories seeded');
  }
};

module.exports = mongoose.model('Category', categorySchema);