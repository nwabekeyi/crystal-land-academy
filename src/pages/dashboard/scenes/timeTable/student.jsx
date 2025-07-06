// components/Student.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { startOfWeek, getWeek, parseISO } from 'date-fns';

const Student = ({ babtechUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading: timetableLoading, error: timetableError, callApi: fetchTimetables, data: timetableData } = useApi();

  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [timetables, setTimetables] = useState([]);
  const [sortBy, setSortBy] = useState('dayOfWeek');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const terms = ['First Term', 'Second Term', 'Third Term'];
  const weeksPerTerm = 12;

  useEffect(() => {
    fetchTimetables(`${endpoints.TIMETABLE}/student`);
  }, []);

  useEffect(() => {
    if (timetableData?.success) {
      setTimetables(timetableData.data.map((t, index) => ({ ...t, sn: index + 1 })));
    }
  }, [timetableData]);

  const getWeekNumber = (dateString) => {
    const date = parseISO(dateString);
    const startDate = startOfWeek(parseISO('2024-09-01'));
    return getWeek(date, { weekStartsOn: 1 }) - getWeek(startDate, { weekStartsOn: 1 }) + 1;
  };

  const filteredSchedules = timetables
    .filter((schedule) => {
      if (!selectedTerm) return true;
      const termMatch = schedule.academicYear?.name.includes(selectedTerm.split(' ')[0]);
      const weekNumber = getWeekNumber(schedule.date || new Date().toISOString());
      return termMatch && weekNumber === selectedWeek;
    })
    .map((schedule) => ({
      ...schedule,
      date: schedule.date ? new Date(schedule.date).toLocaleDateString() : 'N/A',
    }));

  const columns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    { id: 'dayOfWeek', label: 'Day', flex: 1, renderCell: (row) => <Typography>{row.dayOfWeek}</Typography> },
    { id: 'startTime', label: 'Start Time', flex: 1, renderCell: (row) => <Typography>{row.startTime}</Typography> },
    { id: 'endTime', label: 'End Time', flex: 1, renderCell: (row) => <Typography>{row.endTime}</Typography> },
    { id: 'subject', label: 'Subject', flex: 1, renderCell: (row) => <Typography>{row.subject?.name || 'N/A'}</Typography> },
    { id: 'teacher', label: 'Teacher', flex: 1, renderCell: (row) => <Typography>{row.teacher?.firstName} {row.teacher?.lastName}</Typography> },
    { id: 'location', label: 'Location', flex: 1, renderCell: (row) => <Typography>{row.location}</Typography> },
    {
      id: 'attended',
      label: 'Attended',
      flex: 1,
      renderCell: (row) => (
        <Typography>
          {row.periodAttendance?.[0]?.attendance.find((a) => a.studentId === babtechUser._id)?.status || 'N/A'}
        </Typography>
      ),
    },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableProps = {
    columns,
    tableHeader: `Schedule for ${selectedTerm || 'Current Term'}, Week ${selectedWeek}`,
    data: filteredSchedules,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };

  return (
    <Box py="20px">
      <Header title="STUDENT TIMETABLE" subtitle="Weekly Schedule Overview" />
      <Box mb="20px" display="flex" gap="20px" alignItems="center">
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
        <Box display="flex" alignItems="center" gap="10px">
          <Button
            variant="contained"
            onClick={() => selectedWeek > 1 && setSelectedWeek(selectedWeek - 1)}
            disabled={selectedWeek === 1}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Previous Week
          </Button>
          <Typography variant="h6">Week {selectedWeek}</Typography>
          <Button
            variant="contained"
            onClick={() => selectedWeek < weeksPerTerm && setSelectedWeek(selectedWeek + 1)}
            disabled={selectedWeek === weeksPerTerm}
            sx={{ backgroundColor: colors.blueAccent[700] }}
          >
            Next Week
          </Button>
        </Box>
      </Box>
      <Box>
        {timetableLoading ? (
          <Typography>Loading...</Typography>
        ) : timetableError ? (
          <Typography color="error">{timetableError}</Typography>
        ) : filteredSchedules.length > 0 ? (
          <TableComponent {...tableProps} />
        ) : (
          <Typography>No schedule available for this week.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Student;