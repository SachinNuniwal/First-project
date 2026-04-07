package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import com.rps.chatting_service.Service.RedisChatCacheService;
import com.rps.chatting_service.Subscriber.MessageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@RestController
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private MessageRepository repo;

    @Autowired
    MessageService messageService;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    @Autowired
    private RedisChatCacheService redisChatCacheService;

    @MessageMapping("/chat_send")
    public void sendMessage(ChatMessage message) throws JsonProcessingException {
        if(messageService.checkAuthority(message)|| !(messageService.isGroupExists(message.getGroupId()))){
            throw new RuntimeException("NOT HAVE THE AUTHORITY FOR SEND THE MESSAGE");}
        message.setTimestamp(LocalDateTime.now(ZoneOffset.UTC));

      // Message is Saved in DB
        ChatMessage saved = repo.save(message);
        redisChatCacheService.addMessage(saved.getGroupId(), saved);
        // Manually Converting in json/String
        String json = objectMapper.writeValueAsString(saved);
        //  Here Publish to Redis
        redisTemplate.convertAndSend("chat-channel", json);
    }
}
