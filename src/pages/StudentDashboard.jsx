import { useState, useRef } from "react";
import { useTheme } from '../context/ThemeContext';

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const TEACHER_UPLOADS = {
    results: {
        1: [
            { subject: "Mathematics-I", internal: 28, external: 65, total: 93, grade: "O" },
            { subject: "Physics", internal: 25, external: 60, total: 85, grade: "A+" },
            { subject: "Chemistry", internal: 22, external: 55, total: 77, grade: "A" },
            { subject: "C Programming", internal: 27, external: 62, total: 89, grade: "A+" },
            { subject: "Engineering Drawing", internal: 24, external: 50, total: 74, grade: "A" },
        ],
        2: [    
            { subject: "Mathematics-II", internal: 26, external: 63, total: 89, grade: "A+" },
            { subject: "Data Structures", internal: 28, external: 68, total: 96, grade: "O" },
            { subject: "Digital Electronics", internal: 23, external: 57, total: 80, grade: "A" },
            { subject: "OOP with Java", internal: 27, external: 65, total: 92, grade: "O" },
            { subject: "Discrete Math", internal: 25, external: 59, total: 84, grade: "A+" },
        ],
        3: [
            { subject: "Operating Systems", internal: 25, external: 60, total: 85, grade: "A+" },
            { subject: "DBMS", internal: 27, external: 62, total: 89, grade: "A+" },
            { subject: "Computer Networks", internal: 24, external: 55, total: 79, grade: "A" },
            { subject: "Software Engineering", internal: 26, external: 58, total: 84, grade: "A+" },
            { subject: "Theory of Computation", internal: 20, external: 50, total: 70, grade: "B+" },
        ],
        4: [
            { subject: "Machine Learning", internal: 28, external: 66, total: 94, grade: "O" },
            { subject: "Web Technologies", internal: 27, external: 63, total: 90, grade: "O" },
            { subject: "Microprocessors", internal: 22, external: 54, total: 76, grade: "A" },
            { subject: "Compiler Design", internal: 24, external: 58, total: 82, grade: "A+" },
            { subject: "Computer Graphics", internal: 26, external: 61, total: 87, grade: "A+" },
        ],
        5: [
            { subject: "Artificial Intelligence", internal: 28, external: 68, total: 96, grade: "O" },
            { subject: "Cloud Computing", internal: 26, external: 62, total: 88, grade: "A+" },
            { subject: "Cyber Security", internal: 25, external: 60, total: 85, grade: "A+" },
            { subject: "Mobile App Dev", internal: 27, external: 65, total: 92, grade: "O" },
            { subject: "Big Data Analytics", internal: 23, external: 56, total: 79, grade: "A" },
        ],
        6: null,
    },
    attendance: [
        { subject: "Advanced Algorithms", total: 60, present: 52, faculty: "Dr. Pankaj Kumar" },
        { subject: "Operating Systems", total: 58, present: 44, faculty: "Prof. Rekha Gupta" },
        { subject: "Database Systems", total: 55, present: 50, faculty: "Dr. Suresh Mehta" },
        { subject: "Computer Networks", total: 60, present: 46, faculty: "Prof. Anita Shah" },
        { subject: "Software Engineering", total: 50, present: 42, faculty: "Dr. Ravi Kumar" },
        { subject: "Machine Learning Lab", total: 45, present: 38, faculty: "Prof. Neha Joshi" },
    ],
};

const SGPA = { 1: 7.8, 2: 8.1, 3: 8.6, 4: 8.9, 5: 8.4 };

