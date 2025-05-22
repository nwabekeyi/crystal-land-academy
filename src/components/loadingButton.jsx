import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a styled version of the Button component
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#15131D',
  padding: '2% 0',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '1em',
  cursor: 'pointer',
  marginTop: '15px',
  transition: 'background 0.3s',
  zIndex: 3,

  '&:hover': {
    backgroundColor: '#fff',
    color: 'black',
    },
}));

const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <StyledButton
      {...props}
      disabled={isLoading}
      endIcon={isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.5em'
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
    >
      {isLoading ? null : children}
    </StyledButton>
  );
};

export default LoadingButton;
