import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle = () => {
  const { theme, themeColor, toggleTheme, setThemeManually, setThemeColor, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { value: 'light', icon: <Sun className="h-5 w-5" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="h-5 w-5" />, label: 'Dark' },
    { value: 'system', icon: <Monitor className="h-5 w-5" />, label: 'System' },
  ];

  const colorOptions = [
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
    { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
        }`}
        aria-label="Theme settings"
      >
        {theme === 'system' ? (
          <Monitor className="h-5 w-5" />
        ) : resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 ${
              resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="px-3 py-2">
              <h3 className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Appearance
              </h3>
              <div className="mt-2 space-y-1">
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setThemeManually(option.value as any);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                      theme === option.value
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-3 py-2">
              <h3 className={`text-sm font-medium flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <Palette className="h-4 w-4 mr-1" />
                Accent Color
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setThemeColor(color.value as any);
                    }}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      themeColor === color.value ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800' : ''
                    }`}
                    title={color.label}
                    aria-label={`Set color theme to ${color.label}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
