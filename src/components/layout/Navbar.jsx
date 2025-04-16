import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Menu, X, LogOut, User, MessageSquare, LayoutDashboard, ChevronDown, History, Calendar } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    ...(user ? [{ name: 'Chat', path: '/chat' }] : []),
    ...(user ? [{ name: 'Timetable', path: '/timetable' }] : []), // Add Timetable link
    ...(user ? [] : [
      { name: 'Login', path: '/login' },
      { name: 'Register', path: '/signup' }
    ]),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-8 h-8"
            >
              <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                CG
              </div>
            </motion.div>
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg font-bold"
            >
              Campus Genie
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                {item.name === 'Timetable' ? (
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-2" /> {/* Icon for Timetable */}
                    {item.name}
                  </span>
                ) : (
                  item.name
                )}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* User Profile */}
            {user && (
              <div className="relative profile-menu">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <User size={20} className="text-primary" />
                  <span className="text-sm font-medium">{user.name || 'User'}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 py-1 bg-background rounded-md shadow-lg border border-border"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Student Dashboard
                      </Link>
                      <Link
                        to="/chat-history"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <History size={16} className="mr-2" />
                        Chat History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden py-4 border-t border-border"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 flex items-center"
                  >
                    {item.name === 'Timetable' ? (
                      <>
                        <Calendar size={16} className="mr-2" /> {/* Icon for Timetable */}
                        {item.name}
                      </>
                    ) : (
                      item.name
                    )}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 flex items-center"
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      Student Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
