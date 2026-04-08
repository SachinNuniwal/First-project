import { useTheme } from '../context/ThemeContext';

export default function Toppers() {
    const { isDark } = useTheme();
    
    const bgColor = isDark ? '#1c2333' : '#ffffff';
    const borderColor = isDark ? '#30363d' : '#d0d7de';
    const cardBgColor = isDark ? '#0d1117' : '#f0f2f5';
    const textColor = isDark ? '#e6edf3' : '#24292f';

    const toppers = [
        { name: "Aman", marks: 95 },
        { name: "Riya", marks: 93 },
        { name: "Rahul", marks: 91 },
    ];

    return (
        <div 
            className="p-4 rounded transition-colors"
            style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
        >
            <h3 className="font-semibold mb-2 transition-colors" style={{ color: textColor }}>🏆 Top Performers</h3>

            <div className="grid grid-cols-3 gap-2">
                {toppers.map((t, i) => (
                    <div 
                        key={i} 
                        className="p-2 rounded text-center transition-colors"
                        style={{ backgroundColor: cardBgColor, color: textColor }}
                    >
                        {t.name}
                        <br />
                        {t.marks}%
                    </div>
                ))}
            </div>
        </div>
    );
}