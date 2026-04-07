package com.role.RpsHod.service;


import com.role.RpsHod.dto.AddMemberRequest;
import com.role.RpsHod.entity.ChatGroup;
import com.role.RpsHod.entity.GroupMember;
import com.role.RpsHod.repository.GroupMemberRepo;
import com.role.RpsHod.repository.GroupRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class MessageService {
   @Autowired
   private GroupRepo groupRepo;
    @Autowired
    private GroupMemberRepo groupMemberRepo;
    public ResponseEntity<String> addMemberRequest(AddMemberRequest addMemberRequest){

        ChatGroup group = groupRepo.findById(addMemberRequest.getGroup_id())
                .orElseThrow(() -> new RuntimeException("Group Not Found"));

        GroupMember member = GroupMember.builder()
                .group(group)
                .userId(addMemberRequest.getStudent_id())
                .role(addMemberRequest.getRole())
                .groupName(group.getName())
                .build();

        groupMemberRepo.save(member);

        return ResponseEntity.ok("Member Saved");
    }



}
