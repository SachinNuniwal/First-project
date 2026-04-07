package com.rps.chatting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessagePageResponse {
    private List<MessageDTO> messages;
    private Long nextCursor;
    private boolean hasMore;
}
