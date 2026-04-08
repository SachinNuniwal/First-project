import { createContext, useContext, useState, useLayoutEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        // Get theme from localStorage or default to dark
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved ? saved === 'dark' : true;
        }
        return true;
    });

    useLayoutEffect(() => {
        const root = document.documentElement;
        const theme = isDark ? 'dark' : 'light';

        localStorage.setItem('theme', theme);
        root.classList.toggle('dark', isDark);
        root.classList.toggle('light', !isDark);
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);
    const setTheme = (mode) => setIsDark(mode === 'dark');

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
