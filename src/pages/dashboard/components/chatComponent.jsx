import React, { useEffect } from 'react';
import { Box, Typography, Avatar, TextField, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';
import useMessaging from '../../../hooks/useMessaging';

const ChatComponent = ({ userId, role }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    messages,
    selectedMessenger,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleMessengerClick,
    error,
  } = useMessaging(userId, role);

  // Format timestamp for chat messages
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    return `${date.toLocaleDateString(undefined, optionsDate)} ${date.toLocaleTimeString([], optionsTime).replace(':00', '').toLowerCase()}`;
  };

  // List of unique messengers (users other than current user)
  const uniqueMessengers = Array.from(new Set(messages
    .map(msg => msg.senderId)
    .filter(senderId => senderId !== userId)
  )).map(senderId => messages.find(msg => msg.senderId === senderId).sender);

  return (
    <Box display="flex" backgroundColor={colors.primary[400]} height="auto">
      {/* Messenger List */}
      <Box
        width="30%"
        backgroundColor={colors.primary[500]}
        p="10px"
        overflow="auto"
        borderRight={`1px solid ${colors.grey[700]}`}
        height='100%'
      >
        <Typography variant="h5" fontWeight="600" mb="10px" color="white">
          Messengers
        </Typography>
        {uniqueMessengers.length > 0 ? (
          uniqueMessengers.map((messenger) => (
            <Box
              key={messenger.senderId}
              display="flex"
              alignItems="center"
              mb="15px"
              p="10px"
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedMessenger?.id === messenger.senderId ? colors.greenAccent[500] : 'inherit',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: colors.greenAccent[700],
                },
              }}
              onClick={() => handleMessengerClick(messenger.senderId)} // Handle messenger selection
            >
              <Avatar src={messenger.picture} alt={messenger.name} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6" color="white">{messenger.name}</Typography>
                <Typography variant="body2" color={colors.grey[300]}>{messenger.role}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="white">No messengers available</Typography>
        )}
      </Box>

      {/* Conversation Window */}
      <Box 
        width="70%" p="20px" 
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {selectedMessenger ? (
          <Box height='100%'>
            <Typography variant="h6" mb="10px" color="white">
              Conversation with {selectedMessenger.firstName} {selectedMessenger.lastName}
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              height="65%"
              overflow="auto"
              paddingBottom="20px"
              borderTop={`1px solid ${colors.grey[700]}`}
            >
              {messages.filter(msg => 
                (msg.senderId === selectedMessenger.id || msg.receiverId === selectedMessenger.id)
              ).map((text, i) => (
                <Box key={i} display="flex" flexDirection="column" alignItems={text.senderId === userId ? 'flex-end' : 'flex-start'}>
                  <Typography
                    sx={{
                      color: text.senderId === userId ? colors.greenAccent[500] : 'white',
                      backgroundColor: text.senderId === userId ? colors.primary[500] : colors.grey[800],
                      p: 1, borderRadius: '10px', maxWidth: '75%',
                      textAlign: text.senderId === userId ? 'right' : 'left',
                    }}
                  >
                    {text.message}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.grey[400], fontSize: '0.8rem', mt: '5px',
                    }}
                  >
                    {formatTimestamp(text.timestamp)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box display="flex" gap="10px">
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                fullWidth
                placeholder="Type your message..."
                sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { backgroundColor: colors.primary[500] } }}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
                sx={{
                  padding: '10px', borderRadius: '8px',
                  backgroundColor: colors.greenAccent[500],
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography color="white" variant="h6">Select a messenger to start chatting</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatComponent;
