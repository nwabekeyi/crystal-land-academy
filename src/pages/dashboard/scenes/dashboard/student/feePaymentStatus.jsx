// src/components/studentDashboard/FeePaymentStatus.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import useStudentData from './useStudentData';
import { useState, useEffect } from 'react';

const FeePaymentStatus = () => {
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
  if (!data || !data.feeStatus) return <Typography>No payment data available</Typography>;

  const { feeStatus } = data;

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Fee Payment Status ({parseInt(feeStatus.percentagePaid)}%)
      </Typography>
      <ProgressCircle size="125" progress={feeStatus.percentagePaid / 100} />
      <Typography variant="body2" mt="10px">
        Outstanding Fees: ${feeStatus.totalOutstanding}
      </Typography>
    </Box>
  );
};

export default FeePaymentStatus;