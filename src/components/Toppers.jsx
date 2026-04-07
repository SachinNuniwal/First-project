export default function Toppers() {
    const toppers = [
        { name: "Aman", marks: 95 },
        { name: "Riya", marks: 93 },
        { name: "Rahul", marks: 91 },
    ];

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">🏆 Top Performers</h3>

            <div className="grid grid-cols-3 gap-2">
                {toppers.map((t, i) => (
                    <div key={i} className="bg-gray-200 p-2 rounded text-center">
                        {t.name}
                        <br />
                        {t.marks}%
                    </div>
                ))}
            </div>
        </div>
    );
}