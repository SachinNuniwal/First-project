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

// ── Reusable Stat Card ──────────────────────────────────────────────────────
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

// ── Chart Card Wrapper ──────────────────────────────────────────────────────
function ChartCard({ title, children, className = '' }) {
    return (
        <div className={`bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-[#30363d]">
                <div className="text-[13px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{title}</div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

const chartDefaults = {
    plugins: { legend: { display: false } },
    scales: {
        x: { ticks: { color: '#8b949e', font: { size: 11 } }, grid: { color: '#21262d' } },
        y: { ticks: { color: '#8b949e', font: { size: 11 } }, grid: { color: '#21262d' } },
    },
    maintainAspectRatio: false,
};

// ── Main Analytics Page ─────────────────────────────────────────────────────
export default function AnalyticsPage({ students, teachers, classes }) {

    // ── Summary Stats ──
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;
    const avgCgpa = (students.reduce((s, x) => s + x.cgpa, 0) / totalStudents).toFixed(2);
    const avgAtt = Math.round(students.reduce((s, x) => s + x.att, 0) / totalStudents);
    const totalFeeCollected = students.reduce((s, x) => s + x.fee.paid, 0);
    const totalFeeDue = students.reduce((s, x) => s + (x.fee.total - x.fee.paid), 0);
    const feeCollectionPct = Math.round((totalFeeCollected / (totalFeeCollected + totalFeeDue)) * 100);

    // ── Class-wise CGPA Bar ──
    const cgpaBarData = {
        labels: classes.map(c => c.name),
        datasets: [{
            label: 'Avg CGPA',
            data: classes.map(c => c.cgpa),
            backgroundColor: classes.map(c => `${c.color}cc`),
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    // ── Class-wise Attendance Bar ──
    const attBarData = {
        labels: classes.map(c => c.name),
        datasets: [{
            label: 'Attendance %',
            data: classes.map(c => c.att),
            backgroundColor: classes.map(c => `${c.color}99`),
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    // ── Gender Doughnut ──
    const male = students.filter(s => s.gender === 'M').length;
    const female = students.filter(s => s.gender === 'F').length;
    const genderData = {
        labels: ['Male', 'Female'],
        datasets: [{
            data: [male, female],
            backgroundColor: ['#00d4ff', '#a855f7'],
            borderColor: ['#161b22'],
            borderWidth: 3,
        }],
    };

    // ── Fee Collection Doughnut ──
    const feeData = {
        labels: ['Collected', 'Pending'],
        datasets: [{
            data: [totalFeeCollected, totalFeeDue],
            backgroundColor: ['#39d353', '#ff4d4f'],
            borderColor: ['#161b22'],
            borderWidth: 3,
        }],
    };

    // ── Course-wise Breakdown ──
    const courses = {};
    students.forEach(s => { courses[s.course] = (courses[s.course] || 0) + 1; });
    const courseColors = ['#f0a500', '#00d4ff', '#a855f7', '#39d353'];
    const courseData = {
        labels: Object.keys(courses),
        datasets: [{
            data: Object.values(courses),
            backgroundColor: courseColors,
            borderColor: ['#161b22'],
            borderWidth: 3,
        }],
    };

    // ── Teacher Dept Distribution ──
    const depts = {};
    teachers.forEach(t => { depts[t.dept] = (depts[t.dept] || 0) + 1; });
    const deptBarData = {
        labels: Object.keys(depts),
        datasets: [{
            label: 'Teachers',
            data: Object.values(depts),
            backgroundColor: ['#00d4ff', '#f0a500', '#a855f7', '#39d353'],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    // ── CGPA Buckets ──
    const buckets = { '<6': 0, '6–7': 0, '7–8': 0, '8–9': 0, '9+': 0 };
    students.forEach(s => {
        if (s.cgpa >= 9) buckets['9+']++;
        else if (s.cgpa >= 8) buckets['8–9']++;
        else if (s.cgpa >= 7) buckets['7–8']++;
        else if (s.cgpa >= 6) buckets['6–7']++;
        else buckets['<6']++;
    });
    const cgpaBucketData = {
        labels: Object.keys(buckets),
        datasets: [{
            label: 'Students',
            data: Object.values(buckets),
            backgroundColor: ['#ff4d4f', '#f0a500', '#00d4ff', '#39d353', '#a855f7'],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const doughnutOpts = {
        cutout: '68%',
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
    };

    return (
        <div className="space-y-5">

            {/* ── Header Banner ── */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                    <div className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        📊 Department Analytics Report
                    </div>
                    <div className="text-[11px] text-[#8b949e] mt-0.5">
                        CSE Department · Academic Year 2025–26 · Generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div className="text-[11px] text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-400/20">
                    Live Data
                </div>
            </div>

            {/* ── Summary Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="👩‍🎓" label="Total Students" value={totalStudents} sub={`${male}M · ${female}F`} color="#00d4ff" />
                <StatCard icon="👩‍🏫" label="Total Teachers" value={totalTeachers} sub={`${Object.keys(depts).length} departments`} color="#a855f7" />
                <StatCard icon="📊" label="Avg CGPA" value={avgCgpa} sub="Department average" color="#39d353" />
                <StatCard icon="📅" label="Avg Attendance" value={`${avgAtt}%`} sub={`${students.filter(s => s.att < 75).length} below 75%`} color="#f0a500" />
            </div>

            {/* ── Fee Summary Cards ── */}
            <div className="grid grid-cols-3 gap-3">
                <StatCard icon="💰" label="Fee Collected" value={`₹${(totalFeeCollected / 100000).toFixed(1)}L`} sub="Total received" color="#39d353" />
                <StatCard icon="⚠️" label="Fee Pending" value={`₹${(totalFeeDue / 100000).toFixed(1)}L`} sub="Outstanding dues" color="#ff4d4f" />
                <StatCard icon="📈" label="Collection Rate" value={`${feeCollectionPct}%`} sub="Of total fee" color="#00d4ff" />
            </div>

            {/* ── Row 1: CGPA + Attendance Bar Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="🎓 Class-wise CGPA">
                    <div style={{ height: 200 }}>
                        <Bar data={cgpaBarData} options={{
                            ...chartDefaults,
                            scales: {
                                ...chartDefaults.scales,
                                y: { ...chartDefaults.scales.y, min: 6, max: 10 },
                            },
                        }} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {classes.map(c => (
                            <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-[#8b949e]">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                                {c.name}: <span style={{ color: c.color }} className="font-semibold">{c.cgpa}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="📅 Class-wise Attendance">
                    <div style={{ height: 200 }}>
                        <Bar data={attBarData} options={{
                            ...chartDefaults,
                            scales: {
                                ...chartDefaults.scales,
                                y: { ...chartDefaults.scales.y, min: 60, max: 100 },
                            },
                        }} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {classes.map(c => (
                            <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-[#8b949e]">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                                {c.name}: <span style={{ color: c.color }} className="font-semibold">{c.att}%</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* ── Row 2: Doughnuts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Gender */}
                <ChartCard title="👥 Gender Distribution">
                    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
                        <Doughnut data={genderData} options={doughnutOpts} />
                        <div className="absolute text-center pointer-events-none">
                            <div className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{totalStudents}</div>
                            <div className="text-[9px] text-[#8b949e]">students</div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-5 mt-3">
                        <div className="text-center">
                            <div className="text-[16px] font-bold text-[#00d4ff]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{male}</div>
                            <div className="text-[10px] text-[#8b949e]">Male</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[16px] font-bold text-[#a855f7]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{female}</div>
                            <div className="text-[10px] text-[#8b949e]">Female</div>
                        </div>
                    </div>
                </ChartCard>

                {/* Fee Collection */}
                <ChartCard title="💰 Fee Collection">
                    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
                        <Doughnut data={feeData} options={doughnutOpts} />
                        <div className="absolute text-center pointer-events-none">
                            <div className="text-[18px] font-bold text-[#39d353]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{feeCollectionPct}%</div>
                            <div className="text-[9px] text-[#8b949e]">collected</div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-5 mt-3">
                        <div className="text-center">
                            <div className="text-[13px] font-bold text-[#39d353]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>₹{(totalFeeCollected / 100000).toFixed(1)}L</div>
                            <div className="text-[10px] text-[#8b949e]">Paid</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[13px] font-bold text-[#ff4d4f]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>₹{(totalFeeDue / 100000).toFixed(1)}L</div>
                            <div className="text-[10px] text-[#8b949e]">Pending</div>
                        </div>
                    </div>
                </ChartCard>

                {/* Course-wise */}
                <ChartCard title="📚 Course Distribution">
                    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
                        <Doughnut data={courseData} options={doughnutOpts} />
                        <div className="absolute text-center pointer-events-none">
                            <div className="text-[18px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{Object.keys(courses).length}</div>
                            <div className="text-[9px] text-[#8b949e]">courses</div>
                        </div>
                    </div>
                    <div className="flex justify-center flex-wrap gap-3 mt-3">
                        {Object.entries(courses).map(([course, count], i) => (
                            <div key={course} className="text-center">
                                <div className="text-[13px] font-bold" style={{ color: courseColors[i], fontFamily: 'Rajdhani, sans-serif' }}>{count}</div>
                                <div className="text-[10px] text-[#8b949e]">{course}</div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* ── Row 3: CGPA Buckets + Teacher Dept + Student Table ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="📊 CGPA Distribution (All Students)">
                    <div style={{ height: 200 }}>
                        <Bar data={cgpaBucketData} options={chartDefaults} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                        {Object.entries(buckets).map(([range, count], i) => (
                            <div key={range} className="text-center">
                                <div className="text-[14px] font-bold" style={{ color: ['#ff4d4f', '#f0a500', '#00d4ff', '#39d353', '#a855f7'][i], fontFamily: 'Rajdhani, sans-serif' }}>{count}</div>
                                <div className="text-[10px] text-[#8b949e]">CGPA {range}</div>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="👩‍🏫 Teacher Department Distribution">
                    <div style={{ height: 200 }}>
                        <Bar data={deptBarData} options={chartDefaults} />
                    </div>
                    <div className="mt-3 divide-y divide-[#21262d]">
                        {teachers.map(t => (
                            <div key={t.id} className="flex items-center justify-between py-2 text-[11px]">
                                <span className="text-[#e6edf3]">{t.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#8b949e]">{t.subjects.join(', ')}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${t.status === 'Active' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* ── Full Student Performance Table ── */}
            <ChartCard title="📋 Full Student Performance Report">
                <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                        <thead>
                            <tr className="border-b border-[#30363d] text-[#8b949e] text-[10px]">
                                <th className="text-left py-2 pr-4">Student</th>
                                <th className="text-left py-2 pr-4">ID</th>
                                <th className="text-left py-2 pr-4">Class</th>
                                <th className="text-left py-2 pr-4">Course</th>
                                <th className="text-left py-2 pr-4">CGPA</th>
                                <th className="text-left py-2 pr-4">Attendance</th>
                                <th className="text-left py-2">Fee Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#21262d]">
                            {[...students].sort((a, b) => b.cgpa - a.cgpa).map(s => {
                                const feePaid = s.fee.paid >= s.fee.total;
                                const attLow = s.att < 75;
                                return (
                                    <tr key={s.id} className="hover:bg-[#1c2128] transition-colors">
                                        <td className="py-2.5 pr-4 font-semibold text-[#e6edf3]">{s.name}</td>
                                        <td className="py-2.5 pr-4 text-[#8b949e]">{s.id}</td>
                                        <td className="py-2.5 pr-4 text-[#8b949e]">{s.class}</td>
                                        <td className="py-2.5 pr-4 text-[#8b949e]">{s.course}</td>
                                        <td className="py-2.5 pr-4">
                                            <span className="font-bold" style={{
                                                color: s.cgpa >= 8.5 ? '#39d353' : s.cgpa >= 7 ? '#00d4ff' : s.cgpa >= 6 ? '#f0a500' : '#ff4d4f',
                                                fontFamily: 'Rajdhani, sans-serif',
                                            }}>{s.cgpa}</span>
                                        </td>
                                        <td className="py-2.5 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full" style={{
                                                        width: `${s.att}%`,
                                                        background: attLow ? '#ff4d4f' : '#39d353',
                                                    }} />
                                                </div>
                                                <span className={attLow ? 'text-red-400 font-semibold' : 'text-[#8b949e]'}>{s.att}%</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${feePaid ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {feePaid ? 'Paid' : `₹${((s.fee.total - s.fee.paid) / 1000).toFixed(0)}k due`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

        </div>
    );
}