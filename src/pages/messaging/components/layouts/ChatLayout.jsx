import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, IconButton, useTheme, useMediaQuery } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group"; // Icon for users
import { tokens } from "../../../dashboard/theme"; 
import { useQuery } from "@apollo/client";
import { GET_CHATROOMS, GET_CHATROOM } from "../../../../utils/graphql/queries";
import { useSelector, useDispatch } from "react-redux";
import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";
import { addChatroom } from "../../../../reduxStore/slices/messageSlice";
import ChatroomHeader from "../chat/chatroomHeader.";
import ChatForm from "../chat/ChatForm";
import { setSelectedView } from '../../../../reduxStore/slices/messageSlice';

export default function ChatLayout() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect mobile/tablet view

  const [users, SetUsers] = useState([]);
  const [mention, setMention] = useState('');
  const [singleRoom, setSingleRoom] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isContact, setIsContact] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // Track if we are in mobile view
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const selectedView = useSelector((state) => state.message.selectedView);
  const replyToMessage = useSelector((state) => state.message.replyToMessage);

  useEffect(() =>{
    if(isMobile){
      dispatch(setSelectedView(null))
    }else{
      dispatch(setSelectedView('messages'))
    };
  }, [])

  const { loading: loadSingleRoom, data: singleRoomData } = useQuery(GET_CHATROOM, {
    variables: { name: user.cohort },
    skip: !(user.cohort && ['student', 'instructor'].includes(user.role)),
  });

  const { loading: loadAllRooms, data: allRoomsData } = useQuery(GET_CHATROOMS, {
    skip: !['admin', 'superadmin'].includes(user.role),
  });

  console.log(selectedView);
  console.log(isMobile)

  useEffect(() => {
    if (singleRoomData) {
      setSingleRoom(singleRoomData.getChatroom);
      dispatch(addChatroom(singleRoomData.getChatroom.name));
    }
  }, [singleRoomData]);

  useEffect(() => {
    if (allRoomsData) {
      setChatRooms(allRoomsData.getChatrooms);
      allRoomsData.getChatrooms.forEach((chatRoom) => {
        dispatch(addChatroom(chatRoom.name));
      });
    }
  }, [allRoomsData]);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  useEffect(() => {
    if (isContact) {
      setFilteredUsers([]);
    } else {
      setFilteredRooms([]);
    }
  }, [isContact]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (isMobile) {
      setIsMobileView(true); // Switch to chat room view in mobile
    }
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);
    const searchedUsers = users.filter((user) =>
      user.displayName.toLowerCase().includes(newSearchQuery.toLowerCase())
    );
    const searchedUsersId = searchedUsers.map((u) => u.uid);
    if (chatRooms.length !== 0) {
      chatRooms.forEach((chatRoom) => {
        const isUserContact = chatRoom.participants.some(
          (e) => e !== user.uid && searchedUsersId.includes(e)
        );
        setIsContact(isUserContact);
        isUserContact
          ? setFilteredRooms([chatRoom])
          : setFilteredUsers(searchedUsers);
      });
    } else {
      setFilteredUsers(searchedUsers);
    }
  };

  const handleBack = () => {
    setIsMobileView(false); // Go back to user list in mobile view
    dispatch(setSelectedView(null));
    console.log(selectedView);
  };

  return (
<Box
  sx={{
    width: "100%",
    maxHeight: "100%",
    height: "100%",
    display: "flex",
    "& .css-5bjl7n ": {
      height: '100%'
    },

  }}
>
  <Grid container sx={{ height: "100%" }}>
    {!isMobile || !isMobileView ? (
      <Grid
        item
        xs={12}
        lg={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.primary[400],
          overflowY: "auto",
          height: "100%",
          borderRadius: "25px" , // Add top-right border-radius,
          boxShadow: theme.palette.mode === 'light'
          ? '0px 4px 4px rgba(0, 0, 0, 0.1)' // Lighter shadow for light mode
          : '0px 4px 12px rgba(0, 0, 0, 0.5) !important',
        }}
      >
        {/* Left panel content */}
        <Box sx={{ 
          padding: 2,
          display: "flex",
          justifyContent: "space-between",

           }}>
          <SearchUsers handleSearch={handleSearch} />
          <IconButton>
            <GroupIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>
        <Box sx={{ padding: 2, overflowY: "auto", flexGrow: 1 }}>
          <AllUsers
            users={searchQuery !== "" ? filteredUsers : users}
            chatRooms={
              searchQuery !== ""
                ? filteredRooms
                : ["admin", "superadmin"].includes(user.role)
                ? chatRooms
                : singleRoom
            }
            setChatRooms={
              ["superadmin", "admin"].includes(user.role)
                ? setChatRooms
                : setSingleRoom
            }
            changeChat={handleChatChange}
            role={user.role}
          />
        </Box>
      </Grid>
    ) : null}

    {
      typeof currentChat !== "undefined" && selectedView ?
      <Grid
      item
      xs={12}
      lg={9}
      sx={{
        paddingLeft: {xs: 0, md: 2},
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        maxHeight: "100%",
        height: "100%",
        borderTopRightRadius: { lg: "20px" }, // Add bottom-right border-radius on large screens
      }}
    >
     <ChatroomHeader
      currentChat={currentChat}
      isMobile={isMobile}
      handleBack={handleBack}
      isMobileView={isMobileView}
      />

      <Box sx={{ height: "auto", borderRadius: 0, overflowY: "auto"}}>
        {currentChat ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box
              sx={{
                flex: 1,
                paddingLeft: {xs: 0, md: 3},
                maxHeight: "100%",
                height: "100%",
              }}
            >
              <ChatRoom
              currentChat={currentChat}
              currentUser={user}
              mention={mention}
              setMention={setMention}
              />
            </Box>
          </Box>
        ) : (
          !isMobile &&
          <Welcome />
        )}
      </Box>
      {/* <ChatForm 
        currentChat={currentChat}
        mention={mention}
        setMention={setMention}
        currentUser={user}
        replyToMessage={replyToMessage}
      /> */}
    </Grid>
    :
    <Grid sx={{diplay: 'flex', justifyContent: 'center', height:'100%'}}>
      <Welcome />
    </Grid>
    }
  </Grid>
</Box>

  );
}
