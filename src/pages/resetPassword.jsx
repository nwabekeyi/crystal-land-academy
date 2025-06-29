import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Alert } from '@mui/material';
import Footer from './homePage/components/Footer';
import Navbar from './homePage/components/Header';
import LoadingButton from '../components/loadingButton';
import useApi from '../hooks/useApi';
import { endpoints } from '../utils/constants';
import Modal from '../pages/dashboard/components/modal';
import BackgroundWithHome from '../components/backgroundWithHome';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const role = searchParams.get('role'); // Extract role from query params
  const navigate = useNavigate();

  const { loading, error: apiError, callApi } = useApi();

  const handleSuccessModalClose = () => {
    setSuccessModal(false);
    navigate('/');
  };

  const handleSuccessModalConfirm = () => {
    navigate('/signin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    if (!role) {
      setError('Invalid or missing role.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await callApi(
        `${endpoints.RESET_PASSWORD}?token=${encodeURIComponent(token)}`,
        'POST',
        { newPassword }
      );

      if (response && response.status === 'success') {
        setSuccessModal(true);
      }
    } catch (err) {
      setError(apiError || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '30px',
          mx: 2,
        }}
      >
        <Box
          sx={{
            p: 3,
            textAlign: 'start',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: 10,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: '600',
              color: '#15131D',
              fontFamily: 'Inter, Roboto, sans-serif',
            }}
          >
            Reset Password
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 3,
              color: 'text.secondary',
              fontFamily: 'Inter, Roboto, sans-serif',
            }}
          >
            Enter your new password below.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              sx={{
                mb: 2,
                '& label': { fontFamily: 'Inter, Roboto, sans-serif' },
                '& input': { fontFamily: 'Inter, Roboto, sans-serif' },
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{
                mb: 3,
                '& label': { fontFamily: 'Inter, Roboto, sans-serif' },
                '& input': { fontFamily: 'Inter, Roboto, sans-serif' },
              }}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              isLoading={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'none',
                fontFamily: 'Inter, Roboto, sans-serif',
              }}
            >
              Reset Password
            </LoadingButton>
          </form>

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                fontFamily: 'Inter, Roboto, sans-serif',
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Success Modal */}
      <Modal
        open={successModal}
        onClose={handleSuccessModalClose}
        title="Password Reset Successful"
        onConfirm={handleSuccessModalConfirm}
        sx={{
          '& .MuiTypography-root': { fontFamily: 'Inter, Roboto, sans-serif' },
        }}
      >
        <Box sx={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
          <p>Password reset successful. Do you want to login?</p>
        </Box>
      </Modal>
    </div>
  );
};

const ForgotPassword = BackgroundWithHome(ResetPassword);

export default ForgotPassword;