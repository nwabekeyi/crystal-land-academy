import React, { useState, useEffect } from "react";
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  TextField,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import Modal from "../../components/modal";
import { List as ListIcon, Close as CloseIcon } from "@mui/icons-material";
import './calendar.css';

const SchoolActivities = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy school activity data
  const dummyEvents = [
    {
      id: "1",
      title: "Math Midterm Exam",
      start: "2025-07-10T09:00:00",
      end: "2025-07-10T11:00:00",
      allDay: false,
    },
    {
      id: "2",
      title: "School Sports Day",
      start: "2025-07-15",
      allDay: true,
    },
    {
      id: "3",
      title: "Science Club Meeting",
      start: "2025-07-20T15:00:00",
      end: "2025-07-20T16:30:00",
      allDay: false,
    },
    {
      id: "4",
      title: "Parent-Teacher Conference",
      start: "2025-07-25T10:00:00",
      end: "2025-07-25T15:00:00",
      allDay: false,
    },
    {
      id: "5",
      title: "School Holiday - Summer Break",
      start: "2025-08-01",
      end: "2025-08-15",
      allDay: true,
    },
    {
      id: "6",
      title: "Drama Club Rehearsal",
      start: "2025-07-22T16:00:00",
      end: "2025-07-22T18:00:00",
      allDay: false,
    },
  ];

  const [events, setEvents] = useState(dummyEvents); // Initialize with dummy data
  const [addCurriculumOpen, setAddCurriculumOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEvents, setShowEvents] = useState(false);

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    if (storedEvents.length > 0) {
      setEvents([...dummyEvents, ...storedEvents]); // Merge dummy data with stored events
    }
  }, []);

  // Save only user-added events to localStorage (exclude dummy events)
  useEffect(() => {
    const userAddedEvents = events.filter(event => !dummyEvents.some(dummy => dummy.id === event.id));
    if (userAddedEvents.length > 0) {
      localStorage.setItem("events", JSON.stringify(userAddedEvents));
    }
  }, [events]);

  // Open modal when a date is clicked
  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setAddCurriculumOpen(true);
  };

  // Add event to localStorage
  const handleAddEvent = () => {
    if (newEventTitle && selectedDate) {
      const newEvent = {
        id: `${selectedDate.dateStr}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: selectedDate.allDay,
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setAddCurriculumOpen(false);
      setNewEventTitle("");
    }
  };

  // Close the modal without saving
  const closeAddCurriculumModal = () => {
    setAddCurriculumOpen(false);
    setNewEventTitle("");
  };

  // Handle event deletion
  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      const updatedEvents = events.filter(
        (event) => event.id !== selected.event.id
      );
      setEvents(updatedEvents);
    }
  };

  // Toggle events visibility
  const toggleEventList = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <Box my="10px">
      <Box display="flex" justifyContent="center" flexDirection='column'>
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          py="15px"
          borderRadius="4px"
          sx={{
            width: '100%',
            height: "75vh",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* IconButton to toggle visibility of event list */}
          <Box display="flex" alignItems="center" marginBottom="10px">
            <IconButton
              onClick={toggleEventList}
              sx={{
                backgroundColor: colors.blueAccent[500],
                "&:hover": {
                  backgroundColor: colors.blueAccent[700],
                },
                padding: "10px",
                borderRadius: "50%",
              }}
            >
              {showEvents ? <CloseIcon /> : <ListIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: "10px", fontWeight:'800'}}>
              {showEvents ? "Hide Events" : "Show Events"}
            </Typography>
          </Box>

          {/* Events Title */}
          {showEvents && (
            <Typography variant="h4" sx={{ marginBottom: "10px" }}>
              Events
            </Typography>
          )}

          {/* Event list */}
          {showEvents && (
            <List>
              {events.length === 0 ? (
                <Typography>No events available</Typography>
              ) : (
                events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      backgroundColor: colors.blueAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Typography
                          sx={{
                            fontSize: "0.7em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(event.start, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" sx={{width: '100%'}}>
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={events}
          />
        </Box>
      </Box>

      {/* Add Event Modal */}
      <Modal
        open={addCurriculumOpen}
        onClose={closeAddCurriculumModal}
        title="Add Event"
        onConfirm={handleAddEvent}
      >
        <Box p="20px">
          <TextField
            label="Event Title"
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default SchoolActivities;