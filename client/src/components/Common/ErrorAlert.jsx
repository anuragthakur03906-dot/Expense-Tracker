import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;