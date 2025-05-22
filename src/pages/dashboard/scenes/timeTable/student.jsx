import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import { useSelector } from 'react-redux';
import { endpoints } from '../../../../utils/constants';
import Loader from "../../../../utils/loader";
import useApi from '../../../../hooks/useApi'; // Assuming you have a useApi hook
import Header from '../../components/Header';


const TimeTable = () => {
  const [timeTable, setTimeTable] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails?.cohort; // Check if userDetails exist
  const postUrl = cohortName ? `${endpoints.TIMETABLE}/${cohortName}` : null;
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { loading, data, callApi } = useApi();

  // Use effect to fetch schedules
  useEffect(() => {
    if (postUrl) {
      callApi(postUrl, 'GET');
    }
  }, [postUrl, callApi]);

  // Update timetable when data is available
  useEffect(() => {
    if (data) {
      setTimeTable(data);
    }
  }, [data]);

   // Function to check if attendance is already marked for the student
   const isAttendanceMarked = (schedule) => {
    return schedule?.attendance?.includes(userDetails.userId); // Check if studentId is in the attendance array
  };

  // Map timeTable data to the format required by the table
  const schedules = timeTable.map((schedule) => ({
    ...schedule,
    attended: isAttendanceMarked(schedule) ? 'Yes' : 'No', // Use 'attended' field based on 'done'
  }));

  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'location', label: 'Location' },
    { id: 'time', label: 'Time' },
    { id: 'topic', label: 'Topic' },
    { id: 'attended', label: 'Attended' }, // Consistent lowercase 'attended' field
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  return (
    <Box py="20px">
      <Header title="TIME TABLE" subtitle="Overview of Schedule" />
      {loading ? (
        <Loader />
      ) : (
        <Box>
          <TableComponent
            columns={columns}
            tableHeader={`Schedule`}
            data={schedules} // Use the schedules from the timeTable
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={handleRowClick}
          />
        </Box>
      )}
    </Box>
  );
};

export default TimeTable;
