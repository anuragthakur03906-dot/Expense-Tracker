import React from 'react';
import { FiAlertCircle, FiInfo, FiThumbsUp, FiTrendingUp } from 'react-icons/fi';
import { IoIosBulb } from 'react-icons/io';
import { AiFillWarning } from 'react-icons/ai';

// Get appropriate icon based on suggestion type
const getIcon = (type) => {
  switch (type) {
    case 'alert':
      return <AiFillWarning className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />;
    case 'warning':
      return <AiFillWarning className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
    case 'tip':
      return <IoIosBulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
    case 'positive':
      return <FiThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
    default:
      return <FiInfo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />;
  }
};

// Get background color based on suggestion type
const getBgColor = (type) => {
  switch (type) {
    case 'alert':
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'tip':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'positive':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    default:
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

const AISuggestion = ({ suggestion }) => {
  if (!suggestion) return null;

  return (
    <div className={`rounded-xl p-3 sm:p-4 border ${getBgColor(suggestion.type)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(suggestion.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
            AI Insight
          </p>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
            {suggestion.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AISuggestion;