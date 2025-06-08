// components/SignUpForm.js
import { Box, TextField, Typography, Alert, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";
import useSignUp from "./useSignUp";
import ConfirmationModal from "../../pages/dashboard/components/confirmationModal";
import { tokens } from "../../pages/dashboard/theme";
import Loader from "../../utils/loader";
import ActionButton from "../../pages/dashboard/components/actionButton";

const SignUpForm = ({ role, selectedUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { roleFields, error, loading, handleChange, handleSubmit, formData, formRef, modalOpen, modalMessage, setModalOpen } = useSignUp({ role, selectedUser });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  const getFieldValue = (name) => {
    if (name.includes(".")) {
      const parts = name.split(/\.|\[|\]/).filter(Boolean);
      let value = formData;
      for (const part of parts) {
        if (Array.isArray(value) && part.match(/^\d+$/)) {
          value = value[parseInt(part)];
        } else {
          value = value?.[part];
        }
        if (value === undefined) return "";
      }
      return value;
    }
    return formData[name] || "";
  };

  return (
    <Box>
      <Typography variant="h4">
        {selectedUser ? "Update" : "Sign Up"} ({role.charAt(0).toUpperCase() + role.slice(1)})
      </Typography>
      <form onSubmit={handleSubmit} ref={formRef}>
        {roleFields[role].map((field) => (
          <Box key={field.name} mb={2}>
            {field.type === "select" ? (
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select name={field.name} value={getFieldValue(field.name)} onChange={handleChange} required={field.required}>
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : field.type === "file" ? (
              <Box mb={2}>
                <input
                  type="file"
                  name={field.name}
                  id={field.name}
                  onChange={handleChange}
                  required={field.required}
                  accept="image/*"
                  style={{ display: "block", width: "100%" }}
                />
              </Box>
            ) : (
              <TextField
                label={field.label}
                name={field.name}
                type={field.type}
                value={getFieldValue(field.name)}
                onChange={handleChange}
                required={field.required}
                fullWidth
              />
            )}
          </Box>
        ))}
        {error && <Alert severity="error">{error}</Alert>}
        <ActionButton content={selectedUser ? "Update" : "Sign Up"} submit />
      </form>

      <ConfirmationModal open={modalOpen} message={modalMessage} title="User Registration Confirmation" onClose={handleCloseModal} />
    </Box>
  );
};

export default SignUpForm;