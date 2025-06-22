import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

// Dummy feedback data
const dummyFeedbacks = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Student',
    date: '2025-06-01',
    comments: 'The math classes are very engaging, but more practice sessions would help.',
  },
  {
    id: 2,
    name: 'John Doe',
    role: 'Instructor',
    date: '2025-06-02',
    comments: 'The new teaching tools are effective, but Wi-Fi needs improvement.',
  },
  {
    id: 3,
    name: 'Mary Smith',
    role: 'Worker',
    date: '2025-06-03',
    comments: 'The staff lounge is great, but cleaning schedules need adjustment.',
  },
  {
    id: 4,
    name: 'Bob Brown',
    role: 'Student',
    date: '2025-06-04',
    comments: 'Science labs are fun, but safety equipment needs updating.',
  },
  {
    id: 5,
    name: 'Emma Wilson',
    role: 'Instructor',
    date: '2025-06-05',
    comments: 'Student participation has improved with group activities.',
  },
];

const Feedbacks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feedbacks] = useState(dummyFeedbacks); // Use dummy data directly
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'id', label: 'S/N', flex: 0.5 },
    {
      id: 'name',
      label: 'Name',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.name || 'N/A')}</Typography>,
    },
    {
      id: 'role',
      label: 'Role',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.role || 'N/A')}</Typography>,
    },
    {
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</Typography>,
    },
    {
      id: 'comments',
      label: 'Comments',
      flex: 2,
      renderCell: (row) => <Typography>{String(row.comments || 'N/A')}</Typography>,
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
    tableHeader: 'Feedback',
    data: feedbacks,
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
      <Header title="Feedback" subtitle="Feedback from Students, Instructors, and Workers" />

      <Box
        height="75vh"
        sx={{
          '& .MuiTable-root': {
            border: 'none',
          },
          '& .MuiTable-cell': {
            borderBottom: 'none',
          },
          '& .MuiTableHead-root': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiTableBody-root': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiTableFooter-root': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(Feedbacks);