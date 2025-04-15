import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:4000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (token exists in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout(); // Token might be invalid or expired
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (email, password, name) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/signup', { email, password, name });
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  const googleLogin = async (tokenId) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/google', { tokenId });
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Google login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const githubLogin = async (code) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/github', { code });
      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'GitHub login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        signup, 
        logout, 
        googleLogin, 
        githubLogin 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
