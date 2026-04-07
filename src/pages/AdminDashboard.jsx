// AdminDashboard.jsx — FIXED
// Changes:
// ✅ TeachersPage ko onUpdateTeacher={updateTeacher} prop add kiya
// ✅ updateTeacher function already tha, bas prop pass nahi tha

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AnalyticsPage from './AnalyticsPage';
import Topbar from '../components/Header';
import Toast from '../components/Toast';
import { Modal, ModalFooter, FormGroup, Input, Btn } from '../components/UI';

import DashboardPage from './DashboardPage';
import StudentsPage from './StudentsPage';
import TeachersPage from './TeachersPage';
import { LeavesPage, NoticesPage, EventsPage, ClassesPage } from './OtherPages';
import { MessagesPage, SettingsPage } from './CommsPages';
import { FeePage, TimetablePage, AttendancePage } from './AcademicPages';

import apiService from '../api/apiService';

const PAGE_TITLES = {
    dashboard: 'Admin Dashboard', analytics: 'Analytics', events: 'Events & Calendar',
    students: 'Students', teachers: 'Teachers', classes: 'Classes & Groups',
    results: 'Results Overview', attendance: 'Attendance Reports', fee: 'Fee Management',
    timetable: 'Timetable', messages: 'Messages', leaves: 'Leave Approvals',
    notices: 'Notices', settings: 'Settings',
};

