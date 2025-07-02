import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Modal from '../../components/modal';
import ActionButton from '../../components/actionButton';
import PaymentIcon from '@mui/icons-material/Payment';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { useSelector } from 'react-redux';

const PaystackButton = ({
  onSuccess = () => {},
  studentId,
  classLevelId,
  academicYears = [],
  defaultAcademicYear,
  termName,
  subclassLetter,
  section,
  email,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(defaultAcademicYear || '');
  const [defaultAcademicYearName, setDefaultAcademicYearName] = useState('Current Academic Year');
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const { callApi } = useApi();
  const currentAcademicYear = useSelector((state) => state.adminData.currentAcademicYear);

  // Fetch name for defaultAcademicYear if academicYears is empty
  useEffect(() => {
    const fetchDefaultAcademicYearName = async () => {
      if (!academicYears.length && defaultAcademicYear) {
        try {
          const response = await callApi(`${endpoints.ACADEMICYEARS_ID}/${defaultAcademicYear}`, 'GET');
          console.log('Default academic year response:', JSON.stringify(response, null, 2));
          if (response && response.data && response.data.name) {
            setDefaultAcademicYearName(response.data.name);
          } else {
            console.warn('Invalid default academic year response:', response);
            setDefaultAcademicYearName('Current Academic Year');
          }
        } catch (error) {
          console.error('Error fetching default academic year name:', error.response?.data || error.message);
          setDefaultAcademicYearName('Current Academic Year');
        }
      }
    };

    // Check Redux first
    if (!academicYears.length && defaultAcademicYear && currentAcademicYear?._id === defaultAcademicYear) {
      setDefaultAcademicYearName(currentAcademicYear.name || 'Current Academic Year');
    } else if (!academicYears.length && defaultAcademicYear) {
      fetchDefaultAcademicYearName();
    }
  }, [academicYears, defaultAcademicYear, currentAcademicYear, callApi]);

  console.log('PaystackButton props:', JSON.stringify({ studentId, classLevelId, academicYears, defaultAcademicYear, defaultAcademicYearName, selectedAcademicYear, termName, subclassLetter, section, email }, null, 2));

  // If no academic years and no default, show error
  if (!academicYears.length && !defaultAcademicYear) {
    console.error('PaystackButton: academicYears prop is empty and no defaultAcademicYear');
    return <Typography color="error">Error: No academic years available</Typography>;
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!selectedAcademicYear) {
      alert('Please select an academic year');
      return;
    }
    handlePaystackPayment();
    handleCloseModal();
  };

  const handlePaystackPayment = () => {
    setLoading(true);

    try {
      const paystack = window.PaystackPop.setup({
        key: publicKey,
        email: email || 'user@example.com',
        currency: 'NGN',
        amount: parseFloat(paymentAmount) * 100,
        metadata: {
          custom_fields: [
            {
              display_name: 'Payment Purpose',
              variable_name: 'payment_purpose',
              value: 'School Fees',
            },
            {
              display_name: 'Academic Year',
              variable_name: 'academic_year',
              value: academicYears.find((ay) => ay.academicYearId === selectedAcademicYear)?.name || defaultAcademicYearName || 'Unknown',
            },
          ],
        },
        onClose: () => {
          console.log('Payment dialog closed');
          setLoading(false);
        },
        callback: (response) => {
          console.log('Paystack callback triggered:', response);
          const transactionId = response.reference;

          if (!paymentAmount || isNaN(paymentAmount)) {
            console.error('Invalid payment amount:', paymentAmount);
            alert('Invalid payment amount');
            setLoading(false);
            return;
          }

          if (!transactionId) {
            console.error('Missing transaction reference:', response);
            alert('Missing transaction reference');
            setLoading(false);
            return;
          }

          if (!selectedAcademicYear) {
            console.error('Missing selected academic year');
            alert('Please select an academic year');
            setLoading(false);
            return;
          }

          const payload = {
            studentId,
            classLevelId,
            academicYear: selectedAcademicYear,
            section,
            termPayments: [
              {
                termName,
                subclassLetter,
                payments: [
                  {
                    amountPaid: parseFloat(paymentAmount) * 100,
                    method: 'Card',
                    reference: transactionId,
                    status: 'success',
                    datePaid: new Date().toISOString(),
                  },
                ],
              },
            ],
          };

          console.log('Payload being sent to backend:', JSON.stringify(payload, null, 2));
          console.log('Payload academicYear:', payload.academicYear);

          callApi(endpoints.PAYMENT, 'POST', payload)
            .then((backendResponse) => {
              console.log('Transaction registered successfully:', backendResponse);
              if (backendResponse && backendResponse.data) {
                onSuccess({
                  ...backendResponse.data,
                  amount: parseFloat(paymentAmount) * 100,
                  reference: transactionId,
                  academicYear: selectedAcademicYear,
                });
              } else {
                throw new Error('Invalid backend response');
              }
            })
            .catch((error) => {
              console.error('Failed to register transaction:', error.response?.data || error.message);
              alert(`Payment failed: ${error.response?.data?.message || 'Unknown error'}`);
            })
            .finally(() => {
              setLoading(false);
              setPaymentAmount('');
              setSelectedAcademicYear(defaultAcademicYear || '');
            });
        },
      });

      paystack.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack payment:', error);
      alert('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <ActionButton
        icon={<PaymentIcon />}
        disabled={loading}
        onClick={handleOpenModal}
        content={loading ? <CircularProgress size={24} /> : 'Pay Now'}
      />
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Enter Payment Details"
        onConfirm={handleConfirmPayment}
        confirmMessage="Proceed with Payment"
      >
        <TextField
          label="Amount (Naira)"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          fullWidth
          error={!paymentAmount || parseFloat(paymentAmount) <= 0}
          helperText={
            !paymentAmount
              ? 'Amount is required'
              : parseFloat(paymentAmount) <= 0
              ? 'Amount must be greater than 0'
              : ''
          }
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel id="academic-year-label">Academic Year</InputLabel>
          <Select
            labelId="academic-year-label"
            value={selectedAcademicYear}
            label="Academic Year"
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
          >
            {academicYears.length > 0 ? (
              academicYears.map((ay) => (
                <MenuItem key={ay.academicYearId} value={ay.academicYearId}>
                  {ay.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value={defaultAcademicYear}>
                {defaultAcademicYearName}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Modal>
    </Box>
  );
};

export default PaystackButton;