import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, Typography, Popover, Avatar, Button, 
  useTheme, Divider, TextField, Card, CardContent 
} from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import useAuth from '../../../hooks/useAuth';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Modal from './modal';
import { useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useApi';
import { endpoints } from '../../../utils/constants';
import ConfirmationModal from './confirmationModal';
import DownloadIdButton from './IdCards'

const SettingsPopover = ({ anchorEl, handleClose, userDetails }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    program,
    cohort,
    phoneNumber,
    studentId,
    firstName,
    lastName,
    email,
    profilePictureUrl,
    role,
    userId } = userDetails;
  const colorMode = useContext(ColorModeContext);
  const [submissionMessageModal, SetSubmissionMessageModal] = useState(false);
  const { loading, error, data, callApi } = useApi();


  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleSubmissionMessageModal = () => {
    SetSubmissionMessageModal(false);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleDownloadIdCard = () => {
    console.log("Download ID Card");
  };

  const handleSubmitPasswordChange = async () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password must match.");
      return;
    }
  
    // Prepare the body for the API call
    const body = {
      role,
      userId,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };
  
    try {
      // Call the API to update the password
      const response = await callApi(`${endpoints.USER}/changePassword`, 'PUT', body);
      
      // Ensure modal opens even if data isn't immediately available
      SetSubmissionMessageModal(true);
  
      // Optionally, close the password modal regardless of result
      setPasswordModalOpen(false);
  
      // Check for specific message if needed
      if (data && data.message === 'Password updated successfully') {
        console.log(data)
      } else {
        // Additional logic for other cases if needed
        console.log(response)
      }
    } catch (error) {
      console.error("Error updating password:", error);
      SetSubmissionMessageModal(true); // Modal opens even on error
    }
  };


  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          width: '70%', // Default width for small 
          [theme.breakpoints.up('xs')]: {
            width: '80%', // Width for medium screens
          },
          [theme.breakpoints.up('md')]: {
            width: '50%', // Width for medium screens
          },
          [theme.breakpoints.up('lg')]: {
            width: '50%', // Width for large screens
          },
        }}
      >
        <Box display="flex" alignItems="center" p={2} onClick={handleProfileClick} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: colors.grey[600] } }}>
          <Avatar src={profilePictureUrl} sx={{ width: 56, height: 56, mr: 2 }} />
          <Box>
            <Typography variant="h6">{`${firstName} ${lastName}`}</Typography>
            <Typography variant="body2" color="textSecondary">{email}</Typography>
            <Typography variant="body2" color="textSecondary">{role}</Typography>
          </Box>
        </Box>

        <Divider />

        <Box 
          p={2}
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          onClick={handleChangePassword} 
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: colors.grey[600] } }}
        >
          <Typography>Change Password</Typography>
          <LockOutlinedIcon />
        </Box>

        <Divider />

        <Box 
          p={2}
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          onClick={colorMode.toggleColorMode} 
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: colors.grey[600] } }}
        >
          <Typography>Switch Mode</Typography>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </Box>

        <Divider />

        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          p={2}
          onClick={handleLogout} 
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: colors.grey[600] } }}
        >
          <Typography>Sign Out</Typography>
          <LogoutIcon />
        </Box>

        <Modal
          open={passwordModalOpen}
          onClose={handleClosePasswordModal}
          title="Change Password"
          noConfirm={false}
          confirmText="Submit"
          onConfirm={handleSubmitPasswordChange}  // Submit the form on confirm
        >
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
          />
        </Modal>


          {/* confrim chnage password modal */}
          <ConfirmationModal
        open={submissionMessageModal}
        onClose={handleSubmissionMessageModal}
        isLoading={loading}
        title= 'Change password'
        message= {data.message}
        />
      </Popover>

      {/* Profile Popover */}
      <Popover
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            maxWidth: '500px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Card sx={{ textAlign: 'center', p: 2}}>
          <Avatar src={profilePictureUrl} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
          <CardContent>
            <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
            <Typography variant="body1" color="textSecondary">{email}</Typography>
            <Typography variant="body1" color="textSecondary">{phoneNumber}</Typography>
            <Typography variant="body1" color="textSecondary">{role}</Typography>
          {role === 'student' || role === 'instructor' &&
              <Box>
                <Typography variant="body1" color="textSecondary">{program}</Typography>
                <Typography variant="body1" color="textSecondary">{cohort}</Typography>

            </Box>
            }
               {role === 'student' &&
                <Typography variant="body1" color="textSecondary">{studentId}</Typography>

            }
          </CardContent>
           {/* The Download Button is now here */}
           <DownloadIdButton userId={userDetails.id} /> 
        </Card>

      
      </Popover>
    </>
  );
};

export default SettingsPopover;