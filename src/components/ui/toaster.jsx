import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast component with faster animations
const Toast = ({ message, type, onClose, id, timestamp, user = 'User' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose, id]);

  // More vibrant KMIT college colors
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-[#00a896] border-l-4 border-l-[#02c39a] text-white'; // Bright teal
      case 'error':
        return 'bg-[#ff5a5f] border-l-4 border-l-[#ff0000] text-white'; // Bright red
      case 'warning':
        return 'bg-[#ff9e00] border-l-4 border-l-[#ff7b00] text-white'; // Bright orange
      case 'info':
      default:
        return 'bg-[#0066cc] border-l-4 border-l-[#004aad] text-white'; // Bright blue
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.2
      }}
      className={`${getToastStyles()} rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md overflow-hidden relative`}
      style={{ boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.3), 0 6px 10px -5px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff7b00] to-[#004aad]"></div>
      
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-base">{message}</div>
          
          <div className="text-xs text-white/80 mt-1 flex justify-between">
            <span>{user}</span>
            <span>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose(id)}
          className="ml-3 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <motion.div 
          className="h-full bg-white/30"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

// Main Toaster component
export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const addToast = (message, type = 'info', user = 'User') => {
    const newToast = {
      id: Date.now(),
      message,
      type,
      user,
      timestamp: Date.now(),
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose the addToast method to window for global access
  useEffect(() => {
    window.addToast = addToast;
    
    return () => {
      delete window.addToast;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            user={toast.user}
            timestamp={toast.timestamp}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
