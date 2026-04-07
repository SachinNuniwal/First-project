package com.role.RpsHod.repository;

import com.role.RpsHod.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findByTeacherId(String teacherId);
}