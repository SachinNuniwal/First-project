package com.role.RpsHod.service;

import com.role.RpsHod.entity.ClassEntity;
import com.role.RpsHod.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    public List<ClassEntity> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<ClassEntity> getClassById(Long id) {
        return classRepository.findById(id);
    }

    public ClassEntity getClassByName(String name) {
        return classRepository.findByName(name);
    }

    public ClassEntity saveClass(ClassEntity classEntity) {
        return classRepository.save(classEntity);
    }

    public void deleteClass(Long id) {
        classRepository.deleteById(id);
    }
}