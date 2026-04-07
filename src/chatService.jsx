import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081'; // ✅ Correct port
const stompClients = new Map();
const messageQueues = new Map();

export const connectChat = (groupId, onMessage, onError = () => {}) => {
    if (stompClients.has(groupId)) {
        console.log(`Already connected to group ${groupId}`);
        return;
    }

    const client = new Client({
        webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
        onConnect: () => {
            console.log(`Connected to group ${groupId}!`);
            client.subscribe(`/topic/chat/${groupId}`, (msg) => {
                try {
                    onMessage(JSON.parse(msg.body));
                } catch (e) {
                    console.error('Error parsing message:', e);
                    onError(e);
                }
            });
            // Send any queued messages
            const queue = messageQueues.get(groupId);
            if (queue && queue.length > 0) {
                queue.forEach(msg => {
                    try {
                        client.publish({
                            destination: '/app/chat_send',
                            body: JSON.stringify({ groupId, ...msg })
                        });
                    } catch (e) {
                        console.error('Error sending queued message:', e);
                    }
                });
                messageQueues.delete(groupId);
                console.log(`Sent ${queue.length} queued messages for group ${groupId}`);
            }
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame);
            onError(frame);
        },
        onWebSocketError: (event) => {
            console.error('WebSocket error:', event);
            onError(event);
        },
        onDisconnect: () => {
            console.log(`Disconnected from group ${groupId}`);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClients.set(groupId, client);
    client.activate();
};

export const sendChatMessage = ({ groupId, sender, content, roles }) => {
    const client = stompClients.get(groupId);
    if (!client?.connected) {
        // Queue the message
        if (!messageQueues.has(groupId)) messageQueues.set(groupId, []);
        messageQueues.get(groupId).push({ sender, content, roles });
        console.log(`Message queued for group ${groupId}`);
        return false;
    }
    try {
        client.publish({
            destination: '/app/chat_send',
            body: JSON.stringify({ groupId, sender, content, roles })
        });
        return true;
    } catch (e) {
        console.error('Error sending message:', e);
        // Queue it
        if (!messageQueues.has(groupId)) messageQueues.set(groupId, []);
        messageQueues.get(groupId).push({ sender, content, roles });
        return false;
    }
};

export const disconnectChat = (groupId) => {
    const client = stompClients.get(groupId);
    if (client) {
        client.deactivate();
        stompClients.delete(groupId);
        // Optionally clear queue on disconnect
        messageQueues.delete(groupId);
        console.log(`Disconnected from group ${groupId} and cleared queue`);
    }
};

export const isConnected = (groupId) => {
    const client = stompClients.get(groupId);
    return client?.connected || false;
};