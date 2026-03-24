package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Entity.ChatMessage;
import com.rps.chatting_service.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository repo;

    @GetMapping("/{groupId}")
    public List<ChatMessage> getMessages(
            @PathVariable String groupId,
            @RequestParam(required = false) Long after
    ) {
        if (after != null) {
            return repo.findByGroupIdAndTimestampGreaterThan(groupId, after);
        }
        return repo.findByGroupIdOrderByTimestampAsc(groupId);
    }
}
