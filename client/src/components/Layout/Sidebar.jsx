import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiList, 
  FiBarChart2, 
  FiTarget, 
  FiAlertCircle,
  FiLogOut,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/transactions', icon: FiList, label: 'Transactions' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/budgets', icon: FiAlertCircle, label: 'Budgets' },
    { path: '/savings', icon: FiTarget, label: 'Savings Goals' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          ExpenseTracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;