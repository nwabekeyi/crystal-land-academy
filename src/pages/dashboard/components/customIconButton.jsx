import { IconButton } from '@mui/material';
import React from 'react';

const CustomIconButton = ({ onClick, icon, title, ...props }) => {
  return (
    <IconButton
    title ={title}
      onClick={onClick}
      sx={{
        fontSize: {
          xs: '12px',  // Extra small screens (phones)
          sm: '12px',  // Small screens (tablets)
          md: '18px',  // Medium screens (desktops)
          lg: '18px',  // Large screens
          xl: '18px',  // Extra large screens
        },
        ...props.sx,  // Allow additional styles to be passed in
      }}
      {...props}
    >
      {React.cloneElement(icon, { fontSize: "inherit" })}
    </IconButton>
  );
};

export default CustomIconButton;
