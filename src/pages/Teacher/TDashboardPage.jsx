import { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
    CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function StatCard({ icon, label, value, sub, color, change, up }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? '#161b22' : '#ffffff';
    const borderColor = isDark ? '#30363d' : '#d1d9e0';
    const hoverBorderColor = isDark ? '#444c56' : '#79c0ff';
    const textColor = isDark ? '#8b949e' : '#656d76';

    return (
        <div className="border rounded-xl p-4 hover:-translate-y-0.5 transition-all" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-[22px] font-bold" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>{value}</div>
            <div className="text-[11px]" style={{ color: textColor }}>{label}</div>
            {change && (
                <div className={`text-[10px] mt-1 ${up ? 'text-green-400' : 'text-red-400'}`}>
                    {up ? '↑' : '↓'} {change}
                </div>
            )}
        </div>
    );
}

function Card({ title, children, className = '' }) {
    const { isDark } = useTheme();
    const bgColor = isDark ? '#161b22' : '#ffffff';
    const borderColor = isDark ? '#30363d' : '#d1d9e0';
    const textColor = isDark ? '#e6edf3' : '#24292f';

    return (
        <div className={`border rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: bgColor, borderColor: borderColor }}>
            {title && (
                <div className="px-4 py-3 border-b text-[13px] font-bold" style={{ borderColor: borderColor, color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                    {title}
                </div>
            )}
            <div className="p-4">{children}</div>
        </div>
    );
}

const subjectPerf = {
    'CSE-3A': { labels: ['DSA', 'OS', 'DBMS', 'CN', 'SE'], data: [82, 76, 88, 71, 79] },
    'CSE-3B': { labels: ['DBMS', 'AI', 'OS', 'SE'], data: [74, 81, 69, 77] },
    'CSE-2A': { labels: ['Maths', 'Physics', 'DSA', 'Python'], data: [78, 65, 83, 88] },
    'MCA-1': { labels: ['Python', 'Stats', 'DBMS', 'AI', 'SE'], data: [85, 72, 79, 80, 74] },
};

export default function TDashboardPage({ teacher, students, classes, onNavigate, showToast }) {
    const { isDark } = useTheme();
    const [selectedClass, setSelectedClass] = useState('CSE-3A');
    const sd = subjectPerf[selectedClass] || { labels: [], data: [] };

    const bgColor = isDark ? '#161b22' : '#f0f2f5';
    const borderColor = isDark ? '#30363d' : '#d1d9e0';
    const textColor = isDark ? '#e6edf3' : '#24292f';
    const secondaryTextColor = isDark ? '#8b949e' : '#656d76';
    const hoverBgColor = isDark ? '#1c2128' : '#f6f8fa';
    const chartGridColor = isDark ? '#21262d' : '#d1d9e0';
    const chartTextColor = isDark ? '#8b949e' : '#656d76';

    const subjectBarData = {
        labels: sd.labels,
        datasets: [{
            label: 'Avg Marks',
            data: sd.data,
            backgroundColor: 'rgba(0,212,255,0.25)',
            borderColor: '#00d4ff',
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const attDonutData = {
        labels: ['Present', 'Absent', 'Medical'],
        datasets: [{
            data: [87, 9, 4],
            backgroundColor: ['rgba(0,212,255,0.7)', 'rgba(255,71,87,0.7)', 'rgba(255,123,41,0.7)'],
            borderColor: ['#00d4ff', '#ff4757', '#ff7b29'],
            borderWidth: 2,
        }],
    };

    const cgpaLineData = {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
        datasets: [{
            label: 'Avg CGPA',
            data: [7.8, 8.1, 8.6, 8.9, 8.4],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.1)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#00d4ff',
            fill: true,
        }],
    };

    const groupActivity = [
        { group: 'CSE-3A General', last: 'Midterm exam schedule updated', time: 'Today 9:12 AM' },
        { group: 'CSE-3B Lab Group', last: 'Submit DSA lab files by Friday', time: 'Yesterday' },
        { group: 'MCA-1 Batch', last: 'Leave notice: absent on 5th April', time: '2 days ago' },
    ];

    return (
        <div className="space-y-5">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="👩‍🎓" label="Total Students" value="142" color="#00d4ff" change="4 this sem" up={true} />
                <StatCard icon="📖" label="Subjects Teaching" value={teacher?.subjects?.length || 5} color="#0db4a4" change="Stable" up={true} />
                <StatCard icon="✅" label="Avg Attendance" value="87%" color="#39d353" change="+2% vs last sem" up={true} />
                <StatCard icon="⭐" label="Class Avg CGPA" value="8.4" color="#f0a500" change="-0.1 vs last sem" up={false} />
            </div>

            {/* Subject Performance Tracker */}
            <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: borderColor }}>
                    <div className="text-[13px] font-bold" style={{ color: textColor, fontFamily: 'Rajdhani, sans-serif' }}>
                        📡 Subject Performance Tracker
                    </div>
                </div>
                <div className="p-4">
                    {/* Class selector */}
                    <div className="flex gap-2 flex-wrap mb-4">
                        {Object.keys(subjectPerf).map(cls => (
                            <button key={cls}
                                onClick={() => setSelectedClass(cls)}
                                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all
                                    ${selectedClass === cls
                                        ? 'bg-cyan-400/15 border-cyan-400 text-cyan-400'
                                        : `border-[${borderColor}] text-[${secondaryTextColor}] hover:border-cyan-400 hover:text-cyan-400`
                                    }`}>
                                {cls}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div style={{ height: 200 }}>
                            <Bar data={subjectBarData} options={{
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { color: chartTextColor, font: { size: 11 } }, grid: { color: chartGridColor } },
                                    y: { ticks: { color: chartTextColor, font: { size: 11 } }, grid: { color: chartGridColor, drawBorder: false } },
                                },
                                maintainAspectRatio: false,
                                animation: false,
                                responsive: true,
                                interaction: { intersect: false, mode: 'index' },
                                plugins: { legend: { display: false } },
                            }} />
                        </div>
                        <div className="space-y-2.5">
                            {sd.labels.map((label, i) => {
                                const pct = sd.data[i];
                                const color = pct >= 80 ? '#39d353' : pct >= 65 ? '#00d4ff' : '#ff4d4f';
                                return (
                                    <div key={label}>
                                        <div className="flex justify-between text-[12px] font-semibold mb-1">
                                            <span style={{ color: textColor }}>{label}</span>
                                            <span style={{ color }}>{pct}/100</span>
                                        </div>
                                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: borderColor }}>
                                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="📅 Attendance Overview — Current Semester">
                    <div style={{ height: 200 }}>
                        <Doughnut data={attDonutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: chartTextColor, font: { size: 11 } } } } }} />
                    </div>
                </Card>

                <Card title="📈 Class CGPA Trend — Per Semester">
                    <div style={{ height: 200 }}>
                        <Line data={cgpaLineData} options={{
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { ticks: { color: chartTextColor, font: { size: 11 } }, grid: { color: chartGridColor } },
                                y: { ticks: { color: chartTextColor, font: { size: 11 } }, grid: { color: chartGridColor }, min: 7, max: 10 },
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            animation: false,
                            interaction: { intersect: false, mode: 'index' },
                        }} />
                    </div>
                </Card>
            </div>

            {/* Recent Group Activity */}
            <Card title="📣 Recent Group Activity">
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead>
                            <tr className="text-[10px]" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                <th className="text-left pb-2 pr-4">Group</th>
                                <th className="text-left pb-2 pr-4">Last Message</th>
                                <th className="text-left pb-2 pr-4">Sent By</th>
                                <th className="text-left pb-2 pr-4">Time</th>
                                <th className="text-left pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: chartGridColor }}>
                            {groupActivity.map((row, i) => (
                                <tr key={i} className="transition-colors" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBgColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td className="py-2.5 pr-4 font-semibold" style={{ color: textColor }}>{row.group}</td>
                                    <td className="py-2.5 pr-4" style={{ color: secondaryTextColor }}>{row.last}</td>
                                    <td className="py-2.5 pr-4" style={{ color: secondaryTextColor }}>{teacher?.name || 'Dr. Priya Verma'}</td>
                                    <td className="py-2.5 pr-4" style={{ color: secondaryTextColor }}>{row.time}</td>
                                    <td className="py-2.5">
                                        <button onClick={() => onNavigate('groups')}
                                            className="px-2.5 py-1 border rounded-lg text-[10px] transition-all hover:border-cyan-400 hover:text-cyan-400" style={{ borderColor: borderColor, color: secondaryTextColor }}>
                                            Open
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}