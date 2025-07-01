// src/components/studentDashboard/SessionProgress.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import useStudentData from './useStudentData';
import { useEffect, useState } from 'react';

const SessionProgress = () => {
  const { fetchStudentData, loading, error } = useStudentData();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchStudentData();
      setData(result);
    };
    getData();
  }, [fetchStudentData]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!data || data.sessionProgress === 0) return <Typography>No session progress data available</Typography>;

  const { sessionProgress } = data;

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Session Progress
      </Typography>
      <ProgressCircle size="125" progress={sessionProgress / 100} />
      <Typography variant="body2" mt="10px">
        Academic year completion: {sessionProgress}%
      </Typography>
    </Box>
  );
};

export default SessionProgress;