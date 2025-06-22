import React, { useState } from 'react';
import { Box, Typography, useTheme, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import { startOfWeek, getWeek, parseISO } from 'date-fns'; // For week calculations

// Dummy timetable data structured by academic session, term, and week
const dummyTimeTable = [
  {
    id: 1,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-02', // Week 1
    location: 'Room 101',
    time: '08:00 - 09:00',
    topic: 'Mathematics: Algebra Basics',
    attended: 'Yes',
  },
  {
    id: 2,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-02', // Week 1
    location: 'Room 102',
    time: '09:15 - 10:15',
    topic: 'English: Literature Analysis',
    attended: 'No',
  },
  {
    id: 3,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-09', // Week 2
    location: 'Lab 1',
    time: '10:30 - 11:30',
    topic: 'Science: Chemistry Experiments',
    attended: 'Yes',
  },
  {
    id: 4,
    session: '2024-2025',
    term: 'Second Term',
    date: '2025-01-06', // Week 1
    location: 'Room 103',
    time: '08:00 - 09:00',
    topic: 'History: World War II',
    attended: 'No',
  },
  {
    id: 5,
    session: '2024-2025',
    term: 'Second Term',
    date: '2025-01-13', // Week 2
    location: 'Room 101',
    time: '09:15 - 10:15',
    topic: 'Physical Education: Fitness Training',
    attended: 'Yes',
  },
];

// Academic session and term options
const academicSessions = ['2024-2025', '2025-2026'];
const terms = ['First Term', 'Second Term', 'Third Term'];
const weeksPerTerm = 12; // Number of weeks per term

const TimeTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedSession, setSelectedSession] = useState(academicSessions[0]);
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Calculate week number for a given date
  const getWeekNumber = (dateString) => {
    const date = parseISO(dateString);
    const startDate = startOfWeek(parseISO(`2024-09-01`)); // Example start of academic year
    return getWeek(date, { weekStartsOn: 1 }) - getWeek(startDate, { weekStartsOn: 1 }) + 1;
  };

  // Filter timetable data for selected session, term, and week
  const filteredSchedules = dummyTimeTable
    .filter(
      (schedule) =>
        schedule.session === selectedSession &&
        schedule.term === selectedTerm &&
        getWeekNumber(schedule.date) === selectedWeek
    )
    .map((schedule, index) => ({
      ...schedule,
      sn: index + 1,
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

  const handlePreviousWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
      setPage(0);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek < weeksPerTerm) {
      setSelectedWeek(selectedWeek + 1);
      setPage(0);
    }
  };

  const tableProps = {
    columns,
    tableHeader: `Schedule for ${selectedSession}, ${selectedTerm}, Week ${selectedWeek}`,
    data: filteredSchedules,
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
      <Header title="TIME TABLE" subtitle="Weekly Schedule Overview" />
      <Box mb="20px" display="flex" gap="20px" alignItems="center">
        {/* Session Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="session-select-label">Session</InputLabel>
          <Select
            labelId="session-select-label"
            value={selectedSession}
            label="Session"
            onChange={(e) => {
              setSelectedSession(e.target.value);
              setSelectedTerm(terms[0]);
              setSelectedWeek(1);
              setPage(0);
            }}
          >
            {academicSessions.map((session) => (
              <MenuItem key={session} value={session}>
                {session}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Term Selector */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="term-select-label">Term</InputLabel>
          <Select
            labelId="term-select-label"
            value={selectedTerm}
            label="Term"
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setSelectedWeek(1);
              setPage(0);
            }}
          >
            {terms.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Week Navigation */}
        <Box display="flex" alignItems="center" gap="10px">
          <Button
            variant="contained"
            onClick={handlePreviousWeek}
            disabled={selectedWeek === 1}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Previous Week
          </Button>
          <Typography variant="h6">Week {selectedWeek}</Typography>
          <Button
            variant="contained"
            onClick={handleNextWeek}
            disabled={selectedWeek === weeksPerTerm}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Next Week
          </Button>
        </Box>
      </Box>
      <Box>
        {filteredSchedules.length > 0 ? (
          <TableComponent {...tableProps} />
        ) : (
          <Typography>No schedule available for this week.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default TimeTable;