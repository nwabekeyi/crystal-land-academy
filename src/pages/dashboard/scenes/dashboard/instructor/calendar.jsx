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
  IconButton, // Import IconButton
} from "@mui/material";
import { tokens } from "../../../theme";
import Modal from "../../../components/modal";
import { List as ListIcon, Close as CloseIcon } from "@mui/icons-material"; // Import icons
import './calendar.css'
const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]); // State for events
  const [addCurriculumOpen, setAddCurriculumOpen] = useState(false); // Modal open state
  const [newEventTitle, setNewEventTitle] = useState(""); // Event title state
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for the event
  const [showEvents, setShowEvents] = useState(false); // State to toggle visibility of events

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  // Open modal when a date is clicked
  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setAddCurriculumOpen(true); // Open the modal
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

      // Add the new event to the state and localStorage
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setAddCurriculumOpen(false); // Close modal after adding event
      setNewEventTitle(""); // Reset title input
    }
  };

  // Close the modal without saving
  const closeAddCurriculumModal = () => {
    setAddCurriculumOpen(false);
    setNewEventTitle(""); // Reset title input when modal is closed
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
      setEvents(updatedEvents); // Update state and localStorage
    }
  };

  // Toggle events visibility
  const toggleEventList = () => {
    setShowEvents((prev) => !prev); // Toggle the visibility of the events
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
            height: "75vh", // Set the desired height for the sidebar
            overflowY: "auto", // Make the event list scrollable if it overflows
            overflowX: "hidden", // Prevent horizontal overflow
            display: "flex",
            flexDirection: "column", // Align items vertically
          }}
        >
          {/* IconButton to toggle visibility of event list */}
          <Box display="flex" alignItems="center" marginBottom="10px">
            <IconButton
              onClick={toggleEventList} // Toggle visibility of events
              sx={{
                backgroundColor: colors.blueAccent[500], // Button background color
                "&:hover": {
                  backgroundColor: colors.blueAccent[700], // Button hover color
                },
                padding: "10px", // Add padding to the button
                borderRadius: "50%", // Circular button shape
              }}
            >
              {showEvents ? <CloseIcon /> : <ListIcon />} {/* Toggle between List and Close icon */}
            </IconButton>

            {/* Text label next to the IconButton */}
            <Typography variant="h6" sx={{ marginLeft: "10px", fontWeight:'800'}}>
              {showEvents ? "Hide Events" : "Show Events"}
            </Typography>
          </Box>

          {/* Events Title (only shown when events are visible) */}
          {showEvents && (
            <Typography variant="h4" sx={{ marginBottom: "10px" }}>
              Events
            </Typography>
          )}

          {/* Event list (visible based on showEvents state) */}
          {showEvents && ( // Render events only if showEvents is true
            <List>
              {events.length === 0 ? (
                <Typography>No events available</Typography> // Fallback message when no events
              ) : (
                events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      backgroundColor: colors.blueAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                      overflow: "hidden", // Prevent text overflow
                      textOverflow: "ellipsis", // Add ellipsis if text overflows
                      whiteSpace: "nowrap", // Prevent wrapping for longer text
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
            events={events} // Use events from state (loaded from localStorage)
            
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

export default Calendar;
