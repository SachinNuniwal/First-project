import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card, Badge, Btn, SectionHeader, SearchBar, TableWrap, THead, TRow, TD, Modal, ModalFooter, FormGroup, Input, Select } from '../components/UI';
import apiService from '../api/apiService';

export default function TeachersPage({ teachers, onViewTeacher, onAddTeacher, onRemoveTeacher, onUpdateTeacher, showToast }) {
    const { isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [removeTarget, setRemoveTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({});

    const [form, setForm] = useState({
        name: '', id: '', dept: 'CSE', exp: '', email: '', phone: '',
        subjects: '', status: 'Active', qual: '', classes: []
    });

    const classOptions = ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1', 'CSE-4A'];

    const filtered = teachers.filter(t =>
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.teacherId.includes(search) ||
        t.dept.toLowerCase().includes(search.toLowerCase())
    );

    const handleClassToggle = (cls) => {
        setForm(f => ({
            ...f,
            classes: f.classes.includes(cls) ? f.classes.filter(c => c !== cls) : [...f.classes, cls]
        }));
    };

    const handleAdd = () => {
        if (!form.name.trim()) { showToast('⚠️ Full Name is required!'); return; }
        if (!form.id.trim()) { showToast('⚠️ Employee ID is required!'); return; }
        if (!form.email.trim()) { showToast('⚠️ Email is required!'); return; }
        if (teachers.find(t => t.teacherId === form.id)) {
            showToast('⚠️ Teacher with this ID already exists!'); return;
        }
        onAddTeacher({
            teacherId: form.id,
            name: form.name,
            dept: form.dept,
            designation: form.qual || 'Professor',
            subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
            classes: form.classes,
            leavesUsed: 0,
            status: form.status,
            exp: form.exp || '0 yrs',
            email: form.email,
        });
        setForm({ name: '', id: '', dept: 'CSE', exp: '', email: '', phone: '', subjects: '', status: 'Active', qual: '', classes: [] });
        setShowAddModal(false);
        showToast(`✅ Teacher "${form.name}" added successfully!`);
    };

    const handleRemoveClick = (t) => { setRemoveTarget(t); setShowRemoveModal(true); };

    const handleConfirmRemove = () => {
        if (!removeTarget) return;
        onRemoveTeacher(removeTarget.id);
        showToast(`🗑️ Teacher "${removeTarget.name}" removed successfully.`);
        setShowRemoveModal(false);
        setRemoveTarget(null);
    };

    const handleEditClick = (t) => {
        setEditTarget(t);
        setEditForm({
            name: t.name || '',
            dept: t.dept || 'CSE',
            exp: t.exp || '',
            email: t.email || '',
            status: t.status || 'Active',
            designation: t.designation || '',
            subjects: (t.subjects || []).join(', '),
            classes: t.classes || [],
        });
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        if (!editTarget) return;
        try {
            await onUpdateTeacher(editTarget.id, {
                ...editTarget,
                name: editForm.name,
                dept: editForm.dept,
                exp: editForm.exp,
                email: editForm.email,
                status: editForm.status,
                designation: editForm.designation,
                subjects: editForm.subjects.split(',').map(s => s.trim()).filter(Boolean),
                classes: editForm.classes,
            });
            setShowEditModal(false);
        } catch (err) {
            showToast('❌ Update failed!');
        }
    };

    return (
        <div>
            <SectionHeader title="👩‍🏫 Teacher Directory" subtitle="Click any teacher to view full profile">
                <Btn variant="primary" size="sm" onClick={() => setShowAddModal(true)}>➕ Add Teacher</Btn>
                <Btn variant="outline" size="sm" onClick={() => showToast('⬇️ Exporting...')}>⬇️ Export</Btn>
            </SectionHeader>

            <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." />

            <Card>
                <TableWrap>
                    <THead cols={['ID', 'Name', 'Dept', 'Subjects', 'Classes', 'Leaves Used', 'Status', 'Actions']} />
                    <tbody>
                        {filtered.map(t => (
                            <TRow key={t.teacherId}>
                                <TD className="text-[#8b949e]">{t.teacherId}</TD>
                                <TD>
                                    <button className="text-cyan-400 font-semibold hover:underline" onClick={() => onViewTeacher(t.teacherId)}>
                                        {t.name}
                                    </button>
                                </TD>
                                <TD>{t.dept}</TD>
                                <TD className="text-[#8b949e]">{(t.subjects || []).join(', ')}</TD>
                                <TD className="text-[#8b949e]">{(t.classes || []).join(', ')}</TD>
                                <TD><Badge color="orange">{t.leavesUsed} used</Badge></TD>
                                <TD><Badge color={t.status === 'Active' ? 'green' : 'orange'}>{t.status}</Badge></TD>
                                <TD>
                                    <div className="flex gap-1 flex-wrap">
                                        <Btn variant="outline" size="xs" onClick={() => onViewTeacher(t.teacherId)}>👁 View</Btn>
                                        <Btn variant="outline" size="xs" onClick={() => handleEditClick(t)}>✏️ Edit</Btn>
                                        <Btn variant="outline" size="xs" onClick={() => showToast(`💬 Messaging ${t.name}`)}>💬 Msg</Btn>
                                        <Btn variant="danger" size="xs" onClick={() => handleRemoveClick(t)}>🗑</Btn>
                                    </div>
                                </TD>
                            </TRow>
                        ))}
                    </tbody>
                </TableWrap>
            </Card>

            {/* ADD MODAL */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="➕ Add New Teacher" size="lg">
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Full Name *"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Anjali Mehta" /></FormGroup>
                    <FormGroup label="Employee ID *"><Input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. TCH-5001" /></FormGroup>
                    <FormGroup label="Department *">
                        <Select value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
                            {['CSE', 'Maths', 'Physics', 'Electronics', 'Humanities', 'MCA'].map(d => <option key={d}>{d}</option>)}
                        </Select>
                    </FormGroup>
                    <FormGroup label="Experience"><Input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} placeholder="e.g. 5 yrs" /></FormGroup>
                    <FormGroup label="Email *"><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. anjali@college.edu" /></FormGroup>
                    <FormGroup label="Phone"><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98760 00099" /></FormGroup>
                </div>
                <FormGroup label="Subjects (comma separated)">
                    <Input value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))} placeholder="e.g. AI, ML, Python" />
                </FormGroup>
                <FormGroup label="Assigned Classes">
                    <div className="flex flex-wrap gap-2 mt-1">
                        {classOptions.map(cls => (
                            <label key={cls} className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                                <input type="checkbox" checked={form.classes.includes(cls)} onChange={() => handleClassToggle(cls)} className="accent-cyan-400" />
                                {cls}
                            </label>
                        ))}
                    </div>
                </FormGroup>
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Status">
                        <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                            <option>Active</option><option>On Leave</option><option>Inactive</option>
                        </Select>
                    </FormGroup>
                    <FormGroup label="Qualification"><Input value={form.qual} onChange={e => setForm(f => ({ ...f, qual: e.target.value }))} placeholder="e.g. Ph.D. Computer Science" /></FormGroup>
                </div>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleAdd}>✅ Add Teacher</Btn>
                </ModalFooter>
            </Modal>

            {/* EDIT MODAL */}
            <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="✏️ Edit Teacher" size="lg">
                <div className="grid grid-cols-2 gap-3">
                    <FormGroup label="Full Name *"><Input value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></FormGroup>
                    <FormGroup label="Department">
                        <Select value={editForm.dept || 'CSE'} onChange={e => setEditForm(f => ({ ...f, dept: e.target.value }))}>
                            {['CSE', 'Maths', 'Physics', 'Electronics', 'Humanities', 'MCA'].map(d => <option key={d}>{d}</option>)}
                        </Select>
                    </FormGroup>
                    <FormGroup label="Experience"><Input value={editForm.exp || ''} onChange={e => setEditForm(f => ({ ...f, exp: e.target.value }))} /></FormGroup>
                    <FormGroup label="Email"><Input type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} /></FormGroup>
                    <FormGroup label="Designation"><Input value={editForm.designation || ''} onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))} /></FormGroup>
                    <FormGroup label="Status">
                        <Select value={editForm.status || 'Active'} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                            <option>Active</option><option>On Leave</option><option>Inactive</option>
                        </Select>
                    </FormGroup>
                </div>
                <FormGroup label="Subjects (comma separated)">
                    <Input value={editForm.subjects || ''} onChange={e => setEditForm(f => ({ ...f, subjects: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Assigned Classes">
                    <div className="flex flex-wrap gap-2 mt-1">
                        {classOptions.map(cls => (
                            <label key={cls} className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(editForm.classes || []).includes(cls)}
                                    onChange={() => setEditForm(f => ({
                                        ...f,
                                        classes: (f.classes || []).includes(cls)
                                            ? f.classes.filter(c => c !== cls)
                                            : [...(f.classes || []), cls]
                                    }))}
                                    className="accent-cyan-400"
                                />
                                {cls}
                            </label>
                        ))}
                    </div>
                </FormGroup>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleEditSave}>💾 Save Changes</Btn>
                </ModalFooter>
            </Modal>

            {/* REMOVE MODAL */}
            <Modal open={showRemoveModal} onClose={() => setShowRemoveModal(false)} title="🗑️ Remove Teacher" size="sm">
                <div className="text-center py-2 pb-5">
                    <div className="text-4xl mb-3">⚠️</div>
                    <div className="text-[15px] font-semibold">Remove "{removeTarget?.name}" ({removeTarget?.teacherId})?</div>
                    <div className="text-[12px] text-[#8b949e] mt-1.5">This will permanently remove the teacher. This action cannot be undone.</div>
                </div>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowRemoveModal(false)}>Cancel</Btn>
                    <Btn variant="danger" onClick={handleConfirmRemove}>🗑️ Yes, Remove</Btn>
                </ModalFooter>
            </Modal>
        </div>
    );
}