import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const initialGroups = [
    { id: 1, name: 'CSE-3A General', members: 42, icon: '📚', gradient: 'linear-gradient(135deg,#00d4ff,#0db4a4)', last: 'Exam schedule updated · 2h ago', chat: [{ sent: true, text: 'Midterm exam schedule updated. Please check the portal.', time: '9:12 AM' }, { sent: false, from: 'Aarav Singh', text: 'Thank you sir!', time: '9:15 AM' }] },
    { id: 2, name: 'CSE-3B Lab Group', members: 38, icon: '🔬', gradient: 'linear-gradient(135deg,#a855f7,#7c3aed)', last: 'Submit DSA files by Friday · Yesterday', chat: [{ sent: true, text: 'Submit DSA lab files by Friday.', time: 'Yesterday' }] },
    { id: 3, name: 'MCA-1 Batch', members: 30, icon: '🎯', gradient: 'linear-gradient(135deg,#f0a500,#e85d04)', last: 'Leave notice posted · 2 days ago', chat: [{ sent: true, text: 'Leave notice: I will be absent on 5th April.', time: '2 days ago' }] },
];

export function TGroupsPage({ showToast }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? "#161b22" : "#ffffff";
    const borderColor = isDark ? "#30363d" : "#d1d5db";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const subTextColor = isDark ? "#8b949e" : "#6b7280";
    const dimTextColor = isDark ? "#484f58" : "#9ca3af";
    const inputBg = isDark ? "#21262d" : "#f9fafb";
    const modalBg = isDark ? "#1c2230" : "#ffffff";

    const [groups, setGroups] = useState(initialGroups);
    const [activeGroup, setActiveGroup] = useState(null);
    const [msg, setMsg] = useState('');
    const [showBroadcast, setShowBroadcast] = useState(null);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const sendMsg = () => {
        if (!msg.trim() || !activeGroup) return;
        const updated = groups.map(g => g.id === activeGroup.id ? { ...g, chat: [...g.chat, { sent: true, text: msg, time: 'Just now' }], last: msg + ' · Just now' } : g);
        setGroups(updated);
        setActiveGroup(updated.find(g => g.id === activeGroup.id));
        setMsg('');
    };

    const sendBroadcast = () => {
        if (!broadcastMsg.trim()) return;
        showToast(`✅ Broadcast sent to ${showBroadcast.name}`);
        setShowBroadcast(null); setBroadcastMsg('');
    };

    const createGroup = () => {
        if (!newGroupName.trim()) return;
        const newG = { id: Date.now(), name: newGroupName, members: 0, icon: '📚', gradient: 'linear-gradient(135deg,#00d4ff,#0db4a4)', last: 'Group created · Just now', chat: [] };
        setGroups(p => [...p, newG]);
        setNewGroupName(''); setShowCreate(false);
        showToast(`✅ Group "${newGroupName}" created!`);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[18px] font-bold" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>👥 My Groups</div>
                    <div className="text-[11px]" style={{ color: subTextColor }}>Manage class and lab groups</div>
                </div>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">+ Create Group</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {groups.map(g => (
                    <div key={g.id} className="rounded-xl p-4 cursor-pointer hover:border-cyan-400 transition-all" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: g.gradient }}>{g.icon}</div>
                            <div>
                                <div className="font-bold text-[13px]" style={{ color: textColor }}>{g.name}</div>
                                <div className="text-[10px]" style={{ color: subTextColor }}>{g.members} members</div>
                            </div>
                        </div>
                        <div className="text-[11px] mb-3 truncate" style={{ color: dimTextColor }}>{g.last}</div>
                        <div className="flex gap-2">
                            <button onClick={e => { e.stopPropagation(); setActiveGroup(g); }} className="flex-1 py-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[11px] hover:opacity-85 transition-all">💬 Open Chat</button>
                            <button onClick={e => { e.stopPropagation(); setShowBroadcast(g); }} className="flex-1 py-1.5 rounded-lg text-[11px] hover:border-cyan-400 hover:text-cyan-400 transition-all" style={{ border: `1px solid ${borderColor}`, color: subTextColor }}>📢 Broadcast</button>
                        </div>
                    </div>
                ))}
            </div>

            {activeGroup && (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor }}>
                        <div className="text-[13px] font-bold" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>💬 {activeGroup.name}</div>
                        <button onClick={() => setActiveGroup(null)} className="text-[12px] hover:text-red-400 transition-colors" style={{ color: subTextColor }}>✕ Close</button>
                    </div>
                    <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3">
                        {activeGroup.chat.map((m, i) => (
                            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${m.sent ? 'self-end bg-cyan-400/15 border border-cyan-400/30 ml-auto' : 'self-start'}`}
                                style={m.sent ? {} : { backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }}>
                                {!m.sent && <div className="text-[10px] text-cyan-400 mb-1">{m.from}</div>}
                                <span style={{ color: m.sent ? undefined : textColor }}>{m.text}</span>
                                <div className="text-[9px] mt-1" style={{ color: dimTextColor }}>{m.time}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 p-3 border-t" style={{ borderColor }}>
                        <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message to the group..." className="flex-1 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                        <button onClick={sendMsg} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">Send ✈️</button>
                    </div>
                </div>
            )}

            {showBroadcast && (
                <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center">
                    <div className="rounded-2xl p-6 w-[460px] max-w-[90vw]" style={{ backgroundColor: modalBg, border: `1px solid ${borderColor}` }}>
                        <div className="text-[16px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📢 Broadcast to {showBroadcast.name}</div>
                        <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Type your broadcast message..." className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-cyan-400 min-h-[100px] resize-none mb-4 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowBroadcast(null)} className="px-4 py-2 rounded-lg text-[13px] hover:border-cyan-400 hover:text-cyan-400 transition-all" style={{ border: `1px solid ${borderColor}`, color: subTextColor }}>Cancel</button>
                            <button onClick={sendBroadcast} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all">📤 Send Broadcast</button>
                        </div>
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center">
                    <div className="rounded-2xl p-6 w-[460px] max-w-[90vw]" style={{ backgroundColor: modalBg, border: `1px solid ${borderColor}` }}>
                        <div className="text-[16px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>➕ Create New Group</div>
                        <div className="mb-3">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: subTextColor }}>Group Name</label>
                            <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g. CSE-3A Lab Group 2" className="w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                        </div>
                        <div className="flex gap-3 justify-end mt-5">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-[13px] hover:border-cyan-400 hover:text-cyan-400 transition-all" style={{ border: `1px solid ${borderColor}`, color: subTextColor }}>Cancel</button>
                            <button onClick={createGroup} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all">Create Group</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const initialConvs = [
    { id: 1, name: 'Dept. Principal', role: 'Admin', last: 'Meeting confirmed for 3PM', time: '9:00 AM', msgs: [{ sent: false, text: 'Faculty meeting today at 3PM, please confirm.', time: '9:00 AM' }, { sent: true, text: 'Meeting confirmed for 3PM', time: '9:15 AM' }] },
    { id: 2, name: 'Aarav Singh', role: 'Student', last: 'Thank you sir!', time: 'Yesterday', msgs: [{ sent: true, text: 'Please submit your assignment by Friday.', time: 'Yesterday' }, { sent: false, text: 'Thank you sir!', time: 'Yesterday' }] },
    { id: 3, name: 'Mr. Arun Kumar', role: 'Teacher', last: 'Sure, will do', time: '2 days ago', msgs: [{ sent: true, text: 'Can you cover my class on Monday?', time: '2 days ago' }, { sent: false, text: 'Sure, will do', time: '2 days ago' }] },
];

export function TMessagesPage({ showToast }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? "#161b22" : "#ffffff";
    const borderColor = isDark ? "#30363d" : "#d1d5db";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const subTextColor = isDark ? "#8b949e" : "#6b7280";
    const dimTextColor = isDark ? "#484f58" : "#9ca3af";
    const inputBg = isDark ? "#21262d" : "#f9fafb";

    const [convs, setConvs] = useState(initialConvs);
    const [active, setActive] = useState(null);
    const [msg, setMsg] = useState('');
    const [search, setSearch] = useState('');

    const sendMsg = () => {
        if (!msg.trim() || !active) return;
        const updated = convs.map(c => c.id === active.id ? { ...c, msgs: [...c.msgs, { sent: true, text: msg, time: 'Just now' }], last: msg, time: 'Just now' } : c);
        setConvs(updated);
        setActive(updated.find(c => c.id === active.id));
        setMsg('');
    };

    const roleColor = { Admin: '#f0a500', Student: '#00d4ff', Teacher: '#a855f7' };
    const filtered = convs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="px-4 py-3 border-b text-[13px] font-bold" style={{ borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📥 Conversations</div>
                <div className="p-3">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search conversations..." className="w-full rounded-lg px-3 py-2 text-[12px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {filtered.map(c => (
                        <div key={c.id} onClick={() => setActive(c)} className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b" style={{ borderColor, backgroundColor: active?.id === c.id ? (isDark ? "#1c2128" : "#e8f5ff") : "transparent" }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: `${roleColor[c.role]}22`, color: roleColor[c.role] }}>{c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold" style={{ color: textColor }}>{c.name}</div>
                                <div className="text-[11px] truncate" style={{ color: subTextColor }}>{c.last}</div>
                            </div>
                            <div className="text-[10px]" style={{ color: dimTextColor }}>{c.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="px-4 py-3 border-b text-[13px] font-bold" style={{ borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>💬 {active ? active.name : 'Select a conversation'}</div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[250px]">
                    {!active
                        ? <div className="text-center text-[13px] py-12" style={{ color: dimTextColor }}>Select a conversation to start chatting</div>
                        : active.msgs.map((m, i) => (
                            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${m.sent ? 'self-end bg-cyan-400/15 border border-cyan-400/30 ml-auto' : 'self-start'}`}
                                style={m.sent ? {} : { backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }}>
                                <span style={{ color: m.sent ? undefined : textColor }}>{m.text}</span>
                                <div className="text-[9px] mt-1" style={{ color: dimTextColor }}>{m.time}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex gap-2 p-3 border-t" style={{ borderColor }}>
                    <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Type a message..." className="flex-1 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                    <button onClick={sendMsg} className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">Send ✈️</button>
                </div>
            </div>
        </div>
    );
}

