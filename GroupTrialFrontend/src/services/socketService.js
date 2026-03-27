import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

class SocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connectPromise = null;
  }

  connect(userId) {
    if (this.client?.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    // WebSocket endpoint for real-time chat
    const websocketEndpoint = "http://localhost:8081/ws";

    this.client = new Client({
      webSocketFactory: () => new SockJS(websocketEndpoint),
      reconnectDelay: 5000,
      connectHeaders: { userId },
      debug: () => {}
    });

    this.connectPromise = new Promise((resolve, reject) => {
      this.client.onConnect = () => {
        console.log("SocketService: connected to STOMP server");
        this.connectPromise = null;
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error("SocketService STOMP error", frame);
        this.connectPromise = null;
        reject(new Error(frame.headers?.message || "STOMP connection failed."));
      };

      this.client.onWebSocketError = (event) => {
        console.error("SocketService WebSocket error", event);
        this.connectPromise = null;
        reject(new Error("WebSocket connection failed."));
      };

      this.client.onWebSocketClose = (event) => {
        console.warn("SocketService WebSocket closed", event);
      };
    });

    this.client.activate();
    console.log("SocketService: activating SockJS client", websocketEndpoint);
    return this.connectPromise;
  }

  isConnected() {
    return Boolean(this.client?.connected);
  }

  subscribeToGroup(groupId, onMessageReceived) {
    if (!this.client?.connected) {
      return () => {};
    }

    const normalizedGroupId = String(groupId);
    const destination = `/topic/chat/${normalizedGroupId}`;

    this.unsubscribeFromGroup(normalizedGroupId);

    const subscription = this.client.subscribe(destination, (frame) => {
      try {
        const payload = JSON.parse(frame.body);
        onMessageReceived(payload);
      } catch (error) {
        onMessageReceived({
          sender: "Unknown",
          content: frame.body,
          groupId: normalizedGroupId,
          timestamp: new Date().toISOString(),
          roles: "USER"
        });
      }
    });

    console.log(`SocketService: subscribed to group ${normalizedGroupId}`);
    this.subscriptions.set(normalizedGroupId, subscription);
    return () => this.unsubscribeFromGroup(normalizedGroupId);
  }

  unsubscribeFromGroup(groupId) {
    const subscription = this.subscriptions.get(String(groupId));
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(String(groupId));
    }
  }

  sendMessage(messagePayload) {
    if (!this.client?.connected) {
      console.warn("SocketService: sendMessage blocked, client not connected", messagePayload);
      throw new Error("WebSocket is not connected.");
    }

    const sendDestination = "/app/chat_send";
    console.log("SocketService: sending message", sendDestination, messagePayload);

    this.client.publish({
      destination: sendDestination,
      body: JSON.stringify(messagePayload)
    });
  }

  disconnect() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.connectPromise = null;
  }
}

export const socketService = new SocketService();
