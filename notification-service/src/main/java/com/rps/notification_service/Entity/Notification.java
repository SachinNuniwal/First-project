package com.rps.notification_service.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String message;
    private String type;

    // Use "read" as the field name, JPA maps it correctly
    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private long timestamp;



}