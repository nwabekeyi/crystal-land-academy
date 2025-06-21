// src/components/teacherDashboard/AssignmentSubmissions.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useTeacherData  from './useTeacherData';

const AssignmentSubmissions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { assignmentSubmissionRate } = useTeacherData(); // Assumed to return { totalAssignmentRate }
  const submissionRate = assignmentSubmissionRate?.totalAssignmentRate || 85; // Dummy data: 85%

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Assignment Submissions
      </Typography>
      <Box mt="25px">
        <ProgressCircle size="125" progress={submissionRate / 100} />
        <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
          {`${submissionRate}% submission rate`}
        </Typography>
        <Typography>Average assignment submission rate</Typography>
      </Box>
    </Box>
  );
};

export default AssignmentSubmissions;