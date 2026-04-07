package com.role.RpsHod.serviceutility;

import org.springframework.stereotype.Service;

@Service
public class ServiceUtility {

    public String cleanName(String name) {
        try {
            if (name != null && name.startsWith("{")) {
                return new com.fasterxml.jackson.databind.ObjectMapper()
                        .readTree(name)
                        .get("name")
                        .asText();
            }
        } catch (Exception e) {

        }
        return name;
    }
}
