// src/components/teacherDashboard/AssignmentSubmissions.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useTeacherData from './useTeacherData';

const AssignmentSubmissions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { assignmentSubmissionRate } = useTeacherData(); // { totalAssignmentRate }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Assignment Submissions
      </Typography>
      <Box mt="25px">
        {assignmentSubmissionRate && assignmentSubmissionRate.totalAssignmentRate > 0 ? (
          <>
            <ProgressCircle size="125" progress={assignmentSubmissionRate.totalAssignmentRate / 100} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
              {`${assignmentSubmissionRate.totalAssignmentRate}% submission rate`}
            </Typography>
            <Typography>Average assignment submission rate</Typography>
          </>
        ) : (
          <Typography variant="body2" color={colors.grey[300]}>
            No submission data available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AssignmentSubmissions;