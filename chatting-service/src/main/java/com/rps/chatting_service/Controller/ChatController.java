package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    @Autowired
    private MessageRepository repo;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {

        message.setTimestamp(System.currentTimeMillis());

        // ✅ Save in DB
        ChatMessage saved = repo.save(message);

        // ✅ Publish to Redis
        redisTemplate.convertAndSend("chat-channel", saved);
    }
}