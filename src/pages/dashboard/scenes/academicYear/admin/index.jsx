// components/Admin.js
import React, { useState } from "react";
import { Box, Grid, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import TableComponent from "../../../../../components/table";
import useAcademicYears from "./useAcademicYears";
import { AddAcademicYearModal } from "./academicYearModals";
import ActionButton from "../../../components/actionButton";
import EditIcon from "@mui/icons-material/Edit";

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    setEditMode,
    setFormValues,
    academicYears,
    currentYear,
    loading,
    error,
    formValues,
    handleChange,
    handleSubmit,
    startEdit,
    editMode,
  } = useAcademicYears();
  const [openForm, setOpenForm] = useState(false);

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Table columns
  const columns = [
    { id: "sn", label: "S/N" },
    { id: "name", label: "Name" },
    { id: "fromYear", label: "From Year" },
    { id: "toYear", label: "To Year" },
    { id: "isCurrent", label: "Current" },
    { id: "studentCount", label: "Students" },
    { id: "teacherCount", label: "Teachers" },
    { id: "academicTermCount", label: "Academic Terms" },
    { id: "actions", label: "Actions" },
  ];

  // Table rows
  const rows = academicYears.map((year, index) => ({
    sn: index + 1,
    id: year._id,
    name: year.name,
    fromYear: new Date(year.fromYear).toLocaleDateString(),
    toYear: new Date(year.toYear).toLocaleDateString(),
    isCurrent: year.isCurrent ? "Yes" : "No",
    studentCount: year.students?.length || 0,
    teacherCount: year.teachers?.length || 0,
    academicTermCount: year.academicTerms?.length || 0,
    actions: (
      <IconButton onClick={() => handleEdit(year)}>
        <EditIcon />
      </IconButton>
    ),
  }));

  // Handle edit button click
  const handleEdit = (year) => {
    startEdit(year);
    setOpenForm(true);
  };

  // Handle sorting
  const handleSortChange = (columnId) => {
    const isAscending = sortBy === columnId && sortDirection === "asc";
    setSortBy(columnId);
    setSortDirection(isAscending ? "desc" : "asc");
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter rows based on search query
  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
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
            {/* Current Academic Year Section */}
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
                {currentYear ? (
                  <Typography variant="body1" color={colors.grey[100]}>
                    {currentYear.name} (
                    {new Date(currentYear.fromYear).toLocaleDateString()} -{" "}
                    {new Date(currentYear.toYear).toLocaleDateString()}) |{" "}
                    {currentYear.students?.length || 0} Students,{" "}
                    {currentYear.teachers?.length || 0} Teachers,{" "}
                    {currentYear.academicTerms?.length || 0} Terms
                  </Typography>
                ) : (
                  <Typography variant="body1" color={colors.redAccent[500]}>
                    No current academic year set.
                  </Typography>
                )}
              </Box>
              <ActionButton
                onClick={() => {
                  setFormValues({
                    id: "",
                    name: "",
                    fromYear: "",
                    toYear: "",
                    isCurrent: false,
                    addAcademicTerm: false,
                    academicTerm: {
                      name: "",
                      description: "",
                      duration: "3 months",
                      startDate: "",
                      endDate: "",
                      terms: [
                        { name: "1st Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
                        { name: "2nd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
                        { name: "3rd Term", description: "", duration: "3 months", startDate: "", endDate: "", isCurrent: false, createdBy: "" },
                      ],
                    },
                  });
                  setEditMode(false);
                  setOpenForm(true);
                }}
                content="Add Academic Year"
              />
            </Box>

            {/* Academic Year Form Modal */}
            <AddAcademicYearModal
              open={openForm}
              onClose={() => setOpenForm(false)}
              formValues={formValues}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              error={error}
              editMode={editMode}
            />

            {/* Academic Years Table */}
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
  );
};

export default Admin;