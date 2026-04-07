package com.rps.chatting_service.Service;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import com.rps.chatting_service.dto.MessageDTO;
import com.rps.chatting_service.dto.MessagePageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class ChatMessageQueryService {
    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 100;
    private static final int DB_FETCH_MULTIPLIER = 2;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private RedisChatCacheService redisChatCacheService;

    public MessagePageResponse getMessages(String groupId, Integer limit, Long cursor) {
        int pageSize = sanitizeLimit(limit);
        LocalDateTime cursorTime = cursor != null ? toLocalDateTime(cursor) : null;

        List<ChatMessage> redisMessages = (cursorTime == null)
                ? redisChatCacheService.getLatestMessages(groupId, pageSize)
                : redisChatCacheService.getMessagesBefore(groupId, cursor, pageSize);

        Map<String, ChatMessage> unique = new HashMap<>();
        List<ChatMessage> combined = new ArrayList<>();
        addUniqueMessages(redisMessages, unique, combined);

        if (combined.size() < pageSize) {
            int dbLimit = Math.min(pageSize * DB_FETCH_MULTIPLIER, MAX_LIMIT);
            List<ChatMessage> dbMessages = (cursorTime == null)
                    ? messageRepository.findByGroupIdOrderByTimestampDesc(groupId, PageRequest.of(0, dbLimit))
                    : messageRepository.findByGroupIdAndTimestampBeforeOrderByTimestampDesc(
                            groupId,
                            cursorTime,
                            PageRequest.of(0, dbLimit)
                    );
            addUniqueMessages(dbMessages, unique, combined);
        }

        combined.sort(Comparator.comparing(ChatMessage::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())));
        if (combined.size() > pageSize) {
            combined = combined.subList(0, pageSize);
        }
        Collections.reverse(combined);

        List<MessageDTO> dtoList = new ArrayList<>(combined.size());
        for (ChatMessage message : combined) {
            dtoList.add(toDto(message));
        }

        Long nextCursor = null;
        boolean hasMore = false;
        if (!combined.isEmpty()) {
            ChatMessage oldest = combined.get(0);
            if (oldest.getTimestamp() != null) {
                nextCursor = toEpochMillis(oldest.getTimestamp());
                hasMore = messageRepository.existsByGroupIdAndTimestampBefore(groupId, oldest.getTimestamp());
            }
        }

        return new MessagePageResponse(dtoList, nextCursor, hasMore);
    }

    private void addUniqueMessages(List<ChatMessage> messages,
                                   Map<String, ChatMessage> unique,
                                   List<ChatMessage> target) {
        if (messages == null || messages.isEmpty()) {
            return;
        }
        for (ChatMessage message : messages) {
            if (message == null) {
                continue;
            }
            String key = buildKey(message);
            if (!unique.containsKey(key)) {
                unique.put(key, message);
                target.add(message);
            }
        }
    }

    private String buildKey(ChatMessage message) {
        if (message.getId() != null) {
            return "id:" + message.getId();
        }
        return "sig:" + message.getGroupId() + ":" + message.getSender() + ":" + message.getTimestamp();
    }

    private MessageDTO toDto(ChatMessage message) {
        return new MessageDTO(
                message.getId(),
                message.getGroupId(),
                message.getSender(),
                message.getContent(),
                message.getTimestamp() == null ? null : toEpochMillis(message.getTimestamp()),
                message.getRoles()
        );
    }

    private int sanitizeLimit(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }

    private LocalDateTime toLocalDateTime(long epochMillis) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneOffset.UTC);
    }

    private long toEpochMillis(LocalDateTime timestamp) {
        return timestamp.toInstant(ZoneOffset.UTC).toEpochMilli();
    }
}
