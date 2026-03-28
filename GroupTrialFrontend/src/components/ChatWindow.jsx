import { useEffect, useRef, useState } from "react";
import {
  formatHHMM,
  getGroupGradient,
  getGroupId,
  getGroupInitials,
  getGroupName
} from "../utils/chatHelpers";

function ChatWindow({
  userId,
  group,
  messages,
  isLoadingMessages,
  isSocketConnected,
  onBack,
  showBackButton,
  onSendMessage,
  onLoadOlder,
  onAtBottomChange,
  isLoadingOlder,
  hasMore,
  isAtBottom
}) {
  const [draftMessage, setDraftMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isPrependingRef = useRef(false);
  const previousScrollHeightRef = useRef(0);

  useEffect(() => {
    if (isLoadingOlder) {
      return;
    }

    const container = messagesContainerRef.current;
    const endElement = endOfMessagesRef.current;
    if (!container || !endElement) {
      return;
    }

    if (isPrependingRef.current) {
      requestAnimationFrame(() => {
        const oldHeight = previousScrollHeightRef.current;
        const newHeight = container.scrollHeight;
        const newScrollTop = newHeight - oldHeight;
        container.scrollTop = newScrollTop;
      });
      isPrependingRef.current = false;
      return;
    }

    if (isAtBottom || messages.length === 0) {
      requestAnimationFrame(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, isAtBottom, isLoadingOlder]);

  function handleSubmit(event) {
    event.preventDefault();
    const content = draftMessage.trim();
    if (!group || !content) {
      return;
    }

    onSendMessage(content);
    setDraftMessage("");
  }

  function handleScroll() {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const isAtBottomNow =
      container.scrollHeight - container.scrollTop - container.clientHeight <= 50;

    onAtBottomChange(Boolean(isAtBottomNow));

    if (container.scrollTop < 50 && hasMore && !isLoadingOlder) {
      const previousHeight = container.scrollHeight;
      previousScrollHeightRef.current = previousHeight;
      isPrependingRef.current = true;
      onLoadOlder();
    }
  }


  if (!group) {
    return (
      <section className="chat-window empty">
        <div className="empty-chat-content">
          <h3>Select a group to start chatting</h3>
          <p>Your conversations will appear here in real time.</p>
        </div>
      </section>
    );
  }

  const groupName = getGroupName(group);
  const groupId = getGroupId(group);

  return (
    <section className="chat-window">
      <header className="chat-header">
        <div className="chat-title-wrap">
          {showBackButton ? (
            <button type="button" className="ghost-btn" onClick={onBack}>
              Back
            </button>
          ) : null}
          <span className="group-avatar compact" style={{ background: getGroupGradient(group) }}>
            {getGroupInitials(groupName)}
          </span>
          <div>
            <h3>{groupName}</h3>
            <p>{groupId}</p>
          </div>
        </div>
        <span className={`status-pill ${isSocketConnected ? "online" : "offline"}`}>
          {isSocketConnected ? "Live" : "Offline"}
        </span>
      </header>

      <div className="messages-scroll" ref={messagesContainerRef} onScroll={handleScroll}>
        {isLoadingMessages ? <p className="state-text">Loading messages...</p> : null}
        {isLoadingOlder ? <p className="state-text">Loading older messages...</p> : null}

        {!isLoadingMessages &&
          messages.map((message) => {
            const isSelf = message.sender === userId;
            return (
              <article key={message.id} className={`message-row ${isSelf ? "self" : "other"}`}>
                <div className={`message-bubble ${isSelf ? "self" : "other"}`}>
                  {!isSelf ? <p className="message-sender">{message.sender}</p> : null}
                  <p className="message-content">{message.content}</p>
                  <p className="message-time">{formatHHMM(message.timestamp)}</p>
                </div>
              </article>
            );
          })}

        {!isLoadingMessages && messages.length === 0 ? (
          <p className="state-text">No messages yet. Send the first one.</p>
        ) : null}
        <div ref={endOfMessagesRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          placeholder="Type your message..."
          aria-label="Message"
        />
        <button type="submit" disabled={!draftMessage.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}

export default ChatWindow;
