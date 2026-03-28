package com.rps.chatting_service.Controller;

import com.rps.chatting_service.Service.ChatMessageQueryService;
import com.rps.chatting_service.dto.MessagePageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class MessageController {

    @Autowired
    private ChatMessageQueryService chatMessageQueryService;

    @GetMapping("/messages/{groupId}")
    public MessagePageResponse getMessages(
            @PathVariable String groupId,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Long cursor
    ) {
        return chatMessageQueryService.getMessages(groupId, limit, cursor);
    }
}
