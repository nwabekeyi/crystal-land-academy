import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import TableComponent from '../../../../components/table';
import useApi from '../../../../hooks/useApi'; // Import your custom hook
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { endpoints } from "../../../../utils/constants";


const Feedbacks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [feedbacks, setFeedbacks] = useState([]);


  // Using useApi for fetching feedbacks and submitting new feedback
  const {
    loading: fetchLoading,
    data: fetchData,
    error: fetchError,
    callApi: fetchFeedbacks,
  } = useApi();


  // Fetch feedbacks when the component mounts
  useEffect(() => {
    fetchFeedbacks(endpoints.FEEDBACKS, 'GET');
  }, [fetchFeedbacks]);

  // Update feedbacks state when data is fetched
  useEffect(() => {
    if (fetchData) {
      setFeedbacks(fetchData);
    }
  }, [fetchData]);


  const columns = [
    { id: 'id', label: 'S/N', flex: 0.5 },
    { id: 'name', label: 'Name', flex: 1 },
    { id: 'role', label: 'Role', flex: 1 },
    { id: 'date', label: 'Date', flex: 1 },
    { id: 'comments', label: 'Comments', flex: 2 },
  ];

  const handleSortChange = (columnId) => {
    // handle sort change logic
  };

  const handlePageChange = (event, newPage) => {
    // handle page change logic
  };

  const handleRowsPerPageChange = (event) => {
    // handle rows per page change logic
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: 'Feedback',
    data: feedbacks,
    sortBy: 'id',
    sortDirection: 'asc',
    onSortChange: handleSortChange,
    page: 0,
    rowsPerPage: 5,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
  };

  return (
    <Box>
      <Header title="Feedback" subtitle="Feedback from Students, Instructors, and Workers" />

      {fetchLoading && <Typography>Loading feedbacks...</Typography>}
      {fetchError && <Typography color="error">{fetchError}</Typography>}
      
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
