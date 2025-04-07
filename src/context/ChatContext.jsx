import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      // Clear messages when user logs out
      setMessages([]);
    }
  }, [user]);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/history');
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
      setError('Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to the chat
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Connect to the KMIT chatbot backend
      const response = await axios.post('http://127.0.0.1:5000/chat', { query: text });
      
      // Add bot response to the chat
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response, // KMIT chatbot returns response in 'response' field
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    // If user is logged in, also clear chat history on the server
    if (user) {
      axios.delete('/api/history').catch(err => {
        console.error('Failed to clear chat history:', err);
      });
    }
  };

  const rateMessage = async (messageId, rating) => {
    try {
      await axios.post('/api/rate', { messageId, rating });
      
      // Update the message in the local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, rating } : msg
        )
      );
    } catch (err) {
      console.error('Failed to rate message:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        rateMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
