package com.role.RpsHod.serviceutility;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.role.RpsHod.entity.ClassEntity;
import com.role.RpsHod.entity.Student;
import com.role.RpsHod.entity.Teacher;
import com.role.RpsHod.service.ClassService;
import com.role.RpsHod.service.StudentService;
import com.role.RpsHod.service.TeacherService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ClassService classService;

    @Override
    public void run(String... args) throws Exception {
        if (teacherService.getAllTeachers().isEmpty()) {
            initializeTeachers();
        }
        if (studentService.getAllStudents().isEmpty()) {
            initializeStudents();
        }
        if (classService.getAllClasses().isEmpty()) {
            initializeClasses();
        }
    }

    private void initializeTeachers() {
        List<Teacher> teachers = Arrays.asList(
            new Teacher("TCH-4421", "Dr. Priya Verma", "CSE", Arrays.asList("DSA", "OS"), Arrays.asList("CSE-3A", "CSE-3B"), "Sr. Professor", "12 yrs", "priya@college.edu", "Active", 3),
            new Teacher("TCH-3812", "Mr. Arun Kumar", "CSE", Arrays.asList("DBMS", "CN"), Arrays.asList("CSE-2A", "CSE-3A"), "Professor", "8 yrs", "arun@college.edu", "Active", 1),
            new Teacher("TCH-4102", "Ms. Neha Singh", "CSE", Arrays.asList("SE", "Python"), Arrays.asList("MCA-1", "CSE-2A"), "Assistant Professor", "6 yrs", "neha@college.edu", "Active", 5),
            new Teacher("TCH-3560", "Prof. R.K. Das", "Maths", Arrays.asList("Maths", "Stats"), Arrays.asList("CSE-2A", "MCA-1"), "Professor", "15 yrs", "rkdas@college.edu", "Active", 2),
            new Teacher("TCH-4890", "Dr. Anita Joshi", "CSE", Arrays.asList("AI", "ML"), Arrays.asList("CSE-3B", "MCA-1"), "Associate Professor", "10 yrs", "anita@college.edu", "On Leave", 0)
        );
        teachers.forEach(teacherService::saveTeacher);
    }

    private void initializeStudents() {
        List<Student> students = Arrays.asList(
            new Student("2201001", "Aarav Singh", "CSE-3A", 8.9, 92, "M", "B.Tech", 4, new Student.Fee(80000, 80000)),
            new Student("2201002", "Priya Mehta", "CSE-3A", 7.8, 85, "F", "B.Tech", 4, new Student.Fee(80000, 60000)),
            new Student("2201003", "Rahul Sharma", "CSE-3A", 9.1, 95, "M", "B.Tech", 4, new Student.Fee(80000, 80000)),
            new Student("2201004", "Sneha Gupta", "CSE-3B", 7.2, 78, "F", "B.Tech", 4, new Student.Fee(80000, 40000)),
            new Student("2201005", "Arjun Rao", "CSE-3B", 5.8, 62, "M", "B.Tech", 4, new Student.Fee(80000, 20000)),
            new Student("2201006", "Kavya Nair", "CSE-3A", 8.4, 68, "F", "B.Tech", 4, new Student.Fee(80000, 80000)),
            new Student("2201007", "Vikram Tiwari", "CSE-2A", 7.6, 80, "M", "B.Tech", 4, new Student.Fee(75000, 75000)),
            new Student("2201008", "Ananya Sharma", "MCA-1", 8.8, 90, "F", "MCA", 3, new Student.Fee(90000, 90000)),
            new Student("2201009", "Rohan Verma", "CSE-2A", 6.5, 73, "M", "B.Tech", 4, new Student.Fee(75000, 50000)),
            new Student("2201010", "Mohit Batra", "CSE-3B", 7.0, 73, "M", "B.Tech", 4, new Student.Fee(80000, 80000))
        );
        students.forEach(studentService::saveStudent);
    }

    private void initializeClasses() {
        List<ClassEntity> classes = Arrays.asList(
            new ClassEntity("CSE-3A", "3rd Year", "Dr. Priya Verma", 42, 91, 8.4, "#00d4ff", Arrays.asList("DSA", "OS", "DBMS", "CN", "SE")),
            new ClassEntity("CSE-3B", "3rd Year", "Mr. Arun Kumar", 38, 81, 7.9, "#f0a500", Arrays.asList("DBMS", "AI", "OS", "SE")),
            new ClassEntity("CSE-2A", "2nd Year", "Ms. Neha Singh", 45, 84, 7.6, "#a855f7", Arrays.asList("Maths", "Physics", "DSA", "Python")),
            new ClassEntity("MCA-1", "1st Year", "Prof. R.K. Das", 30, 88, 8.5, "#39d353", Arrays.asList("Python", "Stats", "DBMS", "AI")),
            new ClassEntity("CSE-4A", "4th Year", "Dr. Anita Joshi", 40, 86, 8.1, "#ff7b29", Arrays.asList("AI", "ML", "Project"))
        );
        classes.forEach(classService::saveClass);
    }
}