const DAILY_UPDATES = [
    { id: 1, type: "result", icon: "📊", color: "#4481eb", bg: "rgba(68,129,235,0.1)", title: "Sem 5 Results Uploaded", desc: "Dr. Pankaj Kumar has uploaded Artificial Intelligence marks.", time: "2 hrs ago", tag: "Result" },
    { id: 2, type: "attendance", icon: "📅", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", title: "Low Attendance Warning", desc: "Your Operating Systems attendance has dropped to 75.8%. Attend next class.", time: "5 hrs ago", tag: "Alert" },
    { id: 3, type: "fee", icon: "💰", color: "#ef4444", bg: "rgba(239,68,68,0.1)", title: "Fee Due Reminder", desc: "Tuition Fee (Sem 2) of ₹40,000 is due on 31 Jan 2025.", time: "Today 9:00 AM", tag: "Fee" },
    { id: 4, type: "announce", icon: "📢", color: "#22c55e", bg: "rgba(34,197,94,0.1)", title: "Holiday Notice", desc: "College will remain closed on 26th January — Republic Day.", time: "Yesterday", tag: "Notice" },
    { id: 5, type: "assignment", icon: "📝", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", title: "Assignment Deadline", desc: "Cloud Computing assignment submission closes tonight at 11:59 PM.", time: "Yesterday", tag: "Assignment" },
    { id: 6, type: "result", icon: "🏆", color: "#04befe", bg: "rgba(4,190,254,0.1)", title: "Achievement Unlocked", desc: "Congratulations! You have been awarded the Merit Scholarship 2024.", time: "2 days ago", tag: "Achievement" },
];

const UPCOMING_EVENTS = [
    { id: 1, title: "Mid-Sem Examinations", date: "Jan 28", day: "Mon", month: "JAN", icon: "📝", color: "#ef4444", bg: "rgba(239,68,68,0.12)", desc: "Advanced Algorithms & Database Systems", location: "Exam Hall B-2", type: "Exam" },
    { id: 2, title: "TechFest 2025 — Hackathon", date: "Feb 3", day: "Sun", month: "FEB", icon: "💻", color: "#4481eb", bg: "rgba(68,129,235,0.12)", desc: "24-hour coding competition. Register by Jan 30.", location: "CS Lab 3 & 4", type: "Event" },
    { id: 3, title: "Industry Expert Talk", date: "Feb 7", day: "Thu", month: "FEB", icon: "🎤", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", desc: "Mr. Arjun Mehta (Google SWE) on AI in Production.", location: "Seminar Hall", type: "Talk" },
    { id: 4, title: "Fee Payment Deadline", date: "Jan 31", day: "Fri", month: "JAN", icon: "💰", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", desc: "Last date to pay Tuition Fee Sem 2 without fine.", location: "Accounts Office", type: "Deadline" },
    { id: 5, title: "Annual Sports Meet", date: "Feb 15", day: "Sat", month: "FEB", icon: "🏃", color: "#22c55e", bg: "rgba(34,197,94,0.12)", desc: "Inter-branch sports competitions. Registration open.", location: "College Ground", type: "Sports" },
    { id: 6, title: "Project Viva — Sem 6", date: "Mar 1", day: "Sat", month: "MAR", icon: "🎓", color: "#04befe", bg: "rgba(4,190,254,0.12)", desc: "Final year project presentations begin.", location: "Dept. Labs", type: "Academic" },
];

const GROUPS = [
    {
        id: 1, name: "CSE Sem 6 — Section A", icon: "💻", members: 43, type: "Official", messages: [
            { from: "Dr. Pankaj Kumar", text: "Assignment submission deadline is tomorrow midnight.", time: "10:30 AM", self: false },
            { from: "Ankit Nair", text: "Sir, can we submit via email?", time: "10:45 AM", self: false },
            { from: "Dr. Pankaj Kumar", text: "Yes, submit to portal only.", time: "10:50 AM", self: false },
            { from: "You", text: "Noted sir, thank you!", time: "11:00 AM", self: true },
        ]
    },
    {
        id: 2, name: "AI & ML Club", icon: "🤖", members: 28, type: null, messages: [
            { from: "Rohan Verma", text: "Meeting at 5pm today for project discussion.", time: "9:00 AM", self: false },
            { from: "You", text: "I'll be there!", time: "9:10 AM", self: true },
            { from: "Sneha Patel", text: "Can we do it online?", time: "9:15 AM", self: false },
        ]
    },
    {
        id: 3, name: "Study Circle — DSA", icon: "📚", members: 12, badge: 5, type: null, messages: [
            { from: "Priya Singh", text: "Test tonight at 8pm. Graphs chapter.", time: "2:00 PM", self: false },
            { from: "You", text: "Ready! Just finished revision.", time: "2:15 PM", self: true },
        ]
    },
    {
        id: 4, name: "Hackathon Team — CodeStorm", icon: "🏆", members: 4, type: null, messages: [
            { from: "Aman Gupta", text: "Finalize the tech stack today.", time: "Yesterday", self: false },
            { from: "You", text: "React + FastAPI + PostgreSQL?", time: "Yesterday", self: true },
            { from: "Aman Gupta", text: "Perfect. Let's go!", time: "Yesterday", self: false },
        ]
    },
    {
        id: 5, name: "Cultural Committee", icon: "🎭", members: 20, type: null, messages: [
            { from: "Nisha Verma", text: "Annual fest planning meeting this Saturday.", time: "Mon", self: false },
        ]
    },
    {
        id: 6, name: "College Announcements", icon: "📢", members: 800, type: "Official", messages: [
            { from: "Admin", text: "Semester exam timetable has been released. Check the portal.", time: "Today", self: false },
            { from: "Admin", text: "Holiday on 26th January — Republic Day.", time: "Yesterday", self: false },
        ]
    },
];

const ACHIEVEMENTS = [
    { icon: "🥇", title: "1st Place — Hackathon", desc: "Won TechFest 2024 with an AI-powered campus safety app.", date: "December 2024" },
    { icon: "📜", title: "Merit Scholarship", desc: "Awarded for maintaining CGPA above 8.5 consistently.", date: "November 2024" },
    { icon: "🌟", title: "Best Student Award", desc: "Recognized as Best Student of CSE for academic year 2023–24.", date: "May 2024" },
    { icon: "🎤", title: "Paper Presentation", desc: "Presented research on ML applications at National Tech Symposium.", date: "March 2024" },
    { icon: "🏃", title: "Sports Champion", desc: "Gold medal in 100m sprint at Inter-College Sports Meet 2024.", date: "February 2024" },
    { icon: "💡", title: "Innovation Award", desc: "Best project award for IoT-based smart irrigation system.", date: "January 2024" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const gradeColor = (g) => {
    if (g === "O") return "text-emerald-400 bg-emerald-400/10";
    if (g === "A+" || g === "A") return "text-cyan-400 bg-cyan-400/10";
    return "text-amber-400 bg-amber-400/10";
};

// ─── BAR CHART ──────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = "#4481eb", max = 10, isDark }) {
    const labelColor = isDark ? "#8b949e" : "#57606a";
    return (
        <div className="flex items-end gap-2 h-28 w-full">
            {data.map((v, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-[9px] font-bold transition-colors" style={{ color: labelColor }}>{v}</span>
                    <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${(v / max) * 90}%`, background: color, opacity: 0.85, minHeight: 4 }}
                    />
                    <span className="text-[9px] transition-colors" style={{ color: labelColor }}>{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function DonutChart({ value, total, color = "#22c55e", isDark = true }) {
    const pct = value / total;
    const r = 40;
    const circ = 2 * Math.PI * r;
    const dash = pct * circ;
    return (
        <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <circle
                cx="50" cy="50" r={r} fill="none"
                stroke={color} strokeWidth="12"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
            />
            <text x="50" y="54" textAnchor="middle"  fill={isDark ? "white" : "#111827"}  fontSize="14" fontWeight="900" fontFamily="Syne, sans-serif">
                {Math.round(pct * 100)}%
            </text>
        </svg>
    );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
const NAV = [
    {
        section: "Main", items: [
            { key: "dashboard", icon: "🏠", label: "Dashboard" },
            { key: "result", icon: "📊", label: "Result", badge: "New" },
            { key: "attendance", icon: "📅", label: "Attendance" },
        ]
    },
    {
        section: "Community", items: [
            { key: "groups", icon: "👥", label: "My Groups" },
        ]
    },
    {
        section: "Personal", items: [
            { key: "achievement", icon: "🏆", label: "Achievements" },
            { key: "fee", icon: "💰", label: "Fee Details" },
            { key: "profile", icon: "👤", label: "My Profile" },
        ]
    },
    {
        section: "Account", items: [
            { key: "settings", icon: "⚙️", label: "Settings" },
        ]
    },
];

function Sidebar({ active, onNav, student, isDark }) {
    const sidebarBg = isDark ? "#0d1117" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)";
    const textColor = isDark ? "#e6edf3" : "#24292f";
    const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    
    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50 overflow-y-auto transition-colors"
            style={{ background: sidebarBg, borderRight: `1px solid ${borderColor}` }}>
            <div className="px-5 py-4 border-b transition-colors" style={{ borderColor }}>
                <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black tracking-widest text-cyan-400" style={{ fontFamily: "Syne, sans-serif" }}>STUDENT PORTAL</span>
                </div>
            </div>
            <div className="px-4 py-5 border-b flex flex-col items-center text-center gap-2 transition-colors"
                style={{ borderColor }}>
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50">
                        {student.photo
                            ? <img src={student.photo} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl"
                                style={{ background: "linear-gradient(135deg, #1e3a5f, #0d2a4a)" }}>🎓</div>
                        }
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
                        style={{ borderColor: sidebarBg }} />
                </div>
                <div className="font-black text-sm transition-colors" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>{student.name}</div>
                <div className="text-[10px] transition-colors" style={{ color: isDark ? "#8b949e" : "#57606a" }}>
                    Roll: {student.rollNo} · CSE — {student.year}<br />Batch {student.batch}
                </div>
            </div>
            <nav className="flex-1 py-2">
                {NAV.map(sec => (
                    <div key={sec.section} className="mb-1">
                        <div className="text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-colors" style={{ color: isDark ? "#6e7681" : "#959da5" }}>{sec.section}</div>
                        {sec.items.map(it => (
                            <button key={it.key} onClick={() => onNav(it.key)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] transition-all border-l-[3px] text-left`}
                                style={{
                                    background: active === it.key ? (isDark ? "rgba(0,212,255,0.1)" : "rgba(0,84,255,0.1)") : hoverBg,
                                    color: active === it.key ? "#00d4ff" : (isDark ? "#8b949e" : "#57606a"),
                                    borderColor: active === it.key ? "cyan" : "transparent"
                                }}>
                                <span>{it.icon}</span>
                                <span className="flex-1">{it.label}</span>
                                {it.badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">{it.badge}</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="p-4 border-t transition-colors" style={{ borderColor }}>
                <div className="text-[10px] text-center transition-colors" style={{ color: isDark ? "#6e7681" : "#959da5" }}>RPS Engineering College © 2025</div>
            </div>
        </aside>
    );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ student, isDark }) {
    const totalPresent = TEACHER_UPLOADS.attendance.reduce((a, s) => a + s.present, 0);
    const totalClasses = TEACHER_UPLOADS.attendance.reduce((a, s) => a + s.total, 0);
    const attPct = Math.round(totalPresent / totalClasses * 100);
    const cgpa = (Object.values(SGPA).reduce((a, v) => a + v, 0) / Object.keys(SGPA).length).toFixed(1);
    const [activeFilter, setActiveFilter] = useState("all");

    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "rgba(240,242,245,0.85)";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)";
    const textColor = isDark ? "#e6edf3" : "#24292f";
    const mutedText = isDark ? "#94a3b8" : "#6b7280"; // ✅ ye line rakho

    const filteredUpdates = activeFilter === "all"
        ? DAILY_UPDATES
        : DAILY_UPDATES.filter(u => u.type === activeFilter);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: "🎓", val: cgpa, label: "Current CGPA", trend: "↑ +0.2 this sem", trendUp: true, bg: "rgba(68,129,235,0.12)" },
                    { icon: "📅", val: `${attPct}%`, label: "Attendance", trend: "↑ Above threshold", trendUp: true, bg: "rgba(34,197,94,0.12)" },
                    { icon: "💰", val: "₹45K", label: "Fee Pending", trend: "↓ Due 31 Jan", trendUp: false, bg: "rgba(245,158,11,0.12)" },
                    { icon: "🏆", val: "6", label: "Achievements", trend: "↑ 2 this month", trendUp: true, bg: "rgba(4,190,254,0.12)" },
                ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1"
                        style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: s.bg }}>
                            {s.icon}
                        </div>
                        <div>
                            <div className="text-2xl font-black transition-colors" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>{s.val}</div>
                            <div className="text-xs mt-0.5 transition-colors" style={{ color: isDark ? "#8b949e" : "#57606a" }}>{s.label}</div>
                            <div className={`text-xs mt-1 ${s.trendUp ? "text-emerald-400" : "text-red-400"}`}>{s.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-5 transition-colors" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-sm transition-colors" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📊 CGPA Progress</h3>
                        <span className="text-xs transition-colors" style={{ color: isDark ? "#8b949e" : "#57606a" }}>Sem 1–5</span>
                    </div>
                    <BarChart data={[7.8, 8.1, 8.6, 8.9, 8.4]} labels={["S1", "S2", "S3", "S4", "S5"]} color="#4481eb" max={10} isDark={isDark} />
                </div>
                <div className="rounded-2xl p-5 transition-colors" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-sm transition-colors" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📅 Attendance Overview</h3>
                        <span className="text-xs transition-colors" style={{ color: isDark ? "#8b949e" : "#57606a" }}>Current Sem</span>
                    </div>
                    <div className="flex items-center justify-around mt-2">
                       <DonutChart value={totalPresent} total={totalClasses} color="#22c55e" isDark={isDark} />
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span style={{ color: textColor }}>Present: {totalPresent}</span></div>
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><span style={{ color: textColor }}>Absent: {totalClasses - totalPresent}</span></div>
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span style={{ color: textColor }}>Total: {totalClasses}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Updates + Upcoming Events */}
            <div className="grid grid-cols-2 gap-5">
                {/* Daily Updates */}
                 <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="px-5 pt-5 pb-3">
                        <div className="flex justify-between items-center mb-3">
                             <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>🔔 Daily Updates</h3>
                            <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full font-bold">{DAILY_UPDATES.length} new</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {["all", "result", "attendance", "fee", "assignment", "announce"].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)}
                                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize transition-all ${activeFilter === f
                                        ? "bg-blue-500 text-white"
                                        : isDark
                                            ? "text-slate-300 bg-white/5 hover:bg-white/10 hover:text-slate-300"
                                            : "text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900"
                                        }`}>
                                    {f === "all" ? "All" : f === "announce" ? "Notice" : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: "340px" }}>
                        {filteredUpdates.map((u) => (
                            <div key={u.id} className={`flex gap-3 p-3 rounded-xl mb-2 transition-all cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                                style={{ borderLeft: `3px solid ${u.color}` }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                    style={{ background: u.bg }}>{u.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-xs font-bold leading-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>{u.title}</span>
                                        <span className="text-[9px] flex-shrink-0 mt-0.5" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{u.time}</span>
                                    </div>
                                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{u.desc}</p>
                                    <span className="inline-block mt-1.5 text-[9px] font-black px-2 py-0.5 rounded-full"
                                        style={{ background: u.bg, color: u.color }}>{u.tag}</span>
                                </div>
                            </div>
                        ))}
                        {filteredUpdates.length === 0 && (
                            <div className="text-center py-8 text-slate-600 text-xs">No updates in this category</div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events */}
               <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="px-5 pt-5 pb-3 flex justify-between items-center">
                        <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📆 Upcoming Events</h3>
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full font-bold">{UPCOMING_EVENTS.length} events</span>
                    </div>
                    <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: "370px" }}>
                        {UPCOMING_EVENTS.map((ev) => (
                            <div key={ev.id} className={`flex gap-3 p-3 rounded-xl mb-2 transition-all cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 text-center"
                                    style={{ background: ev.bg }}>
                                    <span className="text-[9px] font-black leading-none" style={{ color: ev.color }}>{ev.month}</span>
                                    <span className="text-lg font-black leading-tight" style={{ fontFamily: "Syne, sans-serif", color: '#ffffff' }}>
                                        {ev.date.split(" ")[1]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="text-xs font-bold leading-tight" style={{ color: isDark ? '#ffffff' : '#111827' }}>{ev.title}</span>
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                                            style={{ background: ev.bg, color: ev.color }}>{ev.type}</span>
                                    </div>
                                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{ev.desc}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px]">📍</span>
                                        <span className="text-[10px]" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{ev.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Result */}
              <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📋 Latest Result...</h3>
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Uploaded by Teacher</span>
                </div>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-slate-500 uppercase tracking-wider text-[10px]">
                            <th className="text-left pb-2 px-2">Subject</th>
                            <th className="text-center pb-2">Internal</th>
                            <th className="text-center pb-2">External</th>
                            <th className="text-center pb-2">Total</th>
                            <th className="text-center pb-2">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TEACHER_UPLOADS.results[5].map((s, i) => (
                            <tr key={i} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                <td className="py-2.5 px-2" style={{ color: textColor }}>{s.subject}</td>
                                <td className="text-center" style={{ color: mutedText }}>{s.internal}/30</td>
                                <td className="text-center" style={{ color: mutedText }}>{s.external}/70</td>
                                <td className="text-center font-bold" style={{ color: textColor }}>{s.total}/100</td>
                                <td className="text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── RESULT PAGE ──────────────────────────────────────────────────────────────
function ResultPage({ isDark }) {
    const [selectedSem, setSelectedSem] = useState(5);
    const sems = [1, 2, 3, 4, 5, 6];
    const semResults = TEACHER_UPLOADS.results[selectedSem] ?? null;

    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    const selectBg = isDark ? "bg-slate-900 text-slate-300 hover:bg-slate-800" : "bg-slate-50 text-slate-700 hover:bg-slate-100";
    const labelText = isDark ? "text-slate-400" : "text-slate-500";
    const rowBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(226,232,240,0.8)";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📋 Exam Results</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Your academic performance — semester wise</p>
            </div>

            {/* Sem selector */}
            <div className="grid grid-cols-6 gap-3">
                {sems.map(s => (
                    <button key={s} onClick={() => setSelectedSem(s)}
                        className={`rounded-2xl p-4 text-center transition-all border ${selectedSem === s
                            ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                            : `${selectBg} border ${isDark ? "border-slate-700" : "border-slate-200"}`
                            }`}>
                        <div className={`text-[10px] uppercase tracking-wider mb-1 ${labelText}`}>Sem {s}</div>
                        <div className={`text-2xl font-black ${selectedSem === s ? "text-cyan-400" : isDark ? "text-slate-100" : "text-slate-900"}`}
                            style={{ fontFamily: "Syne, sans-serif" }}>
                            {SGPA[s] ?? "—"}
                        </div>
                        <div className={`text-[9px] mt-0.5 ${mutedText}`}>{SGPA[s] ? "SGPA" : "Current"}</div>
                    </button>
                ))}
            </div>

            {/* CGPA Trend */}
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>CGPA Trend</h3>
                    <span className="text-xs text-cyan-400">
                        Cumulative: {(Object.values(SGPA).reduce((a, v) => a + v, 0) / Object.keys(SGPA).length).toFixed(2)}
                    </span>
                </div>
                <BarChart data={[7.8, 8.1, 8.6, 8.9, 8.4]} labels={["S1", "S2", "S3", "S4", "S5"]} color="#04befe" max={10} isDark={isDark} />
            </div>

            {/* Subject-wise table */}
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>
                        Subject-wise Marks — Semester {selectedSem}
                    </h3>
                    {semResults
                        ? <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">✓ Uploaded by Teacher</span>
                        : <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">⏳ Not yet uploaded</span>
                    }
                </div>

                {semResults ? (
                    <>
                        <div className="mb-5">
                            <BarChart
                                data={semResults.map(s => s.total)}
                                labels={semResults.map(s => s.subject.split(" ")[0])}
                                color="#4481eb" max={100} isDark={isDark}
                            />
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className={`uppercase tracking-wider text-[10px] ${labelText}`}>
                                    <th className="text-left pb-3 px-2">Subject</th>
                                    <th className="text-center pb-3">Internal /30</th>
                                    <th className="text-center pb-3">External /70</th>
                                    <th className="text-center pb-3">Total /100</th>
                                    <th className="text-center pb-3">Grade</th>
                                    <th className="text-center pb-3">Bar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semResults.map((s, i) => (
                                    <tr key={i} className="border-t" style={{ borderColor: rowBorder }}>
                                        <td className="py-3 px-2 font-medium" style={{ color: textColor }}>{s.subject}</td>
                                        <td className="text-center" style={{ color: mutedText }}>{s.internal}</td>
                                        <td className="text-center" style={{ color: mutedText }}>{s.external}</td>
                                        <td className="text-center font-black" style={{ color: textColor }}>{s.total}</td>
                                        <td className="text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${gradeColor(s.grade)}`}>
                                                {s.grade}
                                            </span>
                                        </td>
                                        <td className="px-3">
                                            <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }}>
                                                <div className="h-full rounded-full" style={{
                                                    width: `${s.total}%`,
                                                    background: s.total >= 90 ? "#22c55e" : s.total >= 75 ? "#4481eb" : "#f59e0b"
                                                }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 pt-4 flex gap-6 border-t" style={{ borderColor }}>
                            <div>
                                <div className="text-xs" style={{ color: mutedText }}>SGPA</div>
                                <div className="text-xl font-black text-cyan-400" style={{ fontFamily: "Syne, sans-serif" }}>{SGPA[selectedSem]}</div>
                            </div>
                            <div>
                                <div className="text-xs" style={{ color: mutedText }}>Average</div>
                                <div className="text-xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>{(semResults.reduce((a, s) => a + s.total, 0) / semResults.length).toFixed(1)}</div>
                            </div>
                            <div>
                                <div className="text-xs" style={{ color: mutedText }}>Highest</div>
                                <div className="text-xl font-black text-emerald-400" style={{ fontFamily: "Syne, sans-serif" }}>{Math.max(...semResults.map(s => s.total))}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12" style={{ color: mutedText }}>
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-sm">Results for Semester {selectedSem} haven't been uploaded yet.</p>
                        <p className="text-xs mt-1" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Check back once your faculty uploads the result.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ isDark }) {
    const subjects = TEACHER_UPLOADS.attendance;
    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    const rowBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
    const lowBorder = isDark ? "rgba(239,68,68,0.3)" : "rgba(254,202,202,0.8)";

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📅 Attendance Tracker</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Current semester — updated by faculty</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {subjects.map((s, i) => {
                    const pct = Math.round(s.present / s.total * 100);
                    const low = pct < 75;
                    return (
                        <div key={i} className="rounded-2xl p-5 transition-all hover:-translate-y-1"
                            style={{ background: cardBg, border: `1px solid ${low ? lowBorder : borderColor}` }}>
                            <div className="font-bold text-sm mb-1" style={{ color: textColor }}>{s.subject}</div>
                            <div className="text-[10px] mb-3" style={{ color: mutedText }}>by {s.faculty}</div>
                            <div className={`text-3xl font-black mb-2 ${low ? "text-red-400" : "text-emerald-400"}`} style={{ fontFamily: "Syne, sans-serif" }}>{pct}%</div>
                            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: rowBg }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? "linear-gradient(to right, #ef4444, #f97316)" : "linear-gradient(to right, #4481eb, #04befe)" }} />
                            </div>
                            <div className="flex justify-between text-[10px]" style={{ color: mutedText }}>
                                <span>{s.present}/{s.total} classes</span>
                                {low && <span className="text-red-400 font-bold">⚠ Low</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-sm" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>Monthly Attendance Trend</h3>
                    <span className="text-xs" style={{ color: mutedText }}>2024</span>
                </div>
                <BarChart data={[90, 88, 85, 80, 78, 82, 84]} labels={["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]} color="#22c55e" max={100} isDark={isDark} />
            </div>
        </div>
    );
}

// ─── GROUPS PAGE ──────────────────────────────────────────────────────────────
function GroupsPage({ isDark }) {
    const [openGroup, setOpenGroup] = useState(null);
    const [msg, setMsg] = useState("");
    const [localMsgs, setLocalMsgs] = useState({});
    const group = GROUPS.find(g => g.id === openGroup);

    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f8fafc";
    const inputBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(226,232,240,0.8)";
    const bubbleBg = isDark ? "rgba(51,65,85,0.8)" : "#eef2ff";

    const sendMsg = () => {
        if (!msg.trim()) return;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setLocalMsgs(prev => ({ ...prev, [openGroup]: [...(prev[openGroup] || []), { from: "You", text: msg, time: now, self: true }] }));
        setMsg("");
    };

    const allMsgs = group ? [...group.messages, ...(localMsgs[openGroup] || [])] : [];

    if (openGroup && group) return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => setOpenGroup(null)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: inputBg, color: mutedText, border: `1px solid ${borderColor}` }}>←</button>
                <div>
                    <h2 className="text-lg font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>{group.name}</h2>
                    <p className="text-xs" style={{ color: mutedText }}>{group.members} members</p>
                </div>
            </div>
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ height: "65vh", background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                    {allMsgs.map((m, i) => (
                        <div key={i} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[65%] flex flex-col gap-1 ${m.self ? "items-end" : "items-start"}`}>
                                {!m.self && <span className="text-[10px] font-bold px-1" style={{ color: "#38bdf8" }}>{m.from}</span>}
                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.self ? "text-white rounded-br-sm" : "rounded-bl-sm"}`}
                                    style={{ background: m.self ? "linear-gradient(135deg, #4481eb, #04befe)" : bubbleBg, color: m.self ? "#ffffff" : textColor }}>
                                    {m.text}
                                </div>
                                <span className="text-[9px] px-1" style={{ color: mutedText }}>{m.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t flex gap-3" style={{ borderColor }}>
                    <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor, caretColor: "#38bdf8" }} />
                    <button onClick={sendMsg} className="w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-80"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff" }}>✈</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>👥 My Groups</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Click any group to open the chat</p>
            </div>
            <div className="space-y-3">
                {GROUPS.map(g => (
                    <button key={g.id} onClick={() => setOpenGroup(g.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 text-left"
                        style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff" }}>{g.icon}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm" style={{ color: textColor }}>{g.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: mutedText }}>{g.members} members · {g.messages[g.messages.length - 1]?.text?.slice(0, 40)}...</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {g.type && <span className="text-[9px] font-black bg-blue-400/10 px-2 py-1 rounded-full" style={{ color: "#38bdf8" }}>{g.type}</span>}
                            {g.badge && <span className="text-[9px] font-black bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center text-white">{g.badge}</span>}
                            <span className="text-sm" style={{ color: mutedText }}>›</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── ACHIEVEMENT PAGE ─────────────────────────────────────────────────────────
function AchievementPage({ isDark }) {
    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>🏆 Achievements</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Your milestones and recognitions</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((a, i) => (
                    <div key={i} className="rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
                        style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="text-4xl mb-3">{a.icon}</div>
                        <div className="font-black text-sm mb-1" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>{a.title}</div>
                        <div className="text-xs leading-relaxed" style={{ color: mutedText }}>{a.desc}</div>
                        <div className="text-[10px] mt-3 font-medium" style={{ color: isDark ? "#7dd3fc" : "#0891b2" }}>{a.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── FEE PAGE ─────────────────────────────────────────────────────────────────
function FeePage({ isDark }) {
    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>💰 Fee Details</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Academic year 2024–25</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Fee", val: "₹1,20,000", sub: "Annual", col: isDark ? "text-white" : "text-slate-900" },
                    { label: "Paid", val: "₹75,000", sub: "✓ Cleared", col: "text-emerald-400" },
                    { label: "Pending", val: "₹45,000", sub: "⚠ Due: 31 Jan 2025", col: "text-amber-400" },
                ].map((f, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">{f.label}</div>
                        <div className={`text-3xl font-black ${f.col}`} style={{ fontFamily: "Syne, sans-serif" }}>{f.val}</div>
                        <div className={`text-xs mt-2 ${f.col}`}>{f.sub}</div>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <h3 className="font-black text-sm mb-4" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>Fee Breakdown</h3>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="uppercase tracking-wider text-[10px]" style={{ color: mutedText }}>
                            {["Fee Type", "Amount", "Due Date", "Status"].map(h => <th key={h} className="text-left pb-3 px-2">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["Tuition Fee (Sem 1)", "₹40,000", "Jul 2024", "Paid", "O"],
                            ["Tuition Fee (Sem 2)", "₹40,000", "Jan 2025", "Pending", "B"],
                            ["Exam Fee", "₹3,500", "Nov 2024", "Paid", "O"],
                            ["Hostel Fee", "₹25,000", "Jul 2024", "Paid", "O"],
                            ["Library & Lab Fee", "₹6,500", "Jan 2025", "Pending", "B"],
                            ["Sports & Activity Fee", "₹5,000", "Jul 2024", "Paid", "O"],
                        ].map(([name, amt, date, status, grade], i) => (
                            <tr key={i} className="border-t" style={{ borderColor }}>
                                <td className="py-2.5 px-2" style={{ color: textColor }}>{name}</td>
                                <td className="py-2.5 px-2" style={{ color: mutedText }}>{amt}</td>
                                <td className="py-2.5 px-2" style={{ color: mutedText }}>{date}</td>
                                <td className="py-2.5 px-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${gradeColor(grade)}`}>{status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="mt-4 pt-4 border-t" style={{ borderColor }}>
                    <button className="px-6 py-2.5 rounded-xl font-black text-white text-xs transition-all hover:opacity-85"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", fontFamily: "Syne, sans-serif" }}>
                        💳 Pay Online
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ student, setStudent, isDark }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ ...student });
    const fileRef = useRef();

    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f8fafc";
    const inputBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(226,232,240,0.8)";
    const summaryBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)";
    const panelBg = isDark ? "rgba(13,17,23,0.85)" : "#ffffff";

   const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);  // ✅ pehle url banao
    setForm(f => ({ ...f, photo: url }));   // ✅ phir use karo
    setStudent(prev => ({ ...prev, photo: url }));
};
    const save = () => { setStudent(form); setEditing(false); };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>👤 My Profile</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Manage your personal information</p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                        <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-cyan-400/40 cursor-pointer group"
                            onClick={() => editing && fileRef.current.click()}
                            style={{ background: isDark ? "linear-gradient(135deg, #1e3a5f, #0d2a4a)" : "linear-gradient(135deg, #e2e8f0, #cbd5e1)" }}>
                            {form.photo
                                ? <img src={form.photo} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-5xl">🎓</div>
                            }
                            {editing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold">📷 Change</span>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handlePhotoChange} />
                        {editing && (
                            <button onClick={() => fileRef.current.click()}
                                className="text-[10px] bg-cyan-400/10 px-3 py-1.5 rounded-lg font-bold hover:bg-cyan-400/20 transition-colors"
                                style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                                📷 Upload Photo
                            </button>
                        )}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", key: "name" },
                            { label: "College Roll No.", key: "rollNo" },
                            { label: "University Roll No.", key: "uniRollNo" },
                            { label: "Registration No.", key: "regNo" },
                            { label: "Branch", key: "branch" },
                            { label: "Year / Semester", key: "year" },
                            { label: "Batch", key: "batch" },
                            { label: "Section", key: "section" },
                            { label: "Email", key: "email" },
                            { label: "Phone", key: "phone" },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: mutedText }}>{f.label}</label>
                                {editing
                                    ? <input value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        className="w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors"
                                        style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }} />
                                    : <div className="text-sm font-medium py-2" style={{ color: textColor }}>{student[f.key] || <span style={{ color: mutedText }}>—</span>}</div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t" style={{ borderColor }}>
                    {editing ? (
                        <>
                            <button onClick={save} className="px-6 py-2.5 rounded-xl font-black text-xs hover:opacity-85"
                                style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff", fontFamily: "Syne, sans-serif" }}>✓ Save Changes</button>
                            <button onClick={() => { setForm({ ...student }); setEditing(false); }}
                                className="px-6 py-2.5 rounded-xl font-black text-xs hover:opacity-85"
                                style={{ background: inputBg, color: mutedText, border: `1px solid ${inputBorder}` }}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)} className="px-6 py-2.5 rounded-xl font-black text-xs hover:opacity-85"
                            style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff", fontFamily: "Syne, sans-serif" }}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                <h3 className="font-black text-sm mb-4" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>📊 Academic Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "CGPA", val: "8.36", col: isDark ? "text-cyan-400" : "text-blue-600" },
                        { label: "Semesters", val: "5 / 8", col: isDark ? "text-white" : "text-slate-900" },
                        { label: "Attendance", val: "82%", col: "text-emerald-400" },
                        { label: "Achievements", val: "6", col: "text-amber-400" },
                    ].map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ background: summaryBg }}>
                            <div className={`text-2xl font-black ${s.col}`} style={{ fontFamily: "Syne, sans-serif" }}>{s.val}</div>
                            <div className="text-xs mt-1" style={{ color: mutedText }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ isDark }) {
    const { setTheme } = useTheme();
    const [toggles, setToggles] = useState({ result: true, attendance: true, fee: true, chat: true, announce: true, email: false });
    const [saved, setSaved] = useState(false);
    const [themeChoice, setThemeChoice] = useState(isDark ? "Dark" : "Light");
    const toggle = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const applyTheme = (value) => {
        setThemeChoice(value);
        setTheme(value === "Dark" ? "dark" : "light");
    };

    const cardBg = isDark ? "rgba(30,41,59,0.85)" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(226,232,240,0.8)";
    const textColor = isDark ? "#e6edf3" : "#111827";
    const mutedText = isDark ? "#94a3b8" : "#6b7280";
    const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f8fafc";
    const inputBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(226,232,240,0.8)";

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>⚙️ Settings</h2>
                <p className="text-sm mt-1" style={{ color: mutedText }}>Manage your preferences</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <h3 className="font-black text-sm mb-4" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>🔔 Notifications</h3>
                    {[
                        { k: "result", label: "Result Alerts" },
                        { k: "attendance", label: "Attendance Reminders" },
                        { k: "fee", label: "Fee Reminders" },
                        { k: "chat", label: "Chat Messages" },
                        { k: "announce", label: "Announcements" },
                        { k: "email", label: "Email Notifications" },
                    ].map(({ k, label }) => (
                        <div key={k} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor }}>
                            <span className="text-sm" style={{ color: mutedText }}>{label}</span>
                            <button onClick={() => toggle(k)}
                                className={`w-11 h-6 rounded-full relative transition-all ${toggles[k] ? "bg-blue-500" : isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                                <span className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${toggles[k] ? "left-5" : "left-0.5"}`} style={{ background: "#ffffff" }} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <h3 className="font-black text-sm mb-4" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>🔒 Security</h3>
                    {["Current Password", "New Password", "Confirm Password"].map(pl => (
                        <div key={pl} className="mb-3">
                            <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: mutedText }}>{pl}</label>
                            <input type="password" placeholder={`Enter ${pl.toLowerCase()}`}
                                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }} />
                        </div>
                    ))}
                    <button onClick={handleSave} className="mt-2 px-6 py-2.5 rounded-xl font-black text-xs hover:opacity-85"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff", fontFamily: "Syne, sans-serif" }}>
                        {saved ? "✓ Saved!" : "Update Password"}
                    </button>
                </div>
                <div className="rounded-2xl p-5 col-span-2" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <h3 className="font-black text-sm mb-4" style={{ fontFamily: "Syne, sans-serif", color: textColor }}>🎨 Preferences</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Language", options: ["English", "Hindi"] },
                            { label: "Semester", options: ["Semester 6 (Current)", "Semester 5"] },
                            { label: "Theme", options: ["Light", "Dark"] },
                        ].map(({ label, options }) => (
                            <div key={label}>
                                <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: mutedText }}>{label}</label>
                                <select value={label === "Theme" ? themeChoice : options[0]} onChange={e => label === "Theme" && applyTheme(e.target.value)}
                                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }}>
                                    {options.map(o => <option key={o} value={o} style={{ background: isDark ? "#1e293b" : "#f8fafc", color: textColor }}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave} className="mt-4 px-6 py-2.5 rounded-xl font-black text-xs hover:opacity-85"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", color: "#ffffff", fontFamily: "Syne, sans-serif" }}>
                        {saved ? "✓ Saved!" : "Save Preferences"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
    const { isDark, toggleTheme } = useTheme();
    const [activePage, setActivePage] = useState("dashboard");
 
    const [student, setStudent] = useState({
        name: "Rahul Sharma",
        photo: null,
        rollNo: "2201234",
        uniRollNo: "22BTCSE1234",
        regNo: "REG2022001234",
        branch: "Computer Science Engineering",
        year: "3rd Year — Sem 6",
        batch: "2022–26",
        section: "Section A",
        email: "rahul.sharma@rps.edu.in",
        phone: "+91 98765 43210",
    });

    const PAGE_TITLES = {
        dashboard: "Dashboard", result: "Exam Results", attendance: "Attendance",
        groups: "My Groups", achievement: "Achievements", fee: "Fee Details",
        profile: "My Profile", settings: "Settings"
    };

    const mainBg = isDark ? "#0f172a" : "#f5f5f5";
    const headerBg = isDark ? "rgba(13,17,23,0.92)" : "rgba(255,255,255,0.92)";
    const headerBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)";
    const textPrimary = isDark ? "#e6edf3" : "#24292f";
    const textSecondary = isDark ? "#8b949e" : "#57606a";

    const renderPage = () => {
        switch (activePage) {
            case "dashboard": return <DashboardPage student={student} isDark={isDark} />;
            case "result": return <ResultPage isDark={isDark} />;
            case "attendance": return <AttendancePage isDark={isDark} />;
            case "groups": return <GroupsPage isDark={isDark} />;
            case "achievement": return <AchievementPage isDark={isDark} />;
            case "fee": return <FeePage isDark={isDark} />;
            case "profile": return <ProfilePage student={student} setStudent={setStudent} isDark={isDark} />;
            case "settings": return <SettingsPage isDark={isDark} />;
            default: return <DashboardPage student={student} isDark={isDark} />;
        }
    };

    return (
        <div className="min-h-screen transition-colors" style={{ background: mainBg, fontFamily: "DM Sans, sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
            <Sidebar active={activePage} onNav={setActivePage} student={student} isDark={isDark} />
            <div className="ml-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b transition-colors"
                    style={{ background: headerBg, backdropFilter: "blur(12px)", borderColor: headerBorder }}>
                    <div>
                        <h2 className="text-lg font-black transition-colors" style={{ fontFamily: "Syne, sans-serif", color: textPrimary }}>{PAGE_TITLES[activePage]}</h2>
                        <p className="text-xs mt-0.5 transition-colors" style={{ color: textSecondary }}>Welcome back, {student.name.split(" ")[0]} 👋</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${headerBorder}`, color: textSecondary }}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                            style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${headerBorder}`, color: textSecondary }}>🔔</button>
                        <button onClick={() => setActivePage("profile")}
                            className="w-9 h-9 rounded-xl overflow-hidden border-2 border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
                            {student.photo
                                ? <img src={student.photo} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4481eb, #04befe)" }}>🎓</div>
                            }
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-6">{renderPage()}</main>
            </div>
        </div>
    );
}