import { Box, TextField, Typography, Alert, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";
import useSignUp from "./useSignUp";
import ConfirmationModal from "../../pages/dashboard/components/confirmationModal";
import { tokens } from "../../pages/dashboard/theme";
import Loader from "../../utils/loader";
import ActionButton from "../../pages/dashboard/components/actionButton";

const SignUpForm = ({ role, selectedUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    roleFields,
    error,
    loading,
    handleChange,
    handleSubmit,
    formData,
    formRef,
    modalOpen,
    modalMessage,
    setModalOpen,
    subclassSubjectOptions,
  } = useSignUp({ role, selectedUser });

  // Log for debugging
  console.log("SignUpForm - role:", role, "selectedUser:", selectedUser, "formData:", formData, "subclassSubjectOptions:", subclassSubjectOptions);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Show loading or error if formData is not initialized
  if (loading) {
    return <Loader />;
  }

  if (!formData || Object.keys(formData).length === 0) {
    return <Alert severity="error">Form data is not initialized. Please try again or check Redux configuration.</Alert>;
  }

  const getFieldValue = (name) => {
    if (!formData) return "";
    if (name.includes(".")) {
      const parts = name.split(/\.|\[|\]/).filter(Boolean);
      let value = formData;
      for (const part of parts) {
        if (Array.isArray(value) && part.match(/^\d+$/)) {
          value = value[parseInt(part)];
        } else {
          value = value?.[part];
        }
        if (value === undefined || value === null) return "";
      }
      return value;
    }
    return formData[name] || "";
  };

  // Validate role
  if (!roleFields[role]) {
    return <Alert severity="error">Invalid role specified</Alert>;
  }

  // Filter fields to conditionally show boarding details only for "Boarder" students
  const filteredFields = roleFields[role].filter((field) => {
    if (role === "student" && field.name.includes("boardingDetails")) {
      return formData.boardingStatus === "Boarder";
    }
    return true;
  });

  return (
    <Box>
      <Typography variant="h4">
        {selectedUser ? "Update" : "Sign Up"} ({role.charAt(0).toUpperCase() + role.slice(1)})
      </Typography>
      <form onSubmit={handleSubmit} ref={formRef}>
        {filteredFields.map((field) => (
          <Box key={field.name} mb={2}>
            {field.type === "select" ? (
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={getFieldValue(field.name) || ""}
                  onChange={handleChange}
                  required={field.required}
                >
                  {!field.required && <MenuItem value="">None</MenuItem>}
                  {field.name === "teachingAssignments[0].subject"
                    ? subclassSubjectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    : field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            ) : field.type === "file" ? (
              <Box>
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

      <ConfirmationModal
        open={modalOpen}
        message={modalMessage}
        title="User Registration Confirmation"
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default SignUpForm;