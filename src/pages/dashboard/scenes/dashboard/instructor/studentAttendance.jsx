// src/components/teacherDashboard/StudentAttendance.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useTeacherData  from './useTeacherData';

const StudentAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { studentAttendance } = useTeacherData(); // Assumed to return 0–100
  const attendance = studentAttendance || 90; // Dummy data: 90% attendance

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Student Attendance
      </Typography>
      <Box mt="25px">
        <ProgressCircle size="125" progress={attendance / 100} />
        <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
          {`${attendance}% attendance rate`}
        </Typography>
        <Typography>Average student attendance</Typography>
      </Box>
    </Box>
  );
};

export default StudentAttendance;