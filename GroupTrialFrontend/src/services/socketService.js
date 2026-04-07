import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

class SocketService {
  constructor() {
    this.client = null;
    this.currentSubscription = null;
    this.currentGroupId = null;
    this.connectPromise = null;
  }

  connect(userId) {
    if (this.client?.connected) {
      return Promise.resolve();
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }

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
        console.error("SocketService: STOMP error", frame);
        this.connectPromise = null;
        reject(new Error(frame.headers?.message || "STOMP connection failed."));
      };
      this.client.onWebSocketError = (event) => {
        console.error("SocketService: WebSocket error", event);
        this.connectPromise = null;
        reject(new Error("WebSocket connection failed."));
      };
      this.client.onWebSocketClose = (event) => {
        console.warn("SocketService: WebSocket closed", event);
      };
    });

    this.client.activate();
    console.log("SocketService: activating SockJS client", websocketEndpoint);
    return this.connectPromise;
  }

  subscribeToGroup(groupId, callback) {
    if (!this.client?.connected) {
      console.warn("SocketService: Cannot subscribe, client not connected");
      return () => {};
    }

    // Always refresh the subscription callback. This avoids stale closures in
    // React StrictMode where effects are mounted/cleaned twice in development.
    this.unsubscribeFromGroup();

    const destination = `/topic/chat/${groupId}`;
    const subscription = this.client.subscribe(destination, (frame) => {
      let payload;
      try {
        payload = JSON.parse(frame.body);
      } catch {
        payload = { content: frame.body };
      }
      console.log("SocketService: MESSAGE RECEIVED:", payload);
      callback(payload);
    });
    this.currentSubscription = subscription;
    this.currentGroupId = groupId;
    console.log("SocketService: Successfully subscribed to", destination);

    return () => {
      if (this.currentSubscription !== subscription) {
        return;
      }

      subscription.unsubscribe();
      console.log("SocketService: Unsubscribed from", groupId);
      this.currentSubscription = null;
      this.currentGroupId = null;
    };
  }

  unsubscribeFromGroup() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      console.log("SocketService: Unsubscribed from", this.currentGroupId);
      this.currentSubscription = null;
      this.currentGroupId = null;
    }
  }

  disconnect() {
    this.unsubscribeFromGroup();
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.connectPromise = null;
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
}

export const socketService = new SocketService();
