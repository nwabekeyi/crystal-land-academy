import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, LinearProgress, useTheme } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import TableComponent from '../../../../components/table';
import Modal from '../../components/modal';
import Receipt from '../../components/Receipt';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import PaystackButton from './PaystcakButton';
import useApi from '../../../../hooks/useApi'; // Custom hook for API calls
import { endpoints } from '../../../../utils/constants';
import { useSelector } from 'react-redux';

const PaymentHistory = () => {
  const user = useSelector((state) => state.users.user); // Retrieve user from Redux
console.log('User object:', user); // Debugging log
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for payment records
  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('datePaid');
  const [sortDirection, setSortDirection] = useState('asc');
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // State for payment summary
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  // Custom hook for API calls
  const { callApi, loading, error } = useApi();

  // Fetch payment records from the backend
  useEffect(() => {
    const fetchPaymentRecords = async () => {
      const response = await callApi(endpoints.getAllPayments, 'GET', {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sortDirection,
      });

      if (response) {
        setReceipts(response.data);
        setTotalOutstanding(response.totalOutstanding || 0);
        setAmountPaid(response.totalPaid || 0);
      }
    };

    fetchPaymentRecords();
  }, [page, rowsPerPage, sortBy, sortDirection, callApi]);

  // Calculate total amount due and payment percentage
  const totalAmount = totalOutstanding + amountPaid;
  const paymentPercentage = totalAmount > 0 ? (amountPaid / totalAmount) * 100 : 0;

  // Handle sorting
  const handleSortChange = (field) => {
    const isAsc = sortBy === field && sortDirection === 'asc';
    setSortBy(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  // Action Handlers
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenReceiptModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentDetails) => {
    const payload = {
      studentId: user.studentId, // Replace with actual student ID from context or API
      classLevelId: user.classLevelId, // Replace with actual class level ID
      academicYear: user.academicYear, // Replace with actual academic year ID
      termName: user.termName, // Replace with actual term name
      subclassLetter: user.subclassLetter, // Replace with actual subclass letter
      amountPaid: paymentDetails.amount,
      method: 'Card',
      reference: paymentDetails.reference,
      status: 'success',
    };

    const response = await callApi(endpoints.createPayment, 'POST', payload);

    if (response) {
      setReceipts((prevReceipts) => [response.data, ...prevReceipts]);
      setAmountPaid((prevAmount) => prevAmount + paymentDetails.amount);
      setTotalOutstanding((prevOutstanding) => prevOutstanding - paymentDetails.amount);
    }
  };

  // Table Columns
  const columns = [
    {
      id: 'id',
      label: 'S/N',
      flex: 0.5,
      renderCell: (row) => <Typography>{row.id}</Typography>,
    },
    {
      id: 'reference',
      label: 'Transaction ID',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.reference || 'N/A')}</Typography>,
    },
    {
      id: 'amountPaid',
      label: 'Amount (₦)',
      flex: 1,
      renderCell: (row) => <Typography>₦{(row.amountPaid / 100).toFixed(2)}</Typography>, // Convert kobo to naira
    },
    {
      id: 'status',
      label: 'Status',
      flex: 1,
      renderCell: (row) => (
        <Typography>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Typography>
      ),
    },
    {
      id: 'datePaid',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{row.datePaid || 'N/A'}</Typography>,
    },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <Box display="flex" gap="10px">
          <IconButton onClick={() => handleViewReceipt(row)}>
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
  ];

  const tableProps = {
    columns,
    tableHeader: 'Payment Records',
    data: receipts,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: (e, newPage) => setPage(newPage),
    onRowsPerPageChange: (e) => setRowsPerPage(parseInt(e.target.value, 10)),
    onRowClick: (row) => console.log('Row clicked:', row),
    hiddenColumnsSmallScreen: ['status', 'reference'],
  };

  return (
    <Box>
      <Header title="Payment History" subtitle="Overview of Payments Made" />

      <Box backgroundColor={colors.primary[400]} p="20px" borderRadius="4px">
        <Typography variant="h5" fontWeight="600" mb="15px">
          Payment Summary
        </Typography>
        <Box mb="20px">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              marginBottom: '15px',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box>
              <Typography variant="h6" mb="5px">
                Total Amount Due: ₦{(totalAmount / 100).toFixed(2)}
              </Typography>
              <Typography variant="h6" mb="5px">
                Total Paid: ₦{(amountPaid / 100).toFixed(2)}
              </Typography>
              <Typography variant="h6">
                Payment Percentage: {paymentPercentage.toFixed(2)}%
              </Typography>
            </Box>
            <Box>
            <PaystackButton
              onSuccess={handlePaymentSuccess}
              studentId={user._id} // ObjectId
              classLevelId={user.currentClassLevel?._id} // ObjectId
              academicYear={user.currentClassLevel?.academicYear?._id} // ObjectId
              program={user.program} // e.g., "Primary" or "Secondary"
              termName="1st Term"
              subclassLetter={user.currentClassLevel?.subclass}
            />
                  
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={paymentPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.grey[300],
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.greenAccent[500],
              },
            }}
          />
        </Box>

        <TableComponent {...tableProps} />

        {/* View Receipt Modal */}
        <Modal
          open={openReceiptModal}
          onClose={() => setOpenReceiptModal(false)}
          title="Receipt Details"
          noConfirm
        >
          {selectedReceipt && <Receipt receipt={selectedReceipt} />}
        </Modal>
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(PaymentHistory);