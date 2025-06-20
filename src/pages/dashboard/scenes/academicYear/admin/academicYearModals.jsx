import React from "react";
import { Box, TextField, FormControlLabel, Checkbox, Typography, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Modal from "../../../components/modal";

const AddAcademicYearModal = ({
  open,
  onClose,
  handleSubmit,
  error = {},
  editMode = false,
  userId,
  formValues,
  handleChange,
  isSubmitting = false,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission attempted with values:", formValues);
    try {
      const success = await handleSubmit(formValues);
      if (success) {
        console.log("Submission successful");
        onClose();
      } else {
        console.log("Submission failed, handleSubmit returned false");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <>
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0);
            opacity: 1;
          }
          input[type="date"] {
            color-scheme: light;
          }
        `}
      </style>

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
              value={formValues.name || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!error.name}
              helperText={error.name || "Format: YYYY/YYYY (e.g., 2024/2025)"}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="From Year"
              name="fromYear"
              type="date"
              value={formValues.fromYear || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!error.fromYear}
              helperText={error.fromYear}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="To Year"
              name="toYear"
              type="date"
              value={formValues.toYear || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!error.toYear}
              helperText={error.toYear}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: formValues.fromYear || today }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.isCurrent || false}
                  onChange={handleChange}
                  name="isCurrent"
                  color="primary"
                />
              }
              label="Set as Current Academic Year"
            />
          </Box>

          {error.general && (
            <Typography variant="caption" color="error" mb={2}>
              {error.general}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : editMode ? "Update Academic Year" : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const AddAcademicTermModal = ({
  open,
  onClose,
  handleSubmit,
  error = {},
  userId,
  formValues,
  handleChange,
  isSubmitting = false,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleSubmit();
      if (success) onClose();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // Duration options from 1 to 10 months
  const durationOptions = Array.from({ length: 10 }, (_, i) => `${i + 1} month${i + 1 > 1 ? "s" : ""}`);

  return (
    <>
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0);
            opacity: 1;
          }
          input[type="date"] {
            color-scheme: light;
          }
        `}
      </style>

      <Modal open={open} onClose={onClose} title="Add Academic Term" noConfirm>
        <Box component="form" onSubmit={handleFormSubmit}>
          {formValues.terms.map((term, index) => (
            <Box key={term.name} mb={3} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
              <Typography variant="h6">{term.name}</Typography>
              <Box mb={2}>
                <FormControl fullWidth required error={!!error.terms?.[index]?.name}>
                  <InputLabel id={`term-name-label-${index}`}>Term Name</InputLabel>
                  <Select
                    labelId={`term-name-label-${index}`}
                    name="name"
                    value={term.name || ""}
                    onChange={(e) => handleChange(e, index)}
                    label="Term Name"
                    disabled
                  >
                    {["1st Term", "2nd Term", "3rd Term"].map((termName) => (
                      <MenuItem key={termName} value={termName}>
                        {termName}
                      </MenuItem>
                    ))}
                  </Select>
                  {error.terms?.[index]?.name && (
                    <Typography variant="caption" color="error">
                      {error.terms[index].name}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box mb={2}>
                <TextField
                  label="Description"
                  name="description"
                  value={term.description || ""}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                  error={!!error.terms?.[index]?.description}
                  helperText={error.terms?.[index]?.description}
                />
              </Box>
              <Box mb={2}>
                <FormControl fullWidth required error={!!error.terms?.[index]?.duration}>
                  <InputLabel id={`duration-label-${index}`}>Duration</InputLabel>
                  <Select
                    labelId={`duration-label-${index}`}
                    name="duration"
                    value={term.duration || "3 months"}
                    onChange={(e) => handleChange(e, index)}
                    label="Duration"
                  >
                    {durationOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {error.terms?.[index]?.duration && (
                    <Typography variant="caption" color="error">
                      {error.terms[index].duration}
                    </Typography>
                  )}
                </FormControl>
              </Box>
              <Box mb={2}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={term.startDate || ""}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                  error={!!error.terms?.[index]?.startDate}
                  helperText={error.terms?.[index]?.startDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={term.endDate || ""}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                  error={!!error.terms?.[index]?.endDate}
                  helperText={error.terms?.[index]?.endDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: term.startDate || today }}
                />
              </Box>
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={term.isCurrent || false}
                      onChange={(e) => handleChange(e, index, true)} // Pass isCurrent flag
                      name="isCurrent"
                      color="primary"
                    />
                  }
                  label="Set as Current Term"
                />
              </Box>
            </Box>
          ))}

          {error.general && (
            <Typography variant="caption" color="error" mb={2}>
              {error.general}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export { AddAcademicYearModal, AddAcademicTermModal };