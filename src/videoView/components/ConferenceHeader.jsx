import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const MeetingHeader = ({ totalStudents, presentCount }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // Toggle the drawer and icon
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  useEffect(() => {
    // Update the current date dynamically
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        width: "auto",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
        borderRadius: "8px",
        marginBottom: "16px",
        flexWrap: "wrap", // Enable wrapping for smaller screens
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Hamburger Menu for smaller screens */}
        <IconButton
          onClick={handleDrawerToggle}
          disableRipple
          sx={{
            display: { xs: "block", md: "none" }, // Show only on small screens
            outline: "none", // Remove outline on focus
            color: "#333", // Set color for the icon
          }}
        >
          {isHamburgerOpen ? <CloseIcon /> : <MenuIcon />} {/* Toggle between icons */}
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Our Weekly Design Meeting
        </Typography>

        <Typography variant="body2" sx={{ color: "#888" }}>
          {currentDate}
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" }, // Hide attendance on smaller screens
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#4CAF50",
            fontSize: "1.2rem", // Increased font size
          }}
        >
          Attendee: <span style={{ color: "#000" }}>{presentCount}</span>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#F44336",
            fontSize: "1rem", // Increased font size
          }}
        >
          Absent: <span style={{ color: "#000" }}>{totalStudents - presentCount}</span>
        </Typography>
      </Box>

      {/* Drawer (Hamburger Menu) */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem button>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Participants" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Help" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Attendance" />
              <Typography variant="body2">
                Attendees: {presentCount} / {totalStudents}
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MeetingHeader;
