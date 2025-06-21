// src/components/studentDashboard/StudentActivities.jsx
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { List as ListIcon, Close as CloseIcon } from '@mui/icons-material';
import '../../calendar/calendar.css';

const StudentActivities = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy data for events
  const dummyEvents = [
    { id: '1', title: 'Math Midterm Exam', start: '2025-07-01T09:00:00', end: '2025-07-01T11:00:00', allDay: false },
    { id: '2', title: 'School Sports Day', start: '2025-07-15', allDay: true },
    { id: '3', title: 'Science Club Meeting', start: '2025-07-20T15:00:00', end: '2025-07-20T16:30:00', allDay: false },
    { id: '4', title: 'Parent-Teacher Conference', start: '2025-07-25T10:00:00', end: '2025-07-25T15:00:00', allDay: false },
    { id: '5', title: 'School Holiday - Summer Break', start: '2025-08-01', end: '2025-08-15', allDay: true },
  ];

  const [events, setEvents] = useState(dummyEvents);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    // Load events from localStorage (e.g., synced from admin)
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    if (storedEvents.length > 0) {
      setEvents([...dummyEvents, ...storedEvents]);
    }
  }, []);

  const toggleEventList = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <Box my="10px">
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          py="15px"
          borderRadius="4px"
          sx={{ width: '100%', height: '70vh', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <Box display="flex" alignItems="center" marginBottom="10px">
            <IconButton
              onClick={toggleEventList}
              sx={{ backgroundColor: colors.blueAccent[500], '&:hover': { backgroundColor: colors.blueAccent[700] }, padding: '10px', borderRadius: '50%' }}
            >
              {showEvents ? <CloseIcon /> : <ListIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: '10px', fontWeight: '800' }}>
              {showEvents ? 'Hide Events' : 'Show Events'}
            </Typography>
          </Box>
          {showEvents && <Typography variant="h4" sx={{ marginBottom: '10px' }}>Events</Typography>}
          {showEvents && (
            <List>
              {events.length === 0 ? (
                <Typography>No events</Typography>
              ) : (
                events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{ backgroundColor: colors.blueAccent[500], margin: '10px 0', borderRadius: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Typography sx={{ fontSize: '0.7em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {new Date(event.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>
        <Box flex="1 1 100%" sx={{ width: '100%' }}>
          <FullCalendar
            height="70vh"
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' }}
            initialView="dayGridMonth"
            editable={false}
            selectable={false}
            dayMaxEvents={true}
            events={events}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentActivities;