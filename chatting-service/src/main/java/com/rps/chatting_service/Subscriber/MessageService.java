package com.rps.chatting_service.Subscriber;

import com.rps.chatting_service.Entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class MessageService {
    @Autowired
    @Qualifier("hodClient")
    private WebClient hodClient;
    public  Boolean checkAuthority(ChatMessage message){
        return message.getRoles().equals("STUDENT");
    }
    public Boolean isGroupExists(String groupId) {
        try {
            HttpStatusCode status = hodClient.get()
                    .uri("/{groupId}", groupId)
                    .exchangeToMono(response -> Mono.just(response.statusCode()))
                    .block();
            System.out.println("The Value of the status code is as : "+status.value());
            return  status.value()==200;
        } catch (Exception e) {
            return false;
        }
    }
}
