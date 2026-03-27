package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import com.rps.chatting_service.Subscriber.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

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

    @MessageMapping("/chat_send")
    public void sendMessage(ChatMessage message) {
        if(messageService.checkAuthority(message)|| !(messageService.isGroupExists(message.getGroupId()))){
            throw new RuntimeException("NOT HAVE THE AUTHORITY FOR SEND THE MESSAGE");}
        message.setTimestamp(System.currentTimeMillis());

      // Message is Saved in DB
        ChatMessage saved = repo.save(message);
        // Manually Converting in json/String
        String json = objectMapper.writeValueAsString(saved);
        //  Here Publish to Redis
        redisTemplate.convertAndSend("chat-channel", json);
    }
}