import { useEffect, useState, useRef } from "react";
import {
    connectChat,
    disconnectChat,
    subscribeToGroup,
    publishMessage,
} from "../socket/chatSocket";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";

const Chat = ({ groupId, senderId, senderRole, token }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const subscriptionRef = useRef(null);
    const bottomRef = useRef(null);

    // 1. Fetch message history from REST
    useEffect(() => {
        if (!groupId) return;

        fetch(`${BASE_URL}/messages/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                // Handle MessagePageResponse format: { messages: [...], nextCursor, hasMore }
                const msgs = data.messages || (Array.isArray(data) ? data : []);
                setMessages(msgs.map(msg => ({
                    ...msg,
                    senderId: msg.sender // ✅ Map backend 'sender' to frontend 'senderId'
                })));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading message history:", err);
                setError("Could not load message history");
                setLoading(false);
            });
    }, [groupId, token]);

    // 2. Connect WebSocket + subscribe
    useEffect(() => {
        if (!groupId) return;

        connectChat({
            onConnected: () => {
                setConnected(true);

                // ✅ confirmed topic: /topic/chat/{groupId}
                subscriptionRef.current = subscribeToGroup(groupId, (msg) => {
                    setMessages((prev) => {
                        // Map backend 'sender' to frontend 'senderId'
                        const mappedMsg = { ...msg, senderId: msg.sender };
                        // Deduplicate using senderId + timestamp
                        const exists = prev.some(
                            (m) =>
                                m.senderId === mappedMsg.senderId &&
                                m.timestamp === mappedMsg.timestamp
                        );
                        return exists ? prev : [...prev, mappedMsg];
                    });
                });
            },
            onError: () => {
                setConnected(false);
                setError("WebSocket connection failed. Retrying...");
            },
        });

        return () => {
            subscriptionRef.current?.unsubscribe();
            disconnectChat();
        };
    }, [groupId]);

    // 3. Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !connected) return;

        // ✅ Map frontend senderId to backend 'sender'
        const messageData = {
            groupId,
            sender: senderId,           // ✅ backend uses 'sender'
            content: input,             // ✅ confirmed field name
            roles: senderRole,          // ✅ confirmed field name — used by checkAuthority()
        };

        // Optimistic update — show immediately without waiting for echo
        setMessages((prev) => [
            ...prev,
            { ...messageData, senderId: senderId, timestamp: Date.now() },
        ]);

        // ✅ sends to /app/chat_send
        publishMessage(messageData);
        setInput("");
    };

    // ─── Render ───────────────────────────────────────────────
    if (loading) return <div style={styles.center}>Loading messages...</div>;

    return (
        <div style={styles.container}>
            {/* Status bar */}
            <div style={{
                ...styles.statusBar,
                background: connected ? "#d4edda" : "#fff3cd",
                color: connected ? "#155724" : "#856404",
            }}>
                {connected ? "🟢 Connected" : "🟡 Connecting..."}
                {error && <span style={{ marginLeft: 12, color: "red" }}>{error}</span>}
            </div>

            {/* Messages */}
            <div style={styles.messageArea}>
                {messages.length === 0 && (
                    <div style={styles.empty}>No messages yet. Say hello! 👋</div>
                )}

                {messages.map((msg, i) => {
                    const isMine = String(msg.senderId) === String(senderId);
                    return (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: isMine ? "flex-end" : "flex-start",
                                marginBottom: 8,
                            }}
                        >
                            <div
                                style={{
                                    ...styles.bubble,
                                    background: isMine ? "#0084ff" : "#e4e6eb",
                                    color: isMine ? "white" : "black",
                                    borderRadius: isMine
                                        ? "18px 18px 4px 18px"
                                        : "18px 18px 18px 4px",
                                }}
                            >
                                {/* Show sender name for others' messages */}
                                {!isMine && (
                                    <div style={styles.senderName}>{msg.senderId}</div>
                                )}

                                {/* ✅ content is the confirmed field name */}
                                <div>{msg.content}</div>

                                <div style={styles.timestamp}>
                                    {msg.timestamp
                                        ? new Date(
                                            typeof msg.timestamp === "number"
                                                ? msg.timestamp          // epoch millis from backend
                                                : msg.timestamp          // ISO string from optimistic
                                        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                        : ""}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputRow}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={connected ? "Type a message..." : "Waiting for connection..."}
                    disabled={!connected}
                    style={styles.input}
                />
                <button
                    onClick={handleSend}
                    disabled={!connected || !input.trim()}
                    style={{
                        ...styles.btn,
                        opacity: !connected || !input.trim() ? 0.5 : 1,
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" },
    statusBar: { padding: "6px 16px", fontSize: 13, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center" },
    messageArea: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column" },
    empty: { textAlign: "center", color: "#aaa", marginTop: 40 },
    bubble: { maxWidth: "65%", padding: "10px 14px", fontSize: 14, wordBreak: "break-word" },
    senderName: { fontSize: 11, fontWeight: "bold", marginBottom: 4, opacity: 0.7 },
    timestamp: { fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: "right" },
    inputRow: { display: "flex", gap: 8, padding: 16, borderTop: "1px solid #ddd", background: "white" },
    input: { flex: 1, padding: "10px 16px", borderRadius: 24, border: "1px solid #ddd", fontSize: 14, outline: "none" },
    btn: { padding: "10px 20px", borderRadius: 24, background: "#0084ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#666" },
};

export default Chat;