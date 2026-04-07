package com.role.RpsHod.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "classes")
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "class_year")
    private String year;
    private String teacher;
    private Integer students;
    private Integer attendance;
    private Double cgpa;
    private String color;

    @ElementCollection
    private List<String> subjects;

    // Constructors
    public ClassEntity() {}

    public ClassEntity(String name, String year, String teacher, Integer students, Integer attendance,
                       Double cgpa, String color, List<String> subjects) {
        this.name = name;
        this.year = year;
        this.teacher = teacher;
        this.students = students;
        this.attendance = attendance;
        this.cgpa = cgpa;
        this.color = color;
        this.subjects = subjects;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getTeacher() { return teacher; }
    public void setTeacher(String teacher) { this.teacher = teacher; }

    public Integer getStudents() { return students; }
    public void setStudents(Integer students) { this.students = students; }

    public Integer getAttendance() { return attendance; }
    public void setAttendance(Integer attendance) { this.attendance = attendance; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }
}