import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ figure, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px" p="0 5px" 
  >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center">
          {icon && (
            <Box
              sx={{ fontSize: "50px", color: colors.blueAccent[400], mr: 5, pt: 3 }} // Adjust fontSize as needed
            >
              {icon}
            </Box>
          )}

        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" mt="2px" flexDirection= "column">
        <Box display="flex" justifyContent="center" alignItems="center" mt="2px">
        <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {figure}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" mt="2px">
          <Typography variant="h5" sx={{ color: colors.blueAccent[400] }}>
            {subtitle}
          </Typography>
        </Box>
        </Box>
        
      </Box>
    </Box>
  );
};

export default StatBox;
