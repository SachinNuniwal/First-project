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
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String teacherId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String dept;

    @ElementCollection
    private List<String> subjects;

    @ElementCollection
    private List<String> classes;

    private String designation;
    private String exp;
    private String email;
    private String status;
    private Integer leavesUsed;

    // Constructors
    public Teacher() {}

    public Teacher(String teacherId, String name, String dept, List<String> subjects, List<String> classes,
                   String designation, String exp, String email, String status, Integer leavesUsed) {
        this.teacherId = teacherId;
        this.name = name;
        this.dept = dept;
        this.subjects = subjects;
        this.classes = classes;
        this.designation = designation;
        this.exp = exp;
        this.email = email;
        this.status = status;
        this.leavesUsed = leavesUsed;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }

    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }

    public List<String> getClasses() { return classes; }
    public void setClasses(List<String> classes) { this.classes = classes; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getExp() { return exp; }
    public void setExp(String exp) { this.exp = exp; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getLeavesUsed() { return leavesUsed; }
    public void setLeavesUsed(Integer leavesUsed) { this.leavesUsed = leavesUsed; }
}