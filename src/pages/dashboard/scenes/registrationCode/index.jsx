import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import TableComponent from "../../../../components/table";
import Modal from "../../components/modal";
import { endpoints } from "../../../../utils/constants";
import useApi from "../../../../hooks/useApi";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const RegistrationCodes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("generatedDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const columns = [
    { id: "sn", label: "S/N", minWidth: 50 },
    { id: "code", label: "Code", minWidth: 100 },
    { id: "generatedDate", label: "Generated Date", minWidth: 100 },
    { id: "generatedTime", label: "Generated Time", minWidth: 100 },
    { id: "expiresAt", label: "Expires At", minWidth: 100, type: "date" },
    {
      id: "used",
      label: "Used",
      minWidth: 50,
      renderCell: (row) => (row.used ? "true" : "false"),
    },
    {
      id: "usedBy",
      label: "Used By",
      minWidth: 100,
      renderCell: (row) => (row.usedBy ? row.usedBy.firstName || row.usedBy._id : "N/A"),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 50,
      renderCell: (row) => (
        <IconButton
          onClick={() => {
            setCodeToDelete(row);
            setDeleteModalOpen(true);
          }}
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const { loading, data, error, callApi } = useApi();

  // Fetch registration codes when dependencies change
  useEffect(() => {
    const url = `${endpoints.REGISTRATION_CODE}?page=${page + 1}&limit=${rowsPerPage}&sort=${sortBy}&order=${sortDirection}`;
    console.log("Fetching from:", url); // Debug URL
    callApi(url, "GET");
  }, [page, rowsPerPage, sortBy, sortDirection, callApi]);

  // Handle deletion of a code
  const handleDelete = async () => {
    try {
      const url = `${endpoints.REGISTRATION_CODE}/${codeToDelete._id}`;
      console.log("Deleting code at:", url); // Debug URL
      await callApi(url, "DELETE");
      setDeleteModalOpen(false);
      setCodeToDelete(null);
      const fetchUrl = `${endpoints.REGISTRATION_CODE}?page=${page + 1}&limit=${rowsPerPage}&sort=${sortBy}&order=${sortDirection}`;
      callApi(fetchUrl, "GET"); // Refresh codes
    } catch (err) {
      console.error("Failed to delete code:", err);
    }
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort changes
  const handleSortChange = (columnId) => {
    setSortBy(columnId);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Create rows from data
  const rows = (data?.data?.data || []).map((code, index) => ({
    ...code,
    sn: index + 1, // Add serial number
  }));

  // Handle non-JSON response
  const displayError = error || (typeof data === "string" && data.includes("<!doctype html>")
    ? "Invalid response from server: Expected JSON but received HTML"
    : null);

  // Debug log for API response
  useEffect(() => {
    console.log("API Response:", { loading, data, error });
  }, [loading, data, error]);

  return (
    <Box>
      {/* Header Section */}
      <Header title="REGISTRATION CODES" subtitle="List of Registration Codes" />

      {/* Table Section */}
      {loading && <p>Loading...</p>}
      {displayError && <p style={{ color: "red" }}>{displayError}</p>}
      {!loading && !displayError && rows.length === 0 && <p>No registration codes found.</p>}

      {!loading && !displayError && rows.length > 0 && (
        <Box m="40px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="List of Registration Codes"
            data={rows}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={data?.data?.totalRows || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortChange={handleSortChange}
            loading={loading}
            error={displayError}
          />
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      {codeToDelete && (
        <Modal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCodeToDelete(null);
          }}
          title="Confirm Deletion"
          onConfirm={handleDelete}
          confirmText="Delete"
          cancelText="Cancel"
        >
          <div className="modal-content">
            <h2>Are you sure you want to delete this registration code?</h2>
            <p>
              <strong>Code: </strong>
              {codeToDelete.code}
            </p>
            <p>
              <strong>Generated Date: </strong>
              {codeToDelete.generatedDate}
            </p>
            <p>
              <strong>Used: </strong>
              {codeToDelete.used ? "true" : "false"}
            </p>
            <p>
              <strong>Used By: </strong>
              {codeToDelete.usedBy ? codeToDelete.usedBy.firstName || codeToDelete.usedBy._id : "N/A"}
            </p>
          </div>
        </Modal>
      )}
    </Box>
  );
};

export default withDashboardWrapper(RegistrationCodes);