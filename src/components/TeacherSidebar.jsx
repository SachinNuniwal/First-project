const navItems = [
    {
        section: 'Main', items: [
            { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { key: 'result', icon: '📊', label: 'Upload Results', badge: 'New', badgeColor: 'cyan' },
            { key: 'attendance', icon: '📅', label: 'Attendance' },
        ]
    },
    {
        section: 'Communication', items: [
            { key: 'groups', icon: '👥', label: 'My Groups' },
            { key: 'messages', icon: '💬', label: 'Messages', badge: '3', badgeColor: 'red' },
        ]
    },
    {
        section: 'Management', items: [
            { key: 'leaves', icon: '🌿', label: 'Leave Management' },
            { key: 'subjects', icon: '📚', label: 'Subject Performance' },
        ]
    },
    {
        section: 'Account', items: [
            { key: 'profile', icon: '👤', label: 'My Profile' },
        ]
    },
];

import { useTheme } from '../context/ThemeContext';

export default function TeacherSidebar({ activePage, onNavigate, onLogout, teacher }) {
    const { isDark } = useTheme();

    const themeStyles = {
        bg: {
            primary: isDark ? '#161b22' : '#f6f8fa',
            secondary: isDark ? '#21262d' : '#eaeef2',
            hover: isDark ? '#21262d' : '#eaeef2',
        },
        text: {
            primary: isDark ? '#e6edf3' : '#24292f',
            secondary: isDark ? '#8b949e' : '#57606a',
            tertiary: isDark ? '#484f58' : '#8c959f',
        },
        border: isDark ? '#30363d' : '#d0d7de',
    };

    return (
        <aside 
            className="w-64 border-r flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto z-[100] transition-colors"
            style={{
                backgroundColor: themeStyles.bg.primary,
                borderColor: themeStyles.border,
            }}
        >
            {/* Logo */}
            <div 
                className="p-5 border-b transition-colors"
                style={{ borderColor: themeStyles.border }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #0db4a4)' }}>
                        🏛️
                    </div>
                    <div 
                        className="text-[14px] font-bold tracking-widest transition-colors"
                        style={{ 
                            fontFamily: 'Rajdhani, sans-serif',
                            color: isDark ? '#00d4ff' : '#0080a3'
                        }}
                    >
                        TEACHER PORTAL
                    </div>
                </div>
            </div>

            {/* Profile */}
            <div 
                className="px-4 py-4 border-b flex flex-col items-center text-center transition-colors"
                style={{
                    borderColor: themeStyles.border,
                    color: themeStyles.text.primary,
                }}
            >
                <div className="relative inline-block mb-2">
                    <div 
                        className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl overflow-hidden"
                        style={{ 
                            borderColor: isDark ? '#00d4ff' : '#0080a3',
                            background: isDark ? 'linear-gradient(135deg, #2a4a6b, #1a3a5c)' : 'linear-gradient(135deg, #d0e8f2, #b0d0e8)'
                        }}
                    >
                        {teacher?.photo
                            ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover rounded-full" />
                            : '👩‍🏫'
                        }
                    </div>
                    <div 
                        className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
                        style={{ borderColor: themeStyles.bg.primary }}
                    />
                </div>
                <div className="font-bold text-[15px] transition-colors" style={{ fontFamily: 'Rajdhani, sans-serif', color: themeStyles.text.primary }}>
                    {teacher?.name || 'Dr. Priya Verma'}
                </div>
                <div className="text-[10px] leading-relaxed mt-0.5 transition-colors" style={{ color: themeStyles.text.secondary }}>
                    Dept. of {teacher?.dept || 'Computer Science'}<br />
                    {teacher?.id || 'TCH-4421'} · {teacher?.designation || 'Sr. Professor'}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 pb-4">
                {navItems.map(section => (
                    <div key={section.section} className="pt-3 pb-0.5">
                        <div 
                            className="text-[9px] font-bold tracking-[2px] px-4 py-1.5 uppercase transition-colors"
                            style={{ color: themeStyles.text.tertiary }}
                        >
                            {section.section}
                        </div>
                        {section.items.map(item => {
                            const isActive = activePage === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => onNavigate(item.key)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-all duration-150 border-l-[3px] text-left"
                                    style={{
                                        backgroundColor: isActive ? (isDark ? 'rgba(34, 211, 237, 0.1)' : 'rgba(34, 211, 237, 0.15)') : 'transparent',
                                        color: isActive ? '#22d3ee' : themeStyles.text.secondary,
                                        borderColor: isActive ? '#22d3ee' : 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = themeStyles.bg.hover;
                                            e.currentTarget.style.color = themeStyles.text.primary;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = themeStyles.text.secondary;
                                        }
                                    }}
                                >
                                    <span className="text-sm">{item.icon}</span>
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                            ${item.badgeColor === 'cyan' ? 'bg-cyan-400 text-black' : 'bg-red-500 text-white'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}

                {/* Logout */}
                <div className="pt-3 px-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] border-l-[3px] border-transparent transition-all rounded-r-lg"
                        style={{
                            color: themeStyles.text.secondary,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = themeStyles.bg.hover;
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = themeStyles.text.secondary;
                        }}
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}