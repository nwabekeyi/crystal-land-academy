// components/AddAcademicYearModal.js
import React from "react";
import { Box, TextField, FormControlLabel, Checkbox } from "@mui/material";
import ActionButton from "../../../components/actionButton";
import Modal from "../../../components/modal";

const AddAcademicYearModal = ({ open, onClose, formValues, handleChange, handleCreateAcademicYear, error }) => {
  const handleSubmit = async () => {
    const success = await handleCreateAcademicYear();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Academic Year" noConfirm>
      <Box>
        <Box mb={2}>
          <TextField
            label="Academic Year Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            error={!!error}
            helperText={error}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="date"
            label="From Year"
            name="fromYear"
            value={formValues.fromYear}
            onChange={handleChange}
            fullWidth
            error={!!error}
            helperText={error}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="date"
            label="To Year"
            name="toYear"
            value={formValues.toYear}
            onChange={handleChange}
            fullWidth
            error={!!error}
            helperText={error}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues.isCurrent}
                onChange={handleChange}
                name="isCurrent"
                color="primary"
              />
            }
            label="Set as Current Academic Year"
          />
        </Box>
        <ActionButton onClick={handleSubmit} content="Add Academic Year" />
      </Box>
    </Modal>
  );
};

export {AddAcademicYearModal} // Changed to default export for consistency