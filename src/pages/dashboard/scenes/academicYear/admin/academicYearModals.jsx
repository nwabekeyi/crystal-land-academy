// components/academicYearModals/AddAcademicYearModal.js
import React from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import ActionButton from "../../../components/actionButton";
import Modal from "../../../components/modal";

const AddAcademicYearModal = ({
  open,
  onClose,
  formValues,
  handleChange,
  handleSubmit,
  error,
  editMode = false,
  userId,
}) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onClose();
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const DateInput = ({ label, name, value, min, errorMsg }) => (
    <Box mb={2}>
      <label style={{ display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleChange}
        min={min}
        required
        style={{
          width: "100%",
          padding: "12px",
          border: errorMsg ? "1px solid red" : "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      {errorMsg && (
        <Typography variant="caption" color="error">
          {errorMsg}
        </Typography>
      )}
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editMode ? "Edit Academic Year" : "Add Academic Year"}
      noConfirm
    >
      <Box component="form" onSubmit={handleFormSubmit}>
        <Box mb={2}>
          <TextField
            label="Academic Year Name (e.g., 2024/2025)"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            fullWidth
            required
            error={!!error.name}
            helperText={error.name || "Format: YYYY/YYYY"}
            inputProps={{ pattern: "\\d{4}/\\d{4}" }}
          />
        </Box>

        <DateInput
          label="From Year"
          name="fromYear"
          value={formValues.fromYear}
          min={today}
          errorMsg={error.fromYear}
        />

        <DateInput
          label="To Year"
          name="toYear"
          value={formValues.toYear}
          min={formValues.fromYear || today}
          errorMsg={error.toYear}
        />

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

        {!editMode && (
          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.addAcademicTerm}
                  onChange={handleChange}
                  name="addAcademicTerm"
                  color="primary"
                />
              }
              label="Add Academic Term"
            />
          </Box>
        )}

        {formValues.addAcademicTerm && !editMode && (
          <>
            <Typography variant="h6" mb={2}>
              Academic Term Details
            </Typography>

            <Box mb={2}>
              <TextField
                label="Academic Term Name"
                name="academicTerm.name"
                value={formValues.academicTerm?.name || ""}
                onChange={handleChange}
                fullWidth
                required
                error={!!error.academicTerm?.name}
                helperText={error.academicTerm?.name}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Description"
                name="academicTerm.description"
                value={formValues.academicTerm?.description || ""}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
                error={!!error.academicTerm?.description}
                helperText={error.academicTerm?.description}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Duration"
                name="academicTerm.duration"
                value={formValues.academicTerm?.duration || "3 months"}
                onChange={handleChange}
                fullWidth
                required
                error={!!error.academicTerm?.duration}
                helperText={error.academicTerm?.duration || "e.g., 3 months"}
              />
            </Box>

            <DateInput
              label="Start Date"
              name="academicTerm.startDate"
              value={formValues.academicTerm?.startDate || ""}
              min={formValues.fromYear || today}
              errorMsg={error.academicTerm?.startDate}
            />

            <DateInput
              label="End Date"
              name="academicTerm.endDate"
              value={formValues.academicTerm?.endDate || ""}
              min={formValues.academicTerm?.startDate || today}
              errorMsg={error.academicTerm?.endDate}
            />

            {["1st Term", "2nd Term", "3rd Term"].map((termName, index) => (
              <Box key={termName} mb={3} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" mb={2}>
                  {termName}
                </Typography>

                <Box mb={2}>
                  <TextField
                    label="Description"
                    name={`academicTerm.terms[${index}].description`}
                    value={formValues.academicTerm?.terms[index]?.description || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!error.academicTerm?.terms?.[index]?.description}
                    helperText={error.academicTerm?.terms?.[index]?.description}
                  />
                </Box>

                <Box mb={2}>
                  <TextField
                    label="Duration"
                    name={`academicTerm.terms[${index}].duration`}
                    value={formValues.academicTerm?.terms[index]?.duration || "3 months"}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!error.academicTerm?.terms?.[index]?.duration}
                    helperText={error.academicTerm?.terms?.[index]?.duration || "e.g., 3 months"}
                  />
                </Box>

                <DateInput
                  label="Start Date"
                  name={`academicTerm.terms[${index}].startDate`}
                  value={formValues.academicTerm?.terms[index]?.startDate || ""}
                  min={formValues.academicTerm?.startDate || today}
                  errorMsg={error.academicTerm?.terms?.[index]?.startDate}
                />

                <DateInput
                  label="End Date"
                  name={`academicTerm.terms[${index}].endDate`}
                  value={formValues.academicTerm?.terms[index]?.endDate || ""}
                  min={formValues.academicTerm?.terms[index]?.startDate || today}
                  errorMsg={error.academicTerm?.terms?.[index]?.endDate}
                />

                <Box mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formValues.academicTerm?.terms[index]?.isCurrent || false}
                        onChange={handleChange}
                        name={`academicTerm.terms[${index}].isCurrent`}
                        color="primary"
                      />
                    }
                    label="Set as Current Term"
                  />
                </Box>

                <input type="hidden" name={`academicTerm.terms[${index}].name`} value={termName} />
                <input
                  type="hidden"
                  name={`academicTerm.terms[${index}].createdBy`}
                  value={userId || ""}
                />
              </Box>
            ))}
          </>
        )}

        <ActionButton
          type="submit"
          content={editMode ? "Update Academic Year" : "Submit"}
          disabled={
            !!error.name ||
            !!error.fromYear ||
            !!error.toYear ||
            (formValues.addAcademicTerm &&
              (Object.keys(error.academicTerm || {}).length > 0 ||
                formValues.academicTerm?.terms?.some(
                  (term, i) => Object.keys(error.academicTerm?.terms?.[i] || {}).length > 0
                )))
          }
        />
      </Box>
    </Modal>
  );
};

export { AddAcademicYearModal };
