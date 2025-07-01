import React, { useState } from "react";
import { Box, Grid, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import TableComponent from "../../../../../components/table";
import useAcademicYears from "./useAcademicYears";
import { AddAcademicYearModal, AddAcademicTermModal } from "./academicYearModals";
import ActionButton from "../../../components/actionButton";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Modal from "../../../components/modal";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Something went wrong.
          </Typography>
          <Typography variant="body1" mt={2}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Typography>
          <ActionButton
            content="Reload"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          />
        </Box>
      );
    }
    return this.props.children;
  }
}

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    academicYears,
    currentAcademicYear,
    loading,
    error,
    termError,
    handleSubmit,
    handleCreateAcademicTerm,
    handleDeleteAcademicYear,
    startEdit,
    startAddTerm,
    editMode,
    setEditMode,
    formValues,
    termFormValues,
    handleChange,
    handleTermChange,
    isSubmitting,
    resetForm,
    resetTermForm,
  } = useAcademicYears();
  const [openForm, setOpenForm] = useState(false);
  const [openTermForm, setOpenTermForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteYearId, setDeleteYearId] = useState(null);
  const userId = useSelector((state) => state.users.user?._id) || "";

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { id: "sn", label: "S/N" },
    { id: "name", label: "Name" },
    { id: "fromYear", label: "From Year" },
    { id: "toYear", label: "To Year" },
    { id: "isCurrent", label: "Current" },
    { id: "studentCount", label: "Students" },
    { id: "teacherCount", label: "Teachers" },
    { id: "actions", label: "Actions" },
  ];

  const rows = academicYears.map((year, index) => ({
    sn: index + 1,
    id: year._id,
    name: year.name,
    fromYear: new Date(year.fromYear).toLocaleDateString(),
    toYear: new Date(year.toYear).toLocaleDateString(),
    isCurrent: year.isCurrent ? "Yes" : "No",
    studentCount: year.students?.length || 0,
    teacherCount: year.teachers?.length || 0,
    actions: (
      <Box>
        <IconButton
          onClick={() => {
            console.log("EditIcon clicked for academicYearId:", year._id);
            handleEdit(year);
          }}
        >
          <FaEdit />
        </IconButton>
        <IconButton
          onClick={() => {
            console.log("AddCircleIcon clicked for academicYearId:", year._id);
            handleAddTerm(year._id);
          }}
        >
          <FaPlusCircle />
        </IconButton>
        <IconButton
          onClick={() => {
            console.log("DeleteIcon clicked for academicYearId:", year._id);
            handleDeleteClick(year._id);
          }}
        >
          <FaTrash />
        </IconButton>
      </Box>
    ),
  }));

  const handleEdit = (year) => {
    console.log("handleEdit called with year:", year._id);
    startEdit(year);
    setOpenForm(true);
  };

  const handleAddTerm = (academicYearId) => {
    console.log("handleAddTerm called with academicYearId:", academicYearId);
    try {
      startAddTerm(academicYearId);
      setOpenTermForm(true);
    } catch (err) {
      console.error("Error in handleAddTerm:", err);
    }
  };

  const handleDeleteClick = (yearId) => {
    setDeleteYearId(yearId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteYearId) {
      const success = await handleDeleteAcademicYear(deleteYearId);
      if (success) {
        setDeleteConfirmOpen(false);
        setDeleteYearId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteYearId(null);
  };

  const handleSortChange = (columnId) => {
    const isAscending = sortBy === columnId && sortDirection === "asc";
    setSortBy(columnId);
    setSortDirection(isAscending ? "desc" : "asc");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <ErrorBoundary>
      <Grid container>
        <Grid item xs={12}>
          <Header title="Academics Management" subtitle="Manage Academic Sessions" />
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <Box>Loading...</Box>
          ) : error.general ? (
            <Box sx={{ color: "red" }}>{error.general}</Box>
          ) : (
            <>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: colors.primary[400],
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h5" color={colors.grey[100]}>
                    Current Academic Year
                  </Typography>
                  {currentAcademicYear ? (
                    <Typography variant="body1" color={colors.grey[100]}>
                      {currentAcademicYear.name} (
                      {new Date(currentAcademicYear.fromYear).toLocaleDateString()} -{" "}
                      {new Date(currentAcademicYear.toYear).toLocaleDateString()}) |{" "}
                      {currentAcademicYear.students?.length || 0} Students,{" "}
                      {currentAcademicYear.teachers?.length || 0} Teachers,{" "}
                      {currentAcademicYear.academicTerms?.length || 0} Terms
                    </Typography>
                  ) : (
                    <Typography variant="body1" color={colors.redAccent[500]}>
                      No current academic year set.
                    </Typography>
                  )}
                </Box>
                <ActionButton
                  onClick={() => {
                    setOpenForm(true);
                    setEditMode(false);
                    resetForm();
                  }}
                  content="Add Academic Year"
                />
              </Box>

              <AddAcademicYearModal
                open={openForm}
                onClose={() => {
                  setOpenForm(false);
                  setEditMode(false);
                  resetForm();
                }}
                handleSubmit={handleSubmit}
                error={error}
                editMode={editMode}
                userId={userId}
                formValues={formValues}
                handleChange={handleChange}
                isSubmitting={isSubmitting}
              />

              <AddAcademicTermModal
                open={openTermForm}
                onClose={() => {
                  setOpenTermForm(false);
                  resetTermForm();
                }}
                handleSubmit={handleCreateAcademicTerm}
                error={termError}
                userId={userId}
                formValues={termFormValues}
                handleChange={handleTermChange}
                isSubmitting={isSubmitting}
              />

              <Modal
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
                title="Confirm Deletion"
                noConfirm={false}
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                cancelText="Cancel"
              >
                <Typography>
                  Are you sure you want to delete this academic year? This action cannot be undone.
                </Typography>
              </Modal>

              <TableComponent
                columns={columns}
                tableHeader="Academic Years"
                data={sortedRows}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                hiddenColumnsSmallScreen={["fromYear", "toYear", "studentCount", "teacherCount", "academicTermCount", "actions"]}
                hiddenColumnsTabScreen={["studentCount", "teacherCount", "academicTermCount"]}
              />
            </>
          )}
        </Grid>
      </Grid>
    </ErrorBoundary>
  );
};

export default Admin;