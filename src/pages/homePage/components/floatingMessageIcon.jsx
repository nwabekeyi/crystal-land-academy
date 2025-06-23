import React from 'react';
import { IconButton, Typography, useTheme, Tooltip } from '@mui/material';
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
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: showLabel ? '80px' : '20px', // Adjust for Enquiry icon overlap
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleClick}
    >
      <Tooltip title={showLabel ? "Submit Enquiry" : "Open Chat"} placement="left" arrow>
        <IconButton
          sx={{
            backgroundColor:
              theme.palette.mode === 'light'
                ? '#514b82' // Light mode
                : colors.greenAccent[600], // Dark mode
            color: '#fff',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? '#3e3b6d' // Hover light
                  : colors.greenAccent[500], // Hover dark
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
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
            color: '#524B82',
            fontWeight: '1.5rem',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          Message Us
        </Typography>
      )}
    </div>
  );
};

export default FloatingMessageIcon;