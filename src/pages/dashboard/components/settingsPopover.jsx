import React, { useState, useContext } from 'react';
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
import ConfirmationModal from './confirmationModal';
import DownloadIdButton from './IdCards';
import {endpoints} from '../../../utils/constants';

const SettingsPopover = ({ anchorEl, handleClose, userDetails }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submissionError, setSubmissionError] = useState(false);

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
    _id
  } = userDetails;
  const colorMode = useContext(ColorModeContext);
  const [submissionMessageModal, setSubmissionMessageModal] = useState(false);
  const { loading, error: apiError, callApi } = useApi();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSubmissionMessage('');
    setSubmissionError(false);
  };

  const handleSubmissionMessageModal = () => {
    setSubmissionMessageModal(false);
    setSubmissionMessage('');
    setSubmissionError(false);
    if (!submissionError) {
      navigate('/dashboard'); // Redirect to dashboard on success
    }
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
      setSubmissionMessage('New password and confirm password must match.');
      setSubmissionError(true);
      setSubmissionMessageModal(true);
      return;
    }

    // Prepare the body for the API call
    const body = {
      userId:_id,
      role,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };

    try {
      // Call the API to update the password
      const response = await callApi(
        endpoints.CHANGEPASS, // Correct endpoint
        'PATCH', // Use POST as defined in the router
        body,
      );

      // Set success message and open modal
      setSubmissionMessage(response.message || 'Password changed successfully');
      setSubmissionError(false);
      setSubmissionMessageModal(true);
      setPasswordModalOpen(false); // Close the password input modal
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    } catch (error) {
      // Handle API error
      setSubmissionMessage(apiError || 'Failed to change password. Please try again.');
      setSubmissionError(true);
      setSubmissionMessageModal(true);
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
        <Box
          display="flex"
          alignItems="center"
          p={2}
          onClick={handleProfileClick}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: colors.grey[600] } }}
        >
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
          onConfirm={handleSubmitPasswordChange}
        >
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            required
          />
        </Modal>

        <ConfirmationModal
          open={submissionMessageModal}
          onClose={handleSubmissionMessageModal}
          isLoading={loading}
          title="Change Password"
          message={submissionMessage}
          error={submissionError}
        />
      </Popover>

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
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Avatar src={profilePictureUrl} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
          <CardContent>
            <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
            <Typography variant="body1" color="textSecondary">{email}</Typography>
            <Typography variant="body1" color="textSecondary">{phoneNumber}</Typography>
            <Typography variant="body1" color="textSecondary">{role}</Typography>
            {(role === 'student' || role === 'instructor') && (
              <Box>
                <Typography variant="body1" color="textSecondary">{program}</Typography>
                <Typography variant="body1" color="textSecondary">{cohort}</Typography>
              </Box>
            )}
            {role === 'student' && (
              <Typography variant="body1" color="textSecondary">{studentId}</Typography>
            )}
          </CardContent>
          <DownloadIdButton userId={userDetails.id} />
        </Card>
      </Popover>
    </>
  );
};

export default SettingsPopover;