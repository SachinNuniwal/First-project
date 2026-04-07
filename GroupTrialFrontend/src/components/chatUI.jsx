/**
 * ChatUI.jsx — College ERP Real-time Chat
 *
 * Props:
 *   currentUser  → { id, name, role, token }
 *                  role: 'admin' | 'teacher' | 'student'
 *   groups       → array from api.getChatGroupsByMember(currentUser.id)
 *
 * Internally uses:
 *   chatApi.fetchMessages(groupId, token)   — REST history (last 50)
 *   WebSocket  ws://localhost:8081/ws/chat?token=...&groupId=...
 *
 * Drop-in usage:
 *   <ChatUI currentUser={user} groups={myGroups} />
 *
 * ─── WS Message Protocol (expected from backend) ──────────────────────────────
 *   Incoming:
 *     { type: "MESSAGE",  payload: { id, groupId, senderId, senderName,
 *                                    senderRole, text, timestamp, readBy[] } }
 *     { type: "TYPING",   payload: { groupId, senderId, senderName } }
 *     { type: "READ",     payload: { groupId, userId } }
 *
 *   Outgoing:
 *     { type: "TYPING",   payload: { groupId, senderId, senderName } }
 *     { type: "MESSAGE",  payload: <saved message from REST> }  ← broadcast after send
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── CHAT API ──────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8081";
const WS_BASE = "ws://localhost:8081/ws/chat";

export const fetchMessages = async (groupId, token) => {
    const res = await fetch(`${BASE_URL}/api/chat/messages/${groupId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data.slice(-50) : [];
};

const sendMessageApi = async (payload, token) => {
    const res = await fetch(`${BASE_URL}/api/chat/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to send: ${res.status}`);
    return res.json();
};

const markReadApi = (groupId, token) =>
    fetch(`${BASE_URL}/api/chat/messages/${groupId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { });

// ─── WEBSOCKET HOOK ────────────────────────────────────────────────────────────
function useGroupSocket({ token, activeGroupId, onMessage, onStatusChange }) {
    const wsRef = useRef(null);
    const retryRef = useRef(null);
    const cbRef = useRef(onMessage);
    cbRef.current = onMessage;

    const connect = useCallback(() => {
        if (!token || !activeGroupId) return;
        wsRef.current?.close();
        clearTimeout(retryRef.current);

        const ws = new WebSocket(`${WS_BASE}?token=${token}&groupId=${activeGroupId}`);
        wsRef.current = ws;

        ws.onopen = () => onStatusChange("connected");
        ws.onclose = () => {
            onStatusChange("disconnected");
            retryRef.current = setTimeout(connect, 3500);
        };
        ws.onerror = () => onStatusChange("error");
        ws.onmessage = (e) => { try { cbRef.current(JSON.parse(e.data)); } catch { } };
    }, [token, activeGroupId]);           // eslint-disable-line

    useEffect(() => { connect(); return () => { clearTimeout(retryRef.current); wsRef.current?.close(); }; }, [connect]);

    const send = useCallback((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN)
            wsRef.current.send(JSON.stringify(data));
    }, []);

    return send;
}

// ─── CONSTANTS / HELPERS ──────────────────────────────────────────────────────
const PALETTE = ["#e63946", "#2a9d8f", "#e9c46a", "#f4a261", "#264653", "#457b9d", "#6d6875", "#b5838d", "#e07a5f", "#52b788"];
const avatarColor = (id = "") => PALETTE[(id.charCodeAt(id.length - 1) || 0) % PALETTE.length];
const getInitials = (n = "") => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

const fmtDivider = (ts) => {
    const d = new Date(ts), t = new Date(), y = new Date(t);
    y.setDate(t.getDate() - 1);
    if (d.toDateString() === t.toDateString()) return "Today";
    if (d.toDateString() === y.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
};

const needsDivider = (msgs, i) =>
    i === 0 || new Date(msgs[i - 1].timestamp).toDateString() !== new Date(msgs[i].timestamp).toDateString();

const isLastInCluster = (msgs, i) =>
    i === msgs.length - 1 || msgs[i].senderId !== msgs[i + 1].senderId;

const GROUP_ICON = { class: "🎓", department: "🏛️", broadcast: "📢" };
const GROUP_LABEL = { class: "Class", department: "Dept", broadcast: "Broadcast" };
const ROLE_BADGE = { admin: "Admin", teacher: "Faculty", student: "Student" };

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Avatar({ name, id, size = 36 }) {
    const bg = avatarColor(id);
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background: bg, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: size * 0.35, fontWeight: 700,
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em", userSelect: "none",
            boxShadow: `0 0 0 2px #111118, 0 0 0 3.5px ${bg}55`,
        }}>{getInitials(name)}</div>
    );
}

function StatusDot({ status }) {
    const C = { connected: "#2a9d8f", disconnected: "#555", error: "#e9c46a" };
    const L = { connected: "Live", disconnected: "Reconnecting…", error: "Error" };
    return (
        <span style={{
            display: "flex", alignItems: "center", gap: 5, fontSize: 10.5,
            color: C[status] || "#555", fontFamily: "'DM Mono', monospace"
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: "50%", background: C[status] || "#555",
                display: "inline-block",
                boxShadow: status === "connected" ? `0 0 5px ${C.connected}` : "none",
                animation: status === "connected" ? "pulse 2.5s infinite" : "none",
            }} />
            {L[status]}
        </span>
    );
}

function GroupRow({ group, isActive, unread, onClick }) {
    return (
        <button onClick={onClick} className="group-row" style={{
            width: "100%", border: "none", cursor: "pointer", textAlign: "left",
            background: isActive ? "rgba(42,157,143,0.11)" : "transparent",
            borderLeft: isActive ? "3px solid #2a9d8f" : "3px solid transparent",
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
            transition: "background 0.14s",
        }}>
            <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: isActive ? "rgba(42,157,143,0.18)" : "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                border: isActive ? "1px solid #2a9d8f33" : "1px solid transparent",
                transition: "all 0.14s",
            }}>{GROUP_ICON[group.type] || "💬"}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                    <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 12.5, fontWeight: 600,
                        color: isActive ? "#2a9d8f" : "#d0d0d0",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{group.name}</span>
                    {unread > 0 && (
                        <span style={{
                            minWidth: 17, height: 17, borderRadius: 9, background: "#e63946",
                            color: "#fff", fontSize: 9.5, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: "0 4px", flexShrink: 0,
                            fontFamily: "'DM Mono', monospace",
                        }}>{unread}</span>
                    )}
                </div>
                <span style={{
                    fontSize: 10, color: "#3a3a5a", fontFamily: "'DM Mono', monospace",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                }}>{GROUP_LABEL[group.type]}</span>
            </div>
        </button>
    );
}

function DateDivider({ label }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 12px" }}>
            <div style={{ flex: 1, height: 1, background: "#1a1a28" }} />
            <span style={{
                fontSize: 9.5, fontFamily: "'DM Mono', monospace", color: "#3a3a5a",
                letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "3px 10px", border: "1px solid #1e1e2e", borderRadius: 20,
            }}>{label}</span>
            <div style={{ flex: 1, height: 1, background: "#1a1a28" }} />
        </div>
    );
}

function Bubble({ msg, isMine, showAvatar }) {
    return (
        <div style={{
            display: "flex", flexDirection: isMine ? "row-reverse" : "row",
            alignItems: "flex-end", gap: 7, marginBottom: 2,
            animation: "msgIn 0.16s ease-out",
        }}>
            {/* Avatar slot — always 30px wide to keep alignment */}
            <div style={{ width: 30, flexShrink: 0 }}>
                {!isMine && showAvatar && <Avatar name={msg.senderName} id={msg.senderId} size={28} />}
            </div>

            <div style={{ maxWidth: "66%" }}>
                {/* Sender name (first of cluster, others only) */}
                {!isMine && showAvatar && (
                    <div style={{
                        fontSize: 10.5, marginBottom: 3, paddingLeft: 1,
                        fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
                        color: avatarColor(msg.senderId),
                    }}>
                        {msg.senderName}
                        <span style={{
                            marginLeft: 6, fontSize: 8.5, color: "#2a2a4a",
                            padding: "1px 5px", border: "1px solid #1e1e2e", borderRadius: 4,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>{ROLE_BADGE[msg.senderRole] || msg.senderRole}</span>
                    </div>
                )}

                <div style={{
                    background: isMine ? "#132825" : "#161622",
                    borderRadius: isMine ? "13px 13px 3px 13px" : "13px 13px 13px 3px",
                    padding: "9px 12px 6px",
                    border: isMine ? "1px solid #2a9d8f22" : "1px solid #1e1e2e",
                    boxShadow: isMine ? "0 2px 10px rgba(42,157,143,0.08)" : "0 2px 8px rgba(0,0,0,0.25)",
                    /* Pending / failed visual hint */
                    opacity: msg._pending ? 0.6 : 1,
                    transition: "opacity 0.2s",
                }}>
                    <p style={{
                        margin: 0, fontSize: 13.5, lineHeight: 1.58, wordBreak: "break-word",
                        whiteSpace: "pre-wrap", color: isMine ? "#b8e0dc" : "#cccccc",
                        fontFamily: "'Outfit', sans-serif",
                    }}>{msg.text}</p>

                    <div style={{
                        display: "flex", justifyContent: "flex-end",
                        alignItems: "center", gap: 4, marginTop: 4,
                    }}>
                        <span style={{ fontSize: 9.5, color: "#333", fontFamily: "'DM Mono', monospace" }}>
                            {fmtTime(msg.timestamp)}
                        </span>
                        {isMine && (
                            <span style={{ fontSize: 11, color: (msg.readBy?.length || 0) > 1 ? "#2a9d8f" : "#334" }}>
                                {(msg.readBy?.length || 0) > 1 ? "✓✓" : "✓"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TypingBubble({ users }) {
    if (!users.length) return null;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 44px 4px" }}>
            <div style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map(i => (
                    <span key={i} style={{
                        width: 5, height: 5, borderRadius: "50%", background: "#2a9d8f",
                        display: "inline-block",
                        animation: `typingDot 1.2s ${i * 0.18}s infinite ease-in-out`,
                    }} />
                ))}
            </div>
            <span style={{ fontSize: 10.5, color: "#3a3a5a", fontFamily: "'DM Mono', monospace" }}>
                {users.map(u => u.name.split(" ")[0]).join(", ")} {users.length === 1 ? "is" : "are"} typing…
            </span>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ChatUI({ currentUser, groups: propGroups }) {

    // Demo defaults so the component is self-contained in Storybook / preview
    const user = currentUser ?? {
        id: "TCH-4421", name: "Dr. Anjali Mehta", role: "teacher", token: "demo",
    };

    const [groups] = useState(propGroups ?? [
        { id: 1, name: "CSE-3A Group", type: "class", dept: "CSE", members: [] },
        { id: 6, name: "All Teachers", type: "department", dept: "ALL", members: [] },
        { id: 7, name: "Admin Broadcast", type: "broadcast", dept: "ALL", members: [] },
    ]);

    const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? null);
    const [messages, setMessages] = useState([]);
    const [unreadMap, setUnreadMap] = useState({});
    const [inputText, setInputText] = useState("");
    const [wsStatus, setWsStatus] = useState("disconnected");
    const [loading, setLoading] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQ, setSearchQ] = useState("");
    const [typingUsers, setTypingUsers] = useState([]);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimer = useRef(null);
    const activeGroup = groups.find(g => g.id === activeGroupId);

    // ── Fetch history ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!activeGroupId) return;
        setLoading(true);
        setMessages([]);
        setTypingUsers([]);
        fetchMessages(activeGroupId, user.token)
            .then(msgs => {
                setMessages(msgs);
                setUnreadMap(m => ({ ...m, [activeGroupId]: 0 }));
                markReadApi(activeGroupId, user.token);
            })
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    }, [activeGroupId, user.token]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    // ── WS handler ───────────────────────────────────────────────────────────
    const handleWsMsg = useCallback((data) => {
        if (data.type === "MESSAGE") {
            const msg = data.payload;
            if (msg.groupId === activeGroupId) {
                setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
                markReadApi(activeGroupId, user.token);
            } else {
                setUnreadMap(m => ({ ...m, [msg.groupId]: (m[msg.groupId] || 0) + 1 }));
            }
        }
        if (data.type === "TYPING") {
            const { groupId, senderId, senderName } = data.payload;
            if (groupId === activeGroupId && senderId !== user.id) {
                setTypingUsers(prev => prev.find(u => u.id === senderId) ? prev : [...prev, { id: senderId, name: senderName }]);
                clearTimeout(typingTimer.current);
                typingTimer.current = setTimeout(() => setTypingUsers([]), 3200);
            }
        }
        if (data.type === "READ") {
            const { groupId, userId } = data.payload;
            if (groupId === activeGroupId) {
                setMessages(prev => prev.map(m =>
                    m.readBy?.includes(userId) ? m : { ...m, readBy: [...(m.readBy || []), userId] }
                ));
            }
        }
    }, [activeGroupId, user.id, user.token]);

    const wsSend = useGroupSocket({ token: user.token, activeGroupId, onMessage: handleWsMsg, onStatusChange: setWsStatus });

    // ── Send ─────────────────────────────────────────────────────────────────
    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || !activeGroupId) return;

        const tempId = `pending-${Date.now()}`;
        const optimistic = {
            id: tempId, groupId: activeGroupId,
            senderId: user.id, senderName: user.name, senderRole: user.role,
            text, timestamp: new Date().toISOString(), readBy: [user.id], _pending: true,
        };

        setMessages(p => [...p, optimistic]);
        setInputText("");
        setSendError(null);
        inputRef.current?.focus();

        try {
            const saved = await sendMessageApi(
                { groupId: activeGroupId, senderId: user.id, senderName: user.name, senderRole: user.role, text },
                user.token
            );
            setMessages(p => p.map(m => m.id === tempId ? { ...saved, readBy: saved.readBy ?? [user.id] } : m));
            wsSend({ type: "MESSAGE", payload: saved });
        } catch {
            setSendError("Message failed to send. Please try again.");
            setMessages(p => p.filter(m => m.id !== tempId));
        }
    };

    // ── Typing signal ─────────────────────────────────────────────────────────
    const handleInput = (e) => {
        setInputText(e.target.value);
        wsSend({ type: "TYPING", payload: { groupId: activeGroupId, senderId: user.id, senderName: user.name } });
        // Auto-resize textarea
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQ.toLowerCase()));
    const canSend = !!inputText.trim() && !!activeGroup;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes msgIn      { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingDot  { 0%,60%,100%{transform:translateY(0);opacity:.35} 30%{transform:translateY(-4px);opacity:1} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .chat-root { display:flex; height:100vh; width:100%; background:#0d0d14;
                     font-family:'Outfit',sans-serif; overflow:hidden; animation:fadeUp .28s ease-out; }

        /* Sidebar */
        .sidebar { width:264px; min-width:264px; background:#0f0f1a; border-right:1px solid #181826;
                   display:flex; flex-direction:column; overflow:hidden;
                   transition:width .22s,min-width .22s; }
        .sidebar.closed { width:0; min-width:0; }

        .group-row:hover { background:rgba(255,255,255,0.03) !important; }

        /* Input */
        .chat-textarea { width:100%; background:#181824; border:1px solid #1e1e2e;
                         border-radius:12px; padding:10px 14px; color:#d0d0d0;
                         font-size:13.5px; font-family:'Outfit',sans-serif; line-height:1.55;
                         resize:none; max-height:120px; overflow-y:auto;
                         transition:border-color .15s; outline:none; }
        .chat-textarea:focus { border-color:#2a9d8f44; }
        .chat-textarea::placeholder { color:#2a2a40; }
        .chat-textarea:disabled { cursor:not-allowed; opacity:.4; }

        /* Send button */
        .send-btn { width:42px; height:42px; border-radius:12px; border:none;
                    display:flex; align-items:center; justify-content:center;
                    font-size:17px; flex-shrink:0; cursor:pointer;
                    transition:background .15s, transform .1s; }
        .send-btn:hover:not(:disabled) { filter:brightness(1.15); transform:scale(1.04); }
        .send-btn:active:not(:disabled) { transform:scale(.96); }
        .send-btn:disabled { cursor:not-allowed; }

        /* Scrollbars */
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#1e1e2e; border-radius:2px; }
        ::-webkit-scrollbar-track { background:transparent; }
      `}</style>

            <div className="chat-root">

                {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
                <aside className={`sidebar${sidebarOpen ? "" : " closed"}`}>

                    {/* Brand + user pill */}
                    <div style={{ padding: "18px 14px 12px", borderBottom: "1px solid #181826", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: "50%", background: "#2a9d8f",
                                boxShadow: "0 0 8px #2a9d8f55", display: "inline-block",
                                animation: "pulse 2.5s infinite",
                            }} />
                            <span style={{
                                fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: "#2a9d8f",
                                letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
                            }}>ERP · Chat</span>
                        </div>

                        <div style={{
                            display: "flex", alignItems: "center", gap: 9,
                            background: "rgba(42,157,143,0.06)", border: "1px solid #1e3330",
                            borderRadius: 10, padding: "8px 10px",
                        }}>
                            <Avatar name={user.name} id={user.id} size={32} />
                            <div style={{ minWidth: 0 }}>
                                <div style={{
                                    fontSize: 12, fontWeight: 600, color: "#d0d0d0",
                                    fontFamily: "'DM Mono',monospace",
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>{user.name}</div>
                                <div style={{
                                    fontSize: 9.5, color: "#2a9d8f", fontFamily: "'DM Mono',monospace",
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                }}>{ROLE_BADGE[user.role]}</div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ padding: "10px 12px", flexShrink: 0 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 7,
                            background: "#181824", border: "1px solid #1e1e2e",
                            borderRadius: 8, padding: "7px 10px",
                        }}>
                            <span style={{ color: "#2a2a4a", fontSize: 14 }}>⌕</span>
                            <input
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                placeholder="Search groups…"
                                style={{
                                    background: "none", border: "none", outline: "none", flex: 1,
                                    fontSize: 11.5, color: "#888", fontFamily: "'DM Mono',monospace",
                                }}
                            />
                        </div>
                    </div>

                    {/* Group list */}
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
                        {filteredGroups.map(g => (
                            <GroupRow
                                key={g.id}
                                group={g}
                                isActive={g.id === activeGroupId}
                                unread={unreadMap[g.id] || 0}
                                onClick={() => { setActiveGroupId(g.id); setSendError(null); }}
                            />
                        ))}
                        {filteredGroups.length === 0 && (
                            <div style={{
                                padding: "28px 16px", textAlign: "center",
                                color: "#252535", fontSize: 11.5, fontFamily: "'DM Mono',monospace"
                            }}>
                                No groups found
                            </div>
                        )}
                    </div>

                    {/* WS status footer */}
                    <div style={{
                        padding: "9px 14px", borderTop: "1px solid #181826",
                        flexShrink: 0, display: "flex", alignItems: "center",
                    }}>
                        <StatusDot status={wsStatus} />
                    </div>
                </aside>

                {/* ══ MAIN ═════════════════════════════════════════════════════════ */}
                <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

                    {/* Top bar */}
                    <header style={{
                        height: 56, flexShrink: 0,
                        background: "#0f0f1a", borderBottom: "1px solid #181826",
                        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
                    }}>
                        <button
                            onClick={() => setSidebarOpen(p => !p)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#2a2a4a", fontSize: 16, padding: "4px 6px", borderRadius: 6,
                                lineHeight: 1, transition: "color .15s",
                            }}
                            title="Toggle sidebar"
                        >{sidebarOpen ? "◀" : "▶"}</button>

                        {activeGroup ? (
                            <>
                                <span style={{ fontSize: 20 }}>{GROUP_ICON[activeGroup.type]}</span>
                                <div>
                                    <div style={{
                                        fontFamily: "'DM Mono',monospace", fontWeight: 600,
                                        fontSize: 13.5, color: "#e0e0e0", letterSpacing: "0.04em",
                                    }}>{activeGroup.name}</div>
                                    <div style={{
                                        fontSize: 9.5, color: "#2a2a4a", fontFamily: "'DM Mono',monospace",
                                        textTransform: "uppercase", letterSpacing: "0.1em",
                                    }}>{activeGroup.dept}{activeGroup.members?.length ? ` · ${activeGroup.members.length} members` : ""}</div>
                                </div>
                                <div style={{ marginLeft: "auto" }}>
                                    <StatusDot status={wsStatus} />
                                </div>
                            </>
                        ) : (
                            <span style={{ color: "#2a2a4a", fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
                                Select a group to start chatting
                            </span>
                        )}
                    </header>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: "auto", padding: "14px 18px 6px",
                        display: "flex", flexDirection: "column",
                        background: "radial-gradient(ellipse at 30% 60%, #0d1117 0%, #0d0d14 100%)",
                    }}>
                        {loading ? (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{
                                    fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#1e1e30",
                                    animation: "pulse 1.8s infinite",
                                }}>Loading messages…</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{
                                flex: 1, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: 12,
                            }}>
                                <span style={{ fontSize: 44, filter: "grayscale(0.4)" }}>
                                    {activeGroup ? GROUP_ICON[activeGroup.type] : "💬"}
                                </span>
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, color: "#1e1e30" }}>
                                    {activeGroup ? "No messages yet. Say something!" : "Select a group to start"}
                                </span>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <div key={msg.id}>
                                        {needsDivider(messages, i) && <DateDivider label={fmtDivider(msg.timestamp)} />}
                                        <Bubble
                                            msg={msg}
                                            isMine={msg.senderId === user.id}
                                            showAvatar={isLastInCluster(messages, i)}
                                        />
                                    </div>
                                ))}
                                <TypingBubble users={typingUsers} />
                                <div ref={bottomRef} />
                            </>
                        )}
                    </div>

                    {/* Error bar */}
                    {sendError && (
                        <div style={{
                            background: "#1a0808", borderTop: "1px solid #3a1010",
                            padding: "6px 18px", display: "flex", justifyContent: "space-between",
                            alignItems: "center", flexShrink: 0,
                        }}>
                            <span style={{ fontSize: 11, color: "#e63946", fontFamily: "'DM Mono',monospace" }}>
                                ⚠ {sendError}
                            </span>
                            <button onClick={() => setSendError(null)}
                                style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", fontSize: 14 }}>
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Input bar */}
                    <div style={{
                        padding: "11px 16px", background: "#0f0f1a",
                        borderTop: "1px solid #181826", display: "flex",
                        alignItems: "flex-end", gap: 9, flexShrink: 0,
                    }}>
                        <textarea
                            ref={inputRef}
                            value={inputText}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder={activeGroup ? `Message ${activeGroup.name}…` : "Select a group first"}
                            disabled={!activeGroup}
                            rows={1}
                            className="chat-textarea"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!canSend}
                            className="send-btn"
                            style={{
                                background: canSend ? "#2a9d8f" : "#181824",
                                color: canSend ? "#fff" : "#2a2a4a",
                            }}
                            title="Send (Enter)"
                        >➤</button>
                    </div>
                </main>
            </div>
        </>
    );
}