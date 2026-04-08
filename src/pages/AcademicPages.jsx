import { useState } from 'react';
import { timetables } from '../data/data';

export function FeePage({ students, onViewStudent, showToast }) {
    return (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="p-4 font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>💰 Fee Management</div>
            <table className="w-full text-[12px]">
                <thead>
                    <tr className="border-b text-[11px]" style={{ borderColor: 'var(--border-color)', color: 'var(--muted-text)' }}>
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">Roll No</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.slice(0, 15).map((s, i) => {
                        const paid = i % 3 !== 2;
                        return (
                            <tr key={s.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td className="p-3">{s.name}</td>
                                <td className="p-3" style={{ color: 'var(--muted-text)' }}>{s.roll}</td>
                                <td className="p-3">₹45,000</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${paid ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                        {paid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => onViewStudent(s.id)}
                                        className="text-cyan-400 hover:text-cyan-300 text-[11px]">View</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Replace TimetablePage with:
export function TimetablePage({ showToast }) {
    const [selectedClass, setSelectedClass] = useState('CSE-3A');
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const PERIODS = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00'];
    const grid = timetables[selectedClass] || [];

    return (
        <div className="rounded-xl overflow-auto" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>🗓️ Timetable</span>
                <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    className="rounded-lg text-[12px] outline-none"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.375rem 0.75rem' }}
                >
                    {Object.keys(timetables).map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
            <table className="w-full text-[11px]">
                <thead>
                    <tr className="text-[var(--muted-text)]" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th className="p-3 text-left">Period</th>
                        {DAYS.map(d => <th key={d} className="p-3 text-left">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {grid.map((row, pi) => (
                        <tr key={pi} className="transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td className="p-3 font-semibold" style={{ color: 'var(--muted-text)' }}>{PERIODS[pi]}</td>
                            {row.map((cell, di) => (
                                <td key={di} className="p-3">
                                    <span className="px-2 py-1 rounded-lg text-[10px] whitespace-pre-line leading-tight block" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}>
                                        {cell}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export function AttendancePage({ students, classes, showToast }) {
    const [selected, setSelected] = useState({});

    const toggle = (id) => setSelected(p => ({ ...p, [id]: !p[id] }));
    const save = () => showToast(`✅ Attendance saved for ${Object.values(selected).filter(Boolean).length} students`);

    return (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>📋 Attendance</span>
                <button onClick={save} className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-[11px] font-semibold">Save</button>
            </div>
            <table className="w-full text-[12px]">
                <thead>
                    <tr className="text-[11px]" style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--muted-text)' }}>
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">Roll No</th>
                        <th className="text-left p-3">Present</th>
                    </tr>
                </thead>
                <tbody>
                    {students.slice(0, 15).map(s => (
                        <tr key={s.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td className="p-3">{s.name}</td>
                            <td className="p-3" style={{ color: 'var(--muted-text)' }}>{s.id}</td>
                            <td className="p-3">
                                <input type="checkbox" checked={!!selected[s.id]} onChange={() => toggle(s.id)}
                                    className="w-4 h-4 accent-cyan-400 cursor-pointer" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}