package com.rps.notification_service.Listener;

import com.rps.notification_service.Entity.Notification;
import com.rps.notification_service.Service.EmailService;
import com.rps.notification_service.Service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import tools.jackson.databind.ObjectMapper;


@Component
public class NotificationListener implements MessageListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private FirebaseService firebaseService;

    @Override
    public void onMessage(Message message, byte[] pattern) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            Notification notif = mapper.readValue(message.getBody(), Notification.class);

            // 🔥 In-app
            messagingTemplate.convertAndSend(
                    "/queue/notifications/" + notif.getUserId(),
                    notif
            );

            // 🔥 Email
            if ("EMAIL".equals(notif.getType())) {
                emailService.sendEmail(notif);
            }

            // 🔥 Push
            if ("PUSH".equals(notif.getType())) {
                firebaseService.sendPush(notif);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
