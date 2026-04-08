import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale);

export default function Charts({ student }) {
    const { isDark } = useTheme();
    
    const chartColor = isDark ? '#e6edf3' : '#24292f';
    const bgColor = isDark ? '#1c2333' : '#ffffff';
    const borderColor = isDark ? '#30363d' : '#d0d7de';

    const overallData = {
        labels: ["Present", "Absent"],
        datasets: [
            {
                data: [student.attendance, 100 - student.attendance],
                backgroundColor: ["#22c55e", "#ef4444"],
            },
        ],
    };

    const subjectData = {
        labels: Object.keys(student.subjects),
        datasets: [
            {
                label: "Attendance %",
                data: Object.values(student.subjects),
                backgroundColor: '#00d4ff',
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: chartColor,
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: chartColor,
                },
                grid: {
                    color: borderColor,
                },
            },
            x: {
                ticks: {
                    color: chartColor,
                },
                grid: {
                    color: borderColor,
                },
            },
        },
    };

    return (
        <>
            <div 
                className="p-4 rounded transition-colors"
                style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
            >
                <h3 className="font-semibold mb-2 transition-colors" style={{ color: chartColor }}>Overall Attendance</h3>
                <Doughnut data={overallData} options={chartOptions} />
            </div>

            <div 
                className="p-4 rounded transition-colors"
                style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
            >
                <h3 className="font-semibold mb-2 transition-colors" style={{ color: chartColor }}>Subject-wise Attendance</h3>
                <Bar data={subjectData} options={chartOptions} />
            </div>
        </>
    );
}