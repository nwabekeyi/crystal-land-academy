import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Typography
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import TableComponent from "../../../../components/table"; // Ensure this path is correct
import useApi from "../../../../hooks/useApi"; // Adjust the path to where your `useApi` hook is stored
import { endpoints } from "../../../../utils/constants";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const Support = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const {
    data: inquiries,
    loading: loadingInquiries,
    error: errorInquiries,
    callApi: fetchInquiries,
  } = useApi();

  const {
    callApi: submitInquiry,
    loading: loadingSubmit,
    error: errorSubmit,
  } = useApi();

  // Fetch inquiries on component mount
  useEffect(() => {
    fetchInquiries(endpoints.ENQUIRIES, 'GET');
  }, [fetchInquiries]);

  // Submit a new inquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInquiry = { name, email, date, message };
    await submitInquiry(endpoints.ENQUIRIES, "POST", newInquiry);

    // Refresh the inquiries list after successful submission
    if (!errorSubmit) {
      fetchInquiries(endpoints.ENQUIRIES, "GET");
      setName("");
      setEmail("");
      setDate("");
      setMessage("");
    }
  };

  const columns = [
    { id: "id", label: "ID", flex: 0.5 },
    { id: "name", label: "Name", flex: 1 },
    { id: "email", label: "Email", flex: 1 },
    { id: "date", label: "Date", flex: 1 },
    { id: "message", label: "Message", flex: 2 },
  ];

  const tableProps = {
    columns,
    tableHeader: "Support Inquiries",
    data: inquiries || [],
    sortBy: "id",
    sortDirection: "asc",
    page: 0,
    rowsPerPage: 5,
    onRowClick: (row) => console.log("Row clicked:", row),
  };

  return (
    <Box>
      <Header
        title="Support and Customer Care"
        subtitle="Submit your inquiries and concerns"
      />

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Submitting..." : "Submit Inquiry"}
        </Button>
        {errorSubmit && <Typography color="error">{errorSubmit}</Typography>}
      </Box>

      {loadingInquiries ? (
        <Typography>Loading inquiries...</Typography>
      ) : errorInquiries ? (
        <Typography color="error">{errorInquiries}</Typography>
      ) : (
        <Box
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <TableComponent {...tableProps} />
        </Box>
      )}
    </Box>
  );
};

export default withDashboardWrapper(Support);
