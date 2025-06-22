import { useState } from 'react';
import { IconButton, Typography, Box, Tab, Tabs } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import TableComponent from "../../../../components/table"; // Ensure correct path
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

// Mock data for Fees Paid (Primary and Secondary sections)
const mockDataPrimaryFees = [
  { id: 1, class: 'Primary 1', feesPaid: 150000, balance: 120000, date: '2025-06-01' },
  { id: 2, class: 'Primary 2', feesPaid: 160000, balance: 130000, date: '2025-06-02' },
  { id: 3, class: 'Primary 3', feesPaid: 140000, balance: 110000, date: '2025-06-03' },
  { id: 4, class: 'Primary 4', feesPaid: 170000, balance: 140000, date: '2025-06-04' },
  { id: 5, class: 'Primary 5', feesPaid: 180000, balance: 150000, date: '2025-06-05' },
  { id: 6, class: 'Primary 6', feesPaid: 190000, balance: 160000, date: '2025-06-06' },
];

const mockDataSecondaryFees = [
  { id: 1, class: 'JSS 1', feesPaid: 200000, balance: 150000, date: '2025-06-01' },
  { id: 2, class: 'JSS 2', feesPaid: 210000, balance: 160000, date: '2025-06-02' },
  { id: 3, class: 'JSS 3', feesPaid: 220000, balance: 170000, date: '2025-06-03' },
  { id: 4, class: 'SSS 1', feesPaid: 230000, balance: 180000, date: '2025-06-04' },
  { id: 5, class: 'SSS 2', feesPaid: 240000, balance: 190000, date: '2025-06-05' },
  { id: 6, class: 'SSS 3', feesPaid: 250000, balance: 200000, date: '2025-06-06' },
];

// Mock data for Expenditures
const mockDataExpenditures = [
  { id: 1, category: 'Teacher Salaries', amount: 50000, date: '2025-06-01' },
  { id: 2, category: 'Utilities', amount: 55000, date: '2025-06-02' },
  { id: 3, category: 'Maintenance', amount: 45000, date: '2025-06-03' },
  { id: 4, category: 'Supplies', amount: 60000, date: '2025-06-04' },
  { id: 5, category: 'Events', amount: 65000, date: '2025-06-05' },
  { id: 6, category: 'Transport', amount: 70000, date: '2025-06-06' },
];

// Mock data for Other Revenues
const mockDataOtherRevenues = [
  { id: 1, source: 'Donations', amount: 20000, date: '2025-06-01' },
  { id: 2, source: 'Extracurricular Fees', amount: 25000, date: '2025-06-02' },
  { id: 3, source: 'Fundraising', amount: 15000, date: '2025-06-03' },
  { id: 4, source: 'Grants', amount: 30000, date: '2025-06-04' },
  { id: 5, source: 'Uniform Sales', amount: 35000, date: '2025-06-05' },
  { id: 6, source: 'Book Sales', amount: 40000, date: '2025-06-06' },
];

const useFinancialManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Sort table columns
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

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
    setPage(0); // Reset page when switching tabs
  };

  // Placeholder for edit action
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  // Placeholder for delete action
  const handleDeleteOpen = (record) => {
    setSelectedRecord(record);
    setOpenDeleteModal(true);
  };

  // Placeholder for view details
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewDetailsOpen(true);
  };

  // Columns for Fees Paid tabs (Primary and Secondary)
  const feesColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'class',
      label: 'Class',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {String(row.class || 'N/A')} {/* Force string to prevent date parsing */}
        </Typography>
      ),
    },
    {
      id: 'feesPaid',
      label: 'Fees Paid',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.greenAccent[500]}>
          {typeof row.feesPaid === 'number' ? `₦${row.feesPaid.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'balance',
      label: 'Balance',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.blueAccent[500]}>
          {typeof row.balance === 'number' ? `₦${row.balance.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    { id: 'date', label: 'Date', flex: 1 },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOpen(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleViewDetails(row)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Columns for Expenditures tab
  const expenditureColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'category',
      label: 'Category',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {String(row.category || 'N/A')}
        </Typography>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.redAccent[500]}>
          {typeof row.amount === 'number' ? `₦${row.amount.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    { id: 'date', label: 'Date', flex: 1 },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOpen(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleViewDetails(row)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Columns for Other Revenues tab
  const revenueColumns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'id', label: 'ID', width: 100 },
    {
      id: 'source',
      label: 'Source',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {String(row.source || 'N/A')}
        </Typography>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      flex: 1,
      renderCell: (row) => (
        <Typography color={colors.blueAccent[500]}>
          {typeof row.amount === 'number' ? `₦${row.amount.toLocaleString()}` : 'N/A'}
        </Typography>
      ),
    },
    { id: 'date', label: 'Date', flex: 1 },
    {
      id: 'actions',
      label: 'Actions',
      width: 200,
      renderCell: (row) => (
        <div style={{ display: 'flex' }}>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOpen(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleViewDetails(row)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  // Data for Fees Paid (Primary)
  const primaryFeesData = mockDataPrimaryFees.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    class: record.class,
    feesPaid: record.feesPaid,
    balance: record.balance,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  })).sort((a, b) => a.sn - b.sn);

  // Data for Fees Paid (Secondary)
  const secondaryFeesData = mockDataSecondaryFees.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    class: record.class,
    feesPaid: record.feesPaid,
    balance: record.balance,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  })).sort((a, b) => a.sn - b.sn);

  // Data for Expenditures
  const expenditureData = mockDataExpenditures.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    category: record.category,
    amount: record.amount,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  })).sort((a, b) => a.sn - b.sn);

  // Data for Other Revenues
  const otherRevenueData = mockDataOtherRevenues.map((record, index) => ({
    id: record.id,
    sn: index + 1,
    source: record.source,
    amount: record.amount,
    date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
  })).sort((a, b) => a.sn - b.sn);

  // Determine columns and data based on tabIndex
  const getTableProps = () => {
    switch (tabIndex) {
      case 0: // Primary Fees
        return { columns: feesColumns, data: primaryFeesData, header: 'Primary Section Fees' };
      case 1: // Secondary Fees
        return { columns: feesColumns, data: secondaryFeesData, header: 'Secondary Section Fees' };
      case 2: // Expenditures
        return { columns: expenditureColumns, data: expenditureData, header: 'School Expenditures' };
      case 3: // Other Revenues
        return { columns: revenueColumns, data: otherRevenueData, header: 'Other Revenues' };
      default:
        return { columns: feesColumns, data: primaryFeesData, header: 'Primary Section Fees' };
    }
  };

  const { columns, data, header } = getTableProps();

  return {
    columns,
    data,
    header,
    tabIndex,
    handleTabChange,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    selectedRecord,
    setSelectedRecord,
    openDeleteModal,
    setOpenDeleteModal,
    editDialogOpen,
    setEditDialogOpen,
    viewDetailsOpen,
    setViewDetailsOpen,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleEdit,
    handleDeleteOpen,
    handleViewDetails,
  };
};

const FinancialManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    columns,
    data,
    header,
    tabIndex,
    handleTabChange,
    sortBy,
    sortDirection,
    page,
    rowsPerPage,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = useFinancialManagement();

  const tableProps = {
    columns,
    tableHeader: header,
    data,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };

  return (
    <Box>
      <Header title="FINANCIAL MANAGEMENT" subtitle="Financial data for school operations" />

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="financial management tabs"
        sx={{
          backgroundColor: colors.primary[400],
          '& .MuiTabs-indicator': {
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <Tab
          label="Primary Fees"
          sx={{
            color: 'white !important',
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: 'white !important',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
              backgroundColor: colors.blueAccent[700],
            },
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.primary[400],
          }}
        />
        <Tab
          label="Secondary Fees"
          sx={{
            color: 'white !important',
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: 'white !important',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
              backgroundColor: colors.blueAccent[700],
            },
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.primary[400],
          }}
        />
        <Tab
          label="Expenditures"
          sx={{
            color: 'white !important',
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: 'white !important',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
              backgroundColor: colors.blueAccent[700],
            },
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.primary[400],
          }}
        />
        <Tab
          label="Other Revenues"
          sx={{
            color: 'white !important',
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: 'white !important',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
              backgroundColor: colors.blueAccent[700],
            },
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.primary[400],
          }}
        />
      </Tabs>

      <Box m="40px 0 0 0" height="75vh">
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(FinancialManagement);