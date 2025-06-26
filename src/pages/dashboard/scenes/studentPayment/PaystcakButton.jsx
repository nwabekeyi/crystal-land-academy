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
  program,
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
    // Proceed with Paystack payment after confirming the amount
    handlePaystackPayment();
    handleCloseModal();
  };

  const handlePaystackPayment = () => {
    setLoading(true);

    try {
      const paystack = window.PaystackPop.setup({
        key: publicKey, // Public key from environment
        email: 'user@example.com', // Replace with the user's email
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
          const transactionId = response.reference;
          console.log('Payment successful. Transaction ID:', transactionId);
        
          const payload = {
            studentId,
            classLevelId,
            academicYear,
            program,
            termPayments: [
              {
                termName,
                subclassLetter,
                payments: [
                  {
                    amountPaid: parseFloat(paymentAmount),
                    method: "Card",
                    reference: transactionId,
                    status: "success"
                  }
                ]
              }
            ]
          };
          
          
        
          console.log('Payload being sent to backend:', payload);
        
          callApi('http://localhost:5000/api/v1/create-student-payment', 'POST', payload)
            .then((backendResponse) => {
              console.log('Transaction registered successfully:', backendResponse);
              onSuccess(payload);
            })
            .catch((error) => {
              console.error('Failed to register transaction:', error);
            });
        
          setPaymentAmount('');
        },
      });        

      // Open the Paystack payment dialog
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
        onClick={handleOpenModal} // Open modal on button click
        content={loading ? <CircularProgress size={24} /> : 'Pay Now'}
      />

      {/* Modal for inputting payment amount */}
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
          onChange={(e) => setPaymentAmount(e.target.value)} // Update payment amount
          fullWidth
        />
      </Modal>
    </Box>
  );
};

export default PaystackButton;