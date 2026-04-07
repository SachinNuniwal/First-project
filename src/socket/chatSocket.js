import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";

let stompClient = null;

export const connectChat = ({ onConnected, onError }) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`), // ✅ confirmed /ws
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("✅ STOMP connected");
            onConnected?.();
        },
        onStompError: (frame) => {
            console.error("❌ STOMP error:", frame);
            onError?.(frame);
        },
    });

    stompClient.activate();
};

export const disconnectChat = () => stompClient?.deactivate();

export const subscribeToGroup = (groupId, onMessage) => {
    if (!stompClient?.connected) return null;

    // ⚠️ Update this topic after checking RedisSubscriber.java
    return stompClient.subscribe(`/topic/chat/${groupId}`, (frame) => {
        try {
            onMessage(JSON.parse(frame.body));
        } catch (e) {
            console.error("Parse error:", e);
        }
    });
};

export const publishMessage = (messageData) => {
    if (!stompClient?.connected) return;

    stompClient.publish({
        destination: "/app/chat_send", // ✅ confirmed from @MessageMapping("/chat_send")
        body: JSON.stringify(messageData),
    });
};