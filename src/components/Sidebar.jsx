import { useTheme } from '../context/ThemeContext';

const navItems = [
    {
        section: 'Overview', items: [
            { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { key: 'analytics', icon: '📊', label: 'Analytics' },
            { key: 'events', icon: '📆', label: 'Events', badge: null, badgeColor: 'cyan' },
        ]
    },
    {
        section: 'People', items: [
            { key: 'students', icon: '👩‍🎓', label: 'Students' },
            { key: 'teachers', icon: '👩‍🏫', label: 'Teachers' },
            { key: 'classes', icon: '🏫', label: 'Classes & Groups' },
        ]
    },
    {
        section: 'Academic', items: [
            { key: 'results', icon: '📋', label: 'Results Overview' },
            { key: 'attendance', icon: '📅', label: 'Attendance Reports' },
            { key: 'fee', icon: '💰', label: 'Fee Management', badge: '!', badgeColor: 'red' },
            { key: 'timetable', icon: '🗓️', label: 'Timetable' },
        ]
    },
    {
        section: 'Communication', items: [
            { key: 'messages', icon: '💬', label: 'Messages', badge: '5', badgeColor: 'cyan' },
            { key: 'leaves', icon: '🌿', label: 'Leave Approvals', badge: null, badgeColor: 'red' },
            { key: 'notices', icon: '📢', label: 'Notices' },
        ]
    },
    {
        section: 'System', items: [
            { key: 'settings', icon: '⚙️', label: 'Settings' },
        ]
    },
];

export default function Sidebar({ activePage, onNavigate, onLogout, profile, pendingLeavesCount, onProfileClick }) {
    const { isDark } = useTheme();
    const themeStyles = {
        bg: {
            primary: isDark ? '#161b22' : '#ffffff',
            hover: isDark ? '#21262d' : '#f4f6f8',
        },
        text: {
            primary: isDark ? '#e6edf3' : '#24292f',
            secondary: isDark ? '#8b949e' : '#57606a',
            tertiary: isDark ? '#484f58' : '#8c959f',
        },
        border: isDark ? '#30363d' : '#d0d7de',
    };

    return (
        <aside className="w-60 flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto z-[100] transition-colors"
            style={{ backgroundColor: themeStyles.bg.primary, borderRight: `1px solid ${themeStyles.border}` }}>
            {/* Logo */}
            <div className="p-4 border-b transition-colors" style={{ borderColor: themeStyles.border }}>
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏛️</span>
                    <div>
                        <div className="text-[13px] font-bold tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#fbbf24' }}>
                            HOD / ADMIN
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile */}
            <div
                className="px-4 py-3.5 border-b text-center cursor-pointer transition-colors"
                style={{ borderColor: themeStyles.border }}
                onClick={onProfileClick}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = themeStyles.bg.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <div className="relative inline-block mb-1.5">
                    {profile?.photo
                        ? <img src={profile.photo} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                        : <span className="text-4xl">🧑‍💼</span>
                    }
                    <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#161b22]" />
                </div>
                <div className="font-bold text-[15px]" style={{ fontFamily: 'Rajdhani, sans-serif', color: themeStyles.text.primary }}>{profile?.name}</div>
                <div className="text-[10px] leading-relaxed mt-0.5" style={{ color: themeStyles.text.secondary }}>{profile?.desig}<br />Admin Access · Level 5</div>
                <div className="mt-1.5 text-[10px] text-cyan-400">✏️ Click to edit profile</div>
            </div>

            {/* Nav */}
            <nav className="flex-1 pb-4">
                {navItems.map(section => (
                    <div key={section.section} className="pt-2.5 pb-0.5">
                        <div className="text-[9px] font-bold tracking-[2px] px-4 py-1.5 uppercase transition-colors" style={{ color: themeStyles.text.tertiary }}>{section.section}</div>
                        {section.items.map(item => {
                            const badge = item.key === 'leaves' ? (pendingLeavesCount > 0 ? pendingLeavesCount : null) : item.badge;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => onNavigate(item.key)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[12.5px] transition-all duration-150 border-l-[3px] text-left"
                                    style={{
                                        backgroundColor: activePage === item.key ? (isDark ? 'rgba(0,212,255,0.1)' : 'rgba(6,182,212,0.12)') : 'transparent',
                                        color: activePage === item.key ? '#22d3ee' : themeStyles.text.secondary,
                                        borderColor: activePage === item.key ? '#22d3ee' : 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activePage !== item.key) {
                                            e.currentTarget.style.backgroundColor = themeStyles.bg.hover;
                                            e.currentTarget.style.color = themeStyles.text.primary;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activePage !== item.key) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = themeStyles.text.secondary;
                                        }
                                    }}
                                >
                                    <span className="text-sm">{item.icon}</span>
                                    <span className="flex-1">{item.label}</span>
                                    {badge && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor === 'cyan' ? 'bg-cyan-400 text-black' : 'bg-red-500 text-white'
                                            }`}>
                                            {badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}

                {/* Logout */}
                <div className="pt-2.5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[12.5px] border-l-[3px] border-transparent transition-all"
                        style={{ color: themeStyles.text.secondary }}
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