export const students = [
    { id: '2201001', name: 'Aarav Singh', class: 'CSE-3A', cgpa: 8.9, att: 92, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
    { id: '2201002', name: 'Priya Mehta', class: 'CSE-3A', cgpa: 7.8, att: 85, fee: { total: 80000, paid: 60000 }, gender: 'F', course: 'B.Tech', duration: 4 },
    { id: '2201003', name: 'Rahul Sharma', class: 'CSE-3A', cgpa: 9.1, att: 95, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
    { id: '2201004', name: 'Sneha Gupta', class: 'CSE-3B', cgpa: 7.2, att: 78, fee: { total: 80000, paid: 40000 }, gender: 'F', course: 'B.Tech', duration: 4 },
    { id: '2201005', name: 'Arjun Rao', class: 'CSE-3B', cgpa: 5.8, att: 62, fee: { total: 80000, paid: 20000 }, gender: 'M', course: 'B.Tech', duration: 4 },
    { id: '2201006', name: 'Kavya Nair', class: 'CSE-3A', cgpa: 8.4, att: 68, fee: { total: 80000, paid: 80000 }, gender: 'F', course: 'B.Tech', duration: 4 },
    { id: '2201007', name: 'Vikram Tiwari', class: 'CSE-2A', cgpa: 7.6, att: 80, fee: { total: 75000, paid: 75000 }, gender: 'M', course: 'B.Tech', duration: 4 },
    { id: '2201008', name: 'Ananya Sharma', class: 'MCA-1', cgpa: 8.8, att: 90, fee: { total: 90000, paid: 90000 }, gender: 'F', course: 'MCA', duration: 3 },
    { id: '2201009', name: 'Rohan Verma', class: 'CSE-2A', cgpa: 6.5, att: 73, fee: { total: 75000, paid: 50000 }, gender: 'M', course: 'B.Tech', duration: 4 },
    { id: '2201010', name: 'Mohit Batra', class: 'CSE-3B', cgpa: 7.0, att: 73, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
];

export const initialTeachers = [
    { id: 'TCH-4421', name: 'Dr. Priya Verma', dept: 'CSE', subjects: ['DSA', 'OS'], classes: ['CSE-3A', 'CSE-3B'], leavesUsed: 3, status: 'Active', exp: '12 yrs', email: 'priya@college.edu' },
    { id: 'TCH-3812', name: 'Mr. Arun Kumar', dept: 'CSE', subjects: ['DBMS', 'CN'], classes: ['CSE-2A', 'CSE-3A'], leavesUsed: 1, status: 'Active', exp: '8 yrs', email: 'arun@college.edu' },
    { id: 'TCH-4102', name: 'Ms. Neha Singh', dept: 'CSE', subjects: ['SE', 'Python'], classes: ['MCA-1', 'CSE-2A'], leavesUsed: 5, status: 'Active', exp: '6 yrs', email: 'neha@college.edu' },
    { id: 'TCH-3560', name: 'Prof. R.K. Das', dept: 'Maths', subjects: ['Maths', 'Stats'], classes: ['CSE-2A', 'MCA-1'], leavesUsed: 2, status: 'Active', exp: '15 yrs', email: 'rkdas@college.edu' },
    { id: 'TCH-4890', name: 'Dr. Anita Joshi', dept: 'CSE', subjects: ['AI', 'ML'], classes: ['CSE-3B', 'MCA-1'], leavesUsed: 0, status: 'On Leave', exp: '10 yrs', email: 'anita@college.edu' },
];

export const initialClasses = [
    { name: 'CSE-3A', year: '3rd Year', teacher: 'Dr. Priya Verma', students: 42, att: 91, cgpa: 8.4, color: '#00d4ff', subjects: ['DSA', 'OS', 'DBMS', 'CN', 'SE'] },
    { name: 'CSE-3B', year: '3rd Year', teacher: 'Mr. Arun Kumar', students: 38, att: 81, cgpa: 7.9, color: '#f0a500', subjects: ['DBMS', 'AI', 'OS', 'SE'] },
    { name: 'CSE-2A', year: '2nd Year', teacher: 'Ms. Neha Singh', students: 45, att: 84, cgpa: 7.6, color: '#a855f7', subjects: ['Maths', 'Physics', 'DSA', 'Python'] },
    { name: 'MCA-1', year: '1st Year', teacher: 'Prof. R.K. Das', students: 30, att: 88, cgpa: 8.5, color: '#39d353', subjects: ['Python', 'Stats', 'DBMS', 'AI'] },
    { name: 'CSE-4A', year: '4th Year', teacher: 'Dr. Anita Joshi', students: 40, att: 86, cgpa: 8.1, color: '#ff7b29', subjects: ['AI', 'ML', 'Project'] },
];

export const initialEvents = [
    { id: 1, title: 'Mid-Term Exam Starts', desc: 'CSE Mid-Term examinations begin', date: '2026-04-20', time: '09:00', category: 'Exam', audience: 'Students Only', deadline: '2026-04-20T08:00' },
    { id: 2, title: 'Faculty Meeting', desc: 'Monthly faculty coordination meeting', date: '2026-04-05', time: '15:00', category: 'Meeting', audience: 'Teachers Only', deadline: '2026-04-05T15:00' },
    { id: 3, title: 'IEEE Conference — Prof. Das', desc: 'Prof. R.K. Das attending IEEE conference', date: '2026-04-15', time: '08:00', category: 'Academic', audience: 'All', deadline: '2026-04-15T07:00' },
    { id: 4, title: 'Dr. Ambedkar Jayanti Holiday', desc: 'College closed for national holiday', date: '2026-04-14', time: '00:00', category: 'Holiday', audience: 'All', deadline: '2026-04-14T00:00' },
    { id: 5, title: 'Results Published — DSA', desc: 'DSA mid-term results published on portal', date: '2026-03-25', time: '12:00', category: 'Academic', audience: 'CSE-3A', deadline: '2026-03-26T12:00' },
];

export const initialPendingLeaves = [
    { id: 1, teacher: 'Mr. Arun Kumar', type: 'Medical', from: '5 Apr', to: '7 Apr', days: 3, reason: 'Fever & rest', status: 'Pending' },
    { id: 2, teacher: 'Ms. Neha Singh', type: 'Personal', from: '10 Apr', to: '10 Apr', days: 1, reason: 'Family event', status: 'Pending' },
    { id: 3, teacher: 'Prof. R.K. Das', type: 'Conference', from: '15 Apr', to: '17 Apr', days: 3, reason: 'IEEE Conference', status: 'Pending' },
    { id: 4, teacher: 'Dr. Anita Joshi', type: 'Emergency', from: '3 Apr', to: '4 Apr', days: 2, reason: 'Family emergency', status: 'Pending' },
    { id: 5, teacher: 'Dr. Priya Verma', type: 'Medical', from: '20 Apr', to: '21 Apr', days: 2, reason: 'Doctor appointment', status: 'Pending' },
];

export const initialLeaveHistory = [
    { id: 10, teacher: 'Dr. Priya Verma', type: 'Medical', from: '15 Jan', to: '17 Jan', days: 3, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
    { id: 11, teacher: 'Mr. Arun Kumar', type: 'Personal', from: '5 Feb', to: '5 Feb', days: 1, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
    { id: 12, teacher: 'Ms. Neha Singh', type: 'Conference', from: '20 Mar', to: '22 Mar', days: 3, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
    { id: 13, teacher: 'Dr. Anita Joshi', type: 'Emergency', from: '28 Feb', to: '1 Mar', days: 2, status: 'Rejected', approvedBy: 'Prof. R.K. Sharma' },
];

export const initialNotices = [
    { id: 1, title: 'Mid-Term Exam Schedule Released', content: 'Mid-term exams are scheduled from 20th April. Prepare accordingly.', date: '1 Apr 2026', target: 'All', priority: 'Important' },
    { id: 2, title: 'Faculty Meeting — 5th April, 3PM', content: 'All faculty must attend the meeting in the conference room.', date: '31 Mar 2026', target: 'Teachers Group', priority: 'Urgent' },
    { id: 3, title: 'Last date for fee submission: 15 April', content: 'Students must submit their fee by 15 April to avoid penalty.', date: '30 Mar 2026', target: 'Students Only', priority: 'Important' },
    { id: 4, title: 'Holiday on 14th April — Dr. Ambedkar Jayanti', content: 'The college will remain closed on 14th April.', date: '28 Mar 2026', target: 'All', priority: 'Normal' },
];

export const initialNotifications = [
    { id: 1, text: '🌿 Mr. Arun Kumar applied for Medical Leave (5–7 Apr)', time: '2 min ago', read: false },
    { id: 2, text: '⚠️ Arjun Rao attendance dropped below 75%', time: '30 min ago', read: false },
    { id: 3, text: '💰 Fee defaulter: Sneha Gupta — ₹40,000 pending', time: '1 hr ago', read: false },
    { id: 4, text: '📋 DSA result uploaded by Dr. Priya Verma', time: '2 hr ago', read: true },
    { id: 5, text: '🔔 3 new leave requests pending approval', time: '3 hr ago', read: true },
];

export const initialConversations = [
    { id: 1, name: 'Dr. Priya Verma', role: 'Teacher', last: 'Noted, will submit by Friday', time: '10:30 AM', msgs: [{ sent: false, text: 'Please submit the mid-term marks by this week.', time: 'Yesterday' }, { sent: true, text: 'Noted, will submit by Friday', time: '10:30 AM' }] },
    { id: 2, name: 'Dept. Principal', role: 'Admin', last: 'Meeting confirmed for 3PM', time: '9:00 AM', msgs: [{ sent: false, text: 'Faculty meeting today at 3PM, please confirm.', time: '9:00 AM' }, { sent: true, text: 'Meeting confirmed for 3PM', time: '9:15 AM' }] },
    { id: 3, name: 'Teachers Group', role: 'Group', last: 'Happy to help!', time: 'Yesterday', msgs: [{ sent: false, text: 'Please check the updated timetable.', time: 'Yesterday' }, { sent: true, text: 'All noted, thank you.', time: 'Yesterday' }] },
    { id: 4, name: 'CSE-3A Group', role: 'Group', last: 'Thank you Sir', time: '2 days ago', msgs: [{ sent: true, text: 'Mid-term exams start from 20th April. Be prepared!', time: '2 days ago' }, { sent: false, text: 'Thank you Sir', time: '2 days ago' }] },
    { id: 5, name: 'Aarav Singh', role: 'Student', last: 'Thank you sir!', time: 'Yesterday', msgs: [{ sent: false, text: 'Thank you sir for the scholarship guidance!', time: 'Yesterday' }] },
];

export const timetables = {
    'CSE-3A': [
        ['DSA\nDr.Priya', 'OS\nDr.Priya', 'DBMS\nMr.Arun', 'CN\nMr.Arun', 'SE\nMs.Neha', 'SE\nMs.Neha'],
        ['OS\nDr.Priya', 'DSA Lab\nDr.Priya', 'DSA Lab\nDr.Priya', 'SE\nMs.Neha', 'DBMS\nMr.Arun', 'DBMS\nMr.Arun'],
        ['CN\nMr.Arun', 'DBMS\nMr.Arun', 'DSA\nDr.Priya', 'OS\nDr.Priya', '—Free—', '—Free—'],
        ['SE\nMs.Neha', 'CN\nMr.Arun', 'OS\nDr.Priya', 'DSA\nDr.Priya', 'DBMS\nMr.Arun', 'DBMS\nMr.Arun'],
        ['DBMS\nMr.Arun', 'SE\nMs.Neha', 'CN Lab\nMr.Arun', 'CN Lab\nMr.Arun', 'DSA\nDr.Priya', 'DSA\nDr.Priya'],
    ],
    'CSE-3B': [
        ['DBMS\nMr.Arun', 'AI\nDr.Anita', 'OS\nDr.Priya', 'DSA\nDr.Priya', 'SE\nMs.Neha', 'SE\nMs.Neha'],
        ['AI\nDr.Anita', 'DBMS\nMr.Arun', 'SE\nMs.Neha', 'OS Lab\nDr.Priya', 'OS Lab\nDr.Priya', 'OS Lab\nDr.Priya'],
        ['OS\nDr.Priya', 'DSA\nDr.Priya', 'AI\nDr.Anita', 'DBMS\nMr.Arun', '—Free—', '—Free—'],
        ['SE\nMs.Neha', 'OS\nDr.Priya', 'DBMS\nMr.Arun', 'AI\nDr.Anita', 'DSA\nDr.Priya', 'DSA\nDr.Priya'],
        ['DSA\nDr.Priya', 'SE\nMs.Neha', 'DBMS Lab\nMr.Arun', 'DBMS Lab\nMr.Arun', 'AI\nDr.Anita', 'AI\nDr.Anita'],
    ],
    'CSE-2A': [
        ['Maths\nProf.Das', 'Physics\nFaculty', 'DSA\nDr.Priya', 'OS\nDr.Priya', 'Python\nMs.Neha', 'Python\nMs.Neha'],
        ['DSA\nDr.Priya', 'Maths\nProf.Das', 'Python\nMs.Neha', 'Physics\nFaculty', '—Free—', '—Free—'],
        ['Python\nMs.Neha', 'DSA\nDr.Priya', 'Maths\nProf.Das', 'OS\nDr.Priya', 'Physics\nFaculty', 'Physics\nFaculty'],
        ['OS\nDr.Priya', 'Python\nMs.Neha', 'DSA\nDr.Priya', 'Maths\nProf.Das', '—Free—', '—Free—'],
        ['Physics\nFaculty', 'OS\nDr.Priya', 'Python Lab\nMs.Neha', 'Python Lab\nMs.Neha', 'DSA\nDr.Priya', 'DSA\nDr.Priya'],
    ],
    'MCA-1': [
        ['Python\nMs.Neha', 'Stats\nProf.Das', 'DBMS\nMr.Arun', 'AI\nDr.Anita', 'SE\nMs.Neha', 'SE\nMs.Neha'],
        ['DBMS\nMr.Arun', 'Python\nMs.Neha', 'AI\nDr.Anita', 'Stats\nProf.Das', '—Free—', '—Free—'],
        ['AI\nDr.Anita', 'DBMS\nMr.Arun', 'Stats\nProf.Das', 'Python\nMs.Neha', 'SE\nMs.Neha', 'SE\nMs.Neha'],
        ['Stats\nProf.Das', 'SE\nMs.Neha', 'Python\nMs.Neha', 'DBMS\nMr.Arun', 'AI\nDr.Anita', 'AI\nDr.Anita'],
        ['SE\nMs.Neha', 'AI\nDr.Anita', 'DBMS Lab\nMr.Arun', 'DBMS Lab\nMr.Arun', 'Python\nMs.Neha', 'Python\nMs.Neha'],
    ],
};