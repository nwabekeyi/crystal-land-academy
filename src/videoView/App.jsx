import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoConference from "./components/VideoConference";
import ChatRoom from "./components/ChatRoom";
import Participants from "./components/Participants";
import { Box } from "@mui/material";

function App() {
  // State and logic for main video and speaker
  const [mainVideo, setMainVideo] = useState(null); // Main video participant
  const [speaker, setSpeaker] = useState({
    id: 0,
    name: "Speaker",
    profilePic: "https://via.placeholder.com/80",
  });

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Routes>
            {/* Pass `mainVideo`, `setMainVideo`, `speaker`, and `setSpeaker` to VideoConference */}
            <Route
              path="/"
              element={
                <VideoConference
                  mainVideo={mainVideo}
                  setMainVideo={setMainVideo}
                  speaker={speaker}
                  setSpeaker={setSpeaker}
                />
              }
            />
            <Route path="/chat-room" element={<ChatRoom />} />
            <Route
              path="/participants"
              element={
                <Participants
                  setMainVideo={setMainVideo}
                  setSpeaker={setSpeaker}
                  speaker={speaker}
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
