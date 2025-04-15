import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
      <div className="relative">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
      <div className="relative">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute" style={{ animationDelay: '300ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
      <div className="relative">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute" style={{ animationDelay: '450ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 