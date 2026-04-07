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
    return (
        <aside className="w-60 bg-[#161b22] border-r border-[#30363d] flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto z-[100]">
            {/* Logo */}
            <div className="p-4 border-b border-[#30363d]">
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏛️</span>
                    <div>
                        <div className="text-[13px] font-bold tracking-widest text-yellow-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                            HOD / ADMIN
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile */}
            <div
                className="px-4 py-3.5 border-b border-[#30363d] text-center cursor-pointer hover:bg-[#21262d] transition-colors"
                onClick={onProfileClick}
            >
                <div className="relative inline-block mb-1.5">
                    {profile?.photo
                        ? <img src={profile.photo} alt="profile" className="w-12 h-12 rounded-full object-cover" />
                        : <span className="text-4xl">🧑‍💼</span>
                    }
                    <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#161b22]" />
                </div>
                <div className="font-bold text-[15px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{profile?.name}</div>
                <div className="text-[10px] text-[#8b949e] leading-relaxed mt-0.5">{profile?.desig}<br />Admin Access · Level 5</div>
                <div className="mt-1.5 text-[10px] text-cyan-400">✏️ Click to edit profile</div>
            </div>

            {/* Nav */}
            <nav className="flex-1 pb-4">
                {navItems.map(section => (
                    <div key={section.section} className="pt-2.5 pb-0.5">
                        <div className="text-[9px] font-bold tracking-[2px] text-[#484f58] px-4 py-1.5 uppercase">{section.section}</div>
                        {section.items.map(item => {
                            const badge = item.key === 'leaves' ? (pendingLeavesCount > 0 ? pendingLeavesCount : null) : item.badge;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => onNavigate(item.key)}
                                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-[12.5px] transition-all duration-150 border-l-[3px] text-left
                    ${activePage === item.key
                                            ? 'bg-cyan-400/8 text-cyan-400 border-cyan-400'
                                            : 'text-[#8b949e] border-transparent hover:bg-[#21262d] hover:text-[#e6edf3]'
                                        }`}
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
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[12.5px] text-[#8b949e] border-l-[3px] border-transparent hover:bg-[#21262d] hover:text-red-400 transition-all"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}