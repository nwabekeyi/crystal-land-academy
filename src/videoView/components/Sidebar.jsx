import React, { useState } from "react";
import { IconButton, Box, useMediaQuery } from "@mui/material";
import { VideoCall, Chat, Group, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Video Call");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const menuItems = [
    { icon: <VideoCall />, label: "Video Call", path: "/" },
    {
      icon: <Group />,
      label: "Participants",
      path: "/participants",
    },
    {
      icon: <Chat />,
      label: "Chat",
      path: "/chat-room",
      onClick: () => {
        if (isSmallScreen) navigate("/chat-room");
      },
    },
    { icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  const handleMenuClick = (label, path, onClick) => {
    setActiveItem(label);
    if (onClick) onClick(); // Trigger custom action if provided
    if (path) navigate(path); // Navigate to the specified path
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f5f5f5",
        padding: "10px",
      }}
    >
      {menuItems.map((item, index) => (
        <IconButton
          key={index}
          onClick={() => handleMenuClick(item.label, item.path, item.onClick)}
          sx={{
            margin: "10px 0",
            color: activeItem === item.label ? "#007bff" : "#666",
            "&:hover": {
              color: "#007bff",
            },
          }}
          title={item.label}
        >
          {item.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default Sidebar;
