import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';

// Dummy timetable data
const dummyTimeTable = [
  {
    id: 1,
    date: '2025-06-02',
    location: 'Room 101',
    time: '08:00 - 09:00',
    topic: 'Mathematics: Algebra Basics',
    attended: 'Yes',
  },
  {
    id: 2,
    date: '2025-06-02',
    location: 'Room 102',
    time: '09:15 - 10:15',
    topic: 'English: Literature Analysis',
    attended: 'No',
  },
  {
    id: 3,
    date: '2025-06-03',
    location: 'Lab 1',
    time: '10:30 - 11:30',
    topic: 'Science: Chemistry Experiments',
    attended: 'Yes',
  },
  {
    id: 4,
    date: '2025-06-04',
    location: 'Room 103',
    time: '08:00 - 09:00',
    topic: 'History: World War II',
    attended: 'No',
  },
  {
    id: 5,
    date: '2025-06-05',
    location: 'Room 101',
    time: '09:15 - 10:15',
    topic: 'Physical Education: Fitness Training',
    attended: 'Yes',
  },
];

const TimeTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [timeTable] = useState(dummyTimeTable); // Use dummy data directly
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Map timeTable data to the format required by the table
  const schedules = timeTable.map((schedule, index) => ({
    ...schedule,
    sn: index + 1, // Add serial number for display
    date: schedule.date ? new Date(schedule.date).toLocaleDateString() : 'N/A',
  }));

  const columns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    {
      id: 'date',
      label: 'Date',
      flex: 1,
      renderCell: (row) => <Typography>{row.date || 'N/A'}</Typography>,
    },
    {
      id: 'location',
      label: 'Location',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.location || 'N/A')}</Typography>,
    },
    {
      id: 'time',
      label: 'Time',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.time || 'N/A')}</Typography>,
    },
    {
      id: 'topic',
      label: 'Topic',
      flex: 2,
      renderCell: (row) => <Typography>{String(row.topic || 'N/A')}</Typography>,
    },
    {
      id: 'attended',
      label: 'Attended',
      flex: 1,
      renderCell: (row) => <Typography>{String(row.attended || 'N/A')}</Typography>,
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
    tableHeader: 'Schedule',
    data: schedules,
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
    <Box py="20px">
      <Header title="TIME TABLE" subtitle="Overview of Schedule" />
      <Box>
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default TimeTable;