export default function AdminDashboard() {
    const routerNavigate = useNavigate();
    const [page, setPage] = useState('dashboard');
    const navigate = (p) => setPage(p);

    const [toast, setToast] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [events, setEvents] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [notices, setNotices] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [profile, setProfile] = useState({
        name: 'Prof. R.K. Sharma',
        desig: 'Head of Department — CSE',
        email: 'rksharma@college.edu',
        phone: '+91 98760 00001'
    });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [editProfile, setEditProfile] = useState({ ...profile });

    const showToast = useCallback((msg) => setToast(msg), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersData, studentsData, classesData] = await Promise.all([
                    apiService.getAllTeachers(),
                    apiService.getAllStudents(),
                    apiService.getAllClasses()
                ]);
                setTeachers(teachersData);
                setStudents(studentsData);
                setClasses(classesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Error loading data from server');
            }
        };
        fetchData();
    }, []);

    const approveLeave = (id) => {
        const leave = pendingLeaves.find(l => l.id === id);
        if (!leave) return;
        setPendingLeaves(prev => prev.filter(l => l.id !== id));
        setLeaveHistory(prev => [{ ...leave, id: Date.now(), status: 'Approved', approvedBy: profile.name }, ...prev]);
        showToast(`✅ Leave approved for ${leave.teacher}`);
    };

    const rejectLeave = (id) => {
        const leave = pendingLeaves.find(l => l.id === id);
        if (!leave) return;
        setPendingLeaves(prev => prev.filter(l => l.id !== id));
        setLeaveHistory(prev => [{ ...leave, id: Date.now(), status: 'Rejected', approvedBy: profile.name }, ...prev]);
        showToast(`❌ Leave rejected for ${leave.teacher}`);
    };

    const addTeacher = async (t) => {
        try {
            const newTeacher = await apiService.createTeacher(t);
            setTeachers(prev => [...prev, newTeacher]);
            showToast(`✅ Teacher ${t.name} added successfully`);
        } catch (error) {
            console.error('Error adding teacher:', error);
            showToast('Error adding teacher');
        }
    };

    const removeTeacher = async (id) => {
        try {
            await apiService.deleteTeacher(id);
            setTeachers(prev => prev.filter(t => t.id !== id));
            showToast('✅ Teacher removed successfully');
        } catch (error) {
            console.error('Error removing teacher:', error);
            showToast('Error removing teacher');
        }
    };

    // ✅ updateTeacher — already defined tha
    const updateTeacher = async (id, data) => {
        try {
            const updated = await apiService.updateTeacher(id, data);
            setTeachers(prev => prev.map(t => t.id === id ? updated : t));
            showToast(`✅ Teacher updated successfully`);
        } catch (error) {
            showToast('❌ Error updating teacher');
            throw error;
        }
    };

    const createClass = async (c) => {
        try {
            const newClass = await apiService.createClass(c);
            setClasses(prev => [...prev, newClass]);
            showToast(`✅ Class ${c.name} created successfully`);
        } catch (error) {
            console.error('Error creating class:', error);
            showToast('Error creating class');
        }
    };

    const deleteClass = async (name) => {
        try {
            const classToDelete = classes.find(c => c.name === name);
            if (classToDelete) {
                await apiService.deleteClass(classToDelete.id);
                setClasses(prev => prev.filter(c => c.name !== name));
                showToast('✅ Class deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            showToast('Error deleting class');
        }
    };

    const addEvent = (e) => setEvents(prev => [e, ...prev]);
    const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));
    const postNotice = (n) => setNotices(prev => [{ ...n, id: Date.now() }, ...prev]);
    const deleteNotice = (id) => setNotices(prev => prev.filter(n => n.id !== id));

    const sendMsg = (convIdx, text) => {
        setConversations(prev => {
            const next = [...prev];
            next[convIdx] = {
                ...next[convIdx],
                msgs: [...next[convIdx].msgs, { sent: true, text, time: 'Just now' }],
                last: text,
            };
            return next;
        });
    };

    const newMsg = (recipient, body) => {
        const name = recipient.split(' (')[0];
        const role = recipient.includes('Group') ? 'Group' : recipient.includes('Teacher') ? 'Teacher' : 'Student';
        setConversations(prev => [{
            id: Date.now(), name, role,
            last: body.substring(0, 40), time: 'Just now',
            msgs: [{ sent: true, text: body, time: 'Just now' }]
        }, ...prev]);
    };

    const saveProfile = () => {
        setProfile({ ...editProfile });
        setShowProfileModal(false);
        showToast('✅ Profile updated successfully!');
    };

    const unread = notifications.filter(n => !n.read).length;
    const clearNotifs = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('✅ All notifications cleared');
        setShowNotifModal(false);
    };

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage students={students} pendingLeaves={pendingLeaves} events={events} onApproveLeave={approveLeave} onRejectLeave={rejectLeave} onNavigate={navigate} />;
            case 'students':
                return <StudentsPage students={students} onViewStudent={(id) => showToast(`👁 Viewing student ${id}`)} showToast={showToast} />;
            case 'teachers':
                return (
                    <TeachersPage
                        teachers={teachers}
                        onViewTeacher={(teacherId) => routerNavigate(`/teacher/${teacherId}`)}
                        onAddTeacher={addTeacher}
                        onRemoveTeacher={removeTeacher}
                        onUpdateTeacher={updateTeacher}   // ✅ FIXED: prop pass kiya
                        showToast={showToast}
                    />
                );
            case 'classes':
                return <ClassesPage classes={classes} onCreateClass={createClass} onDeleteClass={deleteClass} onNavigate={navigate} showToast={showToast} />;
            case 'events':
                return <EventsPage events={events} onAdd={addEvent} onDelete={deleteEvent} showToast={showToast} />;
            case 'leaves':
                return <LeavesPage pendingLeaves={pendingLeaves} leaveHistory={leaveHistory} onApprove={approveLeave} onReject={rejectLeave} showToast={showToast} />;
            case 'notices':
                return <NoticesPage notices={notices} onPost={postNotice} onDelete={deleteNotice} showToast={showToast} />;
            case 'messages':
                return <MessagesPage conversations={conversations} onSend={sendMsg} onNewMsg={newMsg} showToast={showToast} />;
            case 'fee':
                return <FeePage students={students} onViewStudent={(id) => showToast(`📋 Viewing fee for ${id}`)} showToast={showToast} />;
            case 'timetable':
                return <TimetablePage showToast={showToast} />;
            case 'attendance':
                return <AttendancePage students={students} classes={classes} showToast={showToast} />;
            case 'settings':
                return <SettingsPage profile={profile} onSave={(p) => setProfile(prev => ({ ...prev, ...p }))} showToast={showToast} />;
            case 'analytics':
                return <AnalyticsPage students={students} teachers={teachers} classes={classes} />;
            case 'results':
                return (
                    <div className="text-center py-20 text-[#8b949e]">
                        <div className="text-5xl mb-4">📋</div>
                        <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Results Overview</div>
                        <div className="text-[12px] mt-2">Connect to backend API to load result records</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0d1117] text-[#e6edf3] text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Sidebar
                activePage={page}
                onNavigate={navigate}
                onLogout={() => { if (window.confirm('Are you sure you want to logout?')) showToast('👋 Logged out!'); }}
                profile={profile}
                pendingLeavesCount={pendingLeaves.length}
                onProfileClick={() => { setEditProfile({ ...profile }); setShowProfileModal(true); }}
            />

            <div className="ml-60 flex-1 flex flex-col min-h-screen">
                <Topbar
                    title={PAGE_TITLES[page] || page}
                    unreadCount={unread}
                    subtitle={page === 'dashboard' ? `Welcome back, ${profile.name} 👋 — Tuesday, 7 April 2026` : ''}
                    profile={profile}
                    notifications={notifications}
                    onNotifClick={() => setShowNotifModal(true)}
                    onMsgClick={() => navigate('messages')}
                    onProfileClick={() => { setEditProfile({ ...profile }); setShowProfileModal(true); }}
                    onRefresh={() => { showToast('🔄 Dashboard refreshed!'); }}
                />

                <div className="p-5 flex-1">
                    {renderPage()}
                </div>
            </div>

            {/* Profile Modal */}
            <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)} title="👤 Edit Profile">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 cursor-pointer border-2 border-[#30363d] hover:border-cyan-400 transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #f0a500, #ff7b29)' }}
                    onClick={() => document.getElementById('photoInput').click()}>
                    {profile.photo
                        ? <img src={profile.photo} alt="profile" className="w-full h-full object-cover rounded-full" />
                        : '🧑‍💼'}
                </div>
                <input id="photoInput" type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            const base64 = ev.target.result;
                            localStorage.setItem('adminPhoto', base64);
                            setProfile(p => ({ ...p, photo: base64 }));
                            setEditProfile(p => ({ ...p, photo: base64 }));
                        };
                        reader.readAsDataURL(file);
                    }}
                />
                <FormGroup label="Full Name"><Input value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} /></FormGroup>
                <FormGroup label="Designation"><Input value={editProfile.desig} onChange={e => setEditProfile(p => ({ ...p, desig: e.target.value }))} /></FormGroup>
                <FormGroup label="Email"><Input type="email" value={editProfile.email} onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))} /></FormGroup>
                <FormGroup label="Phone"><Input value={editProfile.phone} onChange={e => setEditProfile(p => ({ ...p, phone: e.target.value }))} /></FormGroup>
                <FormGroup label="Access Level"><Input value="Level 5 — Full Admin" readOnly /></FormGroup>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={saveProfile}>💾 Save Profile</Btn>
                </ModalFooter>
            </Modal>

            {/* Notifications Modal */}
            <Modal open={showNotifModal} onClose={() => setShowNotifModal(false)} title="🔔 Notifications">
                <div className="space-y-2">
                    {notifications.length === 0 && (
                        <div className="text-center text-[#484f58] py-8 text-[13px]">No notifications ✅</div>
                    )}
                    {notifications.map(n => (
                        <div key={n.id} className={`flex gap-2.5 items-start p-2.5 rounded-lg border ${n.read ? 'border-transparent' : 'bg-cyan-400/5 border-cyan-400/10'}`}>
                            <div className="flex-1">
                                <div className="text-[13px]">{n.text}</div>
                                <div className="text-[10px] text-[#484f58] mt-0.5">{n.time}</div>
                            </div>
                            {!n.read && (
                                <Btn variant="outline" size="xs" onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>✓</Btn>
                            )}
                        </div>
                    ))}
                </div>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowNotifModal(false)}>Close</Btn>
                    <Btn variant="primary" onClick={clearNotifs}>✅ Clear All</Btn>
                </ModalFooter>
            </Modal>

            <Toast message={toast} onHide={() => setToast('')} />
        </div>
    );
}