package com.role.RpsHod.controllers;

import com.role.RpsHod.dto.AddMemberRequest;
import com.role.RpsHod.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("group_member")
public class MemberController {
    @Autowired
    private MessageService messageService;
    @PostMapping
    public ResponseEntity<String> addMember(@RequestBody AddMemberRequest addMemberRequest){
        try{
            return  messageService.addMemberRequest(addMemberRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Sorry Some Issue Occured " +e.getMessage());
        }
    }


    // This endpoint is temporary it   just for create a fake login
    @GetMapping("/check_user_exists/{userId}")
    public  ResponseEntity<String> check(@PathVariable String userId){
        System.out.println("USer Call me Name is : "+userId);

        return ResponseEntity.ok("Everything ok ");
    }

}
