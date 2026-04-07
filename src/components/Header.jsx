import { useState, useRef, useEffect } from 'react';

export default function Topbar({
    title,
    subtitle,
    unreadCount,
    profile,
    notifications,
    onNotifClick,
    onMsgClick,
    onProfileClick,
    onRefresh,
}) {
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const notifRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const recentNotifs = (notifications || []).slice(0, 5);

    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-[#30363d]"
            style={{ background: 'rgba(22,27,34,0.95)', backdropFilter: 'blur(10px)' }}
        >
            {/* Left — Title & Subtitle */}
            <div className="flex flex-col justify-center">
                <h1
                    className="text-[18px] font-bold text-[#e6edf3] leading-tight tracking-wide"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[11px] text-[#8b949e] mt-0.5">{subtitle}</p>
                )}
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-2">

                {/* Refresh */}
                <IconBtn title="Refresh" onClick={onRefresh}>
                    🔄
                </IconBtn>

                {/* Messages */}
                <IconBtn title="Messages" onClick={onMsgClick}>
                    💬
                </IconBtn>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        title="Notifications"
                        onClick={() => setShowNotifDropdown(p => !p)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-all text-[16px]"
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifDropdown && (
                        <div className="absolute right-0 top-10 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-[200] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                                <span className="text-[13px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                    🔔 Notifications
                                </span>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-cyan-400/15 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>

                            <div className="max-h-72 overflow-y-auto divide-y divide-[#21262d]">
                                {recentNotifs.length === 0 ? (
                                    <div className="text-center text-[#8b949e] text-[12px] py-6">No notifications</div>
                                ) : recentNotifs.map(n => (
                                    <div
                                        key={n.id}
                                        className={`px-4 py-3 flex gap-3 items-start transition-colors hover:bg-[#1c2128]
                                            ${!n.read ? 'bg-cyan-400/5' : ''}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[12px] leading-snug ${!n.read ? 'text-[#e6edf3]' : 'text-[#8b949e]'}`}>
                                                {n.text}
                                            </p>
                                            <p className="text-[10px] text-[#484f58] mt-0.5">{n.time}</p>
                                        </div>
                                        {!n.read && (
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-2.5 border-t border-[#30363d]">
                                <button
                                    onClick={() => { setShowNotifDropdown(false); onNotifClick(); }}
                                    className="w-full text-center text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors py-1"
                                >
                                    View all & manage →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[#30363d] mx-1" />

                {/* Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#21262d] transition-all group"
                >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] flex-shrink-0 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #f0a500, #ff7b29)' }}>
                        {profile?.photo
                            ? <img src={profile.photo} alt="profile" className="w-full h-full object-cover" />
                            : '🧑‍💼'
                        }
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[12px] font-semibold text-[#e6edf3] leading-tight group-hover:text-cyan-400 transition-colors">
                            {profile?.name?.split(' ').slice(-1)[0] || 'Admin'}
                        </div>
                        <div className="text-[9px] text-[#484f58]">Level 5 Admin</div>
                    </div>
                    <span className="text-[#484f58] text-[10px] hidden sm:block">▾</span>
                </button>
            </div>
        </header>
    );
}

// Small reusable icon button
function IconBtn({ children, onClick, title }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-all text-[16px]"
        >
            {children}
        </button>
    );
}