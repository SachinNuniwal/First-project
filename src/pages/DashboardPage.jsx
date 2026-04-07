import { useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center gap-4 hover:border-[#444c56] transition-colors">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${color}18` }}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-[11px] text-[#8b949e] uppercase tracking-wider">{label}</div>
                <div className="text-[22px] font-bold leading-tight" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>{value}</div>
                {sub && <div className="text-[10px] text-[#484f58] mt-0.5">{sub}</div>}
            </div>
        </div>
    );
}

// ── Section Header ──────────────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div className="text-[13px] font-bold text-[#e6edf3] mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {children}
        </div>
    );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage({ students, pendingLeaves, events, onApproveLeave, onRejectLeave, onNavigate }) {

    // ── Derived stats ──
    const totalStudents = students.length;
    const avgCgpa = (students.reduce((s, x) => s + x.cgpa, 0) / totalStudents).toFixed(1);
    const avgAtt = Math.round(students.reduce((s, x) => s + x.att, 0) / totalStudents);
    const feePending = students.filter(s => s.fee.paid < s.fee.total).length;
    const lowAtt = students.filter(s => s.att < 75).length;

    // ── Attendance Doughnut ──
    const attData = {
        labels: ['≥75% (Regular)', '<75% (Low)'],
        datasets: [{
            data: [totalStudents - lowAtt, lowAtt],
            backgroundColor: ['#00d4ff', '#ff4d4f'],
            borderColor: ['#161b22'],
            borderWidth: 3,
        }],
    };
    const attOptions = {
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw} students` } } },
    };

    // ── CGPA Bar chart ──
    const cgpaBuckets = { '<6': 0, '6–7': 0, '7–8': 0, '8–9': 0, '9+': 0 };
    students.forEach(s => {
        if (s.cgpa >= 9) cgpaBuckets['9+']++;
        else if (s.cgpa >= 8) cgpaBuckets['8–9']++;
        else if (s.cgpa >= 7) cgpaBuckets['7–8']++;
        else if (s.cgpa >= 6) cgpaBuckets['6–7']++;
        else cgpaBuckets['<6']++;
    });
    const cgpaData = {
        labels: Object.keys(cgpaBuckets),
        datasets: [{
            label: 'Students',
            data: Object.values(cgpaBuckets),
            backgroundColor: ['#ff4d4f', '#f0a500', '#00d4ff', '#39d353', '#a855f7'],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };
    const cgpaOptions = {
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#8b949e', font: { size: 11 } }, grid: { color: '#21262d' } },
            y: { ticks: { color: '#8b949e', font: { size: 11 }, stepSize: 1 }, grid: { color: '#21262d' } },
        },
    };

    // ── Top performers ──
    const toppers = [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];

    // ── Upcoming events (next 30 days) ──
    const now = new Date();
    const upcoming = [...events]
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4);

    const categoryColors = { Exam: '#ff4d4f', Meeting: '#f0a500', Academic: '#00d4ff', Holiday: '#39d353', Other: '#a855f7' };

    return (
        <div className="space-y-5">

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="👩‍🎓" label="Total Students" value={totalStudents} sub="Across all classes" color="#00d4ff" />
                <StatCard icon="📊" label="Avg CGPA" value={avgCgpa} sub="Department average" color="#a855f7" />
                <StatCard icon="📅" label="Avg Attendance" value={`${avgAtt}%`} sub={`${lowAtt} below 75%`} color="#39d353" />
                <StatCard icon="💰" label="Fee Pending" value={feePending} sub="Students with dues" color="#f0a500" />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Attendance Doughnut */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <SectionTitle>📈 Attendance Overview</SectionTitle>
                    <div className="relative flex items-center justify-center" style={{ height: 180 }}>
                        <Doughnut data={attData} options={attOptions} />
                        <div className="absolute text-center pointer-events-none">
                            <div className="text-[22px] font-bold text-[#00d4ff]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{avgAtt}%</div>
                            <div className="text-[9px] text-[#8b949e]">avg att.</div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00d4ff]" /> Regular ({totalStudents - lowAtt})
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4d4f]" /> Low ({lowAtt})
                        </div>
                    </div>
                </div>

                {/* CGPA Bar */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 lg:col-span-2">
                    <SectionTitle>🎓 CGPA Distribution</SectionTitle>
                    <div style={{ height: 180 }}>
                        <Bar data={cgpaData} options={{ ...cgpaOptions, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* ── Bottom Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Pending Leaves */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                        <SectionTitle>🌿 Pending Leaves</SectionTitle>
                        {pendingLeaves.length > 0 && (
                            <span className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                                {pendingLeaves.length} pending
                            </span>
                        )}
                    </div>
                    <div className="divide-y divide-[#21262d] max-h-64 overflow-y-auto">
                        {pendingLeaves.length === 0 ? (
                            <div className="text-center text-[#484f58] text-[12px] py-8">No pending leaves ✅</div>
                        ) : pendingLeaves.slice(0, 4).map(l => (
                            <div key={l.id} className="px-4 py-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div>
                                        <span className="text-[12px] font-semibold text-[#e6edf3]">{l.teacher}</span>
                                        <span className="ml-2 text-[10px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded">{l.type}</span>
                                    </div>
                                    <span className="text-[10px] text-[#8b949e]">{l.days}d</span>
                                </div>
                                <div className="text-[10px] text-[#8b949e] mb-2">{l.from} → {l.to} · {l.reason}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => onApproveLeave(l.id)}
                                        className="flex-1 py-1 bg-green-500/15 text-green-400 hover:bg-green-500/25 rounded text-[10px] font-semibold transition-colors">
                                        ✅ Approve
                                    </button>
                                    <button onClick={() => onRejectLeave(l.id)}
                                        className="flex-1 py-1 bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded text-[10px] font-semibold transition-colors">
                                        ❌ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pendingLeaves.length > 4 && (
                        <button onClick={() => onNavigate('leaves')}
                            className="w-full py-2.5 text-[11px] text-cyan-400 hover:text-cyan-300 border-t border-[#30363d] transition-colors">
                            View all {pendingLeaves.length} leaves →
                        </button>
                    )}
                </div>

                {/* Top Performers */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#30363d]">
                        <SectionTitle>🏆 Top Performers</SectionTitle>
                    </div>
                    <div className="p-4 space-y-3">
                        {toppers.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#21262d] hover:bg-[#282e37] transition-colors">
                                <span className="text-xl">{medals[i]}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-semibold text-[#e6edf3] truncate">{s.name}</div>
                                    <div className="text-[10px] text-[#8b949e]">{s.class}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[14px] font-bold text-cyan-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{s.cgpa}</div>
                                    <div className="text-[9px] text-[#484f58]">CGPA</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 pb-3 space-y-1.5">
                        <SectionTitle>⚠️ Low Attendance</SectionTitle>
                        {students.filter(s => s.att < 75).slice(0, 3).map(s => (
                            <div key={s.id} className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded bg-red-500/5 border border-red-500/10">
                                <span className="text-[#e6edf3]">{s.name}</span>
                                <span className="text-red-400 font-semibold">{s.att}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d]">
                        <SectionTitle>📆 Upcoming Events</SectionTitle>
                        <button onClick={() => onNavigate('events')}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">View all →</button>
                    </div>
                    <div className="divide-y divide-[#21262d]">
                        {upcoming.length === 0 ? (
                            <div className="text-center text-[#484f58] text-[12px] py-8">No upcoming events</div>
                        ) : upcoming.map(e => {
                            const d = new Date(e.date);
                            const color = categoryColors[e.category] || '#8b949e';
                            return (
                                <div key={e.id} className="flex gap-3 px-4 py-3 hover:bg-[#1c2128] transition-colors">
                                    <div className="flex-shrink-0 w-10 text-center">
                                        <div className="text-[16px] font-bold leading-none" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>
                                            {d.getDate()}
                                        </div>
                                        <div className="text-[9px] text-[#484f58] uppercase">
                                            {d.toLocaleString('default', { month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-semibold text-[#e6edf3] truncate">{e.title}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                                                style={{ background: `${color}18`, color }}>
                                                {e.category}
                                            </span>
                                            <span className="text-[9px] text-[#484f58]">{e.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}