package com.rps.notification_service.Controller;

import com.rps.notification_service.Entity.Notification;
import com.rps.notification_service.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notify")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @PostMapping
    public String send(@RequestBody Notification notification) {

        service.sendNotification(notification);
        return "Notification Sent";
    }
}
