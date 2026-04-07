package com.rps.chatting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private String groupId;
    private String sender;
    private String content;
    private Long timestamp;
    private String roles;
}
