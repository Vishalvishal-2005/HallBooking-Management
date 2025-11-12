// ==================== src/components/LoadingSpinner.jsx ====================
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-indigo-600 font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;