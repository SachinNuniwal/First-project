package com.role.RpsHod.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.role.RpsHod.entity.Teacher;
import com.role.RpsHod.service.TeacherService;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-id/{teacherId}")
    public ResponseEntity<Teacher> getTeacherByTeacherId(@PathVariable String teacherId) {
        Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
        return teacher != null ? ResponseEntity.ok(teacher) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        return teacherService.saveTeacher(teacher);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
        Optional<Teacher> teacherOptional = teacherService.getTeacherById(id);
        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            teacher.setName(teacherDetails.getName());
            teacher.setDept(teacherDetails.getDept());
            teacher.setSubjects(teacherDetails.getSubjects());
            teacher.setClasses(teacherDetails.getClasses());
            teacher.setDesignation(teacherDetails.getDesignation());
            teacher.setExp(teacherDetails.getExp());
            teacher.setEmail(teacherDetails.getEmail());
            teacher.setStatus(teacherDetails.getStatus());
            teacher.setLeavesUsed(teacherDetails.getLeavesUsed());
            return ResponseEntity.ok(teacherService.saveTeacher(teacher));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}