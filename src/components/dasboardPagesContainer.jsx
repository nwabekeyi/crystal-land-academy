import React from "react";
import { Box } from "@mui/material";

// Higher-Order Component
const withDashboardWrapper = (WrappedComponent) => {
  return (props) => {
    const { home } = props; // Destructure props to get 'home'
    console.log('Home prop in HOC:', home); // Should log 'true'

    return (
<Box sx={{ 
            // p: { xs: 1, sm: 0, md: 0, lg: 0}, 
            // pr: { xs: 0, sm: 0, md: 0, lg: 2 }, 
            overflow: 'auto',
            minWidth: {sx: '90%', sm: '100%', md:"100%", lg: '100%'}
            }}>
        <WrappedComponent {...props} />
      </Box>
    );
  };
};

export default withDashboardWrapper;
