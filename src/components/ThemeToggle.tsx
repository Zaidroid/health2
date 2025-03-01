import React from 'react';
    import { useTheme } from '../context/ThemeContext';
    import { Sun, Moon } from 'lucide-react';
    import { motion } from 'framer-motion';

    export const ThemeToggle = () => {
      const { theme, toggleTheme } = useTheme();

      return (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`rounded-full p-2 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-dark-primary text-dark-foreground' : 'bg-indigo-600 text-white'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </motion.button>
      );
    };
