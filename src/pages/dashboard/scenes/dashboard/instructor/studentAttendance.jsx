// src/components/teacherDashboard/StudentAttendance.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useTeacherData from './useTeacherData';

const StudentAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { studentAttendance } = useTeacherData(); // Number (0–100)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Student Attendance
      </Typography>
      <Box mt="25px">
        {studentAttendance > 0 ? (
          <>
            <ProgressCircle size="125" progress={studentAttendance / 100} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
              {`${studentAttendance}% attendance rate`}
            </Typography>
            <Typography>Average student attendance</Typography>
          </>
        ) : (
          <Typography variant="body2" color={colors.grey[300]}>
            No attendance data available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentAttendance;