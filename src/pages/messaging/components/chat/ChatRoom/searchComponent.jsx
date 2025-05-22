import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function SearchMessages({ messages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const results = messages.filter(message =>
      message.content.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Search Messages</Typography>
      <TextField
        label="Search messages"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
      />
      <Box sx={{ marginTop: 2 }}>
        {searchResults.length > 0 ? (
          searchResults.map((msg, index) => (
            <Typography key={index} variant="body2">
              {msg.sender.name}: {msg.content}
            </Typography>
          ))
        ) : (
          <Typography>No messages found</Typography>
        )}
      </Box>
    </Box>
  );
}
