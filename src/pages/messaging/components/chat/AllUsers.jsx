import { useState, useEffect } from "react";
import { Avatar, List, ListItem, ListItemText, Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../../dashboard/theme"; // Your token function
import { setSelectedView } from '../../../../reduxStore/slices/messageSlice';
import { useDispatch } from 'react-redux';

export default function AllUsers({
  chatRooms, // Default to empty array
  onlineUsersId = [],
  currentUser = {},
  changeChat = () => {},
  role = '' // Default to empty string
}) {
  const [selectedChat, setSelectedChat] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!role) {
      console.error("Role is not defined.");
      return;
    }
  }, [role]);

  const changeCurrentChat = (chatRoom) => {
    setSelectedChat(chatRoom);
    changeChat(chatRoom);
  };

  const getInitials = (name = '') => {
    if (!name) return '';
    const nameParts = name.split(" ");
    const initials =
      nameParts.length > 1
        ? nameParts[0][0] + nameParts[1][0]
        : nameParts[0][0] + (nameParts[0][1] || '');
    return initials.toUpperCase();
  };

  // Render a single chat room (for student or instructor)
  const renderSingleChatRoom = (chatRoom) => {
    if (!chatRoom) return null;

    return (
      <ListItem
        button
        selected={selectedChat === chatRoom}
        onClick={() => {
          changeCurrentChat(chatRoom);
          dispatch(setSelectedView('messages'));
        }}
        sx={{
          backgroundColor: selectedChat === chatRoom ? colors.greenAccent[700] : colors.greenAccent[700],
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          borderRadius: '20px'
        }}
      >
        <Avatar
          src={chatRoom.avatarUrl || ""}
          alt={chatRoom.name || "Chat Room"}
          sx={{ width: 32, height: 32, mr: 2 }}
        >  

          {!chatRoom.avatarUrl && getInitials(chatRoom.name)}
        </Avatar>
        
        {/* Render chat room name */}
        <ListItemText
          primary={chatRoom.name}
          secondary={`Participants: ${chatRoom.participants ? chatRoom.participants.length : 0}`}
        />
      </ListItem>
    );
  };

  // Render multiple chat rooms (for admin and superadmin)
  const renderMultipleChatRooms = () => {
    if (!chatRooms || chatRooms.length === 0) {
      return (
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          No chats available
        </Typography>
      );
    }
    return chatRooms.map((chatRoom, index) => (
      <ListItem
        button
        key={index}
        selected={selectedChat === chatRoom}
        onClick={() => changeCurrentChat(chatRoom)}
        sx={{
          backgroundColor: selectedChat === chatRoom ? colors.primary[800] : colors.primary[800],
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Avatar
        
          src={chatRoom.avatarUrl || ""}
          alt={chatRoom.name || "Chat Room"}
          sx={{ width: 50, height: 50, mr: 2 }}
        >
          {!chatRoom.avatarUrl && getInitials(chatRoom.name)}
        </Avatar>
        
        {/* Render chat room name */}
        <ListItemText
            primary={
              <Typography variant="h1" sx={{ fontWeight: 'bold'}}>
                {chatRoom.name}
              </Typography>
            }
            secondary={`Participants: ${chatRoom.participants ? chatRoom.participants.length : 0}`}
          />

      </ListItem>
    ));
  };

  return (
    <Box sx={{ maxHeight: '30rem', overflowY: 'auto' }}>
      {/* Display Chat Room Header */}
      <Typography variant="h6" sx={{ my: 2, ml: 2 }}>Chat Rooms</Typography>

      {/* Render chat rooms for admin or superadmin */}
      {["admin", "superadmin"].includes(role) ? (
        <List>
          {renderMultipleChatRooms()}
        </List>
      ) : (
        // Render single chat room for students and instructors
        chatRooms && renderSingleChatRoom(chatRooms)
      )}
    </Box>
  );
}
