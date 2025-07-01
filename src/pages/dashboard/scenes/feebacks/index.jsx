import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';

const Feedbacks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [students, setStudents] = useState([]);
  const [sortBy, setSortBy] = useState('_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, loading, error, callApi } = useApi();

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await callApi(endpoints.FEEDBACKS, 'GET');
      if (response && response.data && response.data.feedbacks) {
        console.log("Fetched feedbacks:", response.data.feedbacks); // Debugging log
        setStudents(response.data.feedbacks);
      }
    };

    fetchStudents();
  }, [callApi]);

  const columns = [
    {
      id: '_id',
      label: 'S/N',
      flex: 0.5,
      renderCell: (row, index) => <Typography>{index + 1}</Typography>, // Fix for S/N column
    },
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
    tableHeader: 'Feedbacks',
    data: students,
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
      <Header title="Feedbacks" subtitle="List of all feedbacks" />

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
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography>Error fetching feedbacks</Typography>
        ) : (
          <TableComponent {...tableProps} />
        )}
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(Feedbacks);