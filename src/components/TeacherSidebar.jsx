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

export default function TeacherSidebar({ activePage, onNavigate, onLogout, teacher }) {
    return (
        <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto z-[100]">
            {/* Logo */}
            <div className="p-5 border-b border-[#30363d]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #0db4a4)' }}>
                        🏛️
                    </div>
                    <div className="text-[14px] font-bold tracking-widest text-[#00d4ff]"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        TEACHER PORTAL
                    </div>
                </div>
            </div>

            {/* Profile */}
            <div className="px-4 py-4 border-b border-[#30363d] flex flex-col items-center text-center">
                <div className="relative inline-block mb-2">
                    <div className="w-16 h-16 rounded-full border-2 border-[#00d4ff] flex items-center justify-center text-3xl overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #2a4a6b, #1a3a5c)' }}>
                        {teacher?.photo
                            ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover rounded-full" />
                            : '👩‍🏫'
                        }
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#161b22]" />
                </div>
                <div className="font-bold text-[15px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {teacher?.name || 'Dr. Priya Verma'}
                </div>
                <div className="text-[10px] text-[#8b949e] leading-relaxed mt-0.5">
                    Dept. of {teacher?.dept || 'Computer Science'}<br />
                    {teacher?.id || 'TCH-4421'} · {teacher?.designation || 'Sr. Professor'}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 pb-4">
                {navItems.map(section => (
                    <div key={section.section} className="pt-3 pb-0.5">
                        <div className="text-[9px] font-bold tracking-[2px] text-[#484f58] px-4 py-1.5 uppercase">
                            {section.section}
                        </div>
                        {section.items.map(item => (
                            <button
                                key={item.key}
                                onClick={() => onNavigate(item.key)}
                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-all duration-150 border-l-[3px] text-left
                                    ${activePage === item.key
                                        ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400'
                                        : 'text-[#8b949e] border-transparent hover:bg-[#21262d] hover:text-[#e6edf3]'
                                    }`}
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
                        ))}
                    </div>
                ))}

                {/* Logout */}
                <div className="pt-3 px-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-[#8b949e] border-l-[3px] border-transparent hover:bg-[#21262d] hover:text-red-400 transition-all rounded-r-lg"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}