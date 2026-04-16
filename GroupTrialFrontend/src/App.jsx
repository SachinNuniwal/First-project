import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import GroupsList from "./components/GroupsList";
import Login from "./components/Login";
import {
  fetchGroupMessages,
  fetchUserGroups,
  validateUserId
} from "./services/api";
import { wsService as socketService } from "../api/apiService";
import {
  getGroupId,
  normalizeMessage,
  mergeIncomingMessage,
  mergeOlderMessages
} from "./utils/chatHelpers";

function useIsMobile(breakpoint = 960) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

function App() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [appError, setAppError] = useState("");
  const [showGroupsOnMobile, setShowGroupsOnMobile] = useState(true);
  const pendingClientMessageIdsRef = useRef(new Set());
  const isMobile = useIsMobile();

  const selectedGroupId = useMemo(
    () => (selectedGroup ? getGroupId(selectedGroup) : ""),
    [selectedGroup]
  );

  async function handleLogin(userId) {
    setIsAuthenticating(true);
    setLoginError("");
    setAppError("");
    console.log("Validating user ID:", userId);
    try {
      const isValidUser = await validateUserId(userId);
      if (!isValidUser) {
        setLoginError("User ID is not valid.");
        console.log("Invalid user ID:", userId);
        return;
      }

      setCurrentUserId(userId);
    } catch (error) {
      setLoginError(error.message || "Could not validate this user right now.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  // WebSocket connection - activate when user logs in
  useEffect(() => {
    if (!currentUserId) {
      return undefined;
    }

    let isSubscribed = true;

    async function connectWebSocket() {
      try {
        await socketService.connect(currentUserId, "user");
        if (isSubscribed) {
          setIsSocketConnected(true);
        }
      } catch (error) {
        if (isSubscribed) {
          setIsSocketConnected(false);
          setAppError(error.message || "Realtime connection failed.");
        }
      }
    }

    connectWebSocket();

    return () => {
      isSubscribed = false;
      socketService.disconnect();
      setIsSocketConnected(false);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    let isActive = true;

    async function loadGroups() {
      setIsLoadingGroups(true);
      try {
        const groupItems = await fetchUserGroups(currentUserId);
        if (isActive) {
          setGroups(groupItems);
        }
      } catch (error) {
        if (isActive) {
          setAppError(error.message || "Could not load groups.");
        }
      } finally {
        if (isActive) {
          setIsLoadingGroups(false);
        }
      }
    }

    loadGroups();

    return () => {
      isActive = false;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedGroupId) {
      setMessages([]);
      setCursor(null);
      setHasMore(true);
      return;
    }

    let isActive = true;

    async function loadMessages() {
      setIsLoadingMessages(true);
      setCursor(null);
      setHasMore(true);

      try {
        const { messages: groupMessages, cursor: newCursor, hasMore: newHasMore } =
          await fetchGroupMessages(selectedGroupId, null, 20);

        if (!isActive) {
          return;
        }

        setMessages(groupMessages);
        setCursor(newCursor);
        setHasMore(Boolean(newHasMore));
        setIsAtBottom(true);
      } catch (error) {
        if (isActive) {
          setAppError(error.message || "Could not load messages.");
        }
      } finally {
        if (isActive) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [selectedGroupId]);

  // Subscribe to group messages when group is selected and socket is connected
  useEffect(() => {
    if (!selectedGroupId || !isSocketConnected) {
      return () => {};
    }

    let isMounted = true;

    const unsubscribe = socketService.subscribeToGroup(selectedGroupId, (incomingMessage) => {
      if (!isMounted) return;

      const normalized = normalizeMessage(incomingMessage, selectedGroupId);
      console.log("[ChatWindow] Received message:", {
        sender: normalized.sender,
        content: normalized.content,
        groupId: normalized.groupId
      });

      setMessages((previousMessages) => {
        // If this is a message we sent and the server echoed back clientMessageId,
        // replace the local optimistic message with the server-normalized message.
        if (
          normalized.clientMessageId &&
          pendingClientMessageIdsRef.current.has(normalized.clientMessageId)
        ) {
          console.log("[ChatWindow] Replacing optimistic message:", normalized.clientMessageId);
          pendingClientMessageIdsRef.current.delete(normalized.clientMessageId);
          return mergeIncomingMessage(previousMessages, normalized);
        }

        return mergeIncomingMessage(previousMessages, normalized);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [selectedGroupId, isSocketConnected]);

  function handleLogout() {
    socketService.disconnect();
    setCurrentUserId("");
    setGroups([]);
    setSelectedGroup(null);
    setMessages([]);
    setLoginError("");
    setAppError("");
    setShowGroupsOnMobile(true);
    setIsSocketConnected(false);
  }

  async function loadOlderMessages() {
    if (!selectedGroupId || isLoadingOlder || !hasMore) {
      return;
    }

    setIsLoadingOlder(true);
    setAppError("");

    try {
      const { messages: olderMessages, cursor: newCursor, hasMore: newHasMore } =
        await fetchGroupMessages(selectedGroupId, cursor, 20);

      if (!olderMessages || olderMessages.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prevMessages) => mergeOlderMessages(prevMessages, olderMessages));
      setCursor(newCursor);
      setHasMore(Boolean(newHasMore));
    } catch (error) {
      setAppError(error.message || "Could not load older messages.");
    } finally {
      setIsLoadingOlder(false);
    }
  }

  function handleGroupSelection(group) {
    setSelectedGroup(group);
    if (isMobile) {
      setShowGroupsOnMobile(false);
    }
  }

  function handleBackToGroups() {
    setShowGroupsOnMobile(true);
  }

  function handleSendMessage(content) {
    if (!currentUserId || !selectedGroupId) {
      console.warn("[handleSendMessage] Missing userId or groupId");
      return;
    }

    if (!isSocketConnected) {
      setAppError("Cannot send message: realtime connection is not ready yet.");
      console.warn("handleSendMessage blocked: socket disconnected", { currentUserId, selectedGroupId });
      return;
    }

    const roleForCurrentUser = selectedGroup?.role || "USER";
    const clientMessageId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const outgoingMessage = {
      sender: currentUserId,
      content,
      groupId: selectedGroupId,
      roles: roleForCurrentUser,
      clientMessageId
    };

    console.log("[handleSendMessage] Sending message:", {
      sender: currentUserId,
      groupId: selectedGroupId,
      contentPreview: content.substring(0, 50) + "...",
      clientMessageId
    });

    try {
      pendingClientMessageIdsRef.current.add(clientMessageId);
      socketService.sendMessage(outgoingMessage);
      const normalizedOutgoing = normalizeMessage({
        ...outgoingMessage,
        timestamp: new Date().toISOString()
      }, selectedGroupId);

      console.log("[handleSendMessage] Added optimistic message:", normalizedOutgoing.id);

      setMessages((previousMessages) => mergeIncomingMessage(previousMessages, normalizedOutgoing));
    } catch (error) {
      pendingClientMessageIdsRef.current.delete(clientMessageId);
      setAppError(error.message || "Message send failed. Check socket connection.");
      console.error("[handleSendMessage] Error:", error);
    }
  }


  if (!currentUserId) {
    return (
      <Login onSubmit={handleLogin} isLoading={isAuthenticating} errorMessage={loginError} />
    );
  }

  return (
    <div className="app-root">
      {appError ? <p className="app-error-banner">{appError}</p> : null}
      <div className="chat-shell">
        <aside className={`${isMobile && !showGroupsOnMobile ? "mobile-hidden" : ""}`}>
          <GroupsList
            userId={currentUserId}
            groups={groups}
            currentGroupId={selectedGroupId}
            isLoading={isLoadingGroups}
            onSelectGroup={handleGroupSelection}
            onLogout={handleLogout}
          />
        </aside>

        <main className={`${isMobile && showGroupsOnMobile ? "mobile-hidden" : ""}`}>
          <ChatWindow
            userId={currentUserId}
            group={selectedGroup}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            isLoadingOlder={isLoadingOlder}
            hasMore={hasMore}
            isSocketConnected={isSocketConnected}
            isAtBottom={isAtBottom}
            onAtBottomChange={setIsAtBottom}
            onLoadOlder={loadOlderMessages}
            showBackButton={isMobile && !showGroupsOnMobile}
            onBack={handleBackToGroups}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
