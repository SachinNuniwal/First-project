import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ResultProvider } from './context/ResultContext';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'admin') navigate('/dashboard');
    else if (role === 'teacher') navigate('/teacher');
    else if (role === 'student') navigate('/student');
  };

  return <Login onLogin={handleLogin} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/:teacherId" element={<TeacherDashboard />} />  {/* ✅ naya */}
      <Route path="/student" element={<StudentDashboard />} />
    </Routes>
  );
}

export default function App() {
  return (
    // BrowserRouter must be outermost so useNavigate works in LoginWrapper
    // ResultProvider is inside BrowserRouter but wraps all routes so
    // teacher & student share the same result data
    <BrowserRouter>
      <ResultProvider>
        <AppRoutes />
      </ResultProvider>
    </BrowserRouter>
  );
}