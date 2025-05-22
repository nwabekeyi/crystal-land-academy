import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const UserCard = ({ img, user }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Avatar Section */}
      <Avatar
        alt={`${user.firstName} ${user.lastName}`}
        src={img}
        sx={{
          width: 64,
          height: 64,
          marginRight: 2,
        }}
      />

      {/* User Info Section */}
      <Box>
        <Typography variant="h6" component="div">
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.role}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserCard;
