import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function TeacherHeader({ title, subtitle, teacher, onRefresh, onProfileClick }) {
    const { isDark } = useTheme();
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const notifications = [
        { id: 1, text: '📋 Result submission deadline: 10th April', time: '2 hr ago', read: false },
        { id: 2, text: '🏫 Department meeting on 5th April at 11 AM', time: '3 hr ago', read: false },
        { id: 3, text: '📊 Mid-term exam schedule released', time: '1 day ago', read: true },
    ];
    const unread = notifications.filter(n => !n.read).length;

    const themeStyles = {
        header: {
            background: isDark ? 'rgba(22,27,34,0.97)' : 'rgba(255,255,255,0.95)',
            borderColor: isDark ? '#30363d' : '#d0d7de',
        },
        text: {
            primary: isDark ? '#e6edf3' : '#24292f',
            secondary: isDark ? '#8b949e' : '#57606a',
            tertiary: isDark ? '#484f58' : '#8c959f',
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
                backdropFilter: 'blur(10px)' 
            }}>
            {/* Left */}
            <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-bold leading-tight transition-colors"
                    style={{ 
                        fontFamily: 'Rajdhani, sans-serif',
                        color: themeStyles.text.primary 
                    }}>
                    {title}
                </h1>
                {subtitle && <p className="text-[11px] mt-0.5 transition-colors" style={{ color: themeStyles.text.secondary }}>{subtitle}</p>}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Refresh */}
                <button 
                    onClick={onRefresh}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[16px]"
                    style={{ color: isDark ? '#8b949e' : '#57606a' }}
                    onMouseEnter={(e) => {
                        e.target.style.color = isDark ? '#e6edf3' : '#24292f';
                        e.target.style.backgroundColor = themeStyles.bg.hover;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = isDark ? '#8b949e' : '#57606a';
                        e.target.style.backgroundColor = 'transparent';
                    }}
                >
                    🔄
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotif(p => !p)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[16px]"
                        style={{ color: isDark ? '#8b949e' : '#57606a' }}
                        onMouseEnter={(e) => {
                            e.target.style.color = isDark ? '#e6edf3' : '#24292f';
                            e.target.style.backgroundColor = themeStyles.bg.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = isDark ? '#8b949e' : '#57606a';
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        🔔
                        {unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                {unread}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div 
                            className="absolute right-0 top-10 rounded-xl shadow-2xl z-[200] overflow-hidden border transition-colors"
                            style={{ 
                                width: 300,
                                backgroundColor: themeStyles.bg.secondary,
                                borderColor: themeStyles.header.borderColor,
                            }}>
                            <button
                                onClick={onProfileClick}
                                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all group w-full"
                                style={{ backgroundColor: 'transparent' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeStyles.bg.hover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] overflow-hidden flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #0db4a4)' }}>
                        {teacher?.photo
                            ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover" />
                            : '👩‍🏫'
                        }
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[12px] font-semibold leading-tight transition-colors" style={{ color: themeStyles.text.primary }}>
                            {teacher?.name?.split(' ').slice(-1)[0] || 'Teacher'}
                        </div>
                        <div className="text-[9px] transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>
                            {teacher?.id || 'TCH-4421'}
                        </div>
                    </div>
                    <span className="text-[10px] hidden sm:block transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>
                        ▾
                    </span>
                            </button>
                            <div 
                                className="max-h-64 overflow-y-auto divide-y transition-colors"
                                style={{
                                    borderColor: isDark ? '#21262d' : '#eaeef2',
                                }}
                            >
                                {notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        className="px-4 py-3 transition-colors"
                                        style={{
                                            backgroundColor: !n.read ? (isDark ? 'rgba(34, 211, 237, 0.05)' : 'rgba(34, 211, 237, 0.08)') : 'transparent',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeStyles.bg.hover}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !n.read ? (isDark ? 'rgba(34, 211, 237, 0.05)' : 'rgba(34, 211, 237, 0.08)') : 'transparent'}
                                    >
                                        <p className="text-[12px] leading-snug transition-colors" style={{ color: !n.read ? themeStyles.text.primary : themeStyles.text.secondary }}>{n.text}</p>
                                        <p className="text-[10px] mt-0.5 transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>{n.time}</p>
                                    </div>
                                ))}
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
                ></div>

                {/* Profile */}
                <button onClick={onProfileClick}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all group"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeStyles.bg.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] overflow-hidden flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #0db4a4)' }}>
                        {teacher?.photo
                            ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover" />
                            : '👩‍🏫'
                        }
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[12px] font-semibold leading-tight transition-colors group-hover:text-cyan-400" style={{ color: themeStyles.text.primary }}>
                            {teacher?.name?.split(' ').slice(-1)[0] || 'Teacher'}
                        </div>
                        <div className="text-[9px] transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>{teacher?.id || 'TCH-4421'}</div>
                    </div>
                    <span className="text-[10px] hidden sm:block transition-colors" style={{ color: isDark ? '#484f58' : '#8c959f' }}>▾</span>
                </button>
            </div>
        </header>
    );
}