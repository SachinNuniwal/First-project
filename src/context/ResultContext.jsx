import { createContext, useContext, useState } from "react";

// ── Initial published results (sem 1–5 pre-loaded, sem 6 pending) ─────────────
const INITIAL_RESULTS = {
    "Rahul Sharma": {
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
        // teacher_* keys are added dynamically when a teacher publishes marks
    },
};

// ── Context ───────────────────────────────────────────────────────────────────
const ResultContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function ResultProvider({ children }) {
    const [publishedResults, setPublishedResults] = useState(INITIAL_RESULTS);

    /**
     * Called by TeacherDashboard when a teacher publishes marks.
     *
     * @param {string} studentName  - e.g. "Rahul Sharma"
     * @param {object} resultEntry  - {
     *   subject, examType, className,
     *   marks, maxMarks, grade,
     *   uploadedBy, uploadedAt
     * }
     */
    const publishResult = (studentName, resultEntry) => {
        setPublishedResults(prev => {
            const studentData = prev[studentName] || {};

            // All teacher uploads live under a single "teacher_uploads" array key
            const existing = Array.isArray(studentData.teacher_uploads)
                ? studentData.teacher_uploads
                : [];

            return {
                ...prev,
                [studentName]: {
                    ...studentData,
                    teacher_uploads: [
                        { ...resultEntry, uploadedAt: new Date().toLocaleString() },
                        ...existing,   // newest first
                    ],
                },
            };
        });
    };

    /**
     * Returns all teacher-uploaded results for a given student.
     * @param {string} studentName
     * @returns {Array}
     */
    const getTeacherUploads = (studentName) => {
        const studentData = publishedResults[studentName] || {};
        return Array.isArray(studentData.teacher_uploads)
            ? studentData.teacher_uploads
            : [];
    };

    return (
        <ResultContext.Provider value={{ publishedResults, publishResult, getTeacherUploads }}>
            {children}
        </ResultContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useResults() {
    const ctx = useContext(ResultContext);
    if (!ctx) {
        throw new Error("useResults must be used inside a <ResultProvider>");
    }
    return ctx;
}