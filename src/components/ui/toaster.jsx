import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast component with faster animations
const Toast = ({ message, type, onClose, id, timestamp, user = 'User' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id, false); // false means don't store in history when auto-closing
    }, 5000);
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
        duration: 0.2 // Faster animation
      }}
      className={`${getToastStyles()} rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md overflow-hidden relative`}
      style={{ boxShadow: '0 8px 20px -5px rgba(0, 0, 0, 0.3), 0 6px 10px -5px rgba(0, 0, 0, 0.2)' }}
    >
      {/* Top gradient bar - KMIT colors */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff7b00] to-[#004aad]"></div>
      
      {/* Content with sections */}
      <div className="flex items-start">
        {/* Icon section */}
        <div className="mr-3 mt-0.5">
          {getIcon()}
        </div>
        
        {/* Message section */}
        <div className="flex-1">
          <div className="font-medium text-base">{message}</div>
          
          {/* User and timestamp section */}
          <div className="text-xs text-white/80 mt-1 flex justify-between">
            <span>{user}</span>
            <span>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        {/* Close button with faster animation */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClose(id, true)}
          className="ml-3 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
      </div>
      
      {/* Animated progress bar - faster */}
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

// Toast History Panel Component
const ToastHistory = ({ history, isOpen, onClose, onReplay }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 bottom-4 w-80 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden z-50 flex flex-col border border-white/20"
    >
      <div className="p-3 bg-[#004aad] text-white flex justify-between items-center">
        <h3 className="font-medium">Notification History</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No notification history</div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-md text-sm relative cursor-pointer hover:brightness-110 transition-all`}
                style={{ backgroundColor: getHistoryItemColor(item.type) }}
                onClick={() => onReplay(item)}
              >
                <div className="font-medium text-white">{item.message}</div>
                <div className="text-xs text-white/80 mt-1 flex justify-between">
                  <span>{item.user}</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-gray-800/50 border-t border-white/10 flex justify-between">
        <button 
          onClick={() => onReplay(history[history.length - 1])} 
          disabled={history.length === 0}
          className="text-xs text-white bg-[#004aad] px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Replay Latest
        </button>
        <button 
          onClick={() => localStorage.removeItem('toastHistory')} 
          className="text-xs text-white bg-[#ff5a5f] px-3 py-1 rounded"
        >
          Clear All
        </button>
      </div>
    </motion.div>
  );
};

// Helper function to get color for history items
const getHistoryItemColor = (type) => {
  switch (type) {
    case 'success': return '#00a896';
    case 'error': return '#ff5a5f';
    case 'warning': return '#ff9e00';
    case 'info':
    default: return '#0066cc';
  }
};

// Main Toaster component with history
export const Toaster = () => {
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('toastHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load toast history:', error);
    }
    
    // Check for history changes and save to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'toastHistory') {
        try {
          const newHistory = JSON.parse(e.newValue || '[]');
          setHistory(newHistory);
        } catch (error) {
          console.error('Failed to parse toast history:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('toastHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save toast history:', error);
    }
  }, [history]);

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
    
    // Add to history
    setHistory(prev => {
      const newHistory = [...prev, newToast].slice(-50); // Keep last 50 items
      return newHistory;
    });
  };

  // Function to remove a toast and optionally add to history
  const removeToast = (id, addToHistory = true) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Function to replay a toast from history
  const replayToast = (toast) => {
    addToast(toast.message, toast.type, toast.user);
  };
  
  // Toggle history panel
  const toggleHistory = () => {
    setHistoryOpen(prev => !prev);
  };

  // Expose the addToast method to window for global access
  useEffect(() => {
    window.addToast = addToast;
    window.showToastHistory = toggleHistory;
    
    return () => {
      delete window.addToast;
      delete window.showToastHistory;
    };
  }, []);

  return (
    <>
      {/* History button */}
      <div className="fixed bottom-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleHistory}
          className="bg-[#004aad] text-white p-2 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <path d="M3.05 11a9 9 0 1 1 .5 4"></path>
            <path d="M3 16V8h8"></path>
          </svg>
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ff5a5f] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {history.length}
            </span>
          )}
        </motion.button>
      </div>
      
      {/* Toast notifications */}
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
      
      {/* History panel */}
      <AnimatePresence>
        {historyOpen && (
          <ToastHistory 
            history={history} 
            isOpen={historyOpen} 
            onClose={toggleHistory} 
            onReplay={replayToast} 
          />
        )}
      </AnimatePresence>
    </>
  );
};
