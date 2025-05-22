import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import TableComponent from "../../../../components/table";
import Modal from "../../components/modal";
import ContactForm from "../contactForm";
import useApi from "../../../../hooks/useApi";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [sortBy, setSortBy] = useState("id"); // Default sort column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

  const columns = [
    { id: "id", label: "ID", flex: 0.5 },
    { id: "registrarId", label: "Registrar ID" },
    { id: "name", label: "Name", flex: 1 },
    { id: "age", label: "Age", type: "number" },
    { id: "phone", label: "Phone", flex: 1 },
    { id: "email", label: "Email", flex: 1 },
    { id: "address", label: "Address", flex: 1 },
    { id: "city", label: "City", flex: 1 },
    { id: "zipCode", label: "Zip Code", flex: 1 },
  ];

  const { loading, data, error, callApi } = useApi(
    `http://localhost:3500/api/v1/contacts?page=${page}&limit=${rowsPerPage}&sort=${sortBy}&order=${sortDirection}`
  );

  // Fetch contacts when dependencies change
  useEffect(() => {
    callApi("GET");
  }, [page, rowsPerPage, sortBy, sortDirection, callApi]);

  // Handle submission of a new contact
  const handleFormSubmit = async (newContact) => {
    try {
      await callApi("POST", newContact);
      setModalOpen(false); // Close modal after successful submission
      callApi("GET"); // Refresh contacts
    } catch (err) {
      console.error("Failed to add contact:", err);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  // Handle sort changes
  const handleSortChange = (columnId) => {
    setSortBy(columnId);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Box>
      {/* Header Section */}
      <Header title="CONTACTS" subtitle="List of Contacts for Future Reference" />

      {/* Add Contact Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add Contact
        </Button>
      </Box>

      {/* Table Section */}
      <Box m="40px 0 0 0" height="75vh">
        <TableComponent
          columns={columns}
          tableHeader="List of Contacts for Future Reference"
          data={data?.data || []} // Corrected: Use the 'data' key from the backend response
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={data?.totalRows || 0} // Corrected: Use 'totalRows' from the backend response
          sortBy={sortBy}
          sortDirection={sortDirection}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSortChange={handleSortChange}
          loading={loading}
          error={error}
          onRowClick={(row) => console.log("Row clicked:", row)}
        />

      </Box>

      {/* Add Contact Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Contact"
        onConfirm={null} // Confirmation logic handled in form
        noConfirm
      >
        <ContactForm onSubmit={handleFormSubmit} />
      </Modal>
    </Box>
  );
};

export default withDashboardWrapper(Contacts);
