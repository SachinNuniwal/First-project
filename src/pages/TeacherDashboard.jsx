import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import TeacherSidebar from '../components/TeacherSidebar';
import TeacherHeader from '../components/TeacherHeader';
import Toast from '../components/Toast';

import TDashboardPage from './teacher/TDashboardPage';
import TResultPage from './teacher/TResultPage';
import TAttendancePage from './teacher/TAttendancePage';
import { TGroupsPage, TMessagesPage, TLeavePage, TSubjectsPage, TProfilePage } from './teacher/TPages';

import apiService from '../api/apiService';

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    result: 'Results Management',
    attendance: 'Attendance',
    groups: 'My Groups',
    messages: 'Messages',
    leaves: 'Leave Management',
    subjects: 'Subject Performance',
    profile: 'My Profile',
};

export default function TeacherDashboard() {
    const { isDark } = useTheme();
    const { teacherId } = useParams();                    // ✅ URL se teacherId lo

    const [page, setPage] = useState('dashboard');
    const [toast, setToast] = useState('');
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);         // ✅ loading state
    const [error, setError] = useState(null);             // ✅ error state

    const showToast = useCallback((msg) => setToast(msg), []);
    const navigate = (p) => setPage(p);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const id = teacherId || 'TCH-4421';       // ✅ URL ka use karo, fallback default

                const [teacherData, studentsData, classesData] = await Promise.all([
                    apiService.getTeacherByTeacherId(id),
                    apiService.getAllStudents(),
                    apiService.getAllClasses()
                ]);

                // ✅
setTeacher({ 
  ...teacherData, 
  photo: teacherData.photo || localStorage.getItem('teacherPhoto') || null 
});
                setStudents(studentsData);
                setClasses(classesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error loading teacher data');
                showToast('Error loading data from server');
            } finally {
                setLoading(false);                        // ✅ hamesha loading band karo
            }
        };
        fetchData();
    }, [teacherId]);                                      // ✅ teacherId badalne pe re-fetch

    // Loading screen
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white">
            <div className="text-center">
                <div className="text-4xl mb-4 animate-spin">⟳</div>
                <p className="text-[#8b949e]">Loading teacher dashboard...</p>
            </div>
        </div>
    );

    // Error screen
    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-red-400">
            <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p>{error}</p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-4 text-cyan-400 underline text-sm"
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );

    const subtitle = page === 'dashboard'
        ? `Welcome back, ${teacher.name} 👋 — Sunday, 5 April 2026`
        : '';

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return (
                    <TDashboardPage
                        teacher={teacher}
                        students={students}
                        classes={classes}
                        onNavigate={navigate}
                        showToast={showToast}
                    />
                );
            case 'result':
                return <TResultPage showToast={showToast} />;
            case 'attendance':
                return <TAttendancePage showToast={showToast} />;
            case 'groups':
                return <TGroupsPage showToast={showToast} />;
            case 'messages':
                return <TMessagesPage showToast={showToast} />;
            case 'leaves':
                return <TLeavePage showToast={showToast} />;
            case 'subjects':
                return <TSubjectsPage showToast={showToast} />;
            case 'profile':
                return (
                    <TProfilePage
                        teacher={teacher}
                        onUpdateTeacher={(updated) => {
                            setTeacher(updated);
                            if (updated.photo) localStorage.setItem('teacherPhoto', updated.photo);
                        }}
                        showToast={showToast}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen transition-colors text-[13px]"
            style={{ 
                background: isDark ? "#0d1117" : "#f5f5f5",
                color: isDark ? "#e6edf3" : "#24292f",
                fontFamily: 'Inter, sans-serif' 
            }}>

            <TeacherSidebar
                activePage={page}
                onNavigate={navigate}
                onLogout={() => {
                    if (window.confirm('Are you sure you want to logout?'))
                        showToast('👋 Logged out!');
                }}
                teacher={teacher}
            />

            <div className="ml-64 flex-1 flex flex-col min-h-screen">
                <TeacherHeader
                    title={PAGE_TITLES[page] || page}
                    subtitle={subtitle}
                    teacher={teacher}
                    onRefresh={() => showToast('🔄 Refreshed!')}
                    onProfileClick={() => navigate('profile')}
                />

                <div className="p-5 flex-1">
                    {renderPage()}
                </div>
            </div>

            <Toast message={toast} onHide={() => setToast('')} />
        </div>
    );
}