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
  console.log(user)
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
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // State for payment summary
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  // Custom hook for API calls
  const { callApi, loading, error } = useApi();

  // Fetch payment records for the student
useEffect(() => {
  const fetchPaymentRecords = async () => {
    const url = `${endpoints.PAYMENT}?studentId=${user._id}&page=${page + 1}&limit=${rowsPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    console.log(`Calling API: ${url}`);

    try {
      const response = await callApi(url, 'GET');
      console.log("API Response:", response);

      if (response) {
        const flatPayments = response.data.flatMap((receipt) => {
          const term = receipt.termPayments?.[0] || {};
          return (term.payments || []).map((payment) => ({
            reference: payment.reference,
            amountPaid: payment.amountPaid,
            datePaid: payment.datePaid,
            status: payment.status || receipt.status,
            originalReceipt: receipt, // to pass full receipt to view
          }));
        });
      
        setReceipts(flatPayments); // Flattened structure
        setTotalOutstanding(response.totalOutstanding || 0);
        setAmountPaid(response.totalPaid || 0);
      }
      
    } catch (error) {
      console.error("Error fetching payment records:", error);
    }
  };

  fetchPaymentRecords();
}, [page, rowsPerPage, sortBy, sortDirection, callApi, user._id]);
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
    console.log("Payment details:", paymentDetails); 
    setOpenSuccessModal(true); 
    const payload = {
      studentId: user._id, // ObjectId from Redux
      classLevelId: user.classLevelId, // ObjectId from Redux
      academicYear: user.currentClassLevel?.academicYear?.academicYearId, // ObjectId from currentClassLevel
      section: user.currentClassLevel?.section, // e.g., "Primary" or "Secondary"
      termPayments: [
        {
          termName: "1st Term", // Replace with dynamic value if needed
          subclassLetter: user.currentClassLevel?.subclass, // e.g., "A"
          payments: [
            {
              amountPaid: paymentDetails.amount, // Ensure this is a valid number
              method: "Card", // Payment method
              reference: paymentDetails.reference, // Transaction reference from Paystack
              status: "success", // Payment status
            },
          ],
        },
      ],
    };
  
    console.log("Payload being sent to backend:", JSON.stringify(payload.academicYear, null, 2));
  
    const response = await callApi(endpoints.createPayment, "POST", payload);
  
    if (response) {
      setReceipts((prevReceipts) => [response.data, ...prevReceipts]);
      setAmountPaid((prevAmount) => prevAmount + paymentDetails.amount);
      setTotalOutstanding((prevOutstanding) => prevOutstanding - paymentDetails.amount);
      setOpenSuccessModal(true);
    }
  };

  // Table Columns
  const columns = [
    {
      id: 'sn',
      label: 'S/N',
      flex: 0.3,
      renderCell: (row, index) => <Typography>{index + 1}</Typography>,
    },
    {
      id: 'reference',
      label: 'Transaction ID',
      flex: 1,
      renderCell: (row) => <Typography>{row.reference || 'N/A'}</Typography>,
    },
    {
      id: 'amountPaid',
      label: 'Amount (₦)',
      flex: 1,
      renderCell: (row) => <Typography>₦{row.amountPaid }</Typography>,
    },
    {
      id: 'status',
      label: 'Status',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'datePaid',
      label: 'Date',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {row.datePaid ? new Date(row.datePaid).toLocaleDateString() : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <Box display="flex" gap="10px">
          <IconButton onClick={() => handleViewReceipt(row.originalReceipt)}>
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
                classLevelId={user.classLevelId} // ObjectId
                academicYear={user.currentClassLevel?.academicYear?.acadenicYearId} // ObjectId
                section={user.currentClassLevel?.section}
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

        {/* Success Modal */}
        <Modal
          open={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
          title="Payment Successful"
          noConfirm
        >
          <Typography variant="h6" align="center" color="green">
            Your payment was successful!
          </Typography>
        </Modal>

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