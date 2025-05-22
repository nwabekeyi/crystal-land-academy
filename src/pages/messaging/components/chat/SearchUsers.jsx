import { Search } from "@mui/icons-material";
import { InputBase, Box, IconButton, useTheme } from "@mui/material";
import { styled } from '@mui/system';
import { tokens } from "../../../dashboard/theme"; // Your token function


const SearchBox = styled(Box)(({ theme, colors }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '10px',
  backgroundColor: colors.primary[800],
  padding: '0 10px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export default function SearchUsers({ handleSearch }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box>
      <SearchBox colors={colors}>
        <IconButton sx={{ p: 1 }}>
          <Search />
        </IconButton>
        <InputBase
          id="search"
          name="search"
          placeholder="Search"
          fullWidth
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            flex: 1,
            '& input': {
              color: theme.palette.text.primary,
            },
          }}
        />
      </SearchBox>
    </Box>
  );
}
