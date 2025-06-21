// src/components/studentDashboard/FeePaymentStatus.jsx
import { Box, Typography } from '@mui/material';
import ProgressCircle from '../../../components/ProgressCircle';
import  useStudentData  from './useStudentData';

const FeePaymentStatus = () => {
  const { feeStatus } = useStudentData(); // Assumed to return { percentagePaid, totalOutstanding }
  const paymentProgress = feeStatus?.percentagePaid || 80; // Dummy data: 80% paid
  const outstanding = feeStatus?.totalOutstanding || 200; // Dummy data: $200 outstanding

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" mb="5px">
        Fee Payment Status ({parseInt(paymentProgress)}%)
      </Typography>
      <ProgressCircle size="125" progress={paymentProgress / 100} />
      <Typography variant="body2" mt="10px">
        Outstanding Fees: ${outstanding}
      </Typography>
    </Box>
  );
};

export default FeePaymentStatus;