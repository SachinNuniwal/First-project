import { useState } from 'react';

// ── CLASS → SUBJECTS mapping ──────────────────────────────────────────────────
const CLASS_SUBJECTS = {
    'CSE — 3rd Year A': ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Compiler Design'],
    'CSE — 3rd Year B': ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Compiler Design'],
    'CSE — 2nd Year A': ['Mathematics III', 'Digital Electronics', 'Object Oriented Programming', 'Discrete Mathematics', 'Data Structures'],
    'MCA — 1st Year': ['Python Programming', 'Statistics & Probability', 'DBMS', 'Computer Organization', 'Web Technologies'],
};

// ── CLASS → STUDENTS mapping ──────────────────────────────────────────────────
const CLASS_STUDENTS = {
    'CSE — 3rd Year A': [
        { roll: '2201001', name: 'Aarav Singh' },
        { roll: '2201002', name: 'Priya Mehta' },
        { roll: '2201003', name: 'Rahul Sharma' },
        { roll: '2201004', name: 'Sneha Gupta' },
        { roll: '2201005', name: 'Arjun Rao' },
        { roll: '2201006', name: 'Kavya Nair' },
        { roll: '2201007', name: 'Rohan Verma' },
        { roll: '2201008', name: 'Ananya Mishra' },
        { roll: '2201009', name: 'Vikram Tiwari' },
        { roll: '2201010', name: 'Pooja Joshi' },
    ],
    'CSE — 3rd Year B': [
        { roll: '2202001', name: 'Vikram Singh' },
        { roll: '2202002', name: 'Neha Yadav' },
        { roll: '2202003', name: 'Karan Patel' },
        { roll: '2202004', name: 'Riya Sharma' },
        { roll: '2202005', name: 'Amit Kumar' },
        { roll: '2202006', name: 'Divya Reddy' },
        { roll: '2202007', name: 'Suresh Nair' },
        { roll: '2202008', name: 'Preeti Singh' },
    ],
    'CSE — 2nd Year A': [
        { roll: '2301001', name: 'Divya Reddy' },
        { roll: '2301002', name: 'Suresh Rao' },
        { roll: '2301003', name: 'Pooja Jain' },
        { roll: '2301004', name: 'Manish Sharma' },
        { roll: '2301005', name: 'Simran Kaur' },
        { roll: '2301006', name: 'Abhishek Das' },
        { roll: '2301007', name: 'Tanvi Mehta' },
    ],
    'MCA — 1st Year': [
        { roll: '2401001', name: 'Manish Tiwari' },
        { roll: '2401002', name: 'Sonal Gupta' },
        { roll: '2401003', name: 'Ritesh Nair' },
        { roll: '2401004', name: 'Anjali Verma' },
        { roll: '2401005', name: 'Deepak Yadav' },
        { roll: '2401006', name: 'Shruti Patil' },
    ],
};

const CLASSES = Object.keys(CLASS_SUBJECTS);
const EXAM_TYPES = ['Mid-Term', 'End-Term', 'Quiz', 'Assignment', 'Lab Practical'];

const uploadedHistory = [
    { class: 'CSE-3A', subject: 'DSA', exam: 'Mid-Term', date: '28 Mar 2026', students: 42, status: 'Published' },
    { class: 'CSE-3B', subject: 'OS', exam: 'Quiz 2', date: '25 Mar 2026', students: 38, status: 'Pending' },
    { class: 'MCA-1', subject: 'DBMS', exam: 'End-Term', date: '20 Mar 2026', students: 30, status: 'Published' },
];

