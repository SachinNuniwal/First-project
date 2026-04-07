package com.rps.chatting_service.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_message",
        indexes = {
                @Index(name = "idx_chat_message_group_ts", columnList = "group_id,timestamp DESC")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private String groupId;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false, columnDefinition = "BIGINT")
    @Convert(converter = EpochMillisConverter.class)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String roles;

    // getters/setters
}
