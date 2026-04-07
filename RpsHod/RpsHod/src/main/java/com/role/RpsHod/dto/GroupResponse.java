package com.role.RpsHod.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupResponse {

    private Long id;          // ✅ group ka actual id
    private String groupName;
    private String userId;
    private String role;
    private String joinedAt;
}