// src/components/dashboard/TopTeachers.jsx
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';

const TopTeachers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dummyData = [
    { name: 'Mrs. Ada Obi', rating: 4.8, subject: 'Math' },
    { name: 'Mr. John Eze', rating: 4.7, subject: 'English' },
    { name: 'Ms. Chioma Nwa', rating: 4.6, subject: 'Science' },
    { name: 'Mr. Tunde Ayo', rating: 4.5, subject: 'History' },
  ];

  return (
    <Box sx={{ height: '350px', overflowY: 'auto' }}>
      <List>
        {dummyData.map((teacher, index) => (
          <ListItem key={index} sx={{ backgroundColor: colors.primary[400], mb: 1, borderRadius: '4px' }}>
            <ListItemText
              primary={`${teacher.name} (${teacher.subject})`}
              secondary={`Rating: ${teacher.rating}/5`}
              sx={{ color: colors.grey[100] }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TopTeachers;