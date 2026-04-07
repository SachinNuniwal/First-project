package com.rps.notification_service.Controller;

import com.rps.notification_service.Entity.Notification;
import com.rps.notification_service.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationQueryController {

    @Autowired
    private NotificationRepository repo;

    @GetMapping("/{userId}")
    public List<Notification> get(@PathVariable String userId) {
        return repo.findByUserIdOrderByTimestampDesc(userId);
    }
}