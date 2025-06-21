// src/components/studentDashboard/SessionProgress.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import  useStudentData  from './useStudentData';

const SessionProgress = () => {
  const { sessionProgress } = useStudentData(); // Assumed to return 0–100 (e.g., 66 for Term 2/3)
  const progress = sessionProgress || 66; // Dummy data: Term 2 completed in 3-term year

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Session Progress
      </Typography>
      <ProgressCircle size="125" progress={progress / 100} />
      <Typography variant="body2" mt="10px">
        Academic year completion: {progress}%
      </Typography>
    </Box>
  );
};

export default SessionProgress;