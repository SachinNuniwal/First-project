export default function Calendar() {
    return (
        <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="font-semibold">📅 India Calendar</h3>
            <p className="mt-2">{new Date().toDateString()}</p>
        </div>
    );
}