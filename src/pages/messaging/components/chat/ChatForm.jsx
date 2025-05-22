import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { tokens } from "../../../dashboard/theme";
import useWebSocket from "../../../../hooks/useWebSocket";
import {
  checkDBFullnessAndSave,
  addChatroomMessage,
  setReplyToMessage,
  setMessages,
} from "../../../../reduxStore/slices/messageSlice";
import { useSelector, useDispatch } from "react-redux";

const ChatForm = ({ currentChat, mention, setMention, currentUser, replyToMessage }) => {
  const messages = useSelector((state) => state.message.messages); // Assumes messages is an array
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [messageState, setMessageState] = useState("");
  const [isSending, setIsSending] = useState(false); // Track sending state for UI feedback
  const { emit, isConnected, listen } = useWebSocket();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const emojiPickerRef = useRef(null);

  const onChange = useCallback(
    (e) => {
      const value = e.target.value;
      setMessageState(value);

      if (value.includes("@")) {
        const query = value.split("@").pop().trim();
        setMentionQuery(query);
        setFilteredParticipants(
          currentChat.participants.filter((participant) =>
            `${participant.firstName} ${participant.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
          )
        );

        const inputElement = e.target;
        const cursorPos = inputElement.selectionStart;
        const rect = inputElement.getBoundingClientRect();
        const charWidth = 8;
        const left = rect.left + charWidth * (cursorPos - value.lastIndexOf("@") - 1);
        const top = rect.top - 250;

        setMentionPosition({ left, top });
      } else {
        setMentionQuery("");
        setFilteredParticipants([]);
      }
    },
    [currentChat?.participants]
  );

  const handleEmojiClick = (event) => {
    const emoji = event.emoji;
    if (emoji) {
      setMessageState((prevState) => prevState + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isConnected || !messageState.trim() || isSending) {
      console.log("Cannot send message: WebSocket not connected, message empty, or already sending.");
      return;
    }

    setIsSending(true); // Indicate message is being sent

    const messageBody = {
      chatroomName: currentChat.name,
      sender: {
        id: currentUser.userId,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        profilePictureUrl: currentUser.profilePictureUrl,
        role: currentUser.role,
      },
      message: messageState,
      messageType: "text",
      deliveredTo: [],
      readBy: [],
      replyTo: replyToMessage ? { id: replyToMessage._id, message: replyToMessage.message } : null,
      mention: mention || null,
      timestamp: new Date().toISOString(),
    };

    // Emit message to server without adding to Redux yet
    emit("chatroom message", messageBody);

    // Reset form but keep sending state until confirmation
    setMessageState("");
    dispatch(setReplyToMessage(null));
    setMention("");
  };

  useEffect(() => {
    if (!isConnected) return;

    const handleMessageConfirmation = (data) => {
      const {
        messageId,
        status,
        chatroomName,
        message,
        timestamp,
        error,
        sender,
        deliveredTo,
        readBy,
        messageType,
        replyTo,
        mention,
      } = data;

      setIsSending(false); // Reset sending state regardless of outcome

      if (status === "sent") {
        const confirmedMessage = {
          _id: messageId,
          chatroomName,
          sender,
          message,
          messageType,
          deliveredTo,
          readBy,
          status: "sent",
          replyTo,
          mention,
          timestamp,
        };

        // Add confirmed message to Redux state
        dispatch(setMessages((prevMessages) => [...prevMessages, confirmedMessage]));
        dispatch(addChatroomMessage({ chatroomName, message: confirmedMessage }));

        // Save to IndexedDB
        dispatch(
          checkDBFullnessAndSave({
            storeName: "ChatroomMessages",
            chatroomName,
            message: confirmedMessage,
          })
        );
      } else if (status === "failure") {
        console.error(`Message failed to send: ${error}`);
        // Optionally notify user of failure (e.g., via a toast)
      }
    };

    listen("chatroom message received", handleMessageConfirmation);

    return () => {
      // Cleanup listener (adjust based on useWebSocket implementation)
    };
  }, [isConnected, listen, dispatch, currentChat.name]);

  const handleClickOutside = useCallback((event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  }, []);

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, handleClickOutside]);

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            py: 1,
            position: "relative",
            "& .css-kcpv2-MuiInputBase-root-MuiOutlinedInput-root": { padding: 0 },
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Write a message"
            fullWidth
            value={messageState}
            onChange={onChange}
            multiline
            minRows={2}
            disabled={isSending} // Disable input while sending
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEmojiPicker((prevState) => !prevState);
                    }}
                    sx={{ color: colors.primary[100] }}
                    disabled={isSending}
                  >
                    <EmojiEmotionsIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleFormSubmit}
                    sx={{ color: colors.primary[100], transform: "rotate(0deg)" }}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <CircularProgress size={28} sx={{ color: colors.primary[100] }} />
                    ) : (
                      <SendIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "25px",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              height: "auto",
              overflowY: "auto",
              "& .MuiInputBase-input": {
                marginTop: "20px",
                textJustify: "auto",
                height: "100%",
                textAlign: "start",
              },
            }}
          />

          {showEmojiPicker && (
            <Paper ref={emojiPickerRef} sx={{ position: "absolute", bottom: "50px", zIndex: 1000 }}>
              <Picker pickerStyle={{ width: "100%" }} onEmojiClick={handleEmojiClick} />
            </Paper>
          )}
        </Box>

        {filteredParticipants.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: mentionPosition.top,
              left: mentionPosition.left,
              backgroundColor: "background.paper",
              boxShadow: 2,
              zIndex: 2,
              borderRadius: 1,
            }}
          >
            <List>
              {filteredParticipants.map((participant) => (
                <ListItem
                  key={participant.userId}
                  onClick={() => {
                    setMessageState(
                      `${messageState.substring(0, messageState.lastIndexOf("@"))}@${participant.firstName} ${participant.lastName} `
                    );
                    setMentionQuery("");
                    setFilteredParticipants([]);
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: colors.grey[900], transition: "background-color 0.3s" },
                  }}
                >
                  <Avatar src={participant.profilePictureUrl} sx={{ marginRight: 2 }} />
                  <ListItemText primary={`${participant.firstName} ${participant.lastName}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default React.memo(ChatForm);