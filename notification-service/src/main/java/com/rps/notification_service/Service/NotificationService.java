package com.rps.notification_service.Service;

import com.rps.notification_service.Entity.Notification;
import com.rps.notification_service.Repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Notification notification) {

        notification.setTimestamp(System.currentTimeMillis());
        repo.save(notification);

        // publish event
        redisTemplate.convertAndSend("notification-channel", notification);
    }

    public void deliverPendingNotifications(String userId) {
        List<Notification> pending = repo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !n.isRead())
                .toList();

        for (Notification notif : pending) {
            messagingTemplate.convertAndSend(
                    "/queue/notifications/" + userId,
                    notif
            );
        }
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        repo.findById(notificationId).ifPresent(notif -> {
            notif.setRead(true);
            repo.save(notif);
        });
    }

    public List<Notification> getUserNotifications(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }



}