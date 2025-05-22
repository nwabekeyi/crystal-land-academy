import React, { useState } from 'react';
import { Box, Typography, useTheme, Tab, Tabs } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import TableComponent from "../../../../components/table"; // Make sure this path is correct
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';


// Dummy data for additional sections
const mockDataInvoices = [
  { id: 1, name: 'Invoice 1', phone: '123-456-7890', email: 'invoice1@example.com', amount: 250, date: '2024-07-01' },
  // Add more data as needed
];
const mockDataPayments = [
  { id: 1, name: 'Payment 1', phone: '123-456-7890', email: 'payment1@example.com', amount: 300, date: '2024-07-02' },
  // Add more data as needed
];
const mockDataExpenses = [
  { id: 1, name: 'Expense 1', phone: '123-456-7890', email: 'expense1@example.com', amount: 150, date: '2024-07-03' },
  // Add more data as needed
];
const mockDataRevenue = [
  { id: 1, name: 'Revenue 1', phone: '123-456-7890', email: 'revenue1@example.com', amount: 500, date: '2024-07-04' },
  // Add more data as needed
];
const mockDataBudget = [
  { id: 1, name: 'Budget 1', phone: '123-456-7890', email: 'budget1@example.com', amount: 1000, date: '2024-07-05' },
  // Add more data as needed
];

const financialColumns = (colors) => [
  { id: "id", label: "ID" },
  { id: "name", label: "Name", flex: 1 },
  { id: "phone", label: "Phone Number", flex: 1 },
  { id: "email", label: "Email", flex: 1 },
  { id: "amount", label: "Amount", flex: 1, renderCell: (row) => (
    <Typography color={colors.greenAccent[500]}>
      ${row.amount}
    </Typography>
  )},
  { id: "date", label: "Date", flex: 1 },
];

const FinancialManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    columns: financialColumns(colors),
    tableHeader: "Financial Management Data",
    data: tabValue === 0 ? mockDataInvoices :
          tabValue === 1 ? mockDataPayments :
          tabValue === 2 ? mockDataExpenses :
          tabValue === 3 ? mockDataRevenue : mockDataBudget,
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
      <Header title="FINANCIAL MANAGEMENT" subtitle="Manage your financial data" />

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="financial management tabs">
        <Tab label="Invoices" />
        <Tab label="Payments" />
        <Tab label="Expenses" />
        <Tab label="Revenue" />
        <Tab label="Budget" />
      </Tabs>

      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(FinancialManagement);
