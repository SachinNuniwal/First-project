package com.rps.chatting_service.Service;

import com.rps.chatting_service.Entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class RedisChatCacheService {
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);
    private static final String KEY_PREFIX = "chat:group:";

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void addMessage(String groupId, ChatMessage message) {
        if (groupId == null || message == null || message.getTimestamp() == null) {
            return;
        }
        String key = buildKey(groupId);
        long score = toEpochMillis(message.getTimestamp());
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.opsForZSet().add(key, json, score);
            redisTemplate.expire(key, CACHE_TTL);
        } catch (Exception ignored) {
            // Cache is best-effort; do not fail the request if Redis serialization fails.
        }
    }

    public List<ChatMessage> getLatestMessages(String groupId, int limit) {
        if (groupId == null || limit <= 0) {
            return Collections.emptyList();
        }
        String key = buildKey(groupId);
        Set<String> values = redisTemplate.opsForZSet().reverseRange(key, 0, limit - 1);
        return parseMessages(values);
    }

    public List<ChatMessage> getMessagesBefore(String groupId, long cursorEpochMillis, int limit) {
        if (groupId == null || limit <= 0) {
            return Collections.emptyList();
        }
        String key = buildKey(groupId);
        double max = Math.max(cursorEpochMillis - 1, Long.MIN_VALUE);
        Set<String> values = redisTemplate.opsForZSet().reverseRangeByScore(
                key,
                Double.NEGATIVE_INFINITY,
                max,
                0,
                limit
        );
        return parseMessages(values);
    }

    private List<ChatMessage> parseMessages(Set<String> values) {
        if (values == null || values.isEmpty()) {
            return Collections.emptyList();
        }
        List<ChatMessage> messages = new ArrayList<>(values.size());
        for (String json : values) {
            if (json == null || json.isBlank()) {
                continue;
            }
            try {
                ChatMessage message = objectMapper.readValue(json, ChatMessage.class);
                messages.add(message);
            } catch (Exception ignored) {
                // Skip malformed entries.
            }
        }
        return messages;
    }

    private String buildKey(String groupId) {
        return KEY_PREFIX + groupId;
    }

    private long toEpochMillis(LocalDateTime timestamp) {
        return timestamp.toInstant(ZoneOffset.UTC).toEpochMilli();
    }
}
