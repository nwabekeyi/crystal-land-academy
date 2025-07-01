// src/components/teacherDashboard/TermProgress.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useTeacherData from './useTeacherData';

const TermProgress = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { termProgress } = useTeacherData(); // Number (0–100)

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" fontWeight="600" textAlign="center">
        Term Progress
      </Typography>
      <Box mt="25px">
        {termProgress > 0 ? (
          <>
            <ProgressCircle size="125" progress={termProgress / 100} />
            <Typography variant="h5" color={colors.blueAccent[500]} sx={{ mt: '15px' }}>
              {`${termProgress}% completed`}
            </Typography>
            <Typography>Current term completion</Typography>
          </>
        ) : (
          <Typography variant="body2" color={colors.grey[300]}>
            No term progress available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TermProgress;