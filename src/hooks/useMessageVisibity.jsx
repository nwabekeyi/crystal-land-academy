import { useEffect, useState, useCallback, useRef} from "react";
import { useSelector } from "react-redux";
import useThrottleAndDebounce from "./useThrothleAndDebounce";
import useWebSocket from "./useWebSocket";

const useMessageVisibility = (messageRefs, messages, chatroomName) => {
  const [visibleMessages, setVisibleMessages] = useState([]); // Use state instead of ref for reactivity
  const { userId, firstName, lastName, profilePictureUrl } = useSelector((state) => state.users.user);
  const observer = useRef(null);
  const observedMessageIds = useRef(new Set());
  const { emit, isConnected } = useWebSocket();

  const throttledEmit = useCallback(
    useThrottleAndDebounce(
      (visibleMessages) => {
        if (isConnected) {
          visibleMessages.forEach((message) => {
            emit("chatroomMessage readBy", {
              chatroomName: message.chatroomName,
              messageId: message.messageId,
              recipientDetails: { userId, firstName, lastName, profilePictureUrl },
              senderId: message.senderId,
            });
          });
        }
      },
      2000,
      "throttle"
    ),
    [isConnected, emit, userId, firstName, lastName, profilePictureUrl]
  );

  const debouncedUpdateVisibility = useCallback(
    useThrottleAndDebounce(
      (entries, messages, currentlyVisibleMessages, userId) => {
        let updatedVisibleMessages = [...currentlyVisibleMessages];

        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute("data-message-id");
          const message = messages.find((msg) => msg._id === messageId);

          if (entry.isIntersecting && message) {
            const isReadByUser = message.readBy.some((readUser) => readUser.userId === userId);
            const isAlreadyVisible = updatedVisibleMessages.some((msg) => msg.messageId === messageId);
            if (!isReadByUser && !isAlreadyVisible && isConnected) {
              updatedVisibleMessages = [
                ...updatedVisibleMessages,
                {
                  messageId: message._id,
                  chatroomName,
                  senderId: message.sender.id,
                },
              ];
            }
          } else if (!entry.isIntersecting && messageId) {
            updatedVisibleMessages = updatedVisibleMessages.filter((msg) => msg.messageId !== messageId);
          }
        });

        setVisibleMessages(updatedVisibleMessages);
        throttledEmit(updatedVisibleMessages);
      },
      1000,
      "debounce"
    ),
    [messages, userId, chatroomName, isConnected, throttledEmit]
  );

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const currentlyVisibleMessages = visibleMessages;
        debouncedUpdateVisibility(entries, messages, currentlyVisibleMessages, userId);
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // Observe all message elements
    Object.keys(messageRefs.current).forEach((messageId) => {
      const messageElement = messageRefs.current[messageId];
      if (messageElement && !observedMessageIds.current.has(messageId)) {
        messageElement.setAttribute("data-message-id", messageId); // Ensure data-message-id is set
        observer.current.observe(messageElement);
        observedMessageIds.current.add(messageId);
      }
    });

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observedMessageIds.current.clear();
    };
  }, [messages, messageRefs, debouncedUpdateVisibility, userId]);

  return visibleMessages;
};

export default useMessageVisibility;