import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import Modal from '../pages/dashboard/components/modal';
import useApi from '../hooks/useApi';
import { endpoints } from '../utils/constants';
import ActionButton from '../pages/dashboard/components/actionButton';

const CodeGenerator = () => {
  const [code, setCode] = useState(''); // Store generated code
  const [modalOpen, setModalOpen] = useState(false); // Modal for displaying code
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog for confirmation
  const { loading, callApi, error } = useApi();

  // Request backend to generate code
  const generateCode = async () => {
    try {
      const response = await callApi(endpoints.REGISTRATION_CODE, 'POST', {});
      if (response?.status === 'success') {
        setCode(response.data.code);
        setModalOpen(true);
      } else {
        throw new Error(response?.message || 'Failed to generate code');
      }
    } catch (err) {
      console.error('Error generating code:', err);
      alert(`Failed to generate code: ${err.message || 'Unknown error'}`);
    }
    setDialogOpen(false);
  };

  return (
    <Box sx={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <ActionButton
          onClick={() => setDialogOpen(true)}
          content={loading ? 'Generating...' : 'Registration Code'}
        />

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Generate Registration Code</DialogTitle>
          <DialogContent>
            <Typography>Do you want to generate a registration code for a student?</Typography>
          </DialogContent>
          <DialogActions>
            <ActionButton onClick={() => setDialogOpen(false)} content="Cancel" />
            <ActionButton onClick={generateCode} content="Confirm" />
          </DialogActions>
        </Dialog>

        {/* Modal to display generated code */}
        {modalOpen && (
          <Modal
            open={true}
            onClose={() => setModalOpen(false)}
            title="Generated Registration Code"
            noConfirm
          >
            <Typography variant="h6" textAlign="center">{code}</Typography>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default CodeGenerator;