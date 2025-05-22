import React from 'react';
import { Box, Typography } from '@mui/material';

export default function GroupInfo({ currentChat }) {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Group Info</Typography>
      <Typography variant="body2">
        Chatroom Name: {currentChat.name}
      </Typography>
      <Typography variant="body2">
        Description: {currentChat.description || 'No description available'}
      </Typography>
      <Typography variant="body2">
        Created On: {new Date(currentChat.createdAt).toLocaleDateString()}
      </Typography>
    </Box>
  );
}
