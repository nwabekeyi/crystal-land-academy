import React, { useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatRoom = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", sender: "receiver" },
    { id: 2, text: "I'm good, thank you! What about you?", sender: "sender" },
    { id: 3, text: "Doing great! Thanks for asking.", sender: "receiver" },
    { id: 4, text: "Glad to hear that! 😊", sender: "sender" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: newMessage, sender: "sender" },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: "16px",
        boxSizing: "border-box",
        "@media (min-width: 320px)": { width: "100%" },
        "@media (min-width: 375px)": { width: "100%" },
        "@media (min-width: 428px)": { width: "100%" },
        "@media (min-width: 480px)": { width: "100%" },
        "@media (min-width: 768px)": { width: "100%" },
        "@media (min-width: 1024px)": { width: "100%" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width:"100%",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: message.sender === "sender" ? "flex-end" : "flex-start",
            }}
          >
            <Typography
              sx={{
                maxWidth: "70%",
                padding: "10px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                lineHeight: "1.5",
                color: message.sender === "sender" ? "#fff" : "#333",
                backgroundColor:
                  message.sender === "sender" ? "#4CAF50" : "rgba(0, 0, 0, 0.05)",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                wordWrap: "break-word",
              }}
            >
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          position: "sticky",
          bottom: 0,
          backgroundColor: "#f9f9f9",
          padding: "8px 0",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message"
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#45a049" },
            color: "#fff",
            padding: "10px",
            borderRadius: "50%",
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoom;
