import React,{ useState, useEffect, useRef } from 'react';
import { Box, Typography, Menu, MenuItem, Avatar, Dialog, DialogContent, useTheme } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { tokens } from "../../../dashboard/theme";
import GroupParticipants from "../chat/ChatRoom/GroupParticipants";
import InfoIcon from '@mui/icons-material/Info';
import { useSelector, useDispatch} from 'react-redux';
import { createSelector } from 'reselect';
import { setReplyToMessage } from '../../../../reduxStore/slices/messageSlice';

// Memoized selector for deliveredTo array
const getDeliveredToArray = createSelector(
  (state, currentChat) => state.message?.chatroomMessages?.[currentChat.name],
  (chatroomMessages) => chatroomMessages?.map((message) => message?.deliveredTo) || []
);

// Memoized selector for readBy array
const getReadByArray = createSelector(
  (state, currentChat) => state.message?.chatroomMessages?.[currentChat.name],
  (chatroomMessages) => chatroomMessages?.map((message) => message?.readBy) || []
);

const Message = ({
  self,
  currentChat,
  message
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const deliveredToArray = useSelector((state) => getDeliveredToArray(state, currentChat));
  const readByArray = useSelector((state) => getReadByArray(state, currentChat));

  const deliveredToRef = useRef([]);
  const readByRef = useRef([]);
  const dispatch = useDispatch();

// Function to filter users with existing userId and remove duplicates
const removeDuplicates = (array) => {
  const uniqueUsers = {};
  // First, filter users where user is not null and userId exists
  const filteredArray = array.filter((user) => user && user.userId);

  // Then, remove duplicates based on userId
  filteredArray.forEach((user) => {
    uniqueUsers[user.userId] = user; // Use userId as the key to ensure uniqueness
  });

  return Object.values(uniqueUsers); // Return the array of unique users
};


  useEffect(() => {
    // Remove duplicates from deliveredToArray based on userId
    const uniqueDeliveredTo = removeDuplicates(deliveredToArray.flat());
    deliveredToRef.current = uniqueDeliveredTo;
  }, [deliveredToArray]);

  useEffect(() => {
    // Remove duplicates from readByArray based on userId
    const uniqueReadBy = removeDuplicates(readByArray.flat());
    readByRef.current = uniqueReadBy;
  }, [readByArray]);

  const handleReply = (event) => {
    event.stopPropagation(); // Prevents the event from propagating to the handleClickOutside
    console.log('Reply button clicked'); // Check if the click is triggering correctly
    dispatch(setReplyToMessage(message));

    // Ensure the menu stays open or close it manually
    setMenuOpen(true); // If you want to keep the menu open after clicking Reply
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Allow clicking inside the menu and on the reply button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('button')
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box
      sx={{
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 1,
        position: 'relative',
        flexWrap: 'wrap',
      }}
      data-message-id={message && message._id}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          padding: 1,
          backgroundColor: message.sender && message && self === message.sender.id ? colors.primary[500] : colors.primary[600],
          borderRadius: 2,
          maxWidth: {xs: '95%', sm: '80%', md: '50%'},
          width: 'auto',
          marginLeft: message && self === message.sender?.id ? 'auto' : '0',
          cursor: 'pointer',
          '&:hover': { backgroundColor: colors.grey[700] },
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {message && message.replyTo && Object.keys(message.replyTo).length !== 0 && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontStyle: 'italic', wordWrap: 'break-word', overflowWrap: 'break-word', width: '100%' }}
          >
            {message.replyTo.message}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: message.sender && message && self !== message.sender.id ? 'column' : 'row',
            alignItems: 'start',
            justifyContent: 'center',
            width: '100%',
            flex: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              color: '#fff',
              marginRight: '20px'
            }}
          >
            {message && message.message}
          </Typography>

          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                right: '3px',
                top: '50%',
                marginLeft: '8%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
              onClick={() => setMenuOpen(true)} // Open the menu on click
            >
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: message.sender && message && self === message.sender.id ? '1.5rem' : '1.5rem',
                }}
              />
            </Box>
          )}
        </Box>

        {message.sender && message && self !== message.sender.id && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              marginTop: 1,
              marginRight: '2%',
            }}
          >
            <Avatar
              src={message.sender.profilePictureUrl}
              alt={message.sender.name}
              sx={{ width: 24, height: 24, marginRight: 1 }}
            />
            <Typography
              variant="caption"
              color="#fff"
              sx={{
                fontSize: '0.6rem',
                marginRight: 1,
              }}
            >
              {message.sender.name} ({message.sender.role})
            </Typography>
          </Box>
        )}

          <Box ref={menuRef}>
            <Menu
              anchorEl={menuRef.current}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
            >
              <MenuItem onClick={handleReply}>
                <ReplyIcon sx={{ marginRight: 1 }} /> Reply
              </MenuItem>
              {
                message.sender && message && self === message.sender.id && <MenuItem onClick={() => setInfoOpen(true)}>
                <InfoIcon sx={{ marginRight: 1 }} /> Info
              </MenuItem>
              }
            </Menu>
          </Box>


        <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="sm">
          <DialogContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Delivered To
            </Typography>
            <GroupParticipants title="" participants={deliveredToRef.current || []} />

            <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
              Read By
            </Typography>
            <GroupParticipants title="" participants={readByRef.current || []} />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default React.memo(Message);
