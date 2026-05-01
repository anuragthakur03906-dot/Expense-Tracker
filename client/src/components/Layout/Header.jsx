import React from 'react';
import { FiBell, FiUser, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Navigate to profile page
  const handleProfile = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Empty div for spacing - search bar removed but structure maintained */}
          <div className="flex-1 max-w-md">
            <div className="relative">
            </div>
          </div>

          {/* Right side buttons - responsive spacing */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications Button */}
            <button className="relative p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <FiBell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0 right-0 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {/* User Avatar */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {/* User Name - hidden on very small screens */}
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user?.name}
                </span>
                <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-2">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FiUser className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Profile Settings
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FiLogOut className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;