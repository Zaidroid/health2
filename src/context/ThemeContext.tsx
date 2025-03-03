import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Extend Theme type to include more options
type Theme = 'light' | 'dark' | 'system';
type ThemeColor = 'indigo' | 'blue' | 'purple' | 'teal' | 'emerald';

type ThemeContextProps = {
  theme: Theme;
  themeColor: ThemeColor;
  toggleTheme: () => void;
  setThemeManually: (newTheme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
  resolvedTheme: 'light' | 'dark'; // The actual theme after system preference is applied
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme with local storage or 'system' as default
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'light';
    console.log("Initial theme from localStorage:", savedTheme);
    console.log("Setting initial theme to:", initialTheme);
    return initialTheme; // Default to light theme
  });

  // Initialize theme color
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('themeColor') as ThemeColor | null;
    return savedColor || 'indigo';
  });

  // Resolved theme tracks what's actually applied (light/dark)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light'); // Force light initially

  // Update resolved theme when theme changes (this should run BEFORE system preference check)
  useEffect(() => {
    console.log("useEffect: theme changed to:", theme);
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log("System preference is dark:", isDarkMode);
      setResolvedTheme(isDarkMode ? 'dark' : 'light');
    } else {
      console.log("Setting resolvedTheme to:", theme);
      setResolvedTheme(theme as 'light' | 'dark');
    }
  }, [theme]);

  // Update theme when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      console.log("System preference changed");
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Set initial value based on system preference only if theme is 'system'
    if (theme === 'system') {
      handleChange();
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]); // Only depend on theme

  // Custom setter for theme color that ensures theme class is applied
  const setThemeColor = (color: ThemeColor) => {
    console.log("Setting theme color to:", color);
    setThemeColorState(color);
    
    // Force quick re-apply of theme classes to make changes more immediate
    document.documentElement.classList.remove(
      'theme-indigo',
      'theme-blue',
      'theme-purple',
      'theme-teal',
      'theme-emerald'
    );
    document.documentElement.classList.add(`theme-${color}`);
    localStorage.setItem('themeColor', color);
  };

  // Apply theme and color classes to document
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark');

    // Add current theme
    console.log("Applying resolvedTheme:", resolvedTheme);
    document.documentElement.classList.add(resolvedTheme);

    // Remove all color classes
    document.documentElement.classList.remove(
      'theme-indigo',
      'theme-blue',
      'theme-purple',
      'theme-teal',
      'theme-emerald'
    );

    // Add current color
    document.documentElement.classList.add(`theme-${themeColor}`);

    // Save preferences
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeColor', themeColor);
  }, [resolvedTheme, themeColor, theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      // Cycle through themes: light -> dark -> system -> light
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  const setThemeManually = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeColor,
        toggleTheme,
        setThemeManually,
        setThemeColor,
        resolvedTheme
      }}
    >
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
