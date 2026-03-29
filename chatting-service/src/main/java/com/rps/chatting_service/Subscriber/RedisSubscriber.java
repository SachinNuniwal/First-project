package com.rps.chatting_service.Subscriber;

import com.rps.chatting_service.Entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RedisSubscriber implements MessageListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {

        try {
            String json = new String(message.getBody());

            ChatMessage msg = objectMapper.readValue(json, ChatMessage.class);

            messagingTemplate.convertAndSend(
                    "/topic/chat/" + msg.getGroupId(),
                    msg
            );
    System.out.println("Message send this to websocket :"+json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
