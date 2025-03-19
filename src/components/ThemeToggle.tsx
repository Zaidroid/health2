import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const ThemeToggle = () => {
  const { theme, themeColor, toggleTheme, setThemeManually, setThemeColor, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const themeOptions = [
    { value: 'light', icon: <Sun className="h-5 w-5" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="h-5 w-5" />, label: 'Dark' },
    { value: 'system', icon: <Monitor className="h-5 w-5" />, label: 'System' },
  ];

  const colorOptions = [
    { value: 'indigo', label: 'Indigo', tailwindClass: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', tailwindClass: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', tailwindClass: 'bg-purple-500' },
    { value: 'teal', label: 'Teal', tailwindClass: 'bg-teal-500' },
    { value: 'emerald', label: 'Emerald', tailwindClass: 'bg-emerald-500' },
  ];

  // Get the active theme color's Tailwind class
  const activeColorClass = colorOptions.find(c => c.value === themeColor)?.tailwindClass || 'bg-indigo-500';

  // Helper function to get theme color-specific styles
  const getThemeColorStyle = (intensity = 500) => {
    return {
      color: `rgb(var(--color-primary-${intensity}))`
    };
  };

  const getThemeBgStyle = (intensity = 100) => {
    return {
      backgroundColor: `rgb(var(--color-primary-${intensity}))`
    };
  };

  // Close the menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus the first theme option when the menu opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Find the first button inside the menu
      const firstButton = menuRef.current.querySelector('button');
      if (firstButton) {
        // Use a slight delay to allow the menu animation to complete
        setTimeout(() => {
          firstButton.focus();
        }, 100);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-full transition-colors duration-200 ${
          resolvedTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        aria-label="Toggle theme options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Palette className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50 ${
              resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="theme-options-menu"
          >
            <div className="px-3 py-2">
              <h3 className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Appearance
              </h3>
              <div className="mt-2 space-y-1">
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05, backgroundColor: `rgba(var(--color-primary-200), ${resolvedTheme === 'dark' ? '0.1' : '0.5'})` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setThemeManually(option.value as any);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                      theme === option.value
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    style={theme === option.value ? {
                      ...getThemeColorStyle(700),
                      ...getThemeBgStyle(100)
                    } : {}}
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <span className="mr-2" style={theme === option.value ? getThemeColorStyle(700) : {}}>
                        {option.icon}
                      </span>
                      {option.label}
                    </div>
                    {theme === option.value && (
                      <Check className="h-4 w-4" style={getThemeColorStyle(700)} />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-3 py-2">
              <h3 className={`text-sm font-medium flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <Palette className="h-4 w-4 mr-1" />
                Accent Color
              </h3>
              <div className="mt-3 flex flex-wrap gap-3 justify-center">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setThemeColor(color.value as any);
                      setIsOpen(false);
                      // Add a slight delay to show the effect
                      setTimeout(() => {
                        toast.success(`Theme color changed to ${color.label}`);
                      }, 200);
                    }}
                    className={`relative w-10 h-10 rounded-full ${color.tailwindClass} shadow-md transition-transform duration-200 ${
                      themeColor === color.value ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400' : ''
                    }`}
                    title={color.label}
                    aria-label={`Set color theme to ${color.label}`}
                    role="menuitem"
                  >
                    {themeColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
