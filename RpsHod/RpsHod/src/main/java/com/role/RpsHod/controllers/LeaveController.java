package com.role.RpsHod.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.role.RpsHod.entity.LeaveRequest;
import com.role.RpsHod.repository.LeaveRequestRepository;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    // Teacher — leave apply karo
    @PostMapping
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequest leave) {
        leave.setStatus("PENDING");
        leave.setApprovedBy(null);
        return ResponseEntity.ok(leaveRepo.save(leave));
    }

    // Admin — sabhi pending leaves dekho
    @GetMapping("/pending")
    public List<LeaveRequest> getPending() {
        return leaveRepo.findByStatus("PENDING");
    }

    // Admin — sabhi leaves dekho
    @GetMapping
    public List<LeaveRequest> getAll() {
        return leaveRepo.findAll();
    }

    // Teacher — apni leaves dekho
    @GetMapping("/teacher/{teacherId}")
    public List<LeaveRequest> getByTeacher(@PathVariable String teacherId) {
        return leaveRepo.findByTeacherId(teacherId);
    }

    // Admin — leave approve karo
    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approve(@PathVariable Long id, @RequestParam String approvedBy) {
        return leaveRepo.findById(id).map(leave -> {
            leave.setStatus("APPROVED");
            leave.setApprovedBy(approvedBy);
            return ResponseEntity.ok(leaveRepo.save(leave));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin — leave reject karo
    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequest> reject(@PathVariable Long id, @RequestParam String approvedBy) {
        return leaveRepo.findById(id).map(leave -> {
            leave.setStatus("REJECTED");
            leave.setApprovedBy(approvedBy);
            return ResponseEntity.ok(leaveRepo.save(leave));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Leave delete karo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaveRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
