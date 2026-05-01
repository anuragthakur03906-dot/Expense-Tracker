/**
 * Service Layer Index
 * Exports all service modules for easy importing throughout the application
 * 
 * Usage: import { authService, transactionService } from '../services';
 */

// Export all services as named modules
export * as authService from './authService';
export * as transactionService from './transactionService';
export * as categoryService from './categoryService';
export * as budgetService from './budgetService';
export * as analyticsService from './analyticsService';

// Export configured axios instance for direct use when needed
export { default as api } from './api';