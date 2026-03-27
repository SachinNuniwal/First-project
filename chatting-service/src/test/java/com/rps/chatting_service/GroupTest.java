package com.rps.chatting_service;

import com.rps.chatting_service.Subscriber.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@SpringBootTest
public class GroupTest {
    @Autowired
    @Qualifier("hodClient")
    private WebClient hodClient;

    @Autowired
    private MessageService messageService;
    @Test
    public  void hodClientTest(){
        System.out.println("Is Group Exist : "+messageService.isGroupExists(""));
    }
}
