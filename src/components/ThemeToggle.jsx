import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center 
                transition-all duration-300 
                ${isDark 
                    ? 'bg-[#21262d] hover:bg-[#30363d] text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }
            `}
        >
            {isDark ? (
                <Sun size={18} className="transition-transform duration-300" />
            ) : (
                <Moon size={18} className="transition-transform duration-300" />
            )}
        </button>
    );
}
