import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Avatar, InputBase, IconButton, useTheme, Badge, List, ListItem, ListItemText, Divider } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; 
import SettingsPopover from '../../components/settingsPopover';
import { tokens } from "../../theme"; // Assuming tokens is your color utility function
import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { unreadCount } = useSelector((state) => state.notifications);
  const userDetails = useSelector((state) => state.users.user);
  const isDashboardCollapse = useSelector((state) => state.ui.isDashboardCollapse);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const path = useLocation().pathname;
  const navigate = useNavigate();  // For navigation based on search

  // Sample search data (could be dynamic)

  const searchResult = () => {
    switch(userDetails?.role){
      case 'student': return [
        { name: "Dashboard", to: "/dashboard" },
        { name: "Timetable", to: "/dashboard/timeTable"},
        { name: "Assignments", to: "/dashboard/assignment"},
        { name: "Learning Plan", to: "/dashboard/learningPlan"},
        { name: "Student Progress", to: "/dashboard/studentProgress"},
        { name: "Instructor", to: "/dashboard/studentInstructors"},
        { name: "Curriculum", to: "/dashboard/curriculum"},
        { name: "Payment History", to: "/dashboard/studentPayment"},
      ];
      break;
      
      case 'instructor': return [
        { name: "Dashboard", to: "/dashboard"},
        { name: "Course Details", to: "/dashboard/courseManagement"},
        { name: "Timetable", to: "/dashboard/timeTable"},
        { name: "Assignments", to: "/dashboard/assignment"},
        { name: "Student Management", to: "/dashboard/studentManagement"},
        { name: "Learning Plan", to: "/dashboard/learningPlan"},
        { name: "Reviews", to: "/dashboard/instructorReviews"},
      ];
      break;

      case 'admin': return [
        { name: "Dashboard", to: "/dashboard" },
        { name: "User Management", to: "/dashboard/userManagement"},
        { name: "Course Management", to: "/dashboard/courseManagement"},
        { name: "Analytics and Reporting", to: "/dashboard/analytics"},
        { name: "Contacts", to: "/dashboard/contacts" },
        { name: "Support", to: "/dashboard/support"},
        { name: "Feedbacks", to: "/dashboard/feedbacks"},
        { name: "Enquiries", to: "/dashboard/enquiries"},
        { name: "Generated Codes", to: "/dashboard/offlineStudents"},
      ];
      break;

      default: return [
        { name: "Dashboard", to: "/dashboard"},
        { name: "User Management", to: "/dashboard/userManagement"},
        { name: "Course Management", to: "/dashboard/courseManagement"},
        { name: "Financial Management", to: "/dashboard/financialManagement"},
        { name: "Team", to: "/dashboard/team"},
        { name: "Analytics and Reporting", to: "/dashboard/analytics"},
        { name: "Growth & Innovation", to: "/dashboard/growth"},
        { name: "Contacts", to: "/dashboard/contacts"},
        { name: "Support", to: "/dashboard/support"},
        { name: "Feedbacks", to: "/dashboard/feedbacks"},
        { name: "Enquiries", to: "/dashboard/enquiries"},
        { name: "Generated Codes", to: "/dashboard/offlineStudents"},
      ];

    }
  }
  const searchData = searchResult();

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter search data based on query
    const filteredResults = searchData.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    setSearchResults(filteredResults);  // Update search results
  };

  // Handle selection of search result
  const handleSearchResultClick = (path) => {
    navigate(path);  // Navigate to the selected path
    setSearchQuery("");  // Clear the search input
    setSearchResults([]);  // Clear the search results
  };

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleOpenSettings = (event) => {
    console.log("Settings clicked", event.currentTarget);
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  const handleCloseSettings = () => {
    setSettingsAnchorEl(null);
  };

  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const isSettingsOpen = Boolean(settingsAnchorEl);

  return (
    <Box
      mt={3}
      display="flex"
      justifyContent="stretch"
      py={1}
      px={{xs:2, md:4}}
      sx={{
        borderRadius:"20px",
        boxShadow: theme.palette.mode === 'light'
          ? '0px 4px 0px rgba(0, 0, 0, 0.1)' // Lighter shadow for light mode
          : '0px 4px 12px rgba(0, 0, 0, 0.5)', // Darker shadow for dark mode
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: colors.primary[400],
        width: "100%",
      }}
    >
      {/* SEARCH BAR */}
      <Box display="flex" alignItems='center' sx={{flex:'2'}}>
        <Box
         sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px',
          backgroundColor: colors.primary[800],
          padding: '0 10px',
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
         }}
        >
          <InputBase
            sx={{ pl: 2, flex: 1, color: 'white' }}
            placeholder="Search"
            value={searchQuery} // Bind search query value
            onChange={handleSearchChange} // Handle search query update
          />
          <IconButton type="button" sx={{ p: 1, color: 'white' }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Code Generator (Admin/Superadmin only) */}
        {
          (userDetails.role === "superadmin" || userDetails.role === "admin") 
          && path === '/dashboard/userManagement' 
          &&<CodeGenerator />
        }
      </Box>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <Box 
          sx={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: colors.grey[100],
            color: colors.primary[900],
            boxShadow: 3,
            width: "50%",
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        >
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <ListItem button onClick={() => handleSearchResultClick(result.to)} key={result.path}>
                  <ListItemText primary={result.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </Box>
      )}

      {/* ICONS */}
      <Box display="flex" sx={{ justifyContent: 'end', alignItems: 'center' }}>
      <IconButton
        onClick={handleOpenNotifications}
        sx={{
          color: theme.palette.mode === "light" ? colors.grey[100] : colors.primary[200],
          padding: '4px',
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      {/* Conditionally render based on isDashboardCollapse */}
      {isDashboardCollapse ? (
        <Avatar 
          src={userDetails.profilePictureUrl} alt="User Profile" 
          sx={{ width: 25, height: 25, cursor: 'pointer' }} 
          onClick={handleOpenSettings}
/>
      ) : (
        <IconButton
          onClick={handleOpenSettings}
          sx={{
            color: theme.palette.mode === "light" ? colors.grey[100] : colors.primary[200],
            padding: '4px',
          }}
        >
          <SettingsOutlinedIcon />
        </IconButton>
      )}
    </Box>

      {/* Notifications Popover */}
      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        handleClose={handleCloseNotifications}
        userId={userDetails.userId}
        role={userDetails.role}
      />

      {/* Settings Popover */}
      <SettingsPopover
        anchorEl={settingsAnchorEl}
        handleClose={handleCloseSettings}
        userDetails={userDetails}
      />
    </Box>
  );
};

export default Topbar;
