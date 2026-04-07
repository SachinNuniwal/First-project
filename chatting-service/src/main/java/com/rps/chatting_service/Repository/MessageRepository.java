package com.rps.chatting_service.Repository;

import com.rps.chatting_service.Entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByGroupIdOrderByTimestampAsc(String groupId);

    List<ChatMessage> findByGroupIdAndTimestampGreaterThan(String groupId, LocalDateTime timestamp);

    List<ChatMessage> findByGroupId(String groupId);

    List<ChatMessage> findByGroupIdOrderByTimestampDesc(String groupId, Pageable pageable);

    List<ChatMessage> findByGroupIdAndTimestampBeforeOrderByTimestampDesc(
            String groupId,
            LocalDateTime timestamp,
            Pageable pageable
    );

    boolean existsByGroupIdAndTimestampBefore(String groupId, LocalDateTime timestamp);
}
