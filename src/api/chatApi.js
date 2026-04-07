const BASE_URL = "http://localhost:8081";

// Fetch all old messages for a group
// Note: Backend has NO pagination yet, so we slice on frontend
export const fetchMessages = async (groupId, token) => {
    const res = await fetch(`${BASE_URL}/api/chat/messages/${groupId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);

    const data = await res.json();

    // Frontend safety: only show last 50 messages since backend has no pagination
    return Array.isArray(data) ? data.slice(-50) : [];
};