import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, IconButton, Menu, MenuItem, Avatar, List, ListItem, ListItemText, colors, useTheme } from '@mui/material';
import { tokens } from "../../../dashboard/theme"; // Your token function
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedView } from '../../../../reduxStore/slices/messageSlice';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatroomHeader =({
  isMobile,
  isMobileView,
  handleBack,
  currentChat
}) => {
const [anchorEl, setAnchorEl] = useState(null);
const theme = useTheme();
const colors = tokens(theme.palette.mode);
const selectedView = useSelector((state) => state.message.selectedView);
const dispatch = useDispatch();
const messages = useSelector((state) => state.message.messages);



const handleMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

const handleMenuSelect = (view) => {
  dispatch(setSelectedView(view));
  handleMenuClose();
};
    return(
        <Box sx={{
          width: '100%',
          padding: 1 ,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.primary[400],
          borderRadius: {xs: '20px', md: '25px'},
          zIndex: 1000  // Ensures it's always above the scrollable content
   }}>
     <Box sx={{ display: 'flex', alignItems: 'center' }}>
       {selectedView !== 'messages' && (
         <IconButton onClick={() => dispatch(setSelectedView('messages'))}>
           <ArrowBackIcon />
         </IconButton>
         )}
         <Box display='flex' alignItems='center'>

           {isMobile && isMobileView && (
           <IconButton onClick={handleBack} sx={{ top: 1, left: 1 }}>
             <ArrowBackIcon sx={{ color: colors.grey[100] }} />
           </IconButton>
             )}

     <Box display="flex" alignItems="center">
       <Avatar alt={currentChat && currentChat.name} src={currentChat && currentChat.avatarUrl} 
        sx={{height: {xs: "30px", md: '40px'}, width: {xs: "30px", md: '40px'}}}
       />
          <Typography variant={{xs:"h5", md: 'h3'}} component="h2" sx={{ marginLeft: '8px' }}>
          {currentChat && currentChat.name}
       </Typography>
     </Box>


       </Box>
     </Box>

     <IconButton onClick={handleMenuOpen}>
       <MoreVertIcon />
     </IconButton>

     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
       <MenuItem onClick={() => handleMenuSelect('groupInfo')}>Group Info</MenuItem>
       <MenuItem onClick={() => handleMenuSelect('search')}>Search</MenuItem>
       <MenuItem onClick={() => handleMenuSelect('participants')}>See Group Participants</MenuItem>
     </Menu>

   </Box>
    )
}

export default ChatroomHeader;