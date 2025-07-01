import React, { useState } from 'react';
import { Box, CircularProgress, TextField } from '@mui/material';
import Modal from '../../components/modal';
import ActionButton from '../../components/actionButton';
import PaymentIcon from '@mui/icons-material/Payment';
import useApi from '../../../../hooks/useApi'; // Custom hook for API calls

const PaystackButton = ({
  onSuccess = () => {},
  studentId,
  classLevelId,
  academicYear,
  termName,
  subclassLetter,
  section,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY; // Ensure this is correctly configured
  const { callApi } = useApi(); // Use custom hook for API calls

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmPayment = () => {
    handlePaystackPayment();
    handleCloseModal();
  };

  const handlePaystackPayment = () => {
    setLoading(true);

    try {
      const paystack = window.PaystackPop.setup({
        key: publicKey,
        email: 'user@example.com', // Replace with the user's email dynamically if available
        currency: 'NGN',
        amount: parseFloat(paymentAmount) * 100, // Convert to kobo
        metadata: {
          custom_fields: [
            {
              display_name: 'Payment Purpose',
              variable_name: 'payment_purpose',
              value: 'School Fees',
            },
          ],
        },
        onClose: function () {
          console.log('Payment dialog closed');
        },
        callback: function (response) {
          console.log('Paystack callback triggered:', response);
        
          const transactionId = response.reference;
        
          if (!paymentAmount || isNaN(paymentAmount)) {
            console.error('Invalid payment amount:', paymentAmount);
            return;
          }
        
          if (!transactionId) {
            console.error('Missing transaction reference:', response);
            return;
          }
        
          const payload = {
            studentId,
            classLevelId,
            academicYear,
            section,
            termPayments: [
              {
                termName,
                subclassLetter,
                payments: [
                  {
                    amountPaid: parseFloat(paymentAmount),
                    method: 'Card',
                    reference: transactionId,
                    status: 'success',
                  },
                ],
              },
            ],
          };
        
          console.log('Payload being sent to backend:', JSON.stringify(payload, null, 2));
        
          callApi('http://localhost:5000/api/v1/payment', 'POST', payload)
            .then((backendResponse) => {
              console.log('Transaction registered successfully:', backendResponse);
              onSuccess(payload);
            })
            .catch((error) => {
              console.error('Failed to register transaction:', error.response || error.message);
              if (error.response) {
                console.error('Backend error details:', error.response.data);
              }
            });
        
          setPaymentAmount('');
        },
      });

      paystack.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack payment:', error);
    } finally {
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
        title="Enter Payment Amount"
        onConfirm={handleConfirmPayment}
        confirmMessage="Proceed with Payment"
      >
        <TextField
          label="Amount (Naira)"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          fullWidth
        />
      </Modal>
      
    </Box>
  );
};

export default PaystackButton;