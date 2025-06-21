// src/components/teacherDashboard/NextClass.jsx
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useTeacherData  from './useTeacherData';

const NextClass = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { nextClass } = useTeacherData(); // Assumed to return { subject, date, time, location }
  const dummyNextClass = {
    subject: 'Mathematics',
    date: '2025-06-23',
    time: '10:00 AM',
    location: 'Room 12',
  };

  const classData = nextClass || dummyNextClass;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Typography variant="h5" fontWeight="600" mb="15px" textAlign="center">
        Next Class
      </Typography>
      {classData ? (
        <Box textAlign="center">
          <SchoolIcon sx={{ fontSize: '50px', color: colors.blueAccent[500] }} />
          <Typography variant="h6">{classData.subject}</Typography>
          <Typography>{classData.date}</Typography>
          <Typography>{classData.time}</Typography>
          <Typography>Location: {classData.location}</Typography>
        </Box>
      ) : (
        <Typography>No upcoming classes.</Typography>
      )}
    </Box>
  );
};

export default NextClass;