const leaveHistory = [
    { type: 'Medical Leave', from: '15 Jan 2026', to: '17 Jan 2026', days: 3, status: 'Approved' },
    { type: 'Personal Leave', from: '5 Feb 2026', to: '5 Feb 2026', days: 1, status: 'Approved' },
    { type: 'Academic Conference', from: '20 Mar 2026', to: '22 Mar 2026', days: 3, status: 'Approved' },
    { type: 'Emergency Leave', from: '10 Apr 2026', to: '11 Apr 2026', days: 2, status: 'Pending' },
];

export function TLeavePage({ showToast }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? "#161b22" : "#ffffff";
    const borderColor = isDark ? "#30363d" : "#d1d5db";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const subTextColor = isDark ? "#8b949e" : "#6b7280";
    const inputBg = isDark ? "#21262d" : "#f9fafb";
    const hoverBg = isDark ? "#1c2128" : "#f9fafb";

    const [leaveType, setLeaveType] = useState('Medical Leave');
    const [fromDate, setFromDate] = useState('2026-04-05');
    const [toDate, setToDate] = useState('2026-04-07');
    const [reason, setReason] = useState('');
    const [notify, setNotify] = useState(true);
    const [groupMsg, setGroupMsg] = useState('');

    const submit = () => {
        if (!reason.trim()) { showToast('⚠️ Please enter a reason.'); return; }
        showToast(`✅ Leave applied${notify ? ' & student groups notified!' : '!'}`);
        setReason(''); setGroupMsg('');
    };

    const statusColor = s => s === 'Approved' ? 'bg-green-500/15 text-green-400' : s === 'Pending' ? 'bg-orange-500/15 text-orange-400' : 'bg-red-500/15 text-red-400';

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
                {[['12', 'Leaves Available', '#39d353'], ['3', 'Leaves Used', '#f0a500'], ['1', 'Pending Approval', '#00d4ff'], ['0', 'Rejected', '#ff4d4f']].map(([val, label, color]) => (
                    <div key={label} className="rounded-xl p-4 text-center transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                        <div className="text-[24px] font-bold" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>{val}</div>
                        <div className="text-[11px] mt-1" style={{ color: subTextColor }}>{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl p-5 transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="text-[13px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📝 Apply for Leave</div>
                    <div className="mb-4">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: subTextColor }}>Leave Type</label>
                        <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }}>
                            <option>Medical Leave</option><option>Personal Leave</option><option>Academic Conference</option><option>Emergency Leave</option>
                        </select>
                    </div>
                    <div className="flex gap-3 mb-4">
                        {[['From Date', fromDate, setFromDate], ['To Date', toDate, setToDate]].map(([label, val, setter]) => (
                            <div key={label} className="flex-1">
                                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: subTextColor }}>{label}</label>
                                <input type="date" value={val} onChange={e => setter(e.target.value)} className="w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: subTextColor }}>Reason</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe reason for leave..." className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-cyan-400 resize-none min-h-[90px] transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                    </div>
                    <label className="flex items-center gap-2 text-[13px] cursor-pointer mb-4" style={{ color: subTextColor }}>
                        <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                        Auto-notify all student groups with leave message
                    </label>
                    {notify && (
                        <div className="mb-4">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: subTextColor }}>Custom Group Message (optional)</label>
                            <textarea value={groupMsg} onChange={e => setGroupMsg(e.target.value)} placeholder="e.g. Dear students, I will be on leave..." className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-cyan-400 resize-none min-h-[80px] transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: textColor }} />
                        </div>
                    )}
                    <button onClick={submit} className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all">📤 Submit Leave Application</button>
                </div>

                <div className="rounded-xl overflow-hidden transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="px-4 py-3 border-b text-[13px] font-bold" style={{ borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📋 Leave History</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="text-[10px]" style={{ borderBottom: `1px solid ${borderColor}`, color: subTextColor }}>
                                    <th className="text-left p-3">Type</th><th className="text-left p-3">From</th><th className="text-left p-3">To</th><th className="text-left p-3">Days</th><th className="text-left p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveHistory.map((l, i) => (
                                    <tr key={i} className="transition-colors" style={{ borderTop: `1px solid ${borderColor}` }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="p-3 font-semibold" style={{ color: textColor }}>{l.type}</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{l.from}</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{l.to}</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{l.days}</td>
                                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(l.status)}`}>{l.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const subjectData = {
    'CSE-3A': { labels: ['DSA', 'OS', 'DBMS', 'CN', 'SE'], data: [82, 76, 88, 71, 79] },
    'CSE-3B': { labels: ['DBMS', 'AI', 'OS', 'SE'], data: [74, 81, 69, 77] },
    'CSE-2A': { labels: ['Maths', 'Physics', 'DSA', 'Python'], data: [78, 65, 83, 88] },
    'MCA-1': { labels: ['Python', 'Stats', 'DBMS', 'AI', 'SE'], data: [85, 72, 79, 80, 74] },
};

export function TSubjectsPage({ showToast }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? "#161b22" : "#ffffff";
    const borderColor = isDark ? "#30363d" : "#d1d5db";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const subTextColor = isDark ? "#8b949e" : "#6b7280";
    const hoverBg = isDark ? "#1c2128" : "#f9fafb";

    const [cls, setCls] = useState('CSE-3A');
    const sd = subjectData[cls];

    const barData = {
        labels: sd.labels,
        datasets: [
            { label: 'Avg Marks', data: sd.data, backgroundColor: 'rgba(0,212,255,0.3)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 8 },
            { label: 'Pass %', data: sd.data.map(v => Math.min(100, v + 8)), backgroundColor: 'rgba(57,211,83,0.2)', borderColor: '#39d353', borderWidth: 2, borderRadius: 8 },
        ],
    };

    const barOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: subTextColor } } },
        scales: {
            x: { ticks: { color: subTextColor }, grid: { color: isDark ? '#21262d' : '#e5e7eb' } },
            y: { min: 0, max: 100, ticks: { color: subTextColor }, grid: { color: isDark ? '#21262d' : '#e5e7eb' } },
        },
    };

    return (
        <div className="space-y-5">
            <div>
                <div className="text-[18px] font-bold" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📚 Subject Performance Analytics</div>
                <div className="text-[11px]" style={{ color: subTextColor }}>Detailed per-subject, per-class analytics</div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {Object.keys(subjectData).map(c => (
                    <button key={c} onClick={() => setCls(c)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${cls === c ? 'bg-cyan-400/15 border-cyan-400 text-cyan-400' : 'hover:border-cyan-400'}`}
                        style={cls === c ? {} : { border: `1px solid ${borderColor}`, color: subTextColor }}>
                        {c}
                    </button>
                ))}
            </div>

            <div className="rounded-xl p-4 transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-[13px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>📊 Subject-wise Average Marks — {cls}</div>
                <div style={{ height: 260 }}><Bar data={barData} options={barOptions} /></div>
            </div>

            <div className="rounded-xl overflow-hidden transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="px-4 py-3 border-b text-[13px] font-bold" style={{ borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>🏆 Subject Performance Summary</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead>
                            <tr className="text-[10px]" style={{ borderBottom: `1px solid ${borderColor}`, color: subTextColor }}>
                                <th className="text-left p-3">Subject</th><th className="text-left p-3">Class Avg</th><th className="text-left p-3">Highest</th><th className="text-left p-3">Lowest</th><th className="text-left p-3">Pass %</th><th className="text-left p-3">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sd.labels.map((label, i) => {
                                const avg = sd.data[i];
                                const badge = avg >= 80 ? 'bg-green-500/15 text-green-400' : avg >= 65 ? 'bg-cyan-400/15 text-cyan-400' : 'bg-red-500/15 text-red-400';
                                return (
                                    <tr key={label} className="transition-colors" style={{ borderTop: `1px solid ${borderColor}` }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="p-3 font-semibold" style={{ color: textColor }}>{label}</td>
                                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge}`}>{avg}</span></td>
                                        <td className="p-3" style={{ color: subTextColor }}>{Math.min(100, avg + 15)}</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{Math.max(0, avg - 22)}</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{Math.min(100, avg + 8)}%</td>
                                        <td className="p-3" style={{ color: subTextColor }}>{avg >= 75 ? '📈 Rising' : '📉 Dip'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function TProfilePage({ teacher, onUpdateTeacher, showToast }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? "#161b22" : "#ffffff";
    const cardBg = isDark ? "#21262d" : "#f3f4f6";
    const borderColor = isDark ? "#30363d" : "#d1d5db";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const subTextColor = isDark ? "#8b949e" : "#6b7280";
    const dimTextColor = isDark ? "#484f58" : "#9ca3af";
    const inputBg = isDark ? "#21262d" : "#ffffff";
    const inputBorder = isDark ? "#30363d" : "#d1d5db";

    const photoInputRef = useRef(null);
    const [editing, setEditing] = useState(false);

    const buildForm = (t) => ({
        name: t?.name || 'Dr. Priya Verma', email: t?.email || 'priya@college.edu',
        phone: t?.phone || '+91 98765 43210', office: t?.office || 'CSE Block, Room 302',
        specialization: t?.specialization || 'Data Structures, Algorithms, AI/ML',
        officeHours: t?.officeHours || 'Mon–Fri 10:00 AM – 12:00 PM',
        id: t?.id || 'TCH-4421', dept: t?.dept || 'CSE',
        designation: t?.designation || 'Sr. Professor', exp: t?.exp || '12 yrs',
        status: t?.status || 'Active',
        classes: Array.isArray(t?.classes) ? t.classes.join(', ') : (t?.classes || 'CSE-3A, CSE-3B'),
    });

    const [form, setForm] = useState(() => buildForm(teacher));
    const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result;
            localStorage.setItem('teacherPhoto', base64);
            onUpdateTeacher({ ...teacher, photo: base64 });
            showToast('✅ Profile photo updated!');
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        onUpdateTeacher({ ...teacher, ...form, classes: form.classes.split(',').map(s => s.trim()).filter(Boolean) });
        setEditing(false);
        showToast('✅ Profile updated successfully!');
    };

    const handleCancel = () => { setForm(buildForm(teacher)); setEditing(false); };

    const infoFields = [
        { label: 'Employee ID', key: 'id' }, { label: 'Department', key: 'dept' },
        { label: 'Designation', key: 'designation' }, { label: 'Experience', key: 'exp' },
        { label: 'Status', key: 'status' }, { label: 'Classes', key: 'classes' },
    ];

    const detailFields = [
        { label: 'Full Name', key: 'name', type: 'text' }, { label: 'Email', key: 'email', type: 'email' },
        { label: 'Phone', key: 'phone', type: 'tel' }, { label: 'Office Room', key: 'office', type: 'text' },
        { label: 'Specialization', key: 'specialization', type: 'text' }, { label: 'Office Hours', key: 'officeHours', type: 'text' },
    ];

    return (
        <div className="space-y-4">
            <div>
                <div className="text-[18px] font-bold" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>👤 My Profile</div>
                <div className="text-[11px]" style={{ color: subTextColor }}>View and update your profile information</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="flex flex-col items-center mb-5">
                        <div className="relative mb-3">
                            <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-5xl transition-colors" style={{ border: '3px solid #00d4ff', background: cardBg }}>
                                {teacher?.photo ? <img src={teacher.photo} alt="profile" className="w-full h-full object-cover" /> : <span>👩‍🏫</span>}
                            </div>
                            <button onClick={() => photoInputRef.current.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-sm hover:bg-cyan-300 transition-all" style={{ border: `2px solid ${bgColor}` }} title="Change photo">📷</button>
                            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                        </div>
                        <div className="text-[20px] font-bold text-center transition-colors" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>{form.name}</div>
                        <div className="text-[12px] mt-0.5 text-center transition-colors" style={{ color: subTextColor }}>{form.designation} · {form.dept}</div>
                        <div className="flex gap-2 mt-4">
                            {!editing && <button onClick={() => setEditing(true)} className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">✏️ Edit Profile</button>}
                            <button onClick={() => showToast('🔑 Change password — coming soon!')} className="px-4 py-1.5 rounded-lg text-[12px] hover:border-cyan-400 hover:text-cyan-400 transition-all" style={{ border: `1px solid ${borderColor}`, color: subTextColor }}>🔑 Password</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {infoFields.map(({ label, key }) => (
                            <div key={key} className="rounded-xl p-3 transition-colors" style={{ backgroundColor: cardBg }}>
                                <div className="text-[10px] mb-1" style={{ color: dimTextColor }}>{label}</div>
                                {editing
                                    ? <input type="text" value={form[key]} onChange={set(key)} className="w-full rounded-lg px-2 py-1 text-[12px] outline-none focus:border-cyan-400 transition-colors" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }} />
                                    : <div className="text-[12px] font-semibold" style={{ color: textColor }}>{form[key]}</div>
                                }
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl p-5 transition-colors" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="text-[13px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>{editing ? '✏️ Edit Information' : '📋 Profile Details'}</div>
                    {!editing && (
                        <div className="space-y-3">
                            {detailFields.map(({ label, key }) => (
                                <div key={key} className="rounded-xl p-3 transition-colors" style={{ backgroundColor: cardBg }}>
                                    <div className="text-[10px] mb-1" style={{ color: dimTextColor }}>{label}</div>
                                    <div className="text-[13px] font-medium" style={{ color: textColor }}>{form[key]}</div>
                                </div>
                            ))}
                            <button onClick={() => setEditing(true)} className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all mt-1">✏️ Edit Profile</button>
                        </div>
                    )}
                    {editing && (
                        <div className="space-y-3">
                            {detailFields.map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: subTextColor }}>{label}</label>
                                    <input type={type} value={form[key]} onChange={set(key)} className="w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 transition-colors" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }} />
                                </div>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <button onClick={handleCancel} className="flex-1 py-2.5 rounded-lg text-[13px] hover:border-red-400 hover:text-red-400 transition-all" style={{ border: `1px solid ${borderColor}`, color: subTextColor }}>✕ Cancel</button>
                                <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all">💾 Save Changes</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}