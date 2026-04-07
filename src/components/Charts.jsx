import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale);

export default function Charts({ student }) {
    const overallData = {
        labels: ["Present", "Absent"],
        datasets: [
            {
                data: [student.attendance, 100 - student.attendance],
            },
        ],
    };

    const subjectData = {
        labels: Object.keys(student.subjects),
        datasets: [
            {
                label: "Attendance %",
                data: Object.values(student.subjects),
            },
        ],
    };

    return (
        <>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Overall Attendance</h3>
                <Doughnut data={overallData} />
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Subject-wise Attendance</h3>
                <Bar data={subjectData} />
            </div>
        </>
    );
}