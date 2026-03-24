package com.rps.chatting_service.Repository;

import com.rps.chatting_service.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByGroupIdOrderByTimestampAsc(String groupId);

    List<ChatMessage> findByGroupIdAndTimestampGreaterThan(String groupId, long timestamp);
}
