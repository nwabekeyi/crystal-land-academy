// src/components/studentDashboard/NextClass.jsx
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useStudentData from './useStudentData';
import { useEffect, useState } from 'react';

const NextClass = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  if (!data || !data.nextClass) return <Typography>No upcoming classes</Typography>;

  const { nextClass } = data;

  return (
    <Box textAlign="center">
      <Typography variant="h6" fontWeight="600" mb="5px">
        Next Class
      </Typography>
      <Box>
        <SchoolIcon sx={{ fontSize: '30px', color: colors.blueAccent[400] }} />
        <Typography variant="h6">{nextClass.subject}</Typography>
        <Typography>{nextClass.date}</Typography>
        <Typography>{nextClass.time}</Typography>
        <Typography>Location: {nextClass.location}</Typography>
      </Box>
    </Box>
  );
};

export default NextClass;