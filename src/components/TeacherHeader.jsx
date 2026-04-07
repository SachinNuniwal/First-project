import { useState, useRef, useEffect } from 'react';

export default function TeacherHeader({ title, subtitle, teacher, onRefresh, onProfileClick }) {
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

    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-[#30363d]"
            style={{ background: 'rgba(22,27,34,0.97)', backdropFilter: 'blur(10px)' }}
        >
            {/* Left */}
            <div>
                <h1 className="text-[18px] font-bold text-[#e6edf3] leading-tight"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {title}
                </h1>
                {subtitle && <p className="text-[11px] text-[#8b949e] mt-0.5">{subtitle}</p>}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Refresh */}
                <button onClick={onRefresh}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-all text-[16px]">
                    🔄
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button onClick={() => setShowNotif(p => !p)}
                        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] transition-all text-[16px]">
                        🔔
                        {unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                {unread}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 top-10 w-76 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-[200] overflow-hidden" style={{ width: 300 }}>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                                <span className="text-[13px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                    🔔 Notifications
                                </span>
                                {unread > 0 && (
                                    <span className="text-[10px] bg-orange-400/15 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                                        {unread} new
                                    </span>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-[#21262d]">
                                {notifications.map(n => (
                                    <div key={n.id} className={`px-4 py-3 hover:bg-[#1c2128] transition-colors ${!n.read ? 'bg-cyan-400/5' : ''}`}>
                                        <p className={`text-[12px] leading-snug ${!n.read ? 'text-[#e6edf3]' : 'text-[#8b949e]'}`}>{n.text}</p>
                                        <p className="text-[10px] text-[#484f58] mt-0.5">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[#30363d] mx-1" />

                {/* Profile */}
                <button onClick={onProfileClick}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#21262d] transition-all group">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] overflow-hidden flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #00d4ff, #0db4a4)' }}>
                        {teacher?.photo
                            ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover" />
                            : '👩‍🏫'
                        }
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-[12px] font-semibold text-[#e6edf3] leading-tight group-hover:text-cyan-400 transition-colors">
                            {teacher?.name?.split(' ').slice(-1)[0] || 'Teacher'}
                        </div>
                        <div className="text-[9px] text-[#484f58]">{teacher?.id || 'TCH-4421'}</div>
                    </div>
                    <span className="text-[#484f58] text-[10px] hidden sm:block">▾</span>
                </button>
            </div>
        </header>
    );
}