import { useState } from 'react';
import { timetables } from '../data/data';

export function FeePage({ students, onViewStudent, showToast }) {
    return (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
            <div className="p-4 border-b border-[#30363d] font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>💰 Fee Management</div>
            <table className="w-full text-[12px]">
                <thead>
                    <tr className="border-b border-[#30363d] text-[#8b949e] text-[11px]">
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
                            <tr key={s.id} className="border-b border-[#30363d] hover:bg-[#1c2128] transition-colors">
                                <td className="p-3">{s.name}</td>
                                <td className="p-3 text-[#8b949e]">{s.roll}</td>
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
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-auto">
            <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                <span className="font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>🗓️ Timetable</span>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-1.5 text-[12px] outline-none">
                    {Object.keys(timetables).map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
            <table className="w-full text-[11px]">
                <thead>
                    <tr className="border-b border-[#30363d] text-[#8b949e]">
                        <th className="p-3 text-left">Period</th>
                        {DAYS.map(d => <th key={d} className="p-3 text-left">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {grid.map((row, pi) => (
                        <tr key={pi} className="border-b border-[#30363d] hover:bg-[#1c2128]">
                            <td className="p-3 text-[#8b949e] font-semibold">{PERIODS[pi]}</td>
                            {row.map((cell, di) => (
                                <td key={di} className="p-3">
                                    <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-[10px] whitespace-pre-line leading-tight block">
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
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
            <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                <span className="font-bold text-[14px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>📋 Attendance</span>
                <button onClick={save} className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-[11px] font-semibold">Save</button>
            </div>
            <table className="w-full text-[12px]">
                <thead>
                    <tr className="border-b border-[#30363d] text-[#8b949e] text-[11px]">
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">Roll No</th>
                        <th className="text-left p-3">Present</th>
                    </tr>
                </thead>
                <tbody>
                    {students.slice(0, 15).map(s => (
                        <tr key={s.id} className="border-b border-[#30363d] hover:bg-[#1c2128]">
                            <td className="p-3">{s.name}</td>
                            <td className="p-3 text-[#8b949e]">{s.id}</td>
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