// components/Admin.js
import React, { useState } from "react";
import { Box, Grid, useTheme, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import TableComponent from "../../../../../components/table";
import useAcademicYears from "./useAcademicYears";

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { academicYears, currentYear, loading, error } = useAcademicYears();

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
  ];

  // Table rows
  const rows = academicYears.map((year, index) => ({
    sn: index + 1,
    id: year._id,
    name: year.name,
    fromYear: new Date(year.fromYear).toLocaleDateString(),
    toYear: new Date(year.toYear).toLocaleDateString(),
    isCurrent: year.isCurrent ? "Yes" : "No",
  }));

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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header title="Academics Management" subtitle="Manage Academic Sessions" />
      </Grid>

      <Grid item xs={12}>
        {loading ? (
          <Box>Loading...</Box>
        ) : error ? (
          <Box sx={{ color: "red" }}>{error}</Box>
        ) : (
          <>
            {/* Current Academic Year Section */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: colors.primary[400],
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" color={colors.grey[100]}>
                Current Academic Year
              </Typography>
              {currentYear ? (
                <Typography variant="body1" color={colors.grey[100]}>
                  {currentYear.name} (
                  {new Date(currentYear.fromYear).toLocaleDateString()} -{" "}
                  {new Date(currentYear.toYear).toLocaleDateString()})
                </Typography>
              ) : (
                <Typography variant="body1" color={colors.redAccent[500]}>
                  No current academic year set.
                </Typography>
              )}
            </Box>

            {/* Academic Years Table */}
            <TableComponent
              columns={columns}
              tableHeader="Academic Years"
              data={filteredRows}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              hiddenColumnsSmallScreen={["fromYear", "toYear"]}
              hiddenColumnsTabScreen={["fromYear"]}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Admin;