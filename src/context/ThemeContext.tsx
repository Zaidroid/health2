import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

    type Theme = 'light' | 'dark';

    type ThemeContextProps = {
      theme: Theme;
      toggleTheme: () => void;
    };

    const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

    type ThemeProviderProps = {
      children: ReactNode;
    };

    export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
      const [theme, setTheme] = useState<Theme>(() => {
        // Check local storage for saved theme, default to light
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        return savedTheme || 'light';
      });

      useEffect(() => {
        // Update the HTML element's class whenever the theme changes
        document.documentElement.classList.toggle('dark', theme === 'dark');
        // Save theme to local storage
        localStorage.setItem('theme', theme);
      }, [theme]);

      const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
      };

      return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      );
    };

    export const useTheme = () => {
      const context = useContext(ThemeContext);
      if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
      }
      return context;
    };
