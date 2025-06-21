// src/components/teacherDashboard/EventCalendar.jsx
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import { List as ListIcon, Close as CloseIcon } from '@mui/icons-material';
import Modal from '../../../components/modal';
import './calendar.css';

const EventCalendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', allDay: false });
  const [selectedDate, setSelectedDate] = useState(null);

  // Dummy data
  const dummyEvents = [
    { id: '1', title: 'Math Midterm Exam', start: '2025-07-01T09:00:00', end: '2025-07-01T11:00:00', allDay: false },
    { id: '2', title: 'School Sports Day', start: '2025-07-15', allDay: true },
    { id: '3', title: 'Teachers Meeting', start: '2025-07-20T15:00:00', end: '2025-07-20T16:30:00', allDay: false },
  ];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents([...dummyEvents, ...storedEvents]);
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setNewEvent({ title: '', start: arg.dateStr, end: arg.dateStr, allDay: arg.allDay });
    setShowModal(true);
  };

  const handleEventClick = (arg) => {
    if (window.confirm(`Are you sure you want to delete the event "${arg.event.title}"?`)) {
      const updatedEvents = events.filter((event) => event.id !== arg.event.id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents.filter((e) => !dummyEvents.some((de) => de.id === e.id))));
    }
  };

  const handleAddEvent = () => {
    const id = new Date().getTime().toString();
    const updatedEvents = [...events, { ...newEvent, id }];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents.filter((e) => !dummyEvents.some((de) => de.id === e.id))));
    setShowModal(false);
    setNewEvent({ title: '', start: '', end: '', allDay: false });
  };

  const toggleEventList = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <Box my="10px">
      <Typography variant="h5" fontWeight="600" mb="15px">
        Event Calendar
      </Typography>
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
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            dayMaxEvents={true}
            events={events}
          />
        </Box>
      </Box>
      <Modal open={showModal} handleClose={() => setShowModal(false)} title="Add Event">
        <TextField
          label="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          type="date"
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEvent}
          sx={{ mt: 2 }}
          disabled={!newEvent.title || !newEvent.start}
        >
          Add Event
        </Button>
      </Modal>
    </Box>
  );
};

export default EventCalendar;