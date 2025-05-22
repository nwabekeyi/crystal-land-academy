import { Typography, Box, useTheme, Divider } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle, home }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box pt="30px" pb='10px'
    sx={{color: theme.palette.mode === "light" ? "#514b82": colors.primary[100],
    }}
    >
   <Typography
  variant="h2"
  fontWeight="bold"
  sx={{
    m: "0 0 5px 0",
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust font sizes for different screen sizes
  }}
>
        {title}
      </Typography>
      <Typography variant="h5" sx={{fontSize: { xs: "0.6rem", sm: "1rem", md: "1.5rem" }, // Adjust font sizes for different screen sizes
  }}>
        {subtitle}
      </Typography>
      {
        !home && <Divider sx={{my: 1}} />

      }
    </Box>
  );
};

export default Header;
