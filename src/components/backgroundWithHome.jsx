import React from 'react';
import { Box } from '@mui/material';
import App from '../pages/homePage'; // Import App or your background component

const BackgroundWithHome = (WrappedComponent) => {
  return (props) => {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Blurred, Fixed Background (App component) */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1, // Keep the background behind the content
            filter: 'blur(5px)', // Apply blur effect to the background
            overflow: 'hidden', // Prevent content overflow
          }}
        >
          <App />
        </Box>

        {/* Wrapped Component (Content on top of the blurred background) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1, // Ensure the wrapped component stays above the background
          }}
        >
          <WrappedComponent {...props} />
        </Box>
      </Box>
    );
  };
};

export default BackgroundWithHome;
