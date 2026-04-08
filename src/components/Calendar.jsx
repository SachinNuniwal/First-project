import { useTheme } from '../context/ThemeContext';

export default function Calendar() {
    const { isDark } = useTheme();
    
    const bgColor = isDark ? '#1c2333' : '#ffffff';
    const borderColor = isDark ? '#30363d' : '#d0d7de';
    const textColor = isDark ? '#e6edf3' : '#24292f';

    return (
        <div 
            className="p-4 rounded text-center transition-colors"
            style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, color: textColor }}
        >
            <h3 className="font-semibold">📅 India Calendar</h3>
            <p className="mt-2">{new Date().toDateString()}</p>
        </div>
    );
}