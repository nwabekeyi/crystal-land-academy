// src/components/studentDashboard/MissedClasses.jsx
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import useStudentData from './useStudentData';
import { useEffect, useState } from 'react';

const MissedClasses = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { fetchStudentData, formatDateToDDMMYYYY, loading, error } = useStudentData();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchStudentData();
      setData(result);
    };
    getData();
  }, [fetchStudentData]);

  const conBg = theme.palette.mode === 'light' ? colors.blueAccent[800] : colors.greenAccent[600];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!data || !data.missedClasses) return <Typography>No missed classes data available</Typography>;

  const { missedClasses } = data;

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" mb="15px">
        Missed Classes
      </Typography>
      {missedClasses.length > 0 ? (
        missedClasses.map((schedule) => (
          <Card key={schedule.id} sx={{ mb: 2 }}>
            <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
              <Typography variant="h6">{schedule.subject}</Typography>
              <Typography>{formatDateToDDMMYYYY(schedule.date)}</Typography>
              <Typography>{schedule.time}</Typography>
              <Typography>Location: {schedule.location}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>You attended all classes</Typography>
      )}
    </Box>
  );
};

export default MissedClasses;