function calcGrade(marks, max = 100) {
    const pct = (parseInt(marks) / parseInt(max)) * 100;
    if (isNaN(pct)) return { grade: '—', color: '#8b949e' };
    if (pct >= 90) return { grade: 'O', color: '#39d353' };
    if (pct >= 80) return { grade: 'A+', color: '#39d353' };
    if (pct >= 70) return { grade: 'A', color: '#00d4ff' };
    if (pct >= 60) return { grade: 'B+', color: '#00d4ff' };
    if (pct >= 50) return { grade: 'B', color: '#f0a500' };
    if (pct >= 40) return { grade: 'C', color: '#f0a500' };
    return { grade: 'F', color: '#ff4d4f' };
}

// ═════════════════════════════════════════════════════════════════════════════
export default function TResultPage({ showToast }) {
    const [tab, setTab] = useState('manual');

    const tabs = [
        { key: 'manual', label: '✏️ Manual Entry' },
        { key: 'upload', label: '📤 Upload Result' },
        { key: 'history', label: '📂 History' },
    ];

    return (
        <div className="space-y-5">
            <div className="flex border-b border-[#30363d]">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 transition-all
                            ${tab === t.key
                                ? 'text-cyan-400 border-cyan-400'
                                : 'text-[#8b949e] border-transparent hover:text-[#e6edf3]'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'manual' && <ManualEntryTab showToast={showToast} />}
            {tab === 'upload' && <FileUploadTab showToast={showToast} />}
            {tab === 'history' && <HistoryTab showToast={showToast} />}
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// MANUAL ENTRY TAB
// ═════════════════════════════════════════════════════════════════════════════
function ManualEntryTab({ showToast }) {
    const [selClass, setSelClass] = useState('');
    const [selSubject, setSelSubject] = useState('');
    const [selExam, setSelExam] = useState('');
    const [maxMarks, setMaxMarks] = useState('100');
    const [students, setStudents] = useState([]);
    const [ready, setReady] = useState(false);

    const handleClassChange = (cls) => {
        setSelClass(cls);
        setSelSubject('');
        setStudents([]);
        setReady(false);
    };

    const handleLoad = () => {
        if (!selClass || !selSubject || !selExam) {
            showToast('⚠️ Please select Class, Subject and Exam Type first!');
            return;
        }
        const list = (CLASS_STUDENTS[selClass] || []).map(s => ({ ...s, marks: '' }));
        setStudents(list);
        setReady(true);
    };

    const handleMark = (roll, val) =>
        setStudents(p => p.map(s => s.roll === roll ? { ...s, marks: val } : s));

    const handleClear = () =>
        setStudents(p => p.map(s => ({ ...s, marks: '' })));

    const handleAutoFill = () =>
        setStudents(p => p.map(s => ({
            ...s,
            marks: String(Math.floor(Math.random() * (parseInt(maxMarks) * 0.5) + parseInt(maxMarks) * 0.45)),
        })));

    const handleSave = () => {
        const filled = students.filter(s => s.marks !== '').length;
        if (filled === 0) { showToast('⚠️ Please enter marks first!'); return; }
        showToast(`💾 Results saved & published for ${filled} students!`);
    };

    const subjects = selClass ? CLASS_SUBJECTS[selClass] : [];
    const filled = students.filter(s => s.marks !== '').length;
    const passing = students.filter(s => {
        const pct = (parseInt(s.marks) / parseInt(maxMarks || 100)) * 100;
        return !isNaN(pct) && pct >= 40;
    }).length;

    return (
        <div className="space-y-4">

            {/* ── Selection Panel ── */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <div className="text-[13px] font-bold text-[#e6edf3] mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    ✏️ Manual Result Entry — Select Class & Subject
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Class */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                            📚 Class / Section
                        </label>
                        <select value={selClass} onChange={e => handleClassChange(e.target.value)}
                            className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400">
                            <option value="">— Select Class —</option>
                            {CLASSES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Subject — unlocks after class selected */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                            📖 Subject
                        </label>
                        <select value={selSubject}
                            onChange={e => { setSelSubject(e.target.value); setReady(false); }}
                            disabled={!selClass}
                            className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400 disabled:opacity-40">
                            <option value="">— Select Subject —</option>
                            {subjects.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Exam Type — unlocks after subject selected */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                            📝 Exam Type
                        </label>
                        <select value={selExam}
                            onChange={e => { setSelExam(e.target.value); setReady(false); }}
                            disabled={!selSubject}
                            className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400 disabled:opacity-40">
                            <option value="">— Select Exam —</option>
                            {EXAM_TYPES.map(e => <option key={e}>{e}</option>)}
                        </select>
                    </div>

                    {/* Max Marks */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                            🎯 Max Marks
                        </label>
                        <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)}
                            className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400" />
                    </div>
                </div>

                {/* Load Button */}
                <button onClick={handleLoad}
                    disabled={!selClass || !selSubject || !selExam}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg text-[13px] hover:opacity-85 transition-all disabled:opacity-40">
                    📋 Load Student List
                </button>

                {/* Selection chips */}
                {selClass && (
                    <div className="flex gap-2 flex-wrap mt-3">
                        <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-[11px] text-cyan-400 font-semibold">
                            📚 {selClass}
                        </span>
                        {selSubject && (
                            <span className="px-3 py-1 bg-purple-400/10 border border-purple-400/30 rounded-full text-[11px] text-purple-400 font-semibold">
                                📖 {selSubject}
                            </span>
                        )}
                        {selExam && (
                            <span className="px-3 py-1 bg-orange-400/10 border border-orange-400/30 rounded-full text-[11px] text-orange-400 font-semibold">
                                📝 {selExam}
                            </span>
                        )}
                        {ready && (
                            <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 rounded-full text-[11px] text-green-400 font-semibold">
                                👩‍🎓 {students.length} Students Loaded
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── Student Table ── */}
            {ready && students.length > 0 && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">

                    <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <div className="text-[13px] font-bold text-[#e6edf3]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                📋 {selClass} — {selSubject} — {selExam}
                            </div>
                            <div className="text-[11px] text-[#8b949e] mt-0.5">
                                Max: <span className="text-cyan-400 font-semibold">{maxMarks}</span>
                                &nbsp;·&nbsp; Total: <span className="text-cyan-400 font-semibold">{students.length}</span>
                                &nbsp;·&nbsp; Filled: <span className="text-yellow-400 font-semibold">{filled}</span>
                                &nbsp;·&nbsp; Pass: <span className="text-green-400 font-semibold">{passing}</span>
                                &nbsp;·&nbsp; Fail: <span className="text-red-400 font-semibold">{filled - passing}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleAutoFill}
                                className="px-3 py-1.5 border border-[#30363d] rounded-lg text-[#8b949e] hover:border-cyan-400 hover:text-cyan-400 transition-all text-[11px] font-semibold">
                                🎲 Auto Fill
                            </button>
                            <button onClick={handleClear}
                                className="px-3 py-1.5 border border-[#30363d] rounded-lg text-[#8b949e] hover:border-red-400 hover:text-red-400 transition-all text-[11px] font-semibold">
                                🗑 Clear
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="border-b border-[#30363d] bg-[#1c2128] text-[#8b949e] text-[10px] uppercase tracking-wider">
                                    <th className="text-left p-3">#</th>
                                    <th className="text-left p-3">Roll No</th>
                                    <th className="text-left p-3">Student Name</th>
                                    <th className="text-left p-3">Subject</th>
                                    <th className="text-left p-3">Marks (/{maxMarks})</th>
                                    <th className="text-left p-3">Percentage</th>
                                    <th className="text-left p-3">Grade</th>
                                    <th className="text-left p-3">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#21262d]">
                                {students.map((s, idx) => {
                                    const { grade, color } = calcGrade(s.marks, maxMarks);
                                    const pct = (parseInt(s.marks) / parseInt(maxMarks || 100)) * 100;
                                    const passed = !isNaN(pct) && pct >= 40;
                                    return (
                                        <tr key={s.roll} className="hover:bg-[#1c2128] transition-colors">
                                            <td className="p-3 text-[#484f58]">{idx + 1}</td>
                                            <td className="p-3 font-mono text-[#8b949e]">{s.roll}</td>
                                            <td className="p-3 font-semibold text-[#e6edf3]">{s.name}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-0.5 bg-purple-400/10 border border-purple-400/20 rounded-full text-[10px] text-purple-400 font-semibold whitespace-nowrap">
                                                    {selSubject}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number" min="0" max={maxMarks}
                                                    value={s.marks}
                                                    onChange={e => handleMark(s.roll, e.target.value)}
                                                    placeholder="—"
                                                    className="w-20 bg-[#21262d] border border-[#30363d] rounded-lg px-2 py-1.5 text-center text-[#e6edf3] outline-none focus:border-cyan-400 text-[12px] font-mono transition-colors"
                                                />
                                            </td>
                                            <td className="p-3 text-[#8b949e] font-mono">
                                                {s.marks !== '' && !isNaN(pct) ? `${pct.toFixed(1)}%` : '—'}
                                            </td>
                                            <td className="p-3">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                                    style={{ color, background: `${color}20` }}>
                                                    {grade}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {s.marks !== '' && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                                                        ${passed ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                        {passed ? '✓ Pass' : '✗ Fail'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-[#30363d]">
                        <button onClick={handleSave}
                            className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg hover:opacity-85 transition-all text-[13px]">
                            💾 Save & Publish Results
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!ready && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <div className="text-[14px] font-semibold text-[#8b949e]">Select Class, Subject & Exam Type</div>
                    <div className="text-[12px] text-[#484f58] mt-1">Then click "Load Student List" to begin entering marks</div>
                </div>
            )}
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// FILE UPLOAD TAB
// ═════════════════════════════════════════════════════════════════════════════
function FileUploadTab({ showToast }) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [emailNotify, setEmailNotify] = useState(true);
    const [selClass, setSelClass] = useState('');
    const [selSubject, setSelSubject] = useState('');
    const [selExam, setSelExam] = useState(EXAM_TYPES[0]);

    const subjects = selClass ? CLASS_SUBJECTS[selClass] : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <div className="text-[13px] font-bold text-[#e6edf3] mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    📤 Upload Result File
                </div>
                <FormGroup label="Select Class">
                    <select value={selClass} onChange={e => { setSelClass(e.target.value); setSelSubject(''); }}
                        className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400">
                        <option value="">— Select Class —</option>
                        {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </FormGroup>
                <FormGroup label="Subject">
                    <select value={selSubject} onChange={e => setSelSubject(e.target.value)}
                        disabled={!selClass}
                        className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400 disabled:opacity-40">
                        <option value="">— Select Subject —</option>
                        {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                </FormGroup>
                <FormGroup label="Exam Type">
                    <select value={selExam} onChange={e => setSelExam(e.target.value)}
                        className="w-full bg-[#21262d] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-2 text-[12px] outline-none focus:border-cyan-400">
                        {EXAM_TYPES.map(e => <option key={e}>{e}</option>)}
                    </select>
                </FormGroup>
                <FormGroup label="Upload File (.xlsx / .csv / .pdf)">
                    <div onClick={() => document.getElementById('fileInput').click()}
                        className="border-2 border-dashed border-[#30363d] rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all">
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-[13px] text-[#8b949e]">Click or drag & drop your result file</div>
                        <div className="text-[11px] text-[#484f58] mt-1">Supported: .xlsx, .csv, .pdf</div>
                        <input type="file" id="fileInput" className="hidden" accept=".xlsx,.csv,.pdf"
                            onChange={e => { if (e.target.files[0]) setUploadedFile(e.target.files[0]); }} />
                    </div>
                    {uploadedFile && (
                        <div className="mt-3 flex items-center gap-3 p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
                            <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center text-lg">📄</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold truncate">{uploadedFile.name}</div>
                                <div className="text-[10px] text-[#8b949e]">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                            </div>
                            <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-semibold">Ready</span>
                        </div>
                    )}
                </FormGroup>
                <label className="flex items-center gap-2 text-[13px] text-[#8b949e] cursor-pointer mb-4">
                    <input type="checkbox" checked={emailNotify} onChange={e => setEmailNotify(e.target.checked)}
                        className="w-4 h-4 accent-cyan-400" />
                    📧 Email result to each student automatically
                </label>
                <button onClick={() => { showToast(`✅ Results uploaded${emailNotify ? ' & emails sent' : ''} successfully!`); setUploadedFile(null); }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg hover:opacity-85 transition-all text-[13px]">
                    📤 Submit & Publish Results
                </button>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
                <div className="text-[13px] font-bold text-[#e6edf3] mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    📋 Upload Tips
                </div>
                <div className="space-y-3">
                    <div className="bg-[#21262d] rounded-xl p-4">
                        <div className="text-[12px] font-semibold text-cyan-400 mb-2">📄 Required Format</div>
                        <div className="text-[12px] text-[#8b949e] space-y-1">
                            <div>Column 1: Roll Number</div>
                            <div>Column 2: Student Name</div>
                            <div>Column 3: Marks Obtained</div>
                            <div>Column 4+: Subject-wise marks (optional)</div>
                        </div>
                    </div>
                    <div className="bg-[#21262d] rounded-xl p-4">
                        <div className="text-[12px] font-semibold text-green-400 mb-2">✅ On Publish</div>
                        <div className="text-[12px] text-[#8b949e] space-y-1">
                            <div>• Result saved to system</div>
                            <div>• Email sent to each student</div>
                            <div>• Students can view via portal</div>
                            <div>• PDF marksheet auto-generated</div>
                        </div>
                    </div>
                </div>
                <button onClick={() => showToast('⬇️ Template downloaded!')}
                    className="w-full mt-4 py-2 border border-[#30363d] rounded-lg text-[#8b949e] hover:border-cyan-400 hover:text-cyan-400 transition-all text-[12px] font-semibold">
                    ⬇️ Download Sample Template
                </button>
            </div>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// HISTORY TAB
// ═════════════════════════════════════════════════════════════════════════════
function HistoryTab({ showToast }) {
    const statusColor = s =>
        s === 'Published' ? 'bg-green-500/15 text-green-400' : 'bg-cyan-400/15 text-cyan-400';

    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#30363d] text-[13px] font-bold text-[#e6edf3]"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                📂 Previously Uploaded Results
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                    <thead>
                        <tr className="border-b border-[#30363d] text-[#8b949e] text-[10px]">
                            <th className="text-left p-3">Class</th>
                            <th className="text-left p-3">Subject</th>
                            <th className="text-left p-3">Exam</th>
                            <th className="text-left p-3">Uploaded On</th>
                            <th className="text-left p-3">Students</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                        {uploadedHistory.map((r, i) => (
                            <tr key={i} className="hover:bg-[#1c2128] transition-colors">
                                <td className="p-3 font-semibold text-[#e6edf3]">{r.class}</td>
                                <td className="p-3 text-[#8b949e]">{r.subject}</td>
                                <td className="p-3 text-[#8b949e]">{r.exam}</td>
                                <td className="p-3 text-[#8b949e]">{r.date}</td>
                                <td className="p-3 text-[#8b949e]">{r.students}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(r.status)}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => showToast(`👁 Viewing ${r.subject} results`)}
                                        className="px-2.5 py-1 border border-[#30363d] rounded-lg text-[#8b949e] hover:border-cyan-400 hover:text-cyan-400 transition-all text-[10px]">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FormGroup({ label, children }) {
    return (
        <div className="mb-4">
            <label className="block text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}