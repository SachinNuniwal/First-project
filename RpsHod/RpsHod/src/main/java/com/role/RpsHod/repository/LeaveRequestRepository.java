package com.role.RpsHod.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.role.RpsHod.entity.LeaveRequest;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByStatus(String status);

    List<LeaveRequest> findByTeacherId(String teacherId);
}
