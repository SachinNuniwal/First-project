import { useEffect, useState, useRef } from "react";
import { useTheme } from '../context/ThemeContext';
import {
    connectChat,
    disconnectChat,
    subscribeToGroup,
    publishMessage,
} from "../socket/chatSocket";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";

const Chat = ({ groupId, senderId, senderRole, token }) => {
    const { isDark } = useTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const subscriptionRef = useRef(null);
    const bottomRef = useRef(null);

    // Theme colors
    const themeStyles = {
        container: isDark ? '#0d1117' : '#ffffff',
        messageArea: isDark ? '#0d1117' : '#f5f5f5',
        textPrimary: isDark ? '#e6edf3' : '#24292f',
        textSecondary: isDark ? '#8b949e' : '#57606a',
        border: isDark ? '#30363d' : '#d0d7de',
        inputBg: isDark ? '#1c2333' : '#ffffff',
        bubble: {
            mine: '#0084ff',
            theirs: isDark ? '#1c2333' : '#e4e6eb',
            textMine: '#ffffff',
            textTheirs: isDark ? '#e6edf3' : '#000000'
        }
    };

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
                const msgs = data.messages || (Array.isArray(data) ? data : []);
                setMessages(msgs.map(msg => ({
                    ...msg,
                    senderId: msg.sender
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

                subscriptionRef.current = subscribeToGroup(groupId, (msg) => {
                    setMessages((prev) => {
                        const mappedMsg = { ...msg, senderId: msg.sender };
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

        const messageData = {
            groupId,
            sender: senderId,
            content: input,
            roles: senderRole,
        };

        setMessages((prev) => [
            ...prev,
            { ...messageData, senderId: senderId, timestamp: Date.now() },
        ]);

        publishMessage(messageData);
        setInput("");
    };

    // ─── Render ───────────────────────────────────────────────
    if (loading) return (
        <div style={{...styles.center, backgroundColor: themeStyles.container, color: themeStyles.textPrimary}}>
            Loading messages...
        </div>
    );

    return (
        <div style={{
            ...styles.container,
            backgroundColor: themeStyles.container
        }}>
            {/* Status bar */}
            <div style={{
                ...styles.statusBar,
                background: connected ? "#d4edda" : "#fff3cd",
                color: connected ? "#155724" : "#856404",
                borderBottomColor: themeStyles.border,
            }}>
                {connected ? "🟢 Connected" : "🟡 Connecting..."}
                {error && <span style={{ marginLeft: 12, color: "red" }}>{error}</span>}
            </div>

            {/* Messages */}
            <div style={{
                ...styles.messageArea,
                backgroundColor: themeStyles.messageArea
            }}>
                {messages.length === 0 && (
                    <div style={{...styles.empty, color: themeStyles.textSecondary}}>No messages yet. Say hello! 👋</div>
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
                                    background: isMine ? themeStyles.bubble.mine : themeStyles.bubble.theirs,
                                    color: isMine ? themeStyles.bubble.textMine : themeStyles.bubble.textTheirs,
                                    borderRadius: isMine
                                        ? "18px 18px 4px 18px"
                                        : "18px 18px 18px 4px",
                                }}
                            >
                                {!isMine && (
                                    <div style={{...styles.senderName, opacity: 0.7}}>{msg.senderId}</div>
                                )}

                                <div>{msg.content}</div>

                                <div style={{...styles.timestamp, opacity: 0.6}}>
                                    {msg.timestamp
                                        ? new Date(
                                            typeof msg.timestamp === "number"
                                                ? msg.timestamp
                                                : msg.timestamp
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
            <div style={{
                ...styles.inputRow,
                backgroundColor: themeStyles.inputBg,
                borderTopColor: themeStyles.border
            }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={connected ? "Type a message..." : "Waiting for connection..."}
                    disabled={!connected}
                    style={{
                        ...styles.input,
                        backgroundColor: isDark ? '#1c2333' : '#ffffff',
                        color: themeStyles.textPrimary,
                        borderColor: themeStyles.border
                    }}
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
    container: { display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif", transition: 'background-color 0.3s' },
    statusBar: { padding: "6px 16px", fontSize: 13, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center" },
    messageArea: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", transition: 'background-color 0.3s' },
    empty: { textAlign: "center", marginTop: 40 },
    bubble: { maxWidth: "65%", padding: "10px 14px", fontSize: 14, wordBreak: "break-word" },
    senderName: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
    timestamp: { fontSize: 10, marginTop: 4, textAlign: "right" },
    inputRow: { display: "flex", gap: 8, padding: 16, borderTop: "1px solid #ddd", transition: 'background-color 0.3s' },
    input: { flex: 1, padding: "10px 16px", borderRadius: 24, border: "1px solid #ddd", fontSize: 14, outline: "none", transition: 'background-color 0.3s, color 0.3s' },
    btn: { padding: "10px 20px", borderRadius: 24, background: "#0084ff", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", transition: 'background-color 0.3s, color 0.3s' },
};

export default Chat;