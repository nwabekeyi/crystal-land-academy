import React, { useState } from "react";
import { Avatar, Box, IconButton } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const participants = [
  { id: 1, name: "Participant 1", profilePic: "https://via.placeholder.com/80" },
  { id: 2, name: "Participant 2", profilePic: "https://via.placeholder.com/80" },
  { id: 3, name: "Participant 3", profilePic: "https://via.placeholder.com/80" },
  { id: 4, name: "Participant 4", profilePic: "https://via.placeholder.com/80" },
  { id: 5, name: "Participant 5", profilePic: "https://via.placeholder.com/80" },
  { id: 0, name: "Speaker", profilePic: "https://via.placeholder.com/80" },
];

const Participants = ({ setMainVideo, setSpeaker, speaker }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsToShow, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsToShow, participants.length - itemsToShow)
    );
  };

  const handleParticipantClick = (participant) => {
    setMainVideo(participant); // Change the main video to the clicked participant
    setSpeaker(participant); // Change the speaker video
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 2,
        overflow: "hidden",
      }}
    >
      {/* Speaker Section */}
      <Box sx={{ textAlign: "center", flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            borderRadius: "8px",
            // border: "2px solid #007bff",
          }}
          src={speaker.profilePic}
        />
        <Box>{speaker.name}</Box>
      </Box>

      {/* Left Arrow */}
      <IconButton
        onClick={handlePrev}
        disabled={startIndex === 0}
        sx={{
          color: startIndex === 0 ? "#ccc" : "#007bff",
          outline: "none",
          "&:focus": { outline: "none" },
          "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.1)" },
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      {/* Participants */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflow: "hidden",
          flex: 1,
        }}
      >
        {participants
          .slice(startIndex, startIndex + itemsToShow)
          .map((participant) => (
            <Box
              key={participant.id}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => handleParticipantClick(participant)}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  borderRadius: "8px",
                }}
                src={participant.profilePic}
              />
              <Box>{participant.name}</Box>
            </Box>
          ))}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={handleNext}
        disabled={startIndex + itemsToShow >= participants.length}
        sx={{
          color:
            startIndex + itemsToShow >= participants.length ? "#ccc" : "#007bff",
          outline: "none",
          "&:focus": { outline: "none" },
          "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.1)" },
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default Participants;
