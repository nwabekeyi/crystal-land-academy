// import React from "react";
// import { Box } from "@mui/material";
// import Sidebar from "./Sidebar";
// import MainVideo from "./MainVideo";
// import Participants from "./Participants";
// import ChatRoom from "./ChatRoom";

// const VideoConference = () => {
//   return (
//     <Box sx={{ display: "flex", height: "100vh" }}>
//       <Sidebar />
      
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <MainVideo />
//         <Participants />
//       </Box>
//       <ChatRoom />
//     </Box>
//   );
// };

// export default VideoConference;
import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import MainVideo from "./MainVideo";
import Participants from "./Participants";
import ChatRoom from "./ChatRoom";
import MeetingHeader from "./ConferenceHeader";

const VideoConference = () => {
  // Example Data: Total number of students and dynamic attendee count
  const totalStudents = 35;
  const [presentCount, setPresentCount] = useState(28);

  // User data (for the example)
  const [user, setUser] = useState({
    id: 1,
    name: "User 1",
    profilePic: "https://via.placeholder.com/80",
    videoOn: true, // Initially video is ON
    videoUrl: "https://via.placeholder.com/320x240", // Replace with actual video URL if needed
  });

  const [speaker, setSpeaker] = useState({
    id: 2,
    name: "Speaker",
    profilePic: "https://via.placeholder.com/80",
    videoUrl: "https://via.placeholder.com/320x240", // Replace with speaker's video URL
  });

  const [participants, setParticipants] = useState([
    { id: 3, name: "Participant 1", profilePic: "https://via.placeholder.com/80" },
    { id: 4, name: "Participant 2", profilePic: "https://via.placeholder.com/80" },
    { id: 5, name: "Participant 3", profilePic: "https://via.placeholder.com/80" },
    { id: 6, name: "Participant 4", profilePic: "https://via.placeholder.com/80" },
  ]);

  const [showMore, setShowMore] = useState(false);

  const setMainVideo = (participant) => {
    // Set main video (user's or participant's video)
  };

  const setSpeakerVideo = (participant) => {
    // Set the speaker video (when the speaker changes)
    setSpeaker(participant);
  };

  const toggleUserVideo = () => {
    setUser((prevState) => ({
      ...prevState,
      videoOn: !prevState.videoOn, // Toggle the video on/off
    }));
  };

  // Use the `useMediaQuery` hook to detect if the screen size is 'xs' (mobile)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // sm = 600px or less

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "hidden",
        height: "100vh",
        width: "100vw", // Ensure full width
        backgroundColor: "#f9f9f9", // Optional background color
      }}
    >
      {/* Full-Width Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%", // Full width
          height: "100%", // Full height of the viewport
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Meeting Header */}
        <MeetingHeader totalStudents={totalStudents} presentCount={presentCount} />

        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, height: "calc(100% - 80px)" }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Video and Participants */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <MainVideo />
            <Participants
              user={user}
              setMainVideo={setMainVideo}
              setSpeaker={setSpeaker}
              speaker={speaker}
              setUserVideoStatus={toggleUserVideo}
              participants={participants}
              showMore={showMore}
              setShowMore={setShowMore}
            />
          </Box>

          {/* Conditionally Render ChatRoom on larger screens */}
          {!isMobile && <ChatRoom />}
        </Box>
      </Box>
    </Box>
  );
};

export default VideoConference;
