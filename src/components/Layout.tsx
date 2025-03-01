import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Calendar as CalendarIcon, LogOut, Menu, X, Home, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) return null;
  
  if (!user) {
    navigate('/login');
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Activity className="h-8 w-8 text-indigo-600" />
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                >
                  Zaid Health
                </motion.span>
              </Link>
              
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="mr-2"
                    >
                      {item.icon}
                    </motion.div>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center mr-4 bg-indigo-50 px-3 py-2 rounded-full"
                >
                  <User className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-700">{user.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </motion.button>
              </div>
              
              <div className="flex md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </div>
                  </Link>
                ))}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2">
                    <User className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-indigo-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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