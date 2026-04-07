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

import com.role.RpsHod.entity.ClassEntity;
import com.role.RpsHod.service.ClassService;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    public List<ClassEntity> getAllClasses() {
        return classService.getAllClasses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassEntity> getClassById(@PathVariable Long id) {
        Optional<ClassEntity> classEntity = classService.getClassById(id);
        return classEntity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<ClassEntity> getClassByName(@PathVariable String name) {
        ClassEntity classEntity = classService.getClassByName(name);
        return classEntity != null ? ResponseEntity.ok(classEntity) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ClassEntity createClass(@RequestBody ClassEntity classEntity) {
        return classService.saveClass(classEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassEntity> updateClass(@PathVariable Long id, @RequestBody ClassEntity classDetails) {
        Optional<ClassEntity> classOptional = classService.getClassById(id);
        if (classOptional.isPresent()) {
            ClassEntity classEntity = classOptional.get();
            classEntity.setName(classDetails.getName());
            classEntity.setYear(classDetails.getYear());
            classEntity.setTeacher(classDetails.getTeacher());
            classEntity.setStudents(classDetails.getStudents());
            classEntity.setAttendance(classDetails.getAttendance());
            classEntity.setCgpa(classDetails.getCgpa());
            classEntity.setColor(classDetails.getColor());
            classEntity.setSubjects(classDetails.getSubjects());
            return ResponseEntity.ok(classService.saveClass(classEntity));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}