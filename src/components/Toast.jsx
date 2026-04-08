import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Toast({ message, onHide }) {
    const { isDark } = useTheme();
    
    const bgColor = isDark ? '#1c2333' : '#ffffff';
    const borderColor = isDark ? '#00d4ff' : '#1f6feb';
    const textColor = isDark ? '#e6edf3' : '#24292f';

    useEffect(() => {
        if (!message) return;
        const t = setTimeout(onHide, 3000);
        return () => clearTimeout(t);
    }, [message, onHide]);

    if (!message) return null;

    return (
        <div 
            className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-[13px] z-[9999] shadow-2xl animate-[slideUp_0.3s_ease] transition-colors border"
            style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor
            }}
        >
            {message}
        </div>
    );
}