import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card, Badge, Btn, SectionHeader, SearchBar, TableWrap, THead, TRow, TD } from '../components/UI';

export default function StudentsPage({ students, onViewStudent, showToast }) {
    const { isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [filterClass, setFilterClass] = useState('');

    const bgColor = isDark ? "#161b22" : "#f0f2f5";
    const borderColor = isDark ? "#30363d" : "#d0d7de";
    const textColor = isDark ? "#e6edf3" : "#24292f";

    const filtered = students.filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search) || s.class.toLowerCase().includes(search.toLowerCase());
        const matchClass = !filterClass || s.class === filterClass;
        return matchSearch && matchClass;
    });

    const getFeeStatus = (s) => {
        const bal = s.fee.total - s.fee.paid;
        if (bal === 0) return { label: 'Paid', color: 'green' };
        if (bal > s.fee.total / 2) return { label: 'Defaulter', color: 'red' };
        return { label: 'Partial', color: 'orange' };
    };

    return (
        <div>
            <SectionHeader title="👩‍🎓 Student Directory" subtitle="Click any student to view full profile">
                <select
                    value={filterClass}
                    onChange={e => setFilterClass(e.target.value)}
                    className="rounded-lg text-[12px] outline-none focus:border-cyan-400 px-3 py-1.5 border transition-colors"
                    style={{
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        color: textColor
                    }}
                >
                    <option value="">All Classes</option>
                    {['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1'].map(c => <option key={c}>{c}</option>)}
                </select>
                <Btn variant="primary" size="sm" onClick={() => showToast('⬇️ Exporting data as CSV...')}>⬇️ Export</Btn>
            </SectionHeader>

            <SearchBar
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, roll number, or class..."
            />

            <Card>
                <TableWrap>
                    <THead cols={['Roll No', 'Name', 'Class', 'CGPA', 'Attendance', 'Fee Status', 'Actions']} />
                    <tbody>
                        {filtered.map(s => {
                            const feeStatus = getFeeStatus(s);
                            const attColor = s.att >= 80 ? 'green' : s.att >= 75 ? 'orange' : 'red';
                            const cgpaColor = s.cgpa >= 8.5 ? 'green' : s.cgpa >= 7 ? 'cyan' : 'orange';
                            return (
                                <TRow key={s.id}>
                                    <TD className="text-[#8b949e]">{s.id}</TD>
                                    <TD>
                                        <button
                                            className="text-cyan-400 font-semibold hover:underline text-left"
                                            onClick={() => onViewStudent(s.id)}
                                        >
                                            {s.name}
                                        </button>
                                    </TD>
                                    <TD><Badge color="purple">{s.class}</Badge></TD>
                                    <TD><Badge color={cgpaColor}>{s.cgpa}</Badge></TD>
                                    <TD><Badge color={attColor}>{s.att}%</Badge></TD>
                                    <TD><Badge color={feeStatus.color}>{feeStatus.label}</Badge></TD>
                                    <TD>
                                        <div className="flex gap-1 flex-wrap">
                                            <Btn variant="outline" size="xs" onClick={() => onViewStudent(s.id)}>👁 View</Btn>
                                            <Btn variant="outline" size="xs" onClick={() => showToast(`💬 Message sent to ${s.name}`)}>💬 Msg</Btn>
                                        </div>
                                    </TD>
                                </TRow>
                            );
                        })}
                    </tbody>
                </TableWrap>
            </Card>
        </div>
    );
}