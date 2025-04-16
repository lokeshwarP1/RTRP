import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable'; // Import the Timetable component
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

function App() {
  const { theme } = useTheme();
  const { loading } = useAuth();
  const location = useLocation();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 ease-in-out">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat-history"
              element={
                <ProtectedRoute>
                  <ChatHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
}

export default App;