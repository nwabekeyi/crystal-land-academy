import React, { useState } from 'react';
import { Box, IconButton, Typography, LinearProgress, useTheme } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import TableComponent from '../../../../components/table';
import Modal from '../../components/modal';
import Receipt from '../../components/Receipt';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import PaystackButton from './PaystcakButton';

// Dummy payment data
const dummyPaymentData = {
  receipts: [
    {
      id: 1,
      transactionId: 'TXN_001',
      amount: 50000, // Amount in kobo (₦500.00)
      status: 'success',
      date: '2025-06-01',
      userName: 'John Doe',
      program: 'Secondary Education',
    },
    {
      id: 2,
      transactionId: 'TXN_002',
      amount: 75000, // ₦750.00
      status: 'success',
      date: '2025-06-05',
      userName: 'John Doe',
      program: 'Secondary Education',
    },
    {
      id: 3,
      transactionId: 'TXN_003',
      amount: 100000, // ₦1000.00
      status: 'failed',
      date: '2025-06-10',
      userName: 'John Doe',
      program: 'Secondary Education',
    },
  ],
  outstandings: {
    totalOutstanding: 150000, // ₦1500.00
    amountPaid: 125000, // ₦1250.00 (sum of successful payments: 50000 + 75000)
  },
};

const PaymentHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [receipts, setReceipts] = useState(dummyPaymentData.receipts); // Use dummy data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Use dummy outstandings data
  const { totalOutstanding, amountPaid } = dummyPaymentData.outstandings;

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

  // Simulate payment success
  const handlePaymentSuccess = () => {
    const newReceipt = {
      id: receipts.length + 1,
      transactionId: `TXN_${String(receipts.length + 1).padStart(3, '0')}`,
      amount: 50000, // Mock new payment of ₦500.00
      status: 'success',
      date: new Date().toLocaleDateString(),
      userName: 'John Doe',
      program: 'Secondary Education',
    };

    setReceipts((prevReceipts) => [newReceipt, ...prevReceipts]);
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
      id: 'transactionId',
      label: 'Transaction ID',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.transactionId || 'N/A')}</Typography>,
    },
    {
      id: 'amount',
      label: 'Amount (₦)',
      flex: 1,
      renderCell: (row) => <Typography>₦{(row.amount / 100).toFixed(2)}</Typography>, // Convert kobo to naira
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
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{row.date || 'N/A'}</Typography>,
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
    hiddenColumnsSmallScreen: ['status', 'transactionId'],
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
              <PaystackButton onSuccess={handlePaymentSuccess} />
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