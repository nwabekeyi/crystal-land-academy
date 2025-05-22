import React, { useState } from "react";
import { Button, Box, IconButton, Slider } from "@mui/material";
import { Mic, MicOff, Videocam, VideocamOff, CallEnd, VolumeUp } from "@mui/icons-material";

const MainVideo = () => {
  // State variables for microphone, video, and volume
  const [micOn, setMicOn] = useState(true); // Microphone toggle
  const [videoOn, setVideoOn] = useState(true); // Video toggle
  const [volume, setVolume] = useState(50); // Volume level

  // Handler to toggle microphone
  const handleMicToggle = () => {
    setMicOn((prev) => !prev);
  };

  // Handler to toggle video
  const handleVideoToggle = () => {
    setVideoOn((prev) => !prev);
  };

  // Handler for leaving the call
  const handleLeaveCall = () => {
    alert("You have left the call.");
    // Implement additional logic for leaving the call if needed
  };

  // Handler for volume adjustment
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    // Adjust the volume in your media stream if necessary
  };

  return (
    <Box
      sx={{
        flex: 1,
        position: "relative",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main video */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: videoOn ? "#000" : "#333", // Darker background if video is off
        }}
      >
        {videoOn ? (
          <div>Main Video Stream</div>
        ) : (
          <div style={{ color: "#fff" }}>Video is turned off</div>
        )}
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
          background: "#222", // Control bar background
        }}
      >
        {/* Mic Button */}
        <Button
          variant="contained"
          color={micOn ? "secondary" : "error"}
          startIcon={micOn ? <Mic /> : <MicOff />}
          onClick={handleMicToggle}
        >
          {micOn ? "Mic On" : "Mic Off"}
        </Button>

        {/* Video Button */}
        <Button
          variant="contained"
          color={videoOn ? "secondary" : "error"}
          startIcon={videoOn ? <Videocam /> : <VideocamOff />}
          onClick={handleVideoToggle}
        >
          {videoOn ? "Video On" : "Video Off"}
        </Button>

        {/* Volume Control */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <VolumeUp sx={{ color: "#fff" }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="volume-slider"
            sx={{
              width: 100,
              color: "#fff",
            }}
          />
        </Box>

        {/* Leave Button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<CallEnd />}
          onClick={handleLeaveCall}
        >
          Leave
        </Button>
      </Box>
    </Box>
  );
};

export default MainVideo;
