import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  fontSize: number;
  isDarkMode: boolean;
  isThemeTransitioning: boolean;
  setFontSize: (size: number) => void;
  setIsDarkMode: (isDark: boolean) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_FONT_SIZE = 16; // Updated to 16px as requested

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  // Apply font size to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

  // Apply dark mode class with transition loading
  useEffect(() => {
    setIsThemeTransitioning(true);
    
    // Small delay to show loading state
    const transitionTimer = setTimeout(() => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // End transition state after DOM update
      setTimeout(() => {
        setIsThemeTransitioning(false);
      }, 100);
    }, 50);

    return () => clearTimeout(transitionTimer);
  }, [isDarkMode]);

  const increaseFontSize = () => {
    if (fontSize < 20) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    fontSize,
    isDarkMode,
    isThemeTransitioning,
    setFontSize, // Direct setter for HeaderBar compatibility
    setIsDarkMode, // Direct setter for HeaderBar compatibility
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {isThemeTransitioning && (
        <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Switching theme...
            </span>
          </div>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}