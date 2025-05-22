import React from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const FloatingMessageIcon = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleMessage = () => {
    navigate('/dashboard/messenger');
  };

  return (
    <div>
      {path === '/dashboard/messenger' ? null : (
        <div
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
          onClick={handleMessage}
        >
          <Fab
            sx={{
              backgroundColor:
                theme.palette.mode === 'light'
                  ? '#514b82' // Color for light mode
                  : colors.greenAccent[600], // Color for dark mode
              color: '#fff', // Text/icon color
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? '#3e3b6d' // Slightly darker for hover in light mode
                    : colors.greenAccent[500], // Slightly lighter for hover in dark mode
              },
            }}
            aria-label="chat"
          >
            <ChatIcon />
          </Fab>
        </div>
      )}
    </div>
  );
};

export default FloatingMessageIcon;
