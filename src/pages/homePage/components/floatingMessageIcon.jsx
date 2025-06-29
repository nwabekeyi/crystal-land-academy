import React from 'react';
import { IconButton, Typography, useTheme, Tooltip, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokens } from '../../dashboard/theme';

const FloatingMessageIcon = ({ onClick, showLabel = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Default click handler: navigate to /dashboard/messenger
  const handleClick = () => {
    if (onClick) {
      onClick(); // Custom handler (e.g., open enquiry modal)
    } else {
      navigate('/dashboard/messenger'); // Default: go to messenger
    }
  };

  // Hide icon on /dashboard/messenger
  if (pathname === '/dashboard/messenger') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: '16px', sm: '20px', md: '24px' }, // Bottom offset
        right: { xs: '16px', sm: '20px', md: '24px' }, // Right offset matches bottom
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000, // Ensure above other elements
      }}
      onClick={handleClick}
    >
      <Tooltip title={showLabel ? 'Submit Enquiry' : 'Open Chat'} placement="left" arrow>
        <IconButton
          sx={{
            backgroundColor:
              theme.palette.mode === 'light'
                ? 'rgba(81, 75, 130, 0.8)' // Light mode: semi-transparent
                : colors.greenAccent[600], // Dark mode
            color: '#fff',
            width: { xs: 48, sm: 56, md: 64 }, // Responsive width
            height: { xs: 48, sm: 56, md: 64 }, // Responsive height
            backdropFilter: 'blur(12px)', // Glassmorphism effect
            border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
            borderRadius: '50%', // Circular shape
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(62, 59, 109, 0.8)' // Hover light
                  : colors.greenAccent[500], // Hover dark
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            '& svg': {
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' }, // Responsive icon size
            },
          }}
          aria-label={showLabel ? 'submit enquiry' : 'open chat'}
        >
          <ChatIcon />
        </IconButton>
      </Tooltip>
      {showLabel && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.mode === 'light' ? '#524B82' : '#fff', // Theme-based color
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, // Responsive font size
            fontWeight: 500,
            mt: 0.5,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          Message Us
        </Typography>
      )}
    </Box>
  );
};

export default FloatingMessageIcon;