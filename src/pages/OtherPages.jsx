import { useState } from 'react';
import { Card, CardTitle, Badge, Btn, SectionHeader, StatCard, TableWrap, THead, TRow, TD, Modal, ModalFooter, FormGroup, Input, Select, Textarea } from '../components/UI';

// ===== LEAVES PAGE =====
export function LeavesPage({ pendingLeaves, leaveHistory, onApprove, onReject, showToast }) {
    const [historyFilter, setHistoryFilter] = useState('');
    const teachers = [...new Set(leaveHistory.map(l => l.teacher))];
    const filteredHistory = historyFilter ? leaveHistory.filter(l => l.teacher === historyFilter) : leaveHistory;

    return (
        <div>
            <SectionHeader title="🌿 Leave Approvals" subtitle="Review and approve/reject teacher leave requests" />

            <div className="grid grid-cols-3 gap-4 mb-5">
                <StatCard icon="⏳" value={pendingLeaves.length} label="Pending Approval" color="#ff7b29" />
                <StatCard icon="✅" value="18" label="Approved This Month" color="#39d353" />
                <StatCard icon="❌" value="2" label="Rejected This Month" color="#ff4757" />
            </div>

            <Card className="mb-4">
                <CardTitle>⏳ Pending Leave Requests</CardTitle>
                {pendingLeaves.length === 0 ? (
                    <div className="text-[12px] text-[#8b949e] py-4 text-center">No pending leave requests</div>
                ) : (
                    <TableWrap>
                        <THead cols={['Teacher', 'Type', 'From', 'To', 'Days', 'Reason', 'Action']} />
                        <tbody>
                            {pendingLeaves.map(l => (
                                <TRow key={l.id}>
                                    <TD className="text-cyan-400 font-semibold">{l.teacher}</TD>
                                    <TD><Badge color="orange">{l.type}</Badge></TD>
                                    <TD>{l.from}</TD>
                                    <TD>{l.to}</TD>
                                    <TD>{l.days}</TD>
                                    <TD className="text-[#8b949e]">{l.reason}</TD>
                                    <TD>
                                        <div className="flex gap-1">
                                            <Btn variant="success" size="xs" onClick={() => onApprove(l.id)}>✓ Approve</Btn>
                                            <Btn variant="danger" size="xs" onClick={() => onReject(l.id)}>✗ Reject</Btn>
                                        </div>
                                    </TD>
                                </TRow>
                            ))}
                        </tbody>
                    </TableWrap>
                )}
            </Card>

            <Card>
                <div className="flex items-center justify-between mb-3">
                    <CardTitle className="mb-0">📋 Leave History — All Teachers</CardTitle>
                    <select
                        value={historyFilter}
                        onChange={e => setHistoryFilter(e.target.value)}
                        className="bg-[#161b22] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-1.5 text-[12px] outline-none"
                    >
                        <option value="">All Teachers</option>
                        {teachers.map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <TableWrap>
                    <THead cols={['Teacher', 'Type', 'From', 'To', 'Days', 'Status', 'Approved By', 'Action']} />
                    <tbody>
                        {filteredHistory.map(l => (
                            <TRow key={l.id}>
                                <TD className="text-cyan-400 font-semibold">{l.teacher}</TD>
                                <TD>{l.type}</TD>
                                <TD>{l.from}</TD>
                                <TD>{l.to}</TD>
                                <TD>{l.days}</TD>
                                <TD><Badge color={l.status === 'Approved' ? 'green' : 'red'}>{l.status}</Badge></TD>
                                <TD className="text-[#8b949e]">{l.approvedBy}</TD>
                                <TD><Btn variant="outline" size="xs" onClick={() => showToast('Leave record viewed')}>View</Btn></TD>
                            </TRow>
                        ))}
                    </tbody>
                </TableWrap>
            </Card>
        </div>
    );
}

// ===== NOTICES PAGE =====
export function NoticesPage({ notices, onPost, onDelete, showToast }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [target, setTarget] = useState('All');
    const [priority, setPriority] = useState('Normal');
    const [filter, setFilter] = useState('');

    const audiences = ['All', 'Students Only', 'Teachers Only', 'CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1', 'Teachers Group'];
    const filtered = filter ? notices.filter(n => n.target === filter || n.target === 'All') : notices;

    const handlePost = () => {
        if (!title.trim() || !content.trim()) { showToast('⚠️ Fill in all fields!'); return; }
        onPost({ title, content, target, priority, date: 'Today' });
        setTitle(''); setContent('');
        showToast('✅ Notice posted to: ' + target);
    };

    const priorityBorder = { Urgent: '#ff4757', Important: '#f0a500', Normal: '#30363d' };

    return (
        <div>
            <SectionHeader title="📢 Notices & Announcements" subtitle="Post notices to specific classes, groups or all" />
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardTitle>📝 Post New Notice</CardTitle>
                    <FormGroup label="Title">
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice title..." />
                    </FormGroup>
                    <FormGroup label="Content">
                        <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your notice..." />
                    </FormGroup>
                    <FormGroup label="Target Audience">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {audiences.map(a => (
                                <button
                                    key={a}
                                    onClick={() => setTarget(a)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${target === a
                                            ? 'bg-cyan-400/15 border-cyan-400 text-cyan-400'
                                            : 'border-[#30363d] text-[#8b949e] hover:border-cyan-400/50'
                                        }`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </FormGroup>
                    <FormGroup label="Priority">
                        <Select value={priority} onChange={e => setPriority(e.target.value)}>
                            <option>Normal</option>
                            <option>Important</option>
                            <option>Urgent</option>
                        </Select>
                    </FormGroup>
                    <Btn variant="primary" className="w-full justify-center" onClick={handlePost}>📢 Post Notice</Btn>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-3">
                        <CardTitle className="mb-0">📋 Posted Notices</CardTitle>
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="bg-[#161b22] border border-[#30363d] rounded-lg text-[#e6edf3] px-3 py-1.5 text-[12px] outline-none"
                        >
                            <option value="">All Audiences</option>
                            {audiences.map(a => <option key={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2.5">
                        {filtered.length === 0 ? (
                            <div className="text-[12px] text-[#8b949e] text-center py-10">No notices found</div>
                        ) : filtered.map(n => (
                            <div
                                key={n.id}
                                className="p-3 border rounded-xl"
                                style={{ borderLeft: `3px solid ${priorityBorder[n.priority] || '#30363d'}`, borderColor: '#30363d' }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-[13px] font-bold">{n.title}</div>
                                    <Badge color={n.priority === 'Urgent' ? 'red' : n.priority === 'Important' ? 'gold' : 'cyan'}>{n.priority}</Badge>
                                </div>
                                <div className="text-[12px] text-[#8b949e] mb-1">{n.content}</div>
                                <div className="text-[11px] text-[#484f58]">{n.date} · 👥 {n.target}</div>
                                <Btn variant="danger" size="xs" className="mt-2" onClick={() => onDelete(n.id)}>🗑 Delete</Btn>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// ===== EVENTS PAGE =====
export function EventsPage({ events, onAdd, onDelete, showToast }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', desc: '', date: new Date().toISOString().split('T')[0], time: '10:00', category: 'Academic', audience: 'All', deadline: '' });

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const upcoming = events.filter(e => e.date > today);
    const todayEvts = events.filter(e => e.date === today);
    const past = events.filter(e => e.date < today);

    const handleAdd = () => {
        if (!form.title.trim() || !form.date) { showToast('⚠️ Title and Date are required!'); return; }
        onAdd({ ...form, id: Date.now() });
        setShowModal(false);
        showToast('✅ Event added successfully!');
    };

    const catColors = { Exam: 'red', Meeting: 'gold', Academic: 'cyan', Holiday: 'green', Cultural: 'purple', Sports: 'orange', Other: 'cyan' };

    const EventCard = ({ e, type }) => (
        <div className={`bg-[#161b22] border rounded-xl p-3 mb-2 border-l-[3px] ${type === 'today' ? 'border-l-yellow-400' : type === 'upcoming' ? 'border-l-cyan-400' : 'border-l-[#484f58] opacity-60'
            } border-[#30363d]`}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="font-bold text-[13px] mb-1">{e.title}</div>
                    <div className="text-[11px] text-[#8b949e]">📅 {e.date} · 🕐 {e.time} · <Badge color={catColors[e.category] || 'cyan'}>{e.category}</Badge> · 👥 {e.audience}</div>
                    <div className="text-[11px] text-[#8b949e] mt-1">{e.desc}</div>
                </div>
                {type !== 'past' && (
                    <Btn variant="danger" size="xs" onClick={() => onDelete(e.id)}>🗑</Btn>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <SectionHeader title="📆 Events & Calendar" subtitle="Track, add and manage department events">
                <Btn variant="primary" size="sm" onClick={() => setShowModal(true)}>+ Add Event</Btn>
            </SectionHeader>

            <div className="grid grid-cols-3 gap-4 mb-5">
                <StatCard icon="📅" value={upcoming.length} label="Upcoming Events" color="#00d4ff" />
                <StatCard icon="🟡" value={todayEvts.length} label="Today's Events" color="#f0a500" />
                <StatCard icon="🔴" value={past.length} label="Expired/Past" color="#ff4757" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardTitle>📅 Upcoming & Today</CardTitle>
                    {[...todayEvts.map(e => ({ ...e, _type: 'today' })), ...upcoming.map(e => ({ ...e, _type: 'upcoming' }))].length === 0 ? (
                        <div className="text-[12px] text-[#8b949e] text-center py-10">No upcoming events</div>
                    ) : (
                        [...todayEvts.map(e => ({ ...e, _type: 'today' })), ...upcoming.map(e => ({ ...e, _type: 'upcoming' }))].map(e => (
                            <EventCard key={e.id} e={e} type={e._type} />
                        ))
                    )}
                </Card>
                <Card>
                    <CardTitle>📋 Past Events</CardTitle>
                    {past.length === 0 ? (
                        <div className="text-[12px] text-[#8b949e] text-center py-10">No past events</div>
                    ) : past.map(e => <EventCard key={e.id} e={e} type="past" />)}
                </Card>
            </div>

            <Modal open={showModal} onClose={() => setShowModal(false)} title="📆 Add New Event">
                <FormGroup label="Event Title *">
                    <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title..." />
                </FormGroup>
                <FormGroup label="Description">
                    <Textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Event details..." />
                </FormGroup>
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Event Date *">
                        <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </FormGroup>
                    <FormGroup label="Event Time">
                        <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                    </FormGroup>
                </div>
                <FormGroup label="Category">
                    <Select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {['Academic', 'Exam', 'Holiday', 'Meeting', 'Cultural', 'Sports', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </Select>
                </FormGroup>
                <FormGroup label="Audience">
                    <Select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                        {['All', 'Students Only', 'Teachers Only', 'CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1'].map(a => <option key={a}>{a}</option>)}
                    </Select>
                </FormGroup>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleAdd}>📆 Add Event</Btn>
                </ModalFooter>
            </Modal>
        </div>
    );
}

// ===== CLASSES PAGE =====
export function ClassesPage({ classes, onCreateClass, onDeleteClass, onNavigate, showToast }) {
    const [showModal, setShowModal] = useState(false);
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [section, setSection] = useState('');
    const [key, setKey] = useState('');
    const [teacher, setTeacher] = useState('Dr. Priya Verma');
    const [strength, setStrength] = useState(45);
    const [subjects, setSubjects] = useState([]);
    const [subInput, setSubInput] = useState('');

    const autoKey = () => {
        if (!dept || !year) return;
        const dk = dept.split(' ').map(w => w[0].toUpperCase()).join('').slice(0, 3);
        setKey(`${dk}-${year}${section}`);
    };

    const addSubject = (s) => {
        if (!s || subjects.includes(s)) return;
        setSubjects(prev => [...prev, s]);
        setSubInput('');
    };

    const quickSubs = ['Mathematics', 'Physics', 'Data Structures', 'OS', 'DBMS', 'Computer Networks', 'Software Engineering', 'Python', 'Java', 'AI & ML', 'Statistics', 'English'];

    const handleCreate = () => {
        if (!dept || !year || !key) { showToast('⚠️ Department and Year are required!'); return; }
        const yearMap = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
        const colors = ['#00d4ff', '#f0a500', '#a855f7', '#39d353', '#ff7b29', '#ff4757'];
        onCreateClass({ name: key, year: yearMap[year], teacher, students: strength, att: 85, cgpa: 7.5, color: colors[classes.length % colors.length], subjects: [...subjects] });
        setDept(''); setYear(''); setSection(''); setKey(''); setSubjects([]);
        setShowModal(false);
        showToast(`✅ Class ${key} created!`);
    };

    return (
        <div>
            <SectionHeader title="🏫 Classes & Groups" subtitle="Overview of all classes and lab groups">
                <Btn variant="primary" size="sm" onClick={() => setShowModal(true)}>+ New Class</Btn>
            </SectionHeader>

            <div className="grid grid-cols-3 gap-4">
                {classes.map(c => (
                    <div
                        key={c.name}
                        className="bg-[#1c2333] border rounded-xl p-4 transition-all hover:scale-[1.01]"
                        style={{ borderColor: c.color + '22' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = c.color}
                        onMouseLeave={e => e.currentTarget.style.borderColor = c.color + '22'}
                    >
                        <div className="flex items-center gap-3 mb-3.5">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[13px]"
                                style={{ background: c.color + '22', border: `1px solid ${c.color}44`, color: c.color, fontFamily: 'Rajdhani, sans-serif' }}>
                                {c.name}
                            </div>
                            <div>
                                <div className="font-bold text-[17px]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{c.name}</div>
                                <div className="text-[12px] text-[#8b949e]">{c.year} · {c.students} students</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-[#161b22] rounded-lg p-2.5 text-center">
                                <div className="font-bold text-[20px]" style={{ fontFamily: 'Rajdhani, sans-serif', color: c.color }}>{c.cgpa}</div>
                                <div className="text-[10px] text-[#8b949e]">Avg CGPA</div>
                            </div>
                            <div className="bg-[#161b22] rounded-lg p-2.5 text-center">
                                <div className="font-bold text-[20px]" style={{ fontFamily: 'Rajdhani, sans-serif', color: c.att >= 85 ? '#39d353' : '#ff7b29' }}>{c.att}%</div>
                                <div className="text-[10px] text-[#8b949e]">Attendance</div>
                            </div>
                        </div>
                        <div className="text-[12px] text-[#8b949e] mb-2">Teacher: <span className="text-[#e6edf3]">{c.teacher}</span></div>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {(c.subjects || []).map(s => <Badge key={s} color="cyan" className="text-[9px]">{s}</Badge>)}
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            <Btn variant="outline" size="xs" onClick={() => onNavigate('students')}>👩‍🎓 Students</Btn>
                            <Btn variant="outline" size="xs" onClick={() => onNavigate('timetable')}>🗓️ Timetable</Btn>
                            <Btn variant="outline" size="xs" onClick={() => showToast('💬 Opening group message')}>💬 Msg</Btn>
                            <Btn variant="danger" size="xs" onClick={() => { onDeleteClass(c.name); showToast(`🗑 Class ${c.name} deleted`); }}>🗑</Btn>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={showModal} onClose={() => setShowModal(false)} title="🏫 Create New Class / Group" size="lg">
                <FormGroup label="Department *">
                    <Input value={dept} onChange={e => { setDept(e.target.value); setTimeout(autoKey, 0); }} placeholder="e.g. Computer Science, MCA, Electronics..." />
                </FormGroup>
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Year *">
                        <Select value={year} onChange={e => { setYear(e.target.value); setTimeout(autoKey, 0); }}>
                            <option value="">— Select Year —</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </Select>
                    </FormGroup>
                    <FormGroup label="Section (Optional)">
                        <Select value={section} onChange={e => { setSection(e.target.value); setTimeout(autoKey, 0); }}>
                            <option value="">— None —</option>
                            {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                        </Select>
                    </FormGroup>
                </div>
                <FormGroup label="Class Key (Auto-Generated)">
                    <Input value={key} onChange={e => setKey(e.target.value)} placeholder="Auto-fills from above..." />
                </FormGroup>
                <FormGroup label="Subjects">
                    <div className="flex gap-2 mb-2">
                        <Input value={subInput} onChange={e => setSubInput(e.target.value)} placeholder="Type a subject..." />
                        <Btn variant="primary" size="sm" onClick={() => addSubject(subInput)}>+ Add</Btn>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {quickSubs.map(s => (
                            <button key={s} onClick={() => addSubject(s)} className="px-2.5 py-1 rounded-full border border-[#30363d] text-[11px] text-[#8b949e] hover:border-cyan-400/50 transition-all">
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="min-h-9 bg-[#161b22] border border-[#30363d] rounded-lg p-2 flex flex-wrap gap-1">
                        {subjects.length === 0 ? <span className="text-[11px] text-[#484f58]">No subjects added yet</span>
                            : subjects.map(s => (
                                <span key={s} className="inline-flex items-center gap-1 bg-cyan-400/8 border border-cyan-400/20 rounded-full px-2.5 py-1 text-[11px] text-cyan-400">
                                    {s}
                                    <button onClick={() => setSubjects(prev => prev.filter(x => x !== s))} className="text-red-400 font-bold ml-0.5">×</button>
                                </span>
                            ))
                        }
                    </div>
                </FormGroup>
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Class Teacher">
                        <Select value={teacher} onChange={e => setTeacher(e.target.value)}>
                            {['Dr. Priya Verma', 'Mr. Arun Kumar', 'Ms. Neha Singh', 'Prof. R.K. Das', 'Dr. Anita Joshi'].map(t => <option key={t}>{t}</option>)}
                        </Select>
                    </FormGroup>
                    <FormGroup label="Strength">
                        <Input type="number" value={strength} onChange={e => setStrength(parseInt(e.target.value) || 45)} />
                    </FormGroup>
                </div>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleCreate}>🏫 Create Class</Btn>
                </ModalFooter>
            </Modal>
        </div>
    );
}   