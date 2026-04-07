package com.rps.notification_service.Service;

import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;

import com.rps.notification_service.Entity.Notification;

import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    public void sendPush(Notification notif) {

        Message message = Message.builder()
                .putData("message", notif.getMessage())
                .setTopic(notif.getUserId())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}