import { useState, useRef } from "react";

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
function BarChart({ data, labels, color = "#4481eb", max = 10 }) {
    return (
        <div className="flex items-end gap-2 h-28 w-full">
            {data.map((v, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-[9px] text-slate-400 font-bold">{v}</span>
                    <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${(v / max) * 90}%`, background: color, opacity: 0.85, minHeight: 4 }}
                    />
                    <span className="text-[9px] text-slate-500">{labels[i]}</span>
                </div>
            ))}
        </div>
    );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function DonutChart({ value, total, color = "#22c55e" }) {
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
            <text x="50" y="54" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Syne, sans-serif">
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

function Sidebar({ active, onNav, student }) {
    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50 overflow-y-auto"
            style={{ background: "#0d1117", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black tracking-widest text-cyan-400" style={{ fontFamily: "Syne, sans-serif" }}>STUDENT PORTAL</span>
                </div>
            </div>
            <div className="px-4 py-5 border-b flex flex-col items-center text-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400/50">
                        {student.photo
                            ? <img src={student.photo} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl"
                                style={{ background: "linear-gradient(135deg, #1e3a5f, #0d2a4a)" }}>🎓</div>
                        }
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
                        style={{ borderColor: "#0d1117" }} />
                </div>
                <div className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{student.name}</div>
                <div className="text-[10px] text-slate-500 leading-relaxed">
                    Roll: {student.rollNo} · CSE — {student.year}<br />Batch {student.batch}
                </div>
            </div>
            <nav className="flex-1 py-2">
                {NAV.map(sec => (
                    <div key={sec.section} className="mb-1">
                        <div className="text-[9px] font-bold tracking-widest text-slate-600 px-4 py-2 uppercase">{sec.section}</div>
                        {sec.items.map(it => (
                            <button key={it.key} onClick={() => onNav(it.key)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] transition-all border-l-[3px] text-left ${active === it.key
                                    ? "bg-blue-500/10 text-cyan-400 border-cyan-400"
                                    : "text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200"
                                    }`}>
                                <span>{it.icon}</span>
                                <span className="flex-1">{it.label}</span>
                                {it.badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">{it.badge}</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="text-[10px] text-slate-600 text-center">RPS Engineering College © 2025</div>
            </div>
        </aside>
    );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ student }) {
    const totalPresent = TEACHER_UPLOADS.attendance.reduce((a, s) => a + s.present, 0);
    const totalClasses = TEACHER_UPLOADS.attendance.reduce((a, s) => a + s.total, 0);
    const attPct = Math.round(totalPresent / totalClasses * 100);
    const cgpa = (Object.values(SGPA).reduce((a, v) => a + v, 0) / Object.keys(SGPA).length).toFixed(1);
    const [activeFilter, setActiveFilter] = useState("all");

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
                        style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: s.bg }}>
                            {s.icon}
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>{s.val}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                            <div className={`text-xs mt-1 ${s.trendUp ? "text-emerald-400" : "text-red-400"}`}>{s.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>📊 CGPA Progress</h3>
                        <span className="text-xs text-slate-500">Sem 1–5</span>
                    </div>
                    <BarChart data={[7.8, 8.1, 8.6, 8.9, 8.4]} labels={["S1", "S2", "S3", "S4", "S5"]} color="#4481eb" max={10} />
                </div>
                <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>📅 Attendance Overview</h3>
                        <span className="text-xs text-slate-500">Current Sem</span>
                    </div>
                    <div className="flex items-center justify-around mt-2">
                        <DonutChart value={totalPresent} total={totalClasses} color="#22c55e" />
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span className="text-slate-300">Present: {totalPresent}</span></div>
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className="text-slate-300">Absent: {totalClasses - totalPresent}</span></div>
                            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="text-slate-300">Total: {totalClasses}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Updates + Upcoming Events */}
            <div className="grid grid-cols-2 gap-5">
                {/* Daily Updates */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="px-5 pt-5 pb-3">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>🔔 Daily Updates</h3>
                            <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full font-bold">{DAILY_UPDATES.length} new</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            {["all", "result", "attendance", "fee", "assignment", "announce"].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)}
                                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize transition-all ${activeFilter === f
                                        ? "bg-blue-500 text-white"
                                        : "text-slate-500 bg-white/5 hover:bg-white/10 hover:text-slate-300"
                                        }`}>
                                    {f === "all" ? "All" : f === "announce" ? "Notice" : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: "340px" }}>
                        {filteredUpdates.map((u) => (
                            <div key={u.id} className="flex gap-3 p-3 rounded-xl mb-2 transition-all hover:bg-white/5 cursor-pointer"
                                style={{ borderLeft: `3px solid ${u.color}` }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                    style={{ background: u.bg }}>{u.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-xs font-bold text-white leading-tight">{u.title}</span>
                                        <span className="text-[9px] text-slate-600 flex-shrink-0 mt-0.5">{u.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{u.desc}</p>
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
                <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="px-5 pt-5 pb-3 flex justify-between items-center">
                        <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>📆 Upcoming Events</h3>
                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full font-bold">{UPCOMING_EVENTS.length} events</span>
                    </div>
                    <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: "370px" }}>
                        {UPCOMING_EVENTS.map((ev) => (
                            <div key={ev.id} className="flex gap-3 p-3 rounded-xl mb-2 transition-all hover:bg-white/5 cursor-pointer">
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 text-center"
                                    style={{ background: ev.bg }}>
                                    <span className="text-[9px] font-black leading-none" style={{ color: ev.color }}>{ev.month}</span>
                                    <span className="text-lg font-black leading-tight text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                                        {ev.date.split(" ")[1]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="text-xs font-bold text-white leading-tight">{ev.title}</span>
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                                            style={{ background: ev.bg, color: ev.color }}>{ev.type}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ev.desc}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px]">📍</span>
                                        <span className="text-[10px] text-slate-500">{ev.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Result */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>📋 Latest Result — Semester 5</h3>
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
                                <td className="py-2.5 px-2 text-slate-200">{s.subject}</td>
                                <td className="text-center text-slate-300">{s.internal}/30</td>
                                <td className="text-center text-slate-300">{s.external}/70</td>
                                <td className="text-center font-bold text-white">{s.total}/100</td>
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
function ResultPage() {
    const [selectedSem, setSelectedSem] = useState(5);
    const sems = [1, 2, 3, 4, 5, 6];
    const semResults = TEACHER_UPLOADS.results[selectedSem] ?? null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>📋 Exam Results</h2>
                <p className="text-slate-400 text-sm mt-1">Your academic performance — semester wise</p>
            </div>

            {/* Sem selector */}
            <div className="grid grid-cols-6 gap-3">
                {sems.map(s => (
                    <button key={s} onClick={() => setSelectedSem(s)}
                        className={`rounded-2xl p-4 text-center transition-all border ${selectedSem === s
                            ? "border-cyan-400/50 bg-cyan-400/10"
                            : "border-white/5 bg-white/5 hover:bg-white/10"
                            }`}>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sem {s}</div>
                        <div className={`text-2xl font-black ${selectedSem === s ? "text-cyan-400" : "text-white"}`}
                            style={{ fontFamily: "Syne, sans-serif" }}>
                            {SGPA[s] ?? "—"}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{SGPA[s] ? "SGPA" : "Current"}</div>
                    </button>
                ))}
            </div>

            {/* CGPA Trend */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>CGPA Trend</h3>
                    <span className="text-xs text-cyan-400">
                        Cumulative: {(Object.values(SGPA).reduce((a, v) => a + v, 0) / Object.keys(SGPA).length).toFixed(2)}
                    </span>
                </div>
                <BarChart data={[7.8, 8.1, 8.6, 8.9, 8.4]} labels={["S1", "S2", "S3", "S4", "S5"]} color="#04befe" max={10} />
            </div>

            {/* Subject-wise table */}
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
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
                                color="#4481eb" max={100}
                            />
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-slate-500 uppercase tracking-wider text-[10px]">
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
                                    <tr key={i} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                        <td className="py-3 px-2 text-slate-200 font-medium">{s.subject}</td>
                                        <td className="text-center text-slate-300">{s.internal}</td>
                                        <td className="text-center text-slate-300">{s.external}</td>
                                        <td className="text-center font-black text-white">{s.total}</td>
                                        <td className="text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${gradeColor(s.grade)}`}>
                                                {s.grade}
                                            </span>
                                        </td>
                                        <td className="px-3">
                                            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
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
                        <div className="mt-4 pt-4 flex gap-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                            <div><div className="text-xs text-slate-400">SGPA</div><div className="text-xl font-black text-cyan-400" style={{ fontFamily: "Syne, sans-serif" }}>{SGPA[selectedSem]}</div></div>
                            <div><div className="text-xs text-slate-400">Average</div><div className="text-xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>{(semResults.reduce((a, s) => a + s.total, 0) / semResults.length).toFixed(1)}</div></div>
                            <div><div className="text-xs text-slate-400">Highest</div><div className="text-xl font-black text-emerald-400" style={{ fontFamily: "Syne, sans-serif" }}>{Math.max(...semResults.map(s => s.total))}</div></div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-sm">Results for Semester {selectedSem} haven't been uploaded yet.</p>
                        <p className="text-xs mt-1 text-slate-600">Check back once your faculty uploads the result.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage() {
    const subjects = TEACHER_UPLOADS.attendance;
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>📅 Attendance Tracker</h2>
                <p className="text-slate-400 text-sm mt-1">Current semester — updated by faculty</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {subjects.map((s, i) => {
                    const pct = Math.round(s.present / s.total * 100);
                    const low = pct < 75;
                    return (
                        <div key={i} className="rounded-2xl p-5 transition-all hover:-translate-y-1"
                            style={{ background: "rgba(30,41,59,0.85)", border: `1px solid ${low ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}` }}>
                            <div className="font-bold text-white text-sm mb-1">{s.subject}</div>
                            <div className="text-[10px] text-slate-500 mb-3">by {s.faculty}</div>
                            <div className={`text-3xl font-black mb-2 ${low ? "text-red-400" : "text-emerald-400"}`} style={{ fontFamily: "Syne, sans-serif" }}>{pct}%</div>
                            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: low ? "linear-gradient(to right, #ef4444, #f97316)" : "linear-gradient(to right, #4481eb, #04befe)" }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>{s.present}/{s.total} classes</span>
                                {low && <span className="text-red-400 font-bold">⚠ Low</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Monthly Attendance Trend</h3>
                    <span className="text-xs text-slate-500">2024</span>
                </div>
                <BarChart data={[90, 88, 85, 80, 78, 82, 84]} labels={["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]} color="#22c55e" max={100} />
            </div>
        </div>
    );
}

// ─── GROUPS PAGE ──────────────────────────────────────────────────────────────
function GroupsPage() {
    const [openGroup, setOpenGroup] = useState(null);
    const [msg, setMsg] = useState("");
    const [localMsgs, setLocalMsgs] = useState({});
    const group = GROUPS.find(g => g.id === openGroup);

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
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)" }}>←</button>
                <div>
                    <h2 className="text-lg font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>{group.name}</h2>
                    <p className="text-slate-500 text-xs">{group.members} members</p>
                </div>
            </div>
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ height: "65vh", background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                    {allMsgs.map((m, i) => (
                        <div key={i} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[65%] flex flex-col gap-1 ${m.self ? "items-end" : "items-start"}`}>
                                {!m.self && <span className="text-[10px] text-cyan-400 font-bold px-1">{m.from}</span>}
                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.self ? "text-white rounded-br-sm" : "text-slate-200 rounded-bl-sm"}`}
                                    style={{ background: m.self ? "linear-gradient(135deg, #4481eb, #04befe)" : "rgba(51,65,85,0.8)" }}>
                                    {m.text}
                                </div>
                                <span className="text-[9px] text-slate-600 px-1">{m.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t flex gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-slate-600 focus:border-cyan-400/50 transition-colors" />
                    <button onClick={sendMsg} className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:opacity-80"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)" }}>✈</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>👥 My Groups</h2>
                <p className="text-slate-400 text-sm mt-1">Click any group to open the chat</p>
            </div>
            <div className="space-y-3">
                {GROUPS.map(g => (
                    <button key={g.id} onClick={() => setOpenGroup(g.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 text-left"
                        style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #4481eb, #04befe)" }}>{g.icon}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-sm">{g.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{g.members} members · {g.messages[g.messages.length - 1]?.text?.slice(0, 40)}...</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {g.type && <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">{g.type}</span>}
                            {g.badge && <span className="text-[9px] font-black text-white bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">{g.badge}</span>}
                            <span className="text-slate-500 text-sm">›</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── ACHIEVEMENT PAGE ─────────────────────────────────────────────────────────
function AchievementPage() {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>🏆 Achievements</h2>
                <p className="text-slate-400 text-sm mt-1">Your milestones and recognitions</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {ACHIEVEMENTS.map((a, i) => (
                    <div key={i} className="rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
                        style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-4xl mb-3">{a.icon}</div>
                        <div className="font-black text-white text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{a.title}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{a.desc}</div>
                        <div className="text-[10px] text-cyan-400/70 mt-3 font-medium">{a.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── FEE PAGE ─────────────────────────────────────────────────────────────────
function FeePage() {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>💰 Fee Details</h2>
                <p className="text-slate-400 text-sm mt-1">Academic year 2024–25</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Fee", val: "₹1,20,000", sub: "Annual", col: "text-white" },
                    { label: "Paid", val: "₹75,000", sub: "✓ Cleared", col: "text-emerald-400" },
                    { label: "Pending", val: "₹45,000", sub: "⚠ Due: 31 Jan 2025", col: "text-amber-400" },
                ].map((f, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">{f.label}</div>
                        <div className={`text-3xl font-black ${f.col}`} style={{ fontFamily: "Syne, sans-serif" }}>{f.val}</div>
                        <div className={`text-xs mt-2 ${f.col}`}>{f.sub}</div>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="font-black text-white text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Fee Breakdown</h3>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-slate-500 uppercase tracking-wider text-[10px]">
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
                            <tr key={i} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                <td className="py-2.5 px-2 text-slate-200">{name}</td>
                                <td className="py-2.5 px-2 text-slate-300">{amt}</td>
                                <td className="py-2.5 px-2 text-slate-400">{date}</td>
                                <td className="py-2.5 px-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${gradeColor(grade)}`}>{status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
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
function ProfilePage({ student, setStudent }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ ...student });
    const fileRef = useRef();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(f => ({ ...f, photo: URL.createObjectURL(file) }));
    };

    const save = () => { setStudent(form); setEditing(false); };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>👤 My Profile</h2>
                <p className="text-slate-400 text-sm mt-1">Manage your personal information</p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                        <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-cyan-400/40 cursor-pointer group"
                            onClick={() => editing && fileRef.current.click()}
                            style={{ background: "linear-gradient(135deg, #1e3a5f, #0d2a4a)" }}>
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
                                className="text-[10px] text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg font-bold hover:bg-cyan-400/20 transition-colors">
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
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                                {editing
                                    ? <input value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-400/50 transition-colors" />
                                    : <div className="text-sm text-white font-medium py-2">{student[f.key] || <span className="text-slate-600">—</span>}</div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    {editing ? (
                        <>
                            <button onClick={save} className="px-6 py-2.5 rounded-xl font-black text-white text-xs hover:opacity-85"
                                style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", fontFamily: "Syne, sans-serif" }}>✓ Save Changes</button>
                            <button onClick={() => { setForm({ ...student }); setEditing(false); }}
                                className="px-6 py-2.5 rounded-xl font-black text-xs text-slate-400 hover:text-white"
                                style={{ background: "rgba(255,255,255,0.06)" }}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setEditing(true)} className="px-6 py-2.5 rounded-xl font-black text-white text-xs hover:opacity-85"
                            style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", fontFamily: "Syne, sans-serif" }}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="font-black text-white text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>📊 Academic Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "CGPA", val: "8.36", col: "text-cyan-400" },
                        { label: "Semesters", val: "5 / 8", col: "text-white" },
                        { label: "Attendance", val: "82%", col: "text-emerald-400" },
                        { label: "Achievements", val: "6", col: "text-amber-400" },
                    ].map((s, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                            <div className={`text-2xl font-black ${s.col}`} style={{ fontFamily: "Syne, sans-serif" }}>{s.val}</div>
                            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage() {
    const [toggles, setToggles] = useState({ result: true, attendance: true, fee: true, chat: true, announce: true, email: false });
    const [saved, setSaved] = useState(false);
    const toggle = (k) => setToggles(p => ({ ...p, [k]: !p[k] }));
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>⚙️ Settings</h2>
                <p className="text-slate-400 text-sm mt-1">Manage your preferences</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h3 className="font-black text-white text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>🔔 Notifications</h3>
                    {[
                        { k: "result", label: "Result Alerts" },
                        { k: "attendance", label: "Attendance Reminders" },
                        { k: "fee", label: "Fee Reminders" },
                        { k: "chat", label: "Chat Messages" },
                        { k: "announce", label: "Announcements" },
                        { k: "email", label: "Email Notifications" },
                    ].map(({ k, label }) => (
                        <div key={k} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                            <span className="text-sm text-slate-300">{label}</span>
                            <button onClick={() => toggle(k)}
                                className={`w-11 h-6 rounded-full relative transition-all ${toggles[k] ? "bg-blue-500" : "bg-slate-700"}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${toggles[k] ? "left-5" : "left-0.5"}`} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl p-5" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h3 className="font-black text-white text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>🔒 Security</h3>
                    {["Current Password", "New Password", "Confirm Password"].map(pl => (
                        <div key={pl} className="mb-3">
                            <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{pl}</label>
                            <input type="password" placeholder={`Enter ${pl.toLowerCase()}`}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400/50 transition-colors placeholder-slate-700" />
                        </div>
                    ))}
                    <button onClick={handleSave} className="mt-2 px-6 py-2.5 rounded-xl font-black text-white text-xs hover:opacity-85"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", fontFamily: "Syne, sans-serif" }}>
                        {saved ? "✓ Saved!" : "Update Password"}
                    </button>
                </div>
                <div className="rounded-2xl p-5 col-span-2" style={{ background: "rgba(30,41,59,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <h3 className="font-black text-white text-sm mb-4" style={{ fontFamily: "Syne, sans-serif" }}>🎨 Preferences</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Language", options: ["English", "Hindi"] },
                            { label: "Semester", options: ["Semester 6 (Current)", "Semester 5"] },
                            { label: "Theme", options: ["Dark", "Darker"] },
                        ].map(({ label, options }) => (
                            <div key={label}>
                                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none">
                                    {options.map(o => <option key={o} value={o} style={{ background: "#1e293b" }}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave} className="mt-4 px-6 py-2.5 rounded-xl font-black text-white text-xs hover:opacity-85"
                        style={{ background: "linear-gradient(135deg, #4481eb, #04befe)", fontFamily: "Syne, sans-serif" }}>
                        {saved ? "✓ Saved!" : "Save Preferences"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
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

    const renderPage = () => {
        switch (activePage) {
            case "dashboard": return <DashboardPage student={student} />;
            case "result": return <ResultPage />;
            case "attendance": return <AttendancePage />;
            case "groups": return <GroupsPage />;
            case "achievement": return <AchievementPage />;
            case "fee": return <FeePage />;
            case "profile": return <ProfilePage student={student} setStudent={setStudent} />;
            case "settings": return <SettingsPage />;
            default: return <DashboardPage student={student} />;
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "#0f172a", fontFamily: "DM Sans, sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
            <Sidebar active={activePage} onNav={setActivePage} student={student} />
            <div className="ml-64 min-h-screen flex flex-col">
                <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b"
                    style={{ background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div>
                        <h2 className="text-lg font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>{PAGE_TITLES[activePage]}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Welcome back, {student.name.split(" ")[0]} 👋</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>🔔</button>
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