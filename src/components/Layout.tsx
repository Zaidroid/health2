import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Calendar as CalendarIcon, LogOut, Menu, X, Home, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export function Layout() {
  const { user, signOut, loading, guest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, themeColor } = useTheme();

  useEffect(() => {
    if (loading) return;
    if (!user && !guest && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, loading, guest, navigate, location.pathname]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5" /> },
    { path: '/workoutprogress', label: 'Workout Progress', icon: <TrendingUp className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center px-2 py-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2 text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Zaid Health
                </motion.span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white'
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} className="mr-2">
                      {item.icon}
                    </motion.div>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section: User Profile, Sign Out, Theme Toggle, Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Profile and Sign Out */}
              <div className="hidden md:flex items-center space-x-3">
                {guest ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <User className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Guest User
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center bg-indigo-50 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm font-medium text-indigo-700 dark:text-gray-200"
                  >
                    <User className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    {user?.name}
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center px-3 py-1.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </motion.button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="px-4 py-4 space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === item.path
                          ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  ))}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    {guest ? (
                      <div className="flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <User className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        Guest User
                      </div>
                    ) : (
                      <div className="flex items-center px-3 py-2 rounded-md bg-indigo-50 dark:bg-gray-700 text-sm font-medium text-indigo-700 dark:text-gray-200">
                        <User className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                        {user?.name}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="mt-2 w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
