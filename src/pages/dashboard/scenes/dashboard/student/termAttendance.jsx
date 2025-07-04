// src/components/studentDashboard/TermAttendance.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import useStudentData from './useStudentData';
import { useEffect, useState } from 'react';

const TermAttendance = () => {
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
  if (!data || data.termAttendance === 0) return <Typography>No attendance data available</Typography>;

  const { termAttendance } = data;

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Term Attendance
      </Typography>
      <ProgressCircle size="125" progress={termAttendance / 100} />
      <Typography variant="body2" mt="10px">
        Current term attendance: {termAttendance}%
      </Typography>
    </Box>
  );
};

export default TermAttendance;