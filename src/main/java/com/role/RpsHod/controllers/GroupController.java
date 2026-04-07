package com.role.RpsHod.controllers;


import com.role.RpsHod.dto.GroupResponse;
import com.role.RpsHod.entity.ChatGroup;
import com.role.RpsHod.entity.GroupMember;
import com.role.RpsHod.repository.GroupMemberRepo;
import com.role.RpsHod.repository.GroupRepo;
import com.role.RpsHod.service.MessageService;
import com.role.RpsHod.serviceutility.ServiceUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = {"http://localhost:5173"
,"http://localhost:5174"})
@RestController
@RequestMapping("/group")
public class GroupController {
    private GroupRepo groupRepo;
    @Autowired
    private MessageService messageService;
    @Autowired
    private GroupMemberRepo groupMemberRepo;
    @Autowired
    private ServiceUtility serviceUtility;

    public GroupController(GroupRepo groupRepo) {
        this.groupRepo = groupRepo;
    }

    @PostMapping("/create_group")
    public ResponseEntity<ChatGroup> createGroup(@RequestBody String name) {

        ChatGroup group = new ChatGroup();
        group.setName(name);

        ChatGroup saved = groupRepo.save(group);

        return ResponseEntity.ok(saved); // ✅ return full object with ID
    }

    @GetMapping("/{groupId}")
    public  ResponseEntity<String> getGroupById(@PathVariable Long groupId){
        ChatGroup  group=groupRepo.findById(groupId).orElse(null);
        if(group!=null){
            return  ResponseEntity.ok("Yes Group Is Valid ");
        }else {
            return  ResponseEntity.noContent().build();
        }
    }


    @GetMapping("/by_id/{userId}")
    public List<GroupResponse> getGroupsByUserId(@PathVariable String userId) {

        List<GroupMember> list = groupMemberRepo.findByUserId(userId);

        return list.stream().map(member -> {

            return GroupResponse.builder()
                    .id(member.getGroup().getId())
                    .groupName(serviceUtility.cleanName(member.getGroup().getName()))
                    .userId(member.getUserId())
                    .role(member.getRole().name())
                    .joinedAt(
                            member.getJoinedAt() != null
                                    ? member.getJoinedAt().toString()
                                    : null
                    )
                    .build();

        }).toList();
    }

    @GetMapping("/get_all_groups")
    public ResponseEntity<List<ChatGroup>>  getAllGroups(){
        return ResponseEntity.ok(groupRepo.findAll());
    }



}
