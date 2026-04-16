// apiService.js
// ✅ Mock RAM database — real backend ready hone pe USE_MOCK = false karo
const USE_MOCK = true;
const API_BASE_URL = 'http://localhost:8080/api';
const WS_URL = 'ws://localhost:8080/ws/chat';

// ─── MOCK DATABASE ────────────────────────────────────────────────────────────

let DB = {

    // ── TEACHERS ──────────────────────────────────────────────────────────────
    teachers: [
        { id: 1, teacherId: 'TCH-4421', name: 'Dr. Anjali Mehta', dept: 'CSE', designation: 'Professor', subjects: ['Artificial Intelligence', 'Machine Learning', 'Python'], classes: ['CSE-3A', 'CSE-3B', 'MCA-1'], leavesUsed: 3, status: 'Active', exp: '12 yrs', email: 'anjali.mehta@college.edu', phone: '+91 98760 00001', qual: 'Ph.D. Computer Science', photo: null },
        { id: 2, teacherId: 'TCH-4422', name: 'Prof. Rakesh Sharma', dept: 'Maths', designation: 'Associate Professor', subjects: ['Discrete Mathematics', 'Linear Algebra'], classes: ['CSE-2A', 'CSE-3A'], leavesUsed: 1, status: 'Active', exp: '8 yrs', email: 'rakesh.sharma@college.edu', phone: '+91 98760 00002', qual: 'M.Sc. Mathematics', photo: null },
        { id: 3, teacherId: 'TCH-4423', name: 'Dr. Priya Singh', dept: 'Electronics', designation: 'Assistant Professor', subjects: ['Digital Electronics', 'VLSI Design'], classes: ['CSE-4A', 'CSE-3B'], leavesUsed: 5, status: 'On Leave', exp: '6 yrs', email: 'priya.singh@college.edu', phone: '+91 98760 00003', qual: 'Ph.D. Electronics', photo: null },
        { id: 4, teacherId: 'TCH-4424', name: 'Mr. Arjun Verma', dept: 'CSE', designation: 'Assistant Professor', subjects: ['Data Structures', 'Algorithms', 'C++'], classes: ['CSE-2A', 'MCA-1'], leavesUsed: 0, status: 'Active', exp: '4 yrs', email: 'arjun.verma@college.edu', phone: '+91 98760 00004', qual: 'M.Tech CSE', photo: null },
        { id: 5, teacherId: 'TCH-4425', name: 'Dr. Sunita Rao', dept: 'Humanities', designation: 'Professor', subjects: ['Communication Skills', 'Technical Writing'], classes: ['CSE-2A', 'CSE-3A', 'CSE-4A'], leavesUsed: 2, status: 'Active', exp: '15 yrs', email: 'sunita.rao@college.edu', phone: '+91 98760 00005', qual: 'Ph.D. English Literature', photo: null },
    ],

    // ── STUDENTS ──────────────────────────────────────────────────────────────
    students: [
        { id: 1, studentId: 'STU-1001', roll: 'STU-1001', name: 'Rahul Gupta', class: 'CSE-3A', dept: 'CSE', semester: 5, status: 'Active', email: 'rahul.gupta@student.edu', phone: '+91 99001 00001', dob: '2002-05-15', gender: 'Male', fatherName: 'Mr. Vijay Gupta', address: 'Jaipur, Rajasthan', att: 88, cgpa: 8.4, feePaid: true, fee: { total: 45000, paid: 45000 } },
        { id: 2, studentId: 'STU-1002', roll: 'STU-1002', name: 'Priya Sharma', class: 'CSE-3A', dept: 'CSE', semester: 5, status: 'Active', email: 'priya.sharma@student.edu', phone: '+91 99001 00002', dob: '2002-08-22', gender: 'Female', fatherName: 'Mr. Anil Sharma', address: 'Alwar, Rajasthan', att: 92, cgpa: 9.1, feePaid: true, fee: { total: 45000, paid: 45000 } },
        { id: 3, studentId: 'STU-1003', roll: 'STU-1003', name: 'Amit Kumar', class: 'CSE-2A', dept: 'CSE', semester: 3, status: 'Active', email: 'amit.kumar@student.edu', phone: '+91 99001 00003', dob: '2003-11-10', gender: 'Male', fatherName: 'Mr. Suresh Kumar', address: 'Bhiwadi, Rajasthan', att: 75, cgpa: 7.8, feePaid: false, fee: { total: 45000, paid: 10000 } },
        { id: 4, studentId: 'STU-1004', roll: 'STU-1004', name: 'Neha Patel', class: 'MCA-1', dept: 'MCA', semester: 1, status: 'Active', email: 'neha.patel@student.edu', phone: '+91 99001 00004', dob: '2001-03-18', gender: 'Female', fatherName: 'Mr. Dinesh Patel', address: 'Ajmer, Rajasthan', att: 95, cgpa: 8.9, feePaid: true, fee: { total: 45000, paid: 45000 } },
        { id: 5, studentId: 'STU-1005', roll: 'STU-1005', name: 'Vikram Singh', class: 'CSE-4A', dept: 'CSE', semester: 7, status: 'Active', email: 'vikram.singh@student.edu', phone: '+91 99001 00005', dob: '2001-07-25', gender: 'Male', fatherName: 'Mr. Rajendra Singh', address: 'Kota, Rajasthan', att: 82, cgpa: 8.0, feePaid: true, fee: { total: 45000, paid: 45000 } },
        { id: 6, studentId: 'STU-1006', roll: 'STU-1006', name: 'Anjali Verma', class: 'CSE-3B', dept: 'CSE', semester: 5, status: 'Inactive', email: 'anjali.verma@student.edu', phone: '+91 99001 00006', dob: '2002-12-01', gender: 'Female', fatherName: 'Mr. Ramesh Verma', address: 'Jodhpur, Rajasthan', att: 60, cgpa: 6.5, feePaid: false, fee: { total: 45000, paid: 5000 } },
        { id: 7, studentId: 'STU-1007', roll: 'STU-1007', name: 'Rohit Meena', class: 'CSE-3B', dept: 'CSE', semester: 5, status: 'Active', email: 'rohit.meena@student.edu', phone: '+91 99001 00007', dob: '2002-04-12', gender: 'Male', fatherName: 'Mr. Hari Ram Meena', address: 'Sikar, Rajasthan', att: 70, cgpa: 7.2, feePaid: false, fee: { total: 45000, paid: 20000 } },
        { id: 8, studentId: 'STU-1008', roll: 'STU-1008', name: 'Sneha Joshi', class: 'MCA-1', dept: 'MCA', semester: 1, status: 'Active', email: 'sneha.joshi@student.edu', phone: '+91 99001 00008', dob: '2001-09-05', gender: 'Female', fatherName: 'Mr. Kamal Joshi', address: 'Udaipur, Rajasthan', att: 90, cgpa: 8.7, feePaid: true, fee: { total: 45000, paid: 45000 } },
        { id: 9, studentId: 'STU-1009', roll: 'STU-1009', name: 'Deepak Saini', class: 'CSE-3A', dept: 'CSE', semester: 5, status: 'Active', email: 'deepak.saini@student.edu', phone: '+91 99001 00009', dob: '2002-06-20', gender: 'Male', fatherName: 'Mr. Mohan Saini', address: 'Bikaner, Rajasthan', att: 65, cgpa: 7.0, feePaid: false, fee: { total: 45000, paid: 15000 } },
        { id: 10, studentId: 'STU-1010', roll: 'STU-1010', name: 'Kavita Sharma', class: 'CSE-4A', dept: 'CSE', semester: 7, status: 'Active', email: 'kavita.sharma@student.edu', phone: '+91 99001 00010', dob: '2001-02-14', gender: 'Female', fatherName: 'Mr. Pramod Sharma', address: 'Jaipur, Rajasthan', att: 85, cgpa: 8.6, feePaid: true, fee: { total: 45000, paid: 45000 } },
    ],

    // ── CLASSES ───────────────────────────────────────────────────────────────
    classes: [
        { id: 1, name: 'CSE-3A', dept: 'CSE', semester: 5, strength: 60, classTeacher: 'Dr. Anjali Mehta', room: 'A-301', subjects: ['Artificial Intelligence', 'Machine Learning', 'Python', 'Discrete Mathematics'], schedule: 'Mon-Fri 9AM-4PM' },
        { id: 2, name: 'CSE-3B', dept: 'CSE', semester: 5, strength: 58, classTeacher: 'Dr. Priya Singh', room: 'A-302', subjects: ['Artificial Intelligence', 'VLSI Design', 'Digital Electronics'], schedule: 'Mon-Fri 9AM-4PM' },
        { id: 3, name: 'CSE-2A', dept: 'CSE', semester: 3, strength: 62, classTeacher: 'Mr. Arjun Verma', room: 'B-201', subjects: ['Data Structures', 'Algorithms', 'Discrete Mathematics'], schedule: 'Mon-Fri 9AM-4PM' },
        { id: 4, name: 'MCA-1', dept: 'MCA', semester: 1, strength: 40, classTeacher: 'Dr. Anjali Mehta', room: 'C-101', subjects: ['Python', 'Data Structures', 'Communication Skills'], schedule: 'Mon-Fri 10AM-5PM' },
        { id: 5, name: 'CSE-4A', dept: 'CSE', semester: 7, strength: 55, classTeacher: 'Dr. Sunita Rao', room: 'A-401', subjects: ['Communication Skills', 'Technical Writing', 'VLSI Design'], schedule: 'Mon-Fri 9AM-4PM' },
    ],

    // ── LEAVE REQUESTS ────────────────────────────────────────────────────────
    leaveRequests: [
        { id: 1, teacherId: 'TCH-4421', teacherName: 'Dr. Anjali Mehta', dept: 'CSE', from: '2025-04-10', to: '2025-04-11', days: 2, reason: 'Family function', type: 'Casual', status: 'Pending', appliedOn: '2025-04-07', adminRemark: '' },
        { id: 2, teacherId: 'TCH-4423', teacherName: 'Dr. Priya Singh', dept: 'Electronics', from: '2025-04-05', to: '2025-04-09', days: 5, reason: 'Medical treatment', type: 'Medical', status: 'Approved', appliedOn: '2025-04-04', adminRemark: 'Get well soon' },
        { id: 3, teacherId: 'TCH-4422', teacherName: 'Prof. Rakesh Sharma', dept: 'Maths', from: '2025-04-15', to: '2025-04-15', days: 1, reason: 'Personal work', type: 'Casual', status: 'Pending', appliedOn: '2025-04-07', adminRemark: '' },
    ],

    // ── SUBJECT ATTENDANCE ────────────────────────────────────────────────────
    // One record per student per subject per date
    subjectAttendance: [
        { id: 1, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', subject: 'Artificial Intelligence', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 2, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', subject: 'Artificial Intelligence', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4421' },
        { id: 3, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', subject: 'Artificial Intelligence', date: '2025-04-03', status: 'Absent', markedBy: 'TCH-4421' },
        { id: 4, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', subject: 'Machine Learning', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 5, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', subject: 'Machine Learning', date: '2025-04-02', status: 'Late', markedBy: 'TCH-4421' },
        { id: 6, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', subject: 'Artificial Intelligence', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 7, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', subject: 'Artificial Intelligence', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4421' },
        { id: 8, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', subject: 'Machine Learning', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 9, studentId: 'STU-1003', studentName: 'Amit Kumar', class: 'CSE-2A', subject: 'Data Structures', date: '2025-04-01', status: 'Absent', markedBy: 'TCH-4424' },
        { id: 10, studentId: 'STU-1003', studentName: 'Amit Kumar', class: 'CSE-2A', subject: 'Data Structures', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4424' },
    ],

    // ── DAILY ATTENDANCE ──────────────────────────────────────────────────────
    // One record per student per date (overall day status)
    dailyAttendance: [
        { id: 1, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 2, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4421' },
        { id: 3, studentId: 'STU-1001', studentName: 'Rahul Gupta', class: 'CSE-3A', date: '2025-04-03', status: 'Absent', markedBy: 'TCH-4421' },
        { id: 4, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 5, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4421' },
        { id: 6, studentId: 'STU-1002', studentName: 'Priya Sharma', class: 'CSE-3A', date: '2025-04-03', status: 'Present', markedBy: 'TCH-4421' },
        { id: 7, studentId: 'STU-1003', studentName: 'Amit Kumar', class: 'CSE-2A', date: '2025-04-01', status: 'Absent', markedBy: 'TCH-4424' },
        { id: 8, studentId: 'STU-1003', studentName: 'Amit Kumar', class: 'CSE-2A', date: '2025-04-02', status: 'Present', markedBy: 'TCH-4424' },
        { id: 9, studentId: 'STU-1004', studentName: 'Neha Patel', class: 'MCA-1', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4421' },
        { id: 10, studentId: 'STU-1005', studentName: 'Vikram Singh', class: 'CSE-4A', date: '2025-04-01', status: 'Present', markedBy: 'TCH-4425' },
    ],

    // ── CHAT GROUPS ───────────────────────────────────────────────────────────
    chatGroups: [
        { id: 1, name: 'CSE-3A Group', type: 'class', classId: 'CSE-3A', dept: 'CSE', members: ['STU-1001', 'STU-1002', 'STU-1009', 'TCH-4421', 'TCH-4422'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 2, name: 'CSE-3B Group', type: 'class', classId: 'CSE-3B', dept: 'CSE', members: ['STU-1006', 'STU-1007', 'TCH-4423'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 3, name: 'CSE-2A Group', type: 'class', classId: 'CSE-2A', dept: 'CSE', members: ['STU-1003', 'TCH-4424', 'TCH-4422'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 4, name: 'MCA-1 Group', type: 'class', classId: 'MCA-1', dept: 'MCA', members: ['STU-1004', 'STU-1008', 'TCH-4421'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 5, name: 'CSE-4A Group', type: 'class', classId: 'CSE-4A', dept: 'CSE', members: ['STU-1005', 'STU-1010', 'TCH-4423', 'TCH-4425'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 6, name: 'All Teachers', type: 'department', classId: null, dept: 'ALL', members: ['TCH-4421', 'TCH-4422', 'TCH-4423', 'TCH-4424', 'TCH-4425'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
        { id: 7, name: 'Admin Broadcast', type: 'broadcast', classId: null, dept: 'ALL', members: ['ADMIN'], createdBy: 'ADMIN', createdAt: '2025-01-01T00:00:00' },
    ],

    // ── CHAT MESSAGES ─────────────────────────────────────────────────────────
    messages: [
        { id: 1, groupId: 1, senderId: 'TCH-4421', senderName: 'Dr. Anjali Mehta', senderRole: 'teacher', text: 'Good morning class! AI assignment submission deadline is April 10.', timestamp: '2025-04-07T09:00:00', readBy: ['STU-1001', 'STU-1002'] },
        { id: 2, groupId: 1, senderId: 'STU-1001', senderName: 'Rahul Gupta', senderRole: 'student', text: 'Ma\'am, can we submit in PDF format?', timestamp: '2025-04-07T09:05:00', readBy: ['TCH-4421'] },
        { id: 3, groupId: 1, senderId: 'TCH-4421', senderName: 'Dr. Anjali Mehta', senderRole: 'teacher', text: 'Yes, PDF or DOCX both are accepted.', timestamp: '2025-04-07T09:07:00', readBy: ['STU-1001', 'STU-1002'] },
        { id: 4, groupId: 2, senderId: 'TCH-4423', senderName: 'Dr. Priya Singh', senderRole: 'teacher', text: 'VLSI exam syllabus has been uploaded on the portal.', timestamp: '2025-04-07T10:00:00', readBy: [] },
        { id: 5, groupId: 6, senderId: 'ADMIN', senderName: 'Admin', senderRole: 'admin', text: 'Staff meeting on April 9 at 11 AM in Conference Room B.', timestamp: '2025-04-07T08:30:00', readBy: ['TCH-4421', 'TCH-4422'] },
        { id: 6, groupId: 7, senderId: 'ADMIN', senderName: 'Admin', senderRole: 'admin', text: 'College will remain closed on April 14 due to Dr. Ambedkar Jayanti.', timestamp: '2025-04-07T08:00:00', readBy: [] },
    ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// ─── MOCK API ─────────────────────────────────────────────────────────────────

const mockApi = {

    // ── TEACHERS ──────────────────────────────────────────────────────────────
    getAllTeachers: async () => { await delay(); return [...DB.teachers]; },
    getTeacherById: async (id) => { await delay(); const t = DB.teachers.find(t => t.id === Number(id)); if (!t) throw new Error(`Teacher not found: id=${id}`); return { ...t }; },
    getTeacherByTeacherId: async (tid) => { await delay(); const t = DB.teachers.find(t => t.teacherId === tid); if (!t) throw new Error(`Teacher not found: teacherId=${tid}`); return { ...t }; },
    createTeacher: async (data) => { await delay(); const n = { ...data, id: Date.now() }; DB.teachers.push(n); return { ...n }; },
    updateTeacher: async (id, data) => { await delay(); const i = DB.teachers.findIndex(t => t.id === Number(id)); if (i === -1) throw new Error(`Teacher not found: id=${id}`); DB.teachers[i] = { ...DB.teachers[i], ...data, id: Number(id) }; return { ...DB.teachers[i] }; },
    deleteTeacher: async (id) => { await delay(); const i = DB.teachers.findIndex(t => t.id === Number(id)); if (i === -1) throw new Error(`Teacher not found: id=${id}`); DB.teachers.splice(i, 1); return { success: true }; },

    // ── STUDENTS ──────────────────────────────────────────────────────────────
    getAllStudents: async () => { await delay(); return [...DB.students]; },
    getStudentById: async (id) => { await delay(); const s = DB.students.find(s => s.id === Number(id)); if (!s) throw new Error(`Student not found: id=${id}`); return { ...s }; },
    getStudentByStudentId: async (sid) => { await delay(); const s = DB.students.find(s => s.studentId === sid); if (!s) throw new Error(`Student not found: studentId=${sid}`); return { ...s }; },
    createStudent: async (data) => { await delay(); const n = { ...data, id: Date.now(), roll: data.studentId }; DB.students.push(n); return { ...n }; },
    updateStudent: async (id, data) => { await delay(); const i = DB.students.findIndex(s => s.id === Number(id)); if (i === -1) throw new Error(`Student not found: id=${id}`); DB.students[i] = { ...DB.students[i], ...data, id: Number(id) }; return { ...DB.students[i] }; },
    deleteStudent: async (id) => { await delay(); const i = DB.students.findIndex(s => s.id === Number(id)); if (i === -1) throw new Error(`Student not found: id=${id}`); DB.students.splice(i, 1); return { success: true }; },

    // ── CLASSES ───────────────────────────────────────────────────────────────
    getAllClasses: async () => { await delay(); return [...DB.classes]; },
    getClassById: async (id) => { await delay(); const c = DB.classes.find(c => c.id === Number(id)); if (!c) throw new Error(`Class not found: id=${id}`); return { ...c }; },
    getClassByName: async (name) => { await delay(); const c = DB.classes.find(c => c.name === name); if (!c) throw new Error(`Class not found: name=${name}`); return { ...c }; },
    createClass: async (data) => { await delay(); const n = { ...data, id: Date.now() }; DB.classes.push(n); return { ...n }; },
    updateClass: async (id, data) => { await delay(); const i = DB.classes.findIndex(c => c.id === Number(id)); if (i === -1) throw new Error(`Class not found: id=${id}`); DB.classes[i] = { ...DB.classes[i], ...data, id: Number(id) }; return { ...DB.classes[i] }; },
    deleteClass: async (id) => { await delay(); const i = DB.classes.findIndex(c => c.id === Number(id)); if (i === -1) throw new Error(`Class not found: id=${id}`); DB.classes.splice(i, 1); return { success: true }; },

    // ── LEAVE REQUESTS ────────────────────────────────────────────────────────
    getAllLeaveRequests: async () => { await delay(); return [...DB.leaveRequests]; },
    getLeaveRequestsByTeacher: async (teacherId) => { await delay(); return DB.leaveRequests.filter(l => l.teacherId === teacherId); },
    getPendingLeaveRequests: async () => { await delay(); return DB.leaveRequests.filter(l => l.status === 'Pending'); },
    applyLeave: async (data) => {
        await delay();
        const teacher = DB.teachers.find(t => t.teacherId === data.teacherId);
        if (!teacher) throw new Error(`Teacher not found: teacherId=${data.teacherId}`);
        const n = { ...data, id: Date.now(), teacherName: teacher.name, dept: teacher.dept, status: 'Pending', appliedOn: new Date().toISOString().split('T')[0], adminRemark: '' };
        DB.leaveRequests.push(n);
        return { ...n };
    },
    approveLeave: async (id, remark = '') => {
        await delay();
        const i = DB.leaveRequests.findIndex(l => l.id === Number(id));
        if (i === -1) throw new Error(`Leave request not found: id=${id}`);
        DB.leaveRequests[i].status = 'Approved';
        DB.leaveRequests[i].adminRemark = remark;
        const ti = DB.teachers.findIndex(t => t.teacherId === DB.leaveRequests[i].teacherId);
        if (ti !== -1) DB.teachers[ti].leavesUsed += DB.leaveRequests[i].days;
        return { ...DB.leaveRequests[i] };
    },
    rejectLeave: async (id, remark = '') => {
        await delay();
        const i = DB.leaveRequests.findIndex(l => l.id === Number(id));
        if (i === -1) throw new Error(`Leave request not found: id=${id}`);
        DB.leaveRequests[i].status = 'Rejected';
        DB.leaveRequests[i].adminRemark = remark;
        return { ...DB.leaveRequests[i] };
    },

    // ── SUBJECT ATTENDANCE ────────────────────────────────────────────────────
    getAllSubjectAttendance: async () => { await delay(); return [...DB.subjectAttendance]; },
    getSubjectAttendanceByClassSubjectDate: async (className, subject, date) => {
        await delay();
        return DB.subjectAttendance.filter(r => r.class === className && r.subject === subject && r.date === date);
    },
    getSubjectAttendanceByStudent: async (studentId) => {
        await delay();
        return DB.subjectAttendance.filter(r => r.studentId === studentId);
    },
    getSubjectAttendanceSummary: async (studentId) => {
        await delay();
        const records = DB.subjectAttendance.filter(r => r.studentId === studentId);
        const subjects = [...new Set(records.map(r => r.subject))];
        return subjects.map(subject => {
            const subRecords = records.filter(r => r.subject === subject);
            const present = subRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
            const total = subRecords.length;
            const percentage = total ? Math.round((present / total) * 100) : 0;
            return { subject, present, absent: total - present, total, percentage, belowThreshold: percentage < 75 };
        });
    },
    markSubjectAttendance: async (records) => {
        // records = [{ studentId, studentName, class, subject, date, status, markedBy }]
        await delay();
        const results = [];
        for (const rec of records) {
            const ei = DB.subjectAttendance.findIndex(r => r.studentId === rec.studentId && r.subject === rec.subject && r.date === rec.date);
            if (ei !== -1) {
                DB.subjectAttendance[ei] = { ...DB.subjectAttendance[ei], ...rec };
                results.push({ ...DB.subjectAttendance[ei] });
            } else {
                const n = { ...rec, id: Date.now() + Math.floor(Math.random() * 1000) };
                DB.subjectAttendance.push(n);
                results.push({ ...n });
            }
        }
        return results;
    },
    updateSubjectAttendance: async (id, data) => {
        await delay();
        const i = DB.subjectAttendance.findIndex(r => r.id === Number(id));
        if (i === -1) throw new Error(`Subject attendance record not found: id=${id}`);
        DB.subjectAttendance[i] = { ...DB.subjectAttendance[i], ...data };
        return { ...DB.subjectAttendance[i] };
    },

    // ── DAILY ATTENDANCE ──────────────────────────────────────────────────────
    getAllDailyAttendance: async () => { await delay(); return [...DB.dailyAttendance]; },
    getDailyAttendanceByClassDate: async (className, date) => {
        await delay();
        return DB.dailyAttendance.filter(r => r.class === className && r.date === date);
    },
    getDailyAttendanceByStudent: async (studentId) => {
        await delay();
        return DB.dailyAttendance.filter(r => r.studentId === studentId);
    },
    getDailyAttendanceSummary: async (studentId) => {
        await delay();
        const records = DB.dailyAttendance.filter(r => r.studentId === studentId);
        const total = records.length;
        const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
        const absent = records.filter(r => r.status === 'Absent').length;
        const late = records.filter(r => r.status === 'Late').length;
        const percentage = total ? Math.round((present / total) * 100) : 0;
        return { studentId, total, present, absent, late, percentage, belowThreshold: percentage < 75, records };
    },
    getLowAttendanceStudents: async (className, threshold = 75) => {
        await delay();
        const classStudents = DB.students.filter(s => s.class === className);
        return classStudents
            .map(s => {
                const records = DB.dailyAttendance.filter(r => r.studentId === s.studentId);
                const total = records.length;
                const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
                const percentage = total ? Math.round((present / total) * 100) : 0;
                return { ...s, attendancePercentage: percentage, totalClasses: total, presentClasses: present };
            })
            .filter(s => s.attendancePercentage < threshold);
    },
    markDailyAttendance: async (records) => {
        // records = [{ studentId, studentName, class, date, status, markedBy }]
        await delay();
        const results = [];
        for (const rec of records) {
            const ei = DB.dailyAttendance.findIndex(r => r.studentId === rec.studentId && r.date === rec.date);
            if (ei !== -1) {
                DB.dailyAttendance[ei] = { ...DB.dailyAttendance[ei], ...rec };
                results.push({ ...DB.dailyAttendance[ei] });
            } else {
                const n = { ...rec, id: Date.now() + Math.random() };
                DB.dailyAttendance.push(n);
                results.push({ ...n });
            }
        }
        return results;
    },
    updateDailyAttendance: async (id, data) => {
        await delay();
        const i = DB.dailyAttendance.findIndex(r => r.id === Number(id));
        if (i === -1) throw new Error(`Daily attendance record not found: id=${id}`);
        DB.dailyAttendance[i] = { ...DB.dailyAttendance[i], ...data };
        return { ...DB.dailyAttendance[i] };
    },
    getMonthlyAttendanceReport: async (className, month, year) => {
        await delay();
        const classStudents = DB.students.filter(s => s.class === className);
        return classStudents.map(s => {
            const records = DB.dailyAttendance.filter(r => {
                const d = new Date(r.date);
                return r.studentId === s.studentId && d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
            });
            const total = records.length;
            const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
            const percentage = total ? Math.round((present / total) * 100) : 0;
            return { studentId: s.studentId, name: s.name, total, present, absent: total - present, percentage, belowThreshold: percentage < 75 };
        });
    },

    // ── CHAT GROUPS ───────────────────────────────────────────────────────────
    getAllChatGroups: async () => { await delay(); return [...DB.chatGroups]; },
    getChatGroupById: async (id) => { await delay(); const g = DB.chatGroups.find(g => g.id === Number(id)); if (!g) throw new Error(`Chat group not found: id=${id}`); return { ...g }; },
    getChatGroupsByMember: async (memberId) => {
        await delay();
        if (memberId === 'ADMIN') return [...DB.chatGroups];
        return DB.chatGroups.filter(g => g.members.includes(memberId) || g.type === 'broadcast');
    },
    createChatGroup: async (data) => {
        await delay();
        const n = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
        DB.chatGroups.push(n);
        return { ...n };
    },
    addMemberToGroup: async (groupId, memberId) => {
        await delay();
        const i = DB.chatGroups.findIndex(g => g.id === Number(groupId));
        if (i === -1) throw new Error(`Chat group not found: id=${groupId}`);
        if (!DB.chatGroups[i].members.includes(memberId)) DB.chatGroups[i].members.push(memberId);
        return { ...DB.chatGroups[i] };
    },
    removeMemberFromGroup: async (groupId, memberId) => {
        await delay();
        const i = DB.chatGroups.findIndex(g => g.id === Number(groupId));
        if (i === -1) throw new Error(`Chat group not found: id=${groupId}`);
        DB.chatGroups[i].members = DB.chatGroups[i].members.filter(m => m !== memberId);
        return { ...DB.chatGroups[i] };
    },

    // ── CHAT MESSAGES ─────────────────────────────────────────────────────────
    getMessagesByGroup: async (groupId) => {
        await delay();
        return DB.messages
            .filter(m => m.groupId === Number(groupId))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    sendMessage: async (data) => {
        // data = { groupId, senderId, senderName, senderRole, text }
        await delay();
        const n = { ...data, id: Date.now(), timestamp: new Date().toISOString(), readBy: [data.senderId] };
        DB.messages.push(n);
        return { ...n };
    },
    markMessagesRead: async (groupId, userId) => {
        await delay();
        DB.messages.forEach((m, i) => {
            if (m.groupId === Number(groupId) && !m.readBy.includes(userId)) {
                DB.messages[i].readBy.push(userId);
            }
        });
        return { success: true };
    },
    getUnreadCounts: async (userId) => {
        await delay();
        const groups = userId === 'ADMIN'
            ? DB.chatGroups
            : DB.chatGroups.filter(g => g.members.includes(userId) || g.type === 'broadcast');
        return groups.map(g => {
            const unread = DB.messages.filter(m => m.groupId === g.id && !m.readBy.includes(userId)).length;
            return { groupId: g.id, groupName: g.name, unread };
        });
    },
    deleteMessage: async (id) => {
        await delay();
        const i = DB.messages.findIndex(m => m.id === Number(id));
        if (i === -1) throw new Error(`Message not found: id=${id}`);
        DB.messages.splice(i, 1);
        return { success: true };
    },
};

// ─── REAL API ─────────────────────────────────────────────────────────────────

const realApi = {
    // ✅ _fetch — private methods (#) not supported by OXC/Vite parser
    _fetch(url, options = {}) {
        return fetch(url, options).then(r => {
            if (!r.ok) throw new Error(`API error ${r.status}: ${url}`);
            return r.json();
        });
    },

    // ── TEACHERS ──────────────────────────────────────────────────────────────
    getAllTeachers() { return this._fetch(`${API_BASE_URL}/teachers`); },
    getTeacherById(id) { return this._fetch(`${API_BASE_URL}/teachers/${id}`); },
    getTeacherByTeacherId(id) { return this._fetch(`${API_BASE_URL}/teachers/by-id/${id}`); },
    createTeacher(data) { return this._fetch(`${API_BASE_URL}/teachers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    updateTeacher(id, data) { return this._fetch(`${API_BASE_URL}/teachers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    deleteTeacher(id) { return fetch(`${API_BASE_URL}/teachers/${id}`, { method: 'DELETE' }); },

    // ── STUDENTS ──────────────────────────────────────────────────────────────
    getAllStudents() { return this._fetch(`${API_BASE_URL}/students`); },
    getStudentById(id) { return this._fetch(`${API_BASE_URL}/students/${id}`); },
    getStudentByStudentId(id) { return this._fetch(`${API_BASE_URL}/students/by-id/${id}`); },
    createStudent(data) { return this._fetch(`${API_BASE_URL}/students`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    updateStudent(id, data) { return this._fetch(`${API_BASE_URL}/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    deleteStudent(id) { return fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' }); },

    // ── CLASSES ───────────────────────────────────────────────────────────────
    getAllClasses() { return this._fetch(`${API_BASE_URL}/classes`); },
    getClassById(id) { return this._fetch(`${API_BASE_URL}/classes/${id}`); },
    getClassByName(name) { return this._fetch(`${API_BASE_URL}/classes/by-name/${name}`); },
    createClass(data) { return this._fetch(`${API_BASE_URL}/classes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    updateClass(id, data) { return this._fetch(`${API_BASE_URL}/classes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    deleteClass(id) { return fetch(`${API_BASE_URL}/classes/${id}`, { method: 'DELETE' }); },

    // ── LEAVE REQUESTS ────────────────────────────────────────────────────────
    getAllLeaveRequests() { return this._fetch(`${API_BASE_URL}/leaves`); },
    getLeaveRequestsByTeacher(teacherId) { return this._fetch(`${API_BASE_URL}/leaves/teacher/${teacherId}`); },
    getPendingLeaveRequests() { return this._fetch(`${API_BASE_URL}/leaves/pending`); },
    applyLeave(data) { return this._fetch(`${API_BASE_URL}/leaves`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    approveLeave(id, remark) { return this._fetch(`${API_BASE_URL}/leaves/${id}/approve`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remark }) }); },
    rejectLeave(id, remark) { return this._fetch(`${API_BASE_URL}/leaves/${id}/reject`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remark }) }); },

    // ── SUBJECT ATTENDANCE ────────────────────────────────────────────────────
    getAllSubjectAttendance() { return this._fetch(`${API_BASE_URL}/attendance/subject`); },
    getSubjectAttendanceByClassSubjectDate(className, subject, date) { return this._fetch(`${API_BASE_URL}/attendance/subject?class=${className}&subject=${encodeURIComponent(subject)}&date=${date}`); },
    getSubjectAttendanceByStudent(studentId) { return this._fetch(`${API_BASE_URL}/attendance/subject/student/${studentId}`); },
    getSubjectAttendanceSummary(studentId) { return this._fetch(`${API_BASE_URL}/attendance/subject/summary/${studentId}`); },
    markSubjectAttendance(records) { return this._fetch(`${API_BASE_URL}/attendance/subject/mark`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(records) }); },
    updateSubjectAttendance(id, data) { return this._fetch(`${API_BASE_URL}/attendance/subject/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },

    // ── DAILY ATTENDANCE ──────────────────────────────────────────────────────
    getAllDailyAttendance() { return this._fetch(`${API_BASE_URL}/attendance/daily`); },
    getDailyAttendanceByClassDate(className, date) { return this._fetch(`${API_BASE_URL}/attendance/daily?class=${className}&date=${date}`); },
    getDailyAttendanceByStudent(studentId) { return this._fetch(`${API_BASE_URL}/attendance/daily/student/${studentId}`); },
    getDailyAttendanceSummary(studentId) { return this._fetch(`${API_BASE_URL}/attendance/daily/summary/${studentId}`); },
    getLowAttendanceStudents(className, threshold = 75) { return this._fetch(`${API_BASE_URL}/attendance/daily/low?class=${className}&threshold=${threshold}`); },
    markDailyAttendance(records) { return this._fetch(`${API_BASE_URL}/attendance/daily/mark`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(records) }); },
    updateDailyAttendance(id, data) { return this._fetch(`${API_BASE_URL}/attendance/daily/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    getMonthlyAttendanceReport(className, month, year) { return this._fetch(`${API_BASE_URL}/attendance/report?class=${className}&month=${month}&year=${year}`); },

    // ── CHAT GROUPS ───────────────────────────────────────────────────────────
    getAllChatGroups() { return this._fetch(`${API_BASE_URL}/chat/groups`); },
    getChatGroupById(id) { return this._fetch(`${API_BASE_URL}/chat/groups/${id}`); },
    getChatGroupsByMember(memberId) { return this._fetch(`${API_BASE_URL}/chat/groups/member/${memberId}`); },
    createChatGroup(data) { return this._fetch(`${API_BASE_URL}/chat/groups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    addMemberToGroup(groupId, memberId) { return this._fetch(`${API_BASE_URL}/chat/groups/${groupId}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId }) }); },
    removeMemberFromGroup(groupId, memberId) { return this._fetch(`${API_BASE_URL}/chat/groups/${groupId}/members/${memberId}`, { method: 'DELETE' }); },

    // ── CHAT MESSAGES (REST — for history load) ───────────────────────────────
    getMessagesByGroup(groupId) { return this._fetch(`${API_BASE_URL}/chat/groups/${groupId}/messages`); },
    sendMessage(data) { return this._fetch(`${API_BASE_URL}/chat/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); },
    markMessagesRead(groupId, userId) { return this._fetch(`${API_BASE_URL}/chat/groups/${groupId}/read`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }); },
    getUnreadCounts(userId) { return this._fetch(`${API_BASE_URL}/chat/unread/${userId}`); },
    deleteMessage(id) { return fetch(`${API_BASE_URL}/chat/messages/${id}`, { method: 'DELETE' }); },
};

// ─── WEBSOCKET SERVICE (Real-time chat — backend ready hone pe use karo) ──────
//
// Usage in your component:
//   import api, { wsService } from './apiService'
//
//   // Connect once on login
//   wsService.connect('TCH-4421', 'teacher')
//   wsService.joinGroup(1)
//
//   // Listen for incoming messages
//   wsService.onMessage((msg) => setMessages(prev => [...prev, msg]))
//
//   // Send message via WS (real mode) or mockApi (mock mode)
//   if (USE_MOCK) {
//     const msg = await api.sendMessage({ groupId, senderId, senderName, senderRole, text })
//     setMessages(prev => [...prev, msg])
//   } else {
//     wsService.sendMessage({ groupId, senderId, senderName, senderRole, text })
//   }
//
//   // Cleanup on logout / unmount
//   wsService.disconnect()

export const wsService = {
    socket: null,
    listeners: [],

    connect(userId, role) {
        if (USE_MOCK) {
            console.log(`[WS MOCK] Connected as ${userId} (${role}) — use mockApi directly`);
            return;
        }
        this.socket = new WebSocket(`${WS_URL}?userId=${userId}&role=${role}`);
        this.socket.onopen = () => console.log('[WS] Connected');
        this.socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            this.listeners.forEach(cb => cb(msg));
        };
        this.socket.onerror = (err) => console.error('[WS] Error:', err);
        this.socket.onclose = () => console.log('[WS] Disconnected');
    },

    joinGroup(groupId) {
        if (USE_MOCK) { console.log(`[WS MOCK] joinGroup(${groupId})`); return; }
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'JOIN_GROUP', groupId }));
        }
    },

    leaveGroup(groupId) {
        if (USE_MOCK) { console.log(`[WS MOCK] leaveGroup(${groupId})`); return; }
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'LEAVE_GROUP', groupId }));
        }
    },

    sendMessage(data) {
        // data = { groupId, senderId, senderName, senderRole, text }
        if (USE_MOCK) {
            console.warn('[WS MOCK] Use mockApi.sendMessage() directly in mock mode');
            return;
        }
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'SEND_MESSAGE', ...data }));
        }
    },

    onMessage(callback) {
        this.listeners.push(callback);
    },

    offMessage(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    },

    disconnect() {
        if (USE_MOCK) { console.log('[WS MOCK] disconnect()'); return; }
        this.socket?.close();
        this.socket = null;
        this.listeners = [];
    },
};

// ─── DEFAULT EXPORT ───────────────────────────────────────────────────────────
export default USE_MOCK ? mockApi : realApi;