
import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import FolderIcon from "@mui/icons-material/Folder";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import profileImg from "../../../../images/profile-placeholder.png";
import EmailIcon from "@mui/icons-material/Email";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import { toggleDashboardCollapse } from '../../../../reduxStore/slices/uiSlice';

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      style={{
        display: 'flex',
        boxShadow: selected === title ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none", // Adding box shadow for active menu
        width: "100%",
        alignItems: isCollapsed ? 'center' : 'none',
        justifyContent: isCollapsed ? 'center' : 'none',
      }}
      onClick={() => setSelected(title)}
      icon={React.cloneElement(icon, {
        style: {
          color: selected === title ? colors.greenAccent[500] : colors.grey[100], // Matching icon color with title
        },
      })}
    >
      {!isCollapsed && (
        <Typography
          sx={{
            color: selected === title ? colors.greenAccent[500] : colors.grey[100], // Matching title color with icon
          }}
        >
          {title}
        </Typography>
      )}
      <Link to={to} />
    </MenuItem>
  );
};


const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleDashboardCollapse(isCollapsed));
  }, [isCollapsed])

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileOrTabletDevice = /iphone|ipod|ipad|android|windows phone|blackberry|opera mini|mobile|tablet/i.test(userAgent);
    setIsMobileOrTablet(isMobileOrTabletDevice);
  }, []);

  if (!user) {
    return null; // or a loading spinner, or some fallback UI
  }

  const profileImage = user.profilePictureUrl ?? profileImg;

  const superAdminMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "User Management", to: "/dashboard/userManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <ReceiptOutlinedIcon /> },
    { title: "Financial Management", to: "/dashboard/financialManagement", icon: <ContactsOutlinedIcon /> },
    { title: "Team", to: "/dashboard/team", icon: <PersonOutlinedIcon /> },
    { title: "Analytics and Reporting", to: "/dashboard/analytics", icon: <MapOutlinedIcon /> },
    { title: "Growth & Innovation", to: "/dashboard/growth", icon: <TimelineOutlinedIcon /> },
    { title: "Contacts", to: "/dashboard/contacts", icon: <SettingsOutlinedIcon /> },
    { title: "Support", to: "/dashboard/support", icon: <SupportAgentIcon /> },
    { title: "Feedbacks", to: "/dashboard/feedbacks", icon: <FeedbackIcon /> },
    { title: "Enquiries", to: "/dashboard/enquiries", icon: <EmailIcon /> },
    { title: "Generated Codes", to: "/dashboard/offlineStudents", icon: <PersonOutlinedIcon /> },
  ];

  const adminMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "User Management", to: "/dashboard/userManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <ReceiptOutlinedIcon /> },
    { title: "Analytics and Reporting", to: "/dashboard/analytics", icon: <MapOutlinedIcon /> },
    { title: "Contacts", to: "/dashboard/contacts", icon: <SettingsOutlinedIcon /> },
    { title: "Support", to: "/dashboard/support", icon: <SupportAgentIcon /> },
    { title: "Feedbacks", to: "/dashboard/feedbacks", icon: <FeedbackIcon /> },
    { title: "Enquiries", to: "/dashboard/enquiries", icon: <EmailIcon /> },
    { title: "Generated Codes", to: "/dashboard/offlineStudents", icon: <PersonOutlinedIcon /> },
  ];

  const studentMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Student Progress", to: "/dashboard/studentProgress", icon: <TimelineOutlinedIcon /> },
    { title: "Instructor", to: "/dashboard/studentInstructors", icon: <PersonOutlinedIcon /> },
    { title: "Curriculum", to: "/dashboard/curriculum", icon: <FolderIcon /> },
    { title: "Payment History", to: "/dashboard/studentPayment", icon: <MapOutlinedIcon /> },
  ];

  const instructorMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Course Details", to: "/dashboard/courseManagement", icon: <SchoolIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Student Management", to: "/dashboard/studentManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Reviews", to: "/dashboard/instructorReviews", icon: <GradeIcon /> },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "student":
        return studentMenuItems;
      case "instructor":
        return instructorMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return superAdminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box
    sx={{
      minWidth: isCollapsed ? "65px !important" : "240px !important",
      "& .pro-sidebar .pro-menu": {
        padding: `${isCollapsed ? '8px 0 0 0' : '0'} !important`,
        display: !isCollapsed && 'flex !important'
      },
      "& .pro-sidebar > .pro-sidebar-inner": {
        backgroundColor: `${colors.primary[400]} !important`,
        position: "fixed !important",
        width: isCollapsed ? "55px" : "240px !important",
        height: `${isCollapsed ? '95%' : '100%'} !important`,
        borderRadius: `${isCollapsed ? '20px' : '0px'} !important`,
        boxShadow: theme.palette.mode === 'light'
        ? '0px 4px 4px rgba(0, 0, 0, 0.1)' // Lighter shadow for light mode
        : '0px 4px 12px rgba(0, 0, 0, 0.5) !important',
      },
      "& .pro-sidebar": {
        minWidth: '90%',
        width: 'fit-content !important',
        maxWidth: isCollapsed ? "60px !important" : "220px !important",
        display: 'flex !important',
        alignItems: 'center !important',
        backgroundColor:
          theme.palette.mode === "light"
            ? `${colors.primary[900]} !important`
            : `${colors.primary[500]} !important`,
        justifyContent: "center !important",
      },
      // "& .pro-sidebar.collapsed": {
      //   minWidth: '70px !important'
      // },
      "& .pro-sidebar .pro-menu.square .pro-menu-item > .pro-inner-item > .pro-icon-wrapper": {
        backgroundColor: "transparent !important",
        margin: "1vh 0 !important",
        display: "flex !important",
        justifyContent: 'center !important',
        height: 'auto !important'
      },
      "& .pro-icon": {
        justifyContent: "flex-start !important",
      },
      // "& .pro-menu-item.active": {
      //   justifyContent: "start !important",
      // },
      "& .pro-inner-item": {
        padding: "10px 5px 5px 5px !important",
        color: theme.palette.mode === "light"
          ? `${colors.grey[100]} !important`
          : `${colors.primary[200]} !important`,
      },
      "& .pro-inner-item:hover": {
        color: "#868dfb !important",
      },
      "& .pro-menu-item.active": {
        display: 'flex !important',
        justifyContent: "center !important",
        color: "#6870fa !important",
      },
      "& .css-1l8icbj": {
        padding: "0 !important",
      },
      "& .pro-sidebar > .pro-sidebar-inner > .pro-sidebar-layout ul": {
        width: !isCollapsed ? '100%' : 'none',
      },
    }}>
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">

           {/* Only show the MenuOutlinedIcon on non-mobile devices */}
           {
             !isMobileOrTablet && 
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                // Toggle between MenuOutlinedIcon (when expanded) and CloseIcon (when collapsed)
                style={{
                  margin: "10px 0 20px 0",
                  color: isCollapsed && colors.grey[100],
                }}
              >
            {!isCollapsed ? 
              <Box display="flex"  color={colors.grey[100]} justifyContent="space-between" alignItems="center" mx='15px'>
                <CloseIcon sx={{color:colors.grey[100]}}
                 onClick={() => setIsCollapsed(!isCollapsed)
                 } />
              </Box>
              :
              <Box display="flex"  color={colors.grey[100]} justifyContent="center" alignItems="center">
              <MenuOutlinedIcon sx={{color:colors.grey[100]}}
               onClick={() => setIsCollapsed(!isCollapsed)} />
            </Box>
            }
          </MenuItem>
           }

          {!isCollapsed && (
            <Box mb="25px" display="flex" justifyContent="center" alignItems="center" flexDirection= 'column'>
              <Avatar
                src={profileImage}
                alt="user-profile"
                sx={{
                  width: "120px",
                  height: "120px",
                  cursor: "pointer",
                  mb: '10px'
                }}
              />
                <Typography 
                    variant="h3" 
                    color= {theme.palette.mode === 'light' ? 
                    colors.greenAccent[100] : colors.grey[100]}>
                  {user?.firstName}
                </Typography>
                <Typography variant="h5" 
                 color= {theme.palette.mode === 'light' ? 
                  colors.greenAccent[100] : colors.grey[100]}>
                  {user?.role}
                </Typography>
            </Box>
          )}

          <Box
            sx ={{
                  display: 'flex',
                  flexDirection: 'column', 
                  alignItems: 'center',
                  width: !isCollapsed ? '100%' : 'none'
                  }}>
            {menuItems.map(({ title, to, icon }) => (
              <Item
                key={title}
                title={title}
                to={to}
                icon={icon}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
            ))}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;