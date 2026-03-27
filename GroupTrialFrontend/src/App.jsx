import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import GroupsList from "./components/GroupsList";
import Login from "./components/Login";
import { fetchGroupMessages, fetchUserGroups, validateUserId } from "./services/api";
import { socketService } from "./services/socketService";
import { getGroupId, normalizeMessage } from "./utils/chatHelpers";

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
        await socketService.connect(currentUserId);
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
      return;
    }

    let isActive = true;

    async function loadMessages() {
      setIsLoadingMessages(true);
      try {
        const groupMessages = await fetchGroupMessages(selectedGroupId);
        if (isActive) {
          setMessages(groupMessages);
        }
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
      return undefined;
    }

    const unsubscribe = socketService.subscribeToGroup(selectedGroupId, (incomingMessage) => {
      const normalized = normalizeMessage(incomingMessage, selectedGroupId);

      setMessages((previousMessages) => {
        // If this is a message we sent and the server echoed back clientMessageId,
        // replace the local optimistic message with the server-normalized message.
        if (
          normalized.clientMessageId &&
          pendingClientMessageIdsRef.current.has(normalized.clientMessageId)
        ) {
          pendingClientMessageIdsRef.current.delete(normalized.clientMessageId);

          return previousMessages.map((item) =>
            item.clientMessageId === normalized.clientMessageId ? normalized : item
          );
        }

        const exists = previousMessages.some((item) => {
          if (item.id && normalized.id && item.id === normalized.id) {
            return true;
          }

          if (
            item.sender === normalized.sender &&
            item.content === normalized.content &&
            item.groupId === normalized.groupId
          ) {
            const existingTs = new Date(item.timestamp).getTime();
            const incomingTs = new Date(normalized.timestamp).getTime();
            if (!Number.isNaN(existingTs) && !Number.isNaN(incomingTs) && Math.abs(existingTs - incomingTs) < 5000) {
              return true;
            }
          }

          return false;
        });

        return exists ? previousMessages : [...previousMessages, normalized];
      });
    });

    return () => {
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

    try {
      pendingClientMessageIdsRef.current.add(clientMessageId);
      socketService.sendMessage(outgoingMessage);
      const normalizedOutgoing = normalizeMessage({
        ...outgoingMessage,
        timestamp: new Date().toISOString()
      }, selectedGroupId); // local optimistic timestamp only (not sent to backend)

      setMessages((previousMessages) => {
        const exists = previousMessages.some((item) => item.id === normalizedOutgoing.id);
        if (exists) {
          return previousMessages;
        }
        return [...previousMessages, normalizedOutgoing];
      });
    } catch (error) {
      pendingClientMessageIdsRef.current.delete(clientMessageId);
      setAppError(error.message || "Message send failed. Check socket connection.");
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
            isSocketConnected={isSocketConnected}
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
