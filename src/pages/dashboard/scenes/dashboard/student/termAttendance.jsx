// src/components/studentDashboard/TermAttendance.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import  useStudentData  from './useStudentData';

const TermAttendance = () => {
  const { termAttendance } = useStudentData(); // Assumed to return 0–100
  const attendance = termAttendance || 95; // Dummy data: 95% attendance

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Term Attendance
      </Typography>
      <ProgressCircle size="125" progress={attendance / 100} />
      <Typography variant="body2" mt="10px">
        Current term attendance: {attendance}%
      </Typography>
    </Box>
  );
};

export default TermAttendance;