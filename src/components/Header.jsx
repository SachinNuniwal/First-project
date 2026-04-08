import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

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
    const { isDark } = useTheme();
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

    const themeStyles = {
        header: {
            background: isDark ? 'rgba(22,27,34,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: isDark ? '#30363d' : '#d0d7de',
        },
        text: {
            primary: isDark ? '#e6edf3' : '#24292f',
            secondary: isDark ? '#8b949e' : '#57606a',
        },
        bg: {
            hover: isDark ? '#21262d' : '#eaeef2',
            secondary: isDark ? '#161b22' : '#f6f8fa',
        },
    };

    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b transition-colors"
            style={{
                background: themeStyles.header.background,
                borderColor: themeStyles.header.borderColor,
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* Left — Title & Subtitle */}
            <div className="flex flex-col justify-center">
                <h1
                    className="text-[18px] font-bold leading-tight tracking-wide transition-colors"
                    style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        color: themeStyles.text.primary,
                    }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-[11px] mt-0.5 transition-colors" style={{ color: themeStyles.text.secondary }}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-2">
                {/* Refresh */}
                <IconBtn isDark={isDark} title="Refresh" onClick={onRefresh} themeStyles={themeStyles}>
                    🔄
                </IconBtn>

                {/* Messages */}
                <IconBtn isDark={isDark} title="Messages" onClick={onMsgClick} themeStyles={themeStyles}>
                    💬
                </IconBtn>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        title="Notifications"
                        onClick={() => setShowNotifDropdown(p => !p)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[16px]"
                        style={{
                            color: isDark ? '#8b949e' : '#57606a',
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = themeStyles.bg.hover)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
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
                        <div
                            className="absolute right-0 top-10 w-80 rounded-xl shadow-2xl z-[200] overflow-hidden border transition-colors"
                            style={{
                                backgroundColor: themeStyles.bg.secondary,
                                borderColor: themeStyles.header.borderColor,
                            }}
                        >
                            <div
                                className="flex items-center justify-between px-4 py-3 border-b transition-colors"
                                style={{
                                    borderColor: themeStyles.header.borderColor,
                                    color: themeStyles.text.primary,
                                }}
                            >
                                <span className="text-[13px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                    🔔 Notifications
                                </span>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-cyan-400/15 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>

                            <div
                                className="max-h-72 overflow-y-auto divide-y transition-colors"
                                style={{
                                    borderColor: isDark ? '#21262d' : '#eaeef2',
                                }}
                            >
                                {recentNotifs.length === 0 ? (
                                    <div className="text-center text-[12px] py-6 transition-colors" style={{ color: themeStyles.text.secondary }}>
                                        No notifications
                                    </div>
                                ) : (
                                    recentNotifs.map(n => (
                                        <div
                                            key={n.id}
                                            className="px-4 py-3 flex gap-3 items-start transition-colors"
                                            style={{
                                                backgroundColor: !n.read ? (isDark ? 'rgba(34, 211, 237, 0.05)' : 'rgba(34, 211, 237, 0.08)') : 'transparent',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeStyles.bg.hover)}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !n.read ? (isDark ? 'rgba(34, 211, 237, 0.05)' : 'rgba(34, 211, 237, 0.08)') : 'transparent')}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] leading-snug transition-colors" style={{ color: !n.read ? themeStyles.text.primary : themeStyles.text.secondary }}>
                                                    {n.text}
                                                </p>
                                                <p className="text-[10px] mt-0.5 transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>
                                                    {n.time}
                                                </p>
                                            </div>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div
                                className="px-4 py-2.5 border-t transition-colors"
                                style={{ borderColor: themeStyles.header.borderColor }}
                            >
                                <button
                                    onClick={() => {
                                        setShowNotifDropdown(false);
                                        onNotifClick();
                                    }}
                                    className="w-full text-center text-[11px] hover:text-cyan-300 font-semibold transition-colors py-1"
                                    style={{ color: '#22d3ee' }}
                                >
                                    View all & manage →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Divider */}
                <div
                    className="w-px h-6 mx-1 transition-colors"
                    style={{ backgroundColor: themeStyles.header.borderColor }}
                />

                {/* Profile */}
                <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all group"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeStyles.bg.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] flex-shrink-0 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #f0a500, #ff7b29)' }}
                    >
                        {profile?.photo ? <img src={profile.photo} alt="profile" className="w-full h-full object-cover" /> : '🧑‍💼'}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[12px] font-semibold leading-tight transition-colors" style={{ color: themeStyles.text.primary }}>
                            {profile?.name?.split(' ').slice(-1)[0] || 'Admin'}
                        </div>
                        <div className="text-[9px] transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>
                            Level 5 Admin
                        </div>
                    </div>
                    <span className="text-[10px] hidden sm:block transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>
                        ▾
                    </span>
                </button>
            </div>
        </header>
    );
}

// Small reusable icon button
function IconBtn({ children, onClick, title, isDark, themeStyles }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[16px]"
            style={{
                color: isDark ? '#8b949e' : '#57606a',
                backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
                e.target.style.color = isDark ? '#e6edf3' : '#24292f';
                e.target.style.backgroundColor = themeStyles.bg.hover;
            }}
            onMouseLeave={(e) => {
                e.target.style.color = isDark ? '#8b949e' : '#57606a';
                e.target.style.backgroundColor = 'transparent';
            }}
        >
            {children}
        </button>
    );
}