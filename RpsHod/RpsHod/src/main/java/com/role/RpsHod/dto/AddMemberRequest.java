package com.role.RpsHod.dto;

import com.role.RpsHod.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberRequest {
    private Long group_id;
    private String student_id;
    private Role role;
}
