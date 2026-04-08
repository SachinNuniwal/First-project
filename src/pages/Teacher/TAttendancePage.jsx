import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const students = [
    { roll: '2201001', name: 'Aarav Singh' },
    { roll: '2201002', name: 'Priya Mehta' },
    { roll: '2201003', name: 'Rahul Sharma' },
    { roll: '2201004', name: 'Sneha Gupta' },
    { roll: '2201005', name: 'Arjun Rao' },
    { roll: '2201006', name: 'Kavya Nair' },
    { roll: '2201007', name: 'Vikram Tiwari' },
    { roll: '2201008', name: 'Ananya Sharma' },
];

const lowAttStudents = [
    { name: 'Arjun Rao', roll: '2201005', att: 62 },
    { name: 'Kavya Nair', roll: '2201006', att: 68 },
    { name: 'Mohit Batra', roll: '2201010', att: 73 },
];

// Simple heatmap data
const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const r = Math.random();
    return i < 2 ? 'empty' : r > 0.85 ? 'absent' : r > 0.75 ? 'medical' : 'present';
});

const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function TAttendancePage({ showToast }) {
    const { isDark } = useTheme();
    const [tab, setTab] = useState('class');
    const [attendance, setAttendance] = useState(
        Object.fromEntries(students.map(s => [s.roll, 'present']))
    );

    const bgColor = isDark ? '#161b22' : '#f0f2f5';
    const borderColor = isDark ? '#30363d' : '#d1d9e0';
    const textColor = isDark ? '#e6edf3' : '#24292f';
    const secondaryTextColor = isDark ? '#8b949e' : '#656d76';
    const inputBgColor = isDark ? '#21262d' : '#ffffff';
    const hoverBgColor = isDark ? '#1c2128' : '#f6f8fa';
    const heatEmptyColor = isDark ? '#21262d' : '#f6f8fa';
    const heatEmptyTextColor = isDark ? '#484f58' : '#8c959f';

    const tabs = [
        { key: 'class', label: 'Class Attendance' },
        { key: 'lab', label: 'Lab Attendance' },
        { key: 'overview', label: 'Attendance Overview' },
    ];

    const toggle = (roll, val) => setAttendance(p => ({ ...p, [roll]: val }));

    const markAll = (val) => {
        setAttendance(Object.fromEntries(students.map(s => [s.roll, val])));
    };

    const statusBadge = (val) => {
        if (val === 'present') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400">Present</span>;
        if (val === 'absent') return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/15 text-red-400">Absent</span>;
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-400">Medical</span>;
    };

    const heatColor = { present: 'bg-green-500/25 text-green-400', absent: 'bg-red-500/25 text-red-400', medical: 'bg-orange-500/25 text-orange-400', empty: `bg-[${heatEmptyColor}] text-[${heatEmptyTextColor}]` };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: borderColor }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 transition-all
                            ${tab === t.key
                                ? 'text-cyan-400 border-cyan-400'
                                : `text-[${secondaryTextColor}] border-transparent hover:text-[${textColor}]`}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Class Attendance */}
            {tab === 'class' && (
                <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: borderColor }}>
                        <div className="text-[13px] font-bold mb-3" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                            🏫 Mark Class Attendance
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <select className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }}>
                                <option>CSE-3A</option><option>CSE-3B</option><option>CSE-2A</option><option>MCA-1</option>
                            </select>
                            <select className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }}>
                                <option>DSA</option><option>OS</option><option>DBMS</option><option>CN</option>
                            </select>
                            <input type="date" defaultValue="2026-04-05"
                                className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="text-[10px]" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                    <th className="text-left p-3">Roll No</th>
                                    <th className="text-left p-3">Student Name</th>
                                    <th className="p-3">Present</th>
                                    <th className="p-3">Absent</th>
                                    <th className="p-3">Medical</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: borderColor }}>
                                {students.map(s => (
                                    <tr key={s.roll} className="transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBgColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="p-3" style={{ color: secondaryTextColor }}>{s.roll}</td>
                                        <td className="p-3 font-semibold" style={{ color: textColor }}>{s.name}</td>
                                        {['present', 'absent', 'medical'].map(val => (
                                            <td key={val} className="p-3 text-center">
                                                <input type="radio" name={`att_${s.roll}`}
                                                    checked={attendance[s.roll] === val}
                                                    onChange={() => toggle(s.roll, val)}
                                                    className="accent-cyan-400 w-4 h-4 cursor-pointer" />
                                            </td>
                                        ))}
                                        <td className="p-3 text-center">{statusBadge(attendance[s.roll])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex gap-3 border-t flex-wrap" style={{ borderColor: borderColor }}>
                        <button onClick={() => markAll('present')}
                            className="px-4 py-2 bg-green-500/15 border border-green-500/30 text-green-400 rounded-lg text-[12px] font-semibold hover:bg-green-500/25 transition-all">
                            ✅ Mark All Present
                        </button>
                        <button onClick={() => markAll('absent')}
                            className="px-4 py-2 bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg text-[12px] font-semibold hover:bg-red-500/25 transition-all">
                            ❌ Mark All Absent
                        </button>
                        <button onClick={() => showToast('✅ Attendance saved!')}
                            className="ml-auto px-5 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">
                            💾 Save Attendance
                        </button>
                    </div>
                </div>
            )}

            {/* Lab Attendance */}
            {tab === 'lab' && (
                <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: borderColor }}>
                        <div className="text-[13px] font-bold mb-3" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                            🔬 Mark Lab Attendance
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <select className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }}>
                                <option>CSE-3A Group 1</option><option>CSE-3A Group 2</option><option>CSE-3B Group 1</option>
                            </select>
                            <select className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }}>
                                <option>DSA Lab</option><option>OS Lab</option><option>DBMS Lab</option>
                            </select>
                            <input type="date" defaultValue="2026-04-05"
                                className="rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-cyan-400"
                                style={{ backgroundColor: inputBgColor, border: `1px solid ${borderColor}`, color: textColor }} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="text-[10px]" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                    <th className="text-left p-3">Roll No</th>
                                    <th className="text-left p-3">Student Name</th>
                                    <th className="p-3">Batch</th>
                                    <th className="p-3">Present</th>
                                    <th className="p-3">Absent</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: borderColor }}>
                                {students.map((s, i) => (
                                    <tr key={s.roll} className="transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBgColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="p-3" style={{ color: secondaryTextColor }}>{s.roll}</td>
                                        <td className="p-3 font-semibold" style={{ color: textColor }}>{s.name}</td>
                                        <td className="p-3 text-center" style={{ color: secondaryTextColor }}>{i % 2 === 0 ? 'Batch A' : 'Batch B'}</td>
                                        <td className="p-3 text-center"><input type="radio" name={`lab_${s.roll}`} defaultChecked className="accent-cyan-400 w-4 h-4" /></td>
                                        <td className="p-3 text-center"><input type="radio" name={`lab_${s.roll}`} className="accent-cyan-400 w-4 h-4" /></td>
                                        <td className="p-3 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400">Present</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t" style={{ borderColor: borderColor }}>
                        <button onClick={() => showToast('✅ Lab attendance saved!')}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[12px] hover:opacity-85 transition-all">
                            💾 Save Lab Attendance
                        </button>
                    </div>
                </div>
            )}

            {/* Overview */}
            {tab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Heatmap */}
                    <div className="border rounded-xl p-4" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                        <div className="text-[13px] font-bold mb-4" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                            📊 Monthly Attendance Heatmap — CSE-3A
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {dayHeaders.map(d => (
                                <div key={d} className="text-center text-[9px] font-semibold py-1" style={{ color: secondaryTextColor }}>{d}</div>
                            ))}
                            {/* Offset */}
                            <div className="aspect-square rounded-md" style={{ backgroundColor: heatEmptyColor }} />
                            <div className="aspect-square rounded-md" style={{ backgroundColor: heatEmptyColor }} />
                            {heatmapDays.map((type, i) => (
                                <div key={i}
                                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold cursor-pointer transition-all hover:scale-110 ${heatColor[type]}`}>
                                    {type !== 'empty' ? i + 1 : ''}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4 justify-center">
                            {[['bg-green-500/25 text-green-400', 'Present'], ['bg-red-500/25 text-red-400', 'Absent'], ['bg-orange-500/25 text-orange-400', 'Medical']].map(([cls, label]) => (
                                <div key={label} className="flex items-center gap-1.5 text-[10px]" style={{ color: secondaryTextColor }}>
                                    <div className={`w-3 h-3 rounded-sm ${cls.split(' ')[0]}`} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Attendance */}
                    <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                        <div className="px-4 py-3 border-b text-[13px] font-bold"
                            style={{ borderColor: borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                            📉 Low Attendance Students (&lt;75%)
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[12px]">
                                <thead>
                                    <tr className="text-[10px]" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                        <th className="text-left p-3">Name</th>
                                        <th className="text-left p-3">Roll No</th>
                                        <th className="text-left p-3">Attendance</th>
                                        <th className="text-left p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: borderColor }}>
                                    {lowAttStudents.map(s => (
                                        <tr key={s.roll} className="transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBgColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td className="p-3 font-semibold" style={{ color: textColor }}>{s.name}</td>
                                            <td className="p-3" style={{ color: secondaryTextColor }}>{s.roll}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.att < 70 ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>
                                                    {s.att}%
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <button onClick={() => showToast(`📨 Alert sent to ${s.name}`)}
                                                    className="px-2.5 py-1 border rounded-lg text-[10px] transition-all hover:border-cyan-400 hover:text-cyan-400" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                                    📨 Alert
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}