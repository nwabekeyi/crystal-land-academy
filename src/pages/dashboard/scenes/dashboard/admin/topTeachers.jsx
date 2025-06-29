import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { tokens } from '../../../theme';
import { selectAdminDataState } from '../../../../../reduxStore/slices/adminDataSlice';

const TopTeachers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { usersData } = useSelector(selectAdminDataState);

  // Transform and sort teacher data
  const teacherData = usersData.teachers && usersData.teachers.length > 0
    ? usersData.teachers
        .map((teacher) => ({
          name: `${teacher.firstName} ${teacher.lastName}`.trim(),
          subject: teacher.subject && teacher.subject.length > 0 ? teacher.subject[0].name : 'No Subject',
          rating: teacher.rating || 0,
        }))
        .sort((a, b) => b.rating - a.rating) // Sort by rating in descending order
        .slice(0, 5) // Take top 5
    : [];

  return (
    <Box sx={{ height: '350px', overflowY: 'auto' }}>
      {teacherData.length > 0 ? (
        <List>
          {teacherData.map((teacher, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: colors.primary[400],
                mb: 1,
                borderRadius: '4px',
              }}
            >
              <ListItemText
                primary={`${teacher.name} (${teacher.subject})`}
                secondary={`Rating: ${teacher.rating}/5`}
                sx={{ color: colors.grey[100] }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography color={colors.grey[100]}>No teachers available</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TopTeachers;