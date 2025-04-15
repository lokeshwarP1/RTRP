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
      // Fetch chat history from the backend with user ID
      const response = await axios.get(`http://127.0.0.1:4000/api/chat/history/${user?._id}`);
      setMessages(response.data.messages || []); // Ensure messages are an array
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

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send the query to the Flask backend with user ID
      const response = await axios.post('http://127.0.0.1:4000/api/chat', { 
        query: text,
        userId: user?._id 
      });

      // Add bot response to the chat
      const botMessage = {
        id: `${Date.now() + 1}`,
        text: Array.isArray(response.data.response)
          ? response.data.response.join('\n') // Join bullet points into a single string
          : response.data.response || 'No response available.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');

      // Add error message to chat
      const errorMessage = {
        id: `${Date.now() + 1}`,
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]); // Clear local messages

    // If user is logged in, also clear chat history on the server
    if (user) {
      clearChatHistory();
    }
  };

  const clearChatHistory = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://127.0.0.1:4000/api/chat/history/${user?._id}`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const rateMessage = async (messageId, rating) => {
    try {
      // Send the rating to the backend with user ID
      await axios.post('http://127.0.0.1:4000/api/rate', { 
        messageId, 
        rating,
        userId: user?._id 
      });

      // Update the message in the local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
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