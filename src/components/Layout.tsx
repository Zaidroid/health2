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

  // Get theme-specific colors
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'indigo':
        return {
          primary: '#4f46e5',
          accent: '#6366f1',
          light: '#eef2ff',
          dark: '#312e81',
          lightSolid: '239, 246, 255',
          darkSolid: '79, 70, 229'
        };
      case 'blue':
        return {
          primary: '#2563eb',
          accent: '#3b82f6',
          light: '#eff6ff',
          dark: '#1e40af',
          lightSolid: '239, 246, 255',
          darkSolid: '37, 99, 235'
        };
      case 'purple':
        return {
          primary: '#7e22ce',
          accent: '#8b5cf6',
          light: '#f5f3ff',
          dark: '#581c87',
          lightSolid: '245, 243, 255',
          darkSolid: '126, 34, 206'
        };
      case 'teal':
        return {
          primary: '#0d9488',
          accent: '#14b8a6',
          light: '#f0fdfa',
          dark: '#115e59',
          lightSolid: '240, 253, 250',
          darkSolid: '13, 148, 136'
        };
      case 'emerald':
        return {
          primary: '#047857',
          accent: '#10b981',
          light: '#ecfdf5',
          dark: '#064e3b',
          lightSolid: '236, 253, 245',
          darkSolid: '4, 120, 87'
        };
      default:
        return {
          primary: '#4f46e5',
          accent: '#6366f1',
          light: '#eef2ff',
          dark: '#312e81',
          lightSolid: '239, 246, 255',
          darkSolid: '79, 70, 229'
        };
    }
  };

  const colors = getThemeColors(themeColor);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5" /> },
    { path: '/workoutprogress', label: 'Workout Progress', icon: <TrendingUp className="h-5 w-5" /> },
  ];

  // Define a base animation object for navigation items
  const navItemAnimation = {
    whileHover: {
      scale: 1.02, // Reduced scale for more subtle effect
      backgroundColor: `rgba(var(--color-primary-200), ${resolvedTheme === 'dark' ? '0.1' : '0.5'})`,
      transition: { duration: 0.15 } // Reduced duration for smoother animation
    },
    whileTap: { scale: 0.98 } // Reduced scale for more subtle effect
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center px-2 py-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Activity className="h-8 w-8" style={{ color: colors.primary }} />
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
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      className="relative"
                      whileHover={navItemAnimation.whileHover}
                      whileTap={navItemAnimation.whileTap}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'text-gray-900 dark:text-white border' // Added border
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? `rgba(var(--color-primary-500), ${resolvedTheme === 'dark' ? '0.2' : '0.1'})` : 'transparent',
                          borderColor: isActive ? colors.accent : 'transparent', // Conditional border color
                        }}
                      >
                        <span className="mr-2" style={{ color: isActive ? colors.primary : 'inherit' }}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-0 left-0 h-0.5 bg-primary-500 rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Section: User Profile, Sign Out, Theme Toggle, Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Profile and Sign Out */}
              <div className="hidden md:flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: `rgba(var(--color-primary-200), ${resolvedTheme === 'dark' ? '0.1' : '0.5'})` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  style={{
                    color: colors.accent,
                    border: `1px solid ${colors.accent}`,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                  }}
                >
                  <span className="text-sm font-medium">
                    {user?.name || 'Guest'}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: `rgba(var(--color-primary-200), ${resolvedTheme === 'dark' ? '0.1' : '0.5'})` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  style={{
                    color: colors.primary,
                    border: `1px solid ${colors.accent}`,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" style={{ color: colors.accent }} />
                  Sign Out
                </motion.button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-md transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                  style={{
                    color: mobileMenuOpen ? colors.accent : colors.primary,
                    backgroundColor: mobileMenuOpen
                      ? (resolvedTheme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)')
                      : 'transparent'
                  }}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.button>
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
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        className="relative"
                        whileHover={navItemAnimation.whileHover}
                        whileTap={navItemAnimation.whileTap}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            isActive
                              ? 'text-gray-900 dark:text-white border' // Added border
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                          style={{
                            backgroundColor: isActive ? `rgba(var(--color-primary-500), ${resolvedTheme === 'dark' ? '0.2' : '0.1'})` : 'transparent',
                            borderColor: isActive ? colors.accent : 'transparent', // Conditional border color
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="mr-2" style={{ color: isActive ? colors.primary : 'inherit' }}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.span
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.2 }}
                              className="absolute bottom-0 left-0 h-0.5 bg-primary-500 rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* User profile in mobile menu */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2"> {/* Container for buttons */}
                      <motion.button
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                        style={{
                          color: colors.accent,
                          border: `1px solid ${colors.accent}`,
                          backgroundColor: resolvedTheme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {user?.name || 'Guest'}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                        style={{
                          color: colors.primary,
                          border: `1px solid ${colors.accent}`,
                          backgroundColor: resolvedTheme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)'
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: `rgba(var(--color-primary-200), ${resolvedTheme === 'dark' ? '0.1' : '0.5'})` }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogOut className="h-4 w-4 mr-2" style={{ color: colors.accent }} />
                        
                      </motion.button>
                    </div>
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
