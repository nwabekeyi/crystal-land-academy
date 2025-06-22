import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import { startOfWeek, getWeek, parseISO } from 'date-fns';

// Dummy timetable data with student attendance
const dummyTimeTable = [
  {
    id: 1,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-02', // Week 1
    location: 'Room 101',
    time: '08:00 - 09:00',
    topic: 'Mathematics: Algebra Basics',
    students: [
      { studentId: 'stu_1', name: 'John Doe', attendance: 'Yes' },
      { studentId: 'stu_2', name: 'Jane Smith', attendance: 'No' },
    ],
  },
  {
    id: 2,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-02', // Week 1
    location: 'Room 102',
    time: '09:15 - 10:15',
    topic: 'English: Literature Analysis',
    students: [
      { studentId: 'stu_1', name: 'John Doe', attendance: 'No' },
      { studentId: 'stu_2', name: 'Jane Smith', attendance: 'Yes' },
    ],
  },
  {
    id: 3,
    session: '2024-2025',
    term: 'First Term',
    date: '2024-09-09', // Week 2
    location: 'Lab 1',
    time: '10:30 - 11:30',
    topic: 'Science: Chemistry Experiments',
    students: [
      { studentId: 'stu_1', name: 'John Doe', attendance: 'Yes' },
      { studentId: 'stu_2', name: 'Jane Smith', attendance: 'Yes' },
    ],
  },
  {
    id: 4,
    session: '2024-2025',
    term: 'Second Term',
    date: '2025-01-06', // Week 1
    location: 'Room 103',
    time: '08:00 - 09:00',
    topic: 'History: World War II',
    students: [
      { studentId: 'stu_1', name: 'John Doe', attendance: 'No' },
      { studentId: 'stu_2', name: 'Jane Smith', attendance: 'No' },
    ],
  },
];

// Dummy student list for adding schedules
const dummyStudents = [
  { studentId: 'stu_1', name: 'John Doe' },
  { studentId: 'stu_2', name: 'Jane Smith' },
];

// Academic session and term options
const academicSessions = ['2024-2025', '2025-2026'];
const terms = ['First Term', 'Second Term', 'Third Term'];
const weeksPerTerm = 12;

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedSession, setSelectedSession] = useState(academicSessions[0]);
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [timeTable, setTimeTable] = useState(dummyTimeTable);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    location: '',
    time: '',
    topic: '',
  });
  const [attendanceChanges, setAttendanceChanges] = useState({});

  // Calculate week number for a given date
  const getWeekNumber = (dateString) => {
    const date = parseISO(dateString);
    const startDate = startOfWeek(parseISO('2024-09-01')); // Adjust to academic year start
    return getWeek(date, { weekStartsOn: 1 }) - getWeek(startDate, { weekStartsOn: 1 }) + 1;
  };

  // Filter timetable data for selected session, term, and week
  const filteredSchedules = timeTable
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

  // Handle adding a new schedule
  const handleAddSchedule = () => {
    const newId = timeTable.length + 1;
    const newScheduleEntry = {
      id: newId,
      session: selectedSession,
      term: selectedTerm,
      date: newSchedule.date,
      location: newSchedule.location,
      time: newSchedule.time,
      topic: newSchedule.topic,
      students: dummyStudents.map((student) => ({
        studentId: student.studentId,
        name: student.name,
        attendance: 'No', // Default attendance
      })),
    };
    setTimeTable([...timeTable, newScheduleEntry]);
    setNewSchedule({ date: '', location: '', time: '', topic: '' });
    setAddModalOpen(false);
  };

  // Handle attendance change in the modal
  const handleAttendanceChange = (studentId, newAttendance) => {
    setAttendanceChanges((prev) => ({
      ...prev,
      [studentId]: newAttendance,
    }));
  };

  // Confirm attendance changes
  const handleConfirmAttendance = () => {
    setTimeTable((prev) =>
      prev.map((schedule) =>
        schedule.id === selectedScheduleId
          ? {
              ...schedule,
              students: schedule.students.map((student) => ({
                ...student,
                attendance: attendanceChanges[student.studentId] || student.attendance,
              })),
            }
          : schedule
      )
    );
    setAttendanceModalOpen(false);
    setSelectedScheduleId(null);
    setAttendanceChanges({});
  };

  // Open attendance modal
  const openAttendanceModal = (scheduleId) => {
    const schedule = timeTable.find((s) => s.id === scheduleId);
    if (schedule) {
      const initialAttendance = schedule.students.reduce(
        (acc, student) => ({
          ...acc,
          [student.studentId]: student.attendance,
        }),
        {}
      );
      setAttendanceChanges(initialAttendance);
      setSelectedScheduleId(scheduleId);
      setAttendanceModalOpen(true);
    }
  };

  // Table columns
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
      id: 'students',
      label: 'Student Attendance',
      flex: 3,
      renderCell: (row) => (
        <Box>
          {row.students.map((student) => (
            <Typography key={student.studentId} mb="5px">
              {student.name}: {student.attendance}
            </Typography>
          ))}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => openAttendanceModal(row.id)}
            sx={{ mt: 1 }}
          >
            Mark Attendance
          </Button>
        </Box>
      ),
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
      <Header title="TEACHER TIME TABLE" subtitle="Manage Weekly Schedule and Attendance" />
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

        {/* Add Schedule Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setAddModalOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Add Schedule
        </Button>
      </Box>
      <Box>
        {filteredSchedules.length > 0 ? (
          <TableComponent {...tableProps} />
        ) : (
          <Typography>No schedule available for this week.</Typography>
        )}
      </Box>

      {/* Add Schedule Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setNewSchedule({ date: '', location: '', time: '', topic: '' });
        }}
      >
        <DialogTitle>Add New Schedule</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="16px" mt="10px">
            <TextField
              label="Date (YYYY-MM-DD)"
              value={newSchedule.date}
              onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              value={newSchedule.location}
              onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Time (e.g., 08:00 - 09:00)"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              fullWidth
            />
            <TextField
              label="Topic"
              value={newSchedule.topic}
              onChange={(e) => setNewSchedule({ ...newSchedule, topic: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddModalOpen(false);
              setNewSchedule({ date: '', location: '', time: '', topic: '' });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSchedule}
            color="primary"
            disabled={!newSchedule.date || !newSchedule.location || !newSchedule.time || !newSchedule.topic}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Modal */}
      <Dialog
        open={attendanceModalOpen}
        onClose={() => {
          setAttendanceModalOpen(false);
          setSelectedScheduleId(null);
          setAttendanceChanges({});
        }}
      >
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap="16px" mt="10px">
            {selectedScheduleId &&
              timeTable
                .find((schedule) => schedule.id === selectedScheduleId)
                ?.students.map((student) => (
                  <Box
                    key={student.studentId}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>{student.name}</Typography>
                    <FormControl sx={{ minWidth: 100 }}>
                      <Select
                        value={attendanceChanges[student.studentId] || student.attendance}
                        onChange={(e) =>
                          handleAttendanceChange(student.studentId, e.target.value)
                        }
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAttendanceModalOpen(false);
              setSelectedScheduleId(null);
              setAttendanceChanges({});
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmAttendance} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Instructor;