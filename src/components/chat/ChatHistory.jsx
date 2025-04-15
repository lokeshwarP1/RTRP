import React, { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ChatHistory = ({ userId, onSelect, visible, onToggle }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!userId) {
      setError('User ID is required to fetch chat history');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:4000/api/chat/history/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch chat history');
      }
      
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!userId) {
      setError('User ID is required to clear chat history');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:4000/api/chat/history/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear chat history');
      }
      
      setHistory([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && userId) {
      fetchHistory();
    }
  }, [visible, userId]);

  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-sm text-red-500 mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm text-primary hover:underline"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-secondary/10 rounded-full"
          aria-label={visible ? "Hide History" : "Show History"}
        >
          {visible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <div className="h-[calc(100%-8rem)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchHistory} />
        ) : history.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No chat history found</p>
            <p className="text-sm mt-1">Start a conversation to see your history here</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            {history.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onSelect(chat)}
                className="w-full p-4 text-left hover:bg-secondary/10 border-b border-border transition-colors"
              >
                <p className="text-sm font-medium truncate">{chat.query}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(chat.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
        <button
          onClick={clearHistory}
          disabled={loading || history.length === 0}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} className="mr-2" />
          Clear History
        </button>
      </div>
    </div>
  );
};

export default ChatHistory; 