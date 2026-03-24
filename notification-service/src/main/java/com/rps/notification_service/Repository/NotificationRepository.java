package com.rps.notification_service.Repository;

import com.rps.notification_service.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByTimestampDesc(String userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}