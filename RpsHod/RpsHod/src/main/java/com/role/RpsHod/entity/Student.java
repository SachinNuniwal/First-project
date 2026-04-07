package com.role.RpsHod.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String className;

    private Double cgpa;
    private Integer attendance;
    private String gender;
    private String course;
    private Integer duration;

    @Embedded
    private Fee fee;

    // Constructors
    public Student() {}

    public Student(String studentId, String name, String className, Double cgpa, Integer attendance,
                   String gender, String course, Integer duration, Fee fee) {
        this.studentId = studentId;
        this.name = name;
        this.className = className;
        this.cgpa = cgpa;
        this.attendance = attendance;
        this.gender = gender;
        this.course = course;
        this.duration = duration;
        this.fee = fee;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Integer getAttendance() { return attendance; }
    public void setAttendance(Integer attendance) { this.attendance = attendance; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Fee getFee() { return fee; }
    public void setFee(Fee fee) { this.fee = fee; }

    @Embeddable
    public static class Fee {
        private Integer total;
        private Integer paid;

        public Fee() {}

        public Fee(Integer total, Integer paid) {
            this.total = total;
            this.paid = paid;
        }

        public Integer getTotal() { return total; }
        public void setTotal(Integer total) { this.total = total; }

        public Integer getPaid() { return paid; }
        public void setPaid(Integer paid) { this.paid = paid; }
    }
}