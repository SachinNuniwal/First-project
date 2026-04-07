package com.rps.chatting_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient hodClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8080/group")
                .build();
    }

}
