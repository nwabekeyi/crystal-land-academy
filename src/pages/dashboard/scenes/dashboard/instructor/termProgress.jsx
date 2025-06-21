// src/components/teacherDashboard/TermProgress.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import  useTeacherData  from './useTeacherData';

const TermProgress = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { termProgress } = useTeacherData(); // Assumed to return 0–100
  const progress = termProgress || 80; // Dummy data: 80% through Term 3

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Term Progress
      </Typography>
      <Box mt="25px">
        <ProgressCircle size="125" progress={progress / 100} />
        <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
          {`${progress}% completed`}
        </Typography>
        <Typography>Current term completion</Typography>
      </Box>
    </Box>
  );
};

export default TermProgress;