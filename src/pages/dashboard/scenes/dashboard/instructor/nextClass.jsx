// src/components/teacherDashboard/NextClass.jsx
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useTeacherData from './useTeacherData';

const NextClass = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { nextClass } = useTeacherData(); // { subject, date, time, location } or null

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Typography variant="h5" fontWeight="600" mb="15px" textAlign="center">
        Next Class
      </Typography>
      {nextClass ? (
        <Box textAlign="center">
          <SchoolIcon sx={{ fontSize: '50px', color: colors.blueAccent[500] }} />
          <Typography variant="h6">{nextClass.subject}</Typography>
          <Typography>{nextClass.date}</Typography>
          <Typography>{nextClass.time}</Typography>
          <Typography>Location: {nextClass.location}</Typography>
        </Box>
      ) : (
        <Typography variant="body2" color={colors.grey[300]}>
          No upcoming classes scheduled.
        </Typography>
      )}
    </Box>
  );
};

export default NextClass;