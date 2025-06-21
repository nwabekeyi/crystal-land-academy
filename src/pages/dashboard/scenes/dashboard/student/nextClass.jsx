// src/components/studentDashboard/NextClass.jsx
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useStudentData  from './useStudentData';

const NextClass = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { nextClass } = useStudentData(); // Assumed to return { subject, date, time, location }
  const dummyNextClass = {
    subject: 'Mathematics',
    date: '2025-06-23',
    time: '10:00 AM',
    location: 'Room 12',
  };

  const classData = nextClass || dummyNextClass;

  return (
    <Box textAlign="center">
      <Typography variant="h6" fontWeight="600" mb="5px">
        Next Class
      </Typography>
      {classData ? (
        <Box>
          <SchoolIcon sx={{ fontSize: '30px', color: colors.blueAccent[400] }} />
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