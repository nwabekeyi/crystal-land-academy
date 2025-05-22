import React, { useState } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import TableComponent from "../../../../components/table"; // Make sure this path is correct
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const mockDataTeam = [
    { id: 1, name: 'Alice Johnson', age: 29, phone: '555-1234', email: 'alice.johnson@example.com', access: 'admin' },
    { id: 2, name: 'Bob Smith', age: 34, phone: '555-5678', email: 'bob.smith@example.com', access: 'manager' },
    { id: 3, name: 'Charlie Brown', age: 26, phone: '555-8765', email: 'charlie.brown@example.com', access: 'user' },
    { id: 4, name: 'Diana Prince', age: 31, phone: '555-4321', email: 'diana.prince@example.com', access: 'admin' },
    { id: 5, name: 'Ethan Hunt', age: 28, phone: '555-6789', email: 'ethan.hunt@example.com', access: 'user' }
  ];

  const columns = [
    { id: "id", label: "ID" },
    { id: "name", label: "Name", flex: 1, cellClassName: "name-column--cell" },
    { id: "age", label: "Age", type: "number", headerAlign: "left", align: "left" },
    { id: "phone", label: "Phone Number", flex: 1 },
    { id: "email", label: "Email", flex: 1 },
    {
      id: "access",
      label: "Access Level",
      flex: 1,
      renderCell: ({ access }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>  
        );
      },
    },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: "Managing the Team Members",
    data: mockDataTeam,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
  };

  return (
    <Box>
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box m="40px 0 0 0" height="75vh">
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(Team);
