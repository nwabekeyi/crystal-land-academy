import { Box, useTheme, Grid } from "@mui/material";
import { tokens } from '../theme';

const DashboardDataBox = ({ children, noFlex, height, moreStyles = {} }) => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  return (
    <Box
    backgroundColor={colors.primary[400]}
    p="20px"
    borderRadius="10px"
    textAlign="center"
    display= {!noFlex && "flex"}
    flexDirection= "column"
    justifyContent="center" 
    alignItems="center"
    sx={{
      height: height ? height : '100%',
      boxShadow: theme.palette.mode === 'light'
        ? '0px 2px 10px rgba(0, 0, 0, 0.1)' // Lighter shadow for light mode
        : '0px 4px 12px rgba(0, 0, 0, 0.3)', // Darker shadow for dark mode
        ...moreStyles
    }}
  >
      {children} {/* Rendering children inside the Box */}
    </Box>
  );
};


const RowGrid = ({children, ...rest }) => {

  return (
    <Grid container spacing={2} {...rest}>
      {children} {/* Rendering children inside the Box */}
    </Grid>
  );
};

const RowContainer = ({children }) => {

  return (
    <Grid container item xs={12} spacing={2}>
      {children} {/* Rendering children inside the Box */}
    </Grid>
  );
};


const ResponsiveContainer = ({children, ...rest }) => {

  return (
    <Grid item xs={12} {...rest}>
      {children} {/* Rendering children inside the Box */}
    </Grid>
  );
};




export {
  RowGrid, 
  DashboardDataBox,
  RowContainer,
  ResponsiveContainer
}
