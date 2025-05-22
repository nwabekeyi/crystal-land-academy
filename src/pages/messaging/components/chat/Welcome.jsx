import React from "react";
import { Box, Typography } from "@mui/material";

export default function Welcome() {
  return (
    <Box
      sx={{
        display: {xs: 'none', md: "flex"},
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: 40,
        height: "100%",
        justifyContent: "center",
      }}
    >
      {/* You can replace this with an MUI Icon if needed */}
      <Typography variant="h5" sx={{ color: "text.secondary", textAlign: "center" }}>
        Select a Chat to Start Messaging
      </Typography>
    </Box>
  );
}
