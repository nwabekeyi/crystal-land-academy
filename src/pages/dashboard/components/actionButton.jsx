import { Box, Typography, useTheme, ButtonBase } from '@mui/material';
import { tokens } from '../theme';

const ActionButton = ({ icon, content, onClick, submit, ...props }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Set different background and text colors for light and dark mode
  const backgroundColor = theme.palette.mode === 'light'
    ? '#514b82'  // Lighter color for light mode
    : colors.greenAccent[600]; // Darker color for dark mode

  const hoverBackgroundColor = theme.palette.mode === 'light'
    ? '#423c71'  // Darker hover color for light mode
    : '#000000'; // Lighter hover color for dark mode

  const textColor = theme.palette.mode === 'light'
    ? colors.grey[900]  // Dark text for light mode
    : colors.grey[100]; // Light text for dark mode

  return (
    <ButtonBase
      onClick={onClick}
      
      type={submit && 'submit'}
      width= '100%'
    >
      <Box
        width={{
          xs: '120px',  // Width for extra-small screens (mobile)
          sm: '150px',  // Width for small screens (tablet)
          md: '170px',  // Width for medium screens (desktop)
          lg: '200px',  // Width for large screens
        }}
        m="0"
        py="8px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor}
        borderRadius="4px"
        sx={{
          transition: 'all 0.3s ease',  // Smooth transition effect
          '&:hover': {
            backgroundColor: hoverBackgroundColor,
            transform: 'scale(1.02)',  // Slightly enlarge the button on hover
          },
        }}
        {...props}
      >
        {
          icon && <Typography
          color={textColor}
          sx={{
            mb: '5px',
            mx: '5px',
            fontSize: {
              xs: '12px',  // Font size for extra-small screens (mobile)
              sm: '14px',  // Font size for small screens (tablet)
              md: '16px',  // Font size for medium screens (desktop)
              lg: '18px',  // Font size for large screens
            },
          }}
        >
          {icon}
        </Typography>
        }
        
        <Typography
          color={textColor}
          fontWeight="900"
          sx={{
            fontSize: {
              xs: '10px',  // Font size for extra-small screens
              sm: '12px',  // Font size for small screens
            },
          }}
        >
          {content}
        </Typography>
      </Box>
    </ButtonBase>
  );
};

export default ActionButton;
