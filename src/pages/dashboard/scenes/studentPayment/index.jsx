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
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { useSelector } from 'react-redux';

const PaymentHistory = () => {
  const user = useSelector((state) => state.users.user);
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [receipts, setReceipts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('datePaid');
  const [sortDirection, setSortDirection] = useState('asc');
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [academicYears, setAcademicYears] = useState([]);
  const [defaultAcademicYearName, setDefaultAcademicYearName] = useState('Current Academic Year');
  const [errorMessage, setErrorMessage] = useState('');

  const { callApi, loading, error } = useApi();

  // Fetch academic years
  useEffect(() => {
    console.log('User object:', JSON.stringify(user, null, 2));
    console.log('Current academic year from Redux:', JSON.stringify(currentAcademicYear, null, 2));
    console.log('Academic years endpoint:', endpoints.ACADEMICYEARS_ID);
    const fetchAcademicYears = async () => {
      try {
        const response = await callApi(endpoints.ACADEMICYEARS_ID, 'GET');
        console.log('Academic years response:', JSON.stringify(response, null, 2));
        if (response && Array.isArray(response.data)) {
          setAcademicYears(response.data);
          if (response.data.length === 0) {
            console.warn('Academic years response is empty');
            setErrorMessage('No academic years available. Using default academic year.');
          }
        } else {
          console.warn('Invalid academic years response:', response);
          setErrorMessage('Failed to load academic years. Using default academic year.');
          setAcademicYears([]);
        }
      } catch (error) {
        console.error('Error fetching academic years:', error.response?.data || error.message);
        setErrorMessage(`Error fetching academic years: ${error.response?.data?.message || error.message}`);
        setAcademicYears([]);
      }
    };

    fetchAcademicYears();
  }, [callApi]);

  // Fetch default academic year name if needed
  useEffect(() => {
    const fetchDefaultAcademicYearName = async () => {
      const defaultAcademicYearId = academicYears.find((ay) => ay.isCurrent)?.academicYearId ||
                                    currentAcademicYear?._id ||
                                    user?.currentClassLevel?.academicYear?.academicYearId ||
                                    '';
      if (!academicYears.length && defaultAcademicYearId) {
        try {
          const response = await callApi(`${endpoint.ACADEMICYEARS_ID}/${defaultAcademicYearId}`, 'GET');
          console.log('Default academic year response:', JSON.stringify(response, null, 2));
          if (response && response.data && response.data.name) {
            setDefaultAcademicYearName(response.data.name);
          } else {
            setDefaultAcademicYearName('Current Academic Year');
          }
        } catch (error) {
          console.error('Error fetching default academic year name:', error.response?.data || error.message);
          setDefaultAcademicYearName('Current Academic Year');
        }
      }
    };

    if (!academicYears.length && currentAcademicYear?.name) {
      setDefaultAcademicYearName(currentAcademicYear.name);
    } else if (!academicYears.length && defaultAcademicYear) {
      fetchDefaultAcademicYearName();
    }
  }, [academicYears, currentAcademicYear, user, callApi]);

  // Fetch payment records
  useEffect(() => {
    const fetchPaymentRecords = async () => {
      if (!user?._id) {
        console.warn('No user ID available, skipping payment records fetch');
        setErrorMessage('User not authenticated. Please log in again.');
        return;
      }

      const url = `${endpoints.PAYMENT}?studentId=${user._id}&page=${page + 1}&limit=${rowsPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
      console.log(`Fetching payment records from: ${url}`);

      try {
        const response = await callApi(url, 'GET');
        console.log('Payment records response:', JSON.stringify(response, null, 2));

        if (response && Array.isArray(response.data)) {
          const flatPayments = response.data.flatMap((receipt) => {
            const term = receipt.termPayments?.[0] || {};
            return (term.payments || []).map((payment) => ({
              reference: payment.reference,
              amountPaid: payment.amountPaid,
              datePaid: payment.datePaid,
              status: payment.status || receipt.status,
              originalReceipt: receipt,
            }));
          });
          setReceipts(flatPayments);
          setTotalOutstanding(response.totalOutstanding || 0);
          setAmountPaid(response.totalPaid || 0);
        } else {
          console.warn('Invalid payment records response:', response);
          setErrorMessage('No payment records found.');
          setReceipts([]);
          setTotalOutstanding(0);
          setAmountPaid(0);
        }
      } catch (error) {
        console.error('Error fetching payment records:', error.response?.data || error.message);
        setErrorMessage(`Error fetching payment records: ${error.response?.data?.message || error.message}`);
        setReceipts([]);
        setTotalOutstanding(0);
        setAmountPaid(0);
      }
    };

    fetchPaymentRecords();
  }, [page, rowsPerPage, sortBy, sortDirection, callApi, user?._id]);

  const totalAmount = totalOutstanding + amountPaid;
  const paymentPercentage = totalAmount > 0 ? (amountPaid / totalAmount) * 100 : 0;

  const handleSortChange = (field) => {
    const isAsc = sortBy === field && sortDirection === 'asc';
    setSortBy(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setOpenReceiptModal(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    console.log('Payment details:', JSON.stringify(paymentDetails, null, 2));
    setReceipts((prevReceipts) => [paymentDetails, ...prevReceipts]);
    setAmountPaid((prevAmount) => prevAmount + paymentDetails.amount);
    setTotalOutstanding((prevOutstanding) => prevOutstanding - paymentDetails.amount);
    setOpenSuccessModal(true);
  };

  // Determine default academic year
  const defaultAcademicYear = academicYears.find((ay) => ay.isCurrent)?.academicYearId ||
                            currentAcademicYear?._id ||
                            user?.currentClassLevel?.academicYear?.academicYearId ||
                            '';

  // If no academic years and no default, show error
  if (!defaultAcademicYear) {
    console.error('Cannot render PaystackButton: No default academicYearId found');
    return (
      <Box>
        <Header title="Payment History" subtitle="Overview of Payments Made" />
        <Typography color="error">
          {errorMessage || 'Error: Academic year information is missing. Please contact support.'}
        </Typography>
      </Box>
    );
  }

  const paystackProps = {
    onSuccess: handlePaymentSuccess,
    studentId: user._id,
    classLevelId: user.classLevelId,
    academicYears,
    defaultAcademicYear,
    defaultAcademicYearName, // Pass the name
    section: user.currentClassLevel?.section,
    termName: '1st Term',
    subclassLetter: user.currentClassLevel?.subclass,
    email: user.email || 'user@example.com',
  };

  console.log('PaystackButton props:', JSON.stringify(paystackProps, null, 2));

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
      renderCell: (row) => <Typography>₦{(row.amountPaid / 100).toFixed(2)}</Typography>,
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
        {errorMessage && (
          <Typography color="error" mb="15px">
            {errorMessage}
          </Typography>
        )}
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
              <PaystackButton {...paystackProps} />
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