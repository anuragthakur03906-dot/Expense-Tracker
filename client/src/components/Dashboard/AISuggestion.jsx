import React from 'react';
import { FiAlertCircle, FiInfo, FiThumbsUp, FiTrendingUp } from 'react-icons/fi';
import { IoIosBulb } from 'react-icons/io'; // Using IoIosBulb instead of FiBulb
import { AiFillWarning } from 'react-icons/ai'; // Using AiFillWarning for alerts

const getIcon = (type) => {
  switch (type) {
    case 'alert':
      return <AiFillWarning className="w-6 h-6 text-red-500" />;
    case 'warning':
      return <AiFillWarning className="w-6 h-6 text-yellow-500" />;
    case 'tip':
      return <IoIosBulb className="w-6 h-6 text-blue-500" />;
    case 'positive':
      return <FiThumbsUp className="w-6 h-6 text-green-500" />;
    default:
      return <FiInfo className="w-6 h-6 text-gray-500" />;
  }
};

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
    <div className={`rounded-xl p-4 border ${getBgColor(suggestion.type)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(suggestion.type)}
        </div>
        <div className="flex-1">
          <p className="text-gray-900 dark:text-white font-medium">
            AI Insight
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            {suggestion.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AISuggestion;