package com.rps.notification_service.Service;

import com.rps.notification_service.Entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(Notification notif) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(notif.getUserId()); // assume email
        msg.setSubject("Notification");
        msg.setText(notif.getMessage());

        mailSender.send(msg);
    }
}
