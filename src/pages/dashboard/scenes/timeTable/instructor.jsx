// components/Instructor.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import Header from '../../components/Header';
import useApi from '../../../../hooks/useApi';
import { endpoints } from '../../../../utils/constants';
import { AttendanceModal, ConfirmationModal } from './Modals';
import ActionButton from '../../components/actionButton';
import { startOfWeek, getWeek, parseISO } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Instructor = ({ babtechUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading: timetableLoading, error: timetableError, callApi: fetchTimetables, data: timetableData } = useApi();
  const { loading: studentLoading, error: studentError, callApi: fetchStudents, data: studentData } = useApi();
  const { loading: attendanceLoading, error: attendanceError, callApi: markAttendance } = useApi();

  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [timetables, setTimetables] = useState([]);
  const [sortBy, setSortBy] = useState('dayOfWeek');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [attendanceChanges, setAttendanceChanges] = useState({});

  const terms = ['First Term', 'Second Term', 'Third Term'];
  const weeksPerTerm = 12;

  useEffect(() => {
    fetchTimetables(`${endpoints.TIMETABLE}/teacher`);
  }, []);

  useEffect(() => {
    if (timetableData?.success) {
      setTimetables(timetableData.data.map((t, index) => ({ ...t, sn: index + 1 })));
    }
  }, [timetableData]);

  const fetchStudentsForTimetable = async (classLevelId, subclassLetter) => {
    const response = await fetchStudents(`${endpoints.CLASS_LEVEL}/${classLevelId}/subclasses/${subclassLetter}/students`);
    return response?.data?.students || [];
  };

  const getWeekNumber = (dateString) => {
    const date = parseISO(dateString);
    const startDate = startOfWeek(parseISO('2024-09-01')); // Adjust to academic year start
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

  const handleAttendanceChange = (studentId, newAttendance) => {
    setAttendanceChanges((prev) => ({
      ...prev,
      [studentId]: newAttendance,
    }));
  };

  const handleConfirmAttendance = async () => {
    const timetable = timetables.find((t) => t._id === selectedScheduleId);
    if (!timetable) return;

    const attendanceData = Object.entries(attendanceChanges).map(([studentId, status]) => ({
      studentId,
      status,
      notes: status === 'Absent' || status === 'Excused' ? 'Marked by instructor' : '',
    }));

    const body = {
      periodIndex: 0, // Default to first period
      attendanceData,
    };

    const response = await markAttendance(`${endpoints.MARK_TIMETABLE}/${selectedScheduleId}/attendance`, 'PUT', body);
    if (response?.success) {
      setTimetables(timetables.map((t) => (t._id === selectedScheduleId ? { ...t, periodAttendance: response.data.periodAttendance } : t)));
      setConfirmationMessage('Attendance marked successfully');
      setAttendanceModalOpen(false);
      setConfirmationModalOpen(true);
      setSelectedScheduleId(null);
      setAttendanceChanges({});
    } else {
      setConfirmationMessage(attendanceError || 'Failed to mark attendance');
      setConfirmationModalOpen(true);
    }
  };

  const openAttendanceModal = async (scheduleId) => {
    const schedule = timetables.find((s) => s._id === scheduleId);
    if (schedule) {
      const students = await fetchStudentsForTimetable(schedule.classLevel._id, schedule.subclassLetter);
      const initialAttendance = students.reduce((acc, student) => {
        const attendanceRecord = schedule.periodAttendance?.[0]?.attendance.find((a) => a.studentId === student._id);
        return {
          ...acc,
          [student._id]: attendanceRecord?.status || 'Absent',
        };
      }, {});
      setAttendanceChanges(initialAttendance);
      setSelectedScheduleId(scheduleId);
      setAttendanceModalOpen(true);
    }
  };

  const columns = [
    { id: 'sn', label: 'S/N', flex: 0.5 },
    { id: 'dayOfWeek', label: 'Day', flex: 1, renderCell: (row) => <Typography>{row.dayOfWeek}</Typography> },
    { id: 'startTime', label: 'Start Time', flex: 1, renderCell: (row) => <Typography>{row.startTime}</Typography> },
    { id: 'endTime', label: 'End Time', flex: 1, renderCell: (row) => <Typography>{row.endTime}</Typography> },
    { id: 'numberOfPeriods', label: 'Periods', flex: 1, renderCell: (row) => <Typography>{row.numberOfPeriods}</Typography> },
    { id: 'subject', label: 'Subject', flex: 1, renderCell: (row) => <Typography>{row.subject?.name || 'N/A'}</Typography> },
    { id: 'location', label: 'Location', flex: 1, renderCell: (row) => <Typography>{row.location}</Typography> },
    {
      id: 'attendance',
      label: 'Attendance',
      flex: 2,
      renderCell: (row) => (
        <Box>
          {row.periodAttendance?.[0]?.attendance.map((att) => (
            <Typography key={att.studentId} mb="5px">
              Student ID {att.studentId}: {att.status}
            </Typography>
          ))}
          <ActionButton
            content="Mark Attendance"
            icon={<CheckCircleIcon />}
            onClick={() => openAttendanceModal(row._id)}
          />
        </Box>
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
      <Header title="TEACHER TIMETABLE" subtitle="Manage Weekly Schedule and Attendance" />
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
      <AttendanceModal
        open={attendanceModalOpen}
        onClose={() => {
          setAttendanceModalOpen(false);
          setSelectedScheduleId(null);
          setAttendanceChanges({});
        }}
        onConfirm={handleConfirmAttendance}
        attendanceChanges={attendanceChanges}
        handleAttendanceChange={handleAttendanceChange}
        studentData={studentData}
        isLoading={attendanceLoading}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title="Attendance Operation"
        message={confirmationMessage}
        isLoading={attendanceLoading}
      />
    </Box>
  );
};

export default Instructor;