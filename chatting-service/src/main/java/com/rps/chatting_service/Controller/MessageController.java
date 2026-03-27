package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class MessageController {

    @Autowired
    private MessageRepository repo;

    @GetMapping("/all_messages/{groupId}")
    public List<ChatMessage> getAllMessage(@PathVariable String groupId) {
        List<ChatMessage>  data=repo.findByGroupId(groupId);
        return  data;
    }
}
