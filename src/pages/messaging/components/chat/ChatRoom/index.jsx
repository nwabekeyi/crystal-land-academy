import { useEffect, useRef } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSubscription } from "@apollo/client";
import { MESSAGE_ADDED_SUBSCRIPTION } from "../../../../../utils/graphql/subscriptions";
import Message from "../Message";
import ChatForm from "../ChatForm";
import Loader from "../../../../../utils/loader";
import GroupInfo from "./GroupInfo";
import SearchMessages from "./searchComponent";
import { tokens } from "../../../../dashboard/theme";
import GroupParticipants from "./GroupParticipants";
import { useSelector, useDispatch } from "react-redux";
import { useChatroomVisibility } from "../../../../../hooks/useChatroomVisibilty";
import useMessageVisibility from "../../../../../hooks/useMessageVisibity";
import { loadMessagesFromIndexedDB } from "../../../../../reduxStore/slices/messageSlice";
import { setReplyToMessage, setMessages } from "../../../../../reduxStore/slices/messageSlice";

export default function ChatRoom({ currentChat, currentUser, setMention }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const scrollRef = useRef();
  const messageRefs = useRef({});

  const messages = useSelector((state) => state.message.messages);
  const selectedView = useSelector((state) => state.message.selectedView);
  const chatroomMessages = currentChat && useSelector((state) => state.message.chatroomMessages[currentChat.name]);
  const replyToMessage = useSelector((state) => state.message.replyToMessage);
  const loading = useSelector((state) => state.message.chatroomMessages.messageLoading);
  const chatroomName = useChatroomVisibility(scrollRef, currentChat);
  const visibleMessages = currentChat && useMessageVisibility(messageRefs, messages, currentChat.name);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      loadMessagesFromIndexedDB({
        dbName: "Messages",
        storeName: "ChatroomMessages",
        chatroomName: currentChat.name,
      })
    );
  }, [dispatch, currentChat?.name]);

  const { data: subscriptionData } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { chatroomName: currentChat?.name },
  });

  useEffect(() => {
    if (chatroomMessages) {
      dispatch(setMessages(chatroomMessages));
    }
  }, [chatroomMessages, dispatch]);

  useEffect(() => {
    if (subscriptionData?.messageAdded) {
      dispatch(setMessages((prevMessages) => [...prevMessages, subscriptionData.messageAdded]));
    }
  }, [subscriptionData, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (replyToMessage && messageRefs.current[replyToMessage._id]) {
      messageRefs.current[replyToMessage._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [replyToMessage]);

  const handleReply = (message) => {
    dispatch(setReplyToMessage(message));
    setMention("");
  };

  const handleCloseReply = () => {
    dispatch(setReplyToMessage(null));
  };

  const handleMessageClick = (message) => {
    if (message.replyTo && message.replyTo.id) {
      const replyMessage = messages.find((msg) => msg._id === message.replyTo.id);
      if (replyMessage && messageRefs.current[replyMessage._id]) {
        messageRefs.current[replyMessage._id].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  console.log("Messages:", messages);
  console.log("Visible Messages:", visibleMessages);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        overflowY: "auto",
      }}
    >
      {selectedView === "messages" && (
        <>
          <Box sx={{ height: "100%", flex: 1, overflowY: "auto", padding: { xs: 0, md: 3 }, maxHeight: "50%" }}>
            {loading ? (
              <Loader />
            ) : (
              <Box component="ul" sx={{ listStyleType: "none", padding: 0 }}>
                {messages.length > 0 &&
                  messages.map((message, index) => (
                    <Box
                      key={message._id || index} // Use message._id if available, fallback to index
                      ref={(el) => (messageRefs.current[message._id] = el)}
                      onClick={() => handleMessageClick(message)}
                    >
                      <Message
                        message={message}
                        self={currentUser.userId}
                        onReply={handleReply}
                        onCloseReply={handleCloseReply}
                        isReplyingTo={replyToMessage}
                        currentChat={currentChat}
                      />
                    </Box>
                  ))}
                <div ref={scrollRef} /> {/* Empty div for scrolling to bottom */}
              </Box>
            )}
          </Box>

          {replyToMessage && (
            <Box
              sx={{
                padding: 1,
                backgroundColor: colors.primary[700],
                borderColor: "primary.main",
                marginBottom: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Replying to:
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {replyToMessage.message}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseReply} sx={{ padding: "6px" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
          <ChatForm
            currentChat={currentChat}
            mention={""}
            setMention={setMention}
            currentUser={currentUser}
            replyToMessage={replyToMessage}
          />
        </>
      )}

      {selectedView === "groupInfo" && <GroupInfo currentChat={currentChat} />}
      {selectedView === "search" && <SearchMessages currentChat={currentChat} />}
      {selectedView === "participants" && <GroupParticipants participants={currentChat.participants} />}
    </Box>
  );
}