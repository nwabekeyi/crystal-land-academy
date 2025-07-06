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
  Alert,
} from "@mui/material";
import { tokens } from "../../theme";
import Modal from "../../components/modal";
import { List as ListIcon, Close as CloseIcon } from "@mui/icons-material";
import useApi from "../../../../hooks/useApi";
import { endpoints } from "../../../../utils/constants";
import './calendar.css';

const SchoolActivities = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, error, data, callApi } = useApi();

  const [events, setEvents] = useState([]);
  const [addCurriculumOpen, setAddCurriculumOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [eventActionModalOpen, setEventActionModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    day: "",
    startDate: "",
    endDate: "",
  });
  const [editEvent, setEditEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  // Fetch events from API on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await callApi(endpoints.EVENT, 'GET');
      if (response) {
        console.log('Fetched events:', response);
        const mappedEvents = response.data.map(event => ({
          id: event._id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          allDay: event.startDate === event.endDate,
        }));
        setEvents(mappedEvents);
      } else {
        setApiError(error || "Failed to fetch events");
      }
    };
    fetchEvents();
  }, [callApi, error]);

  // Open modal for adding a new event with pre-filled startDate
  const handleDateClick = (selected) => {
    const selectedStartDate = new Date(selected.startStr);
    const defaultEndDate = new Date(selectedStartDate.getTime() + 60 * 60 * 1000); // +1 hour
    setSelectedDate(selected);
    setNewEvent({
      title: "",
      description: "",
      day: formatDate(selected.start, { weekday: "long" }),
      startDate: selectedStartDate.toISOString(),
      endDate: defaultEndDate.toISOString(),
    });
    setAddCurriculumOpen(true);
  };

  // Add event via API
  const handleAddEvent = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      setApiError("Please log in to add events");
      return;
    }

    if (!newEvent.title || !newEvent.description || !newEvent.day || !newEvent.startDate || !newEvent.endDate) {
      setApiError("All fields are required");
      return;
    }

    const response = await callApi(endpoints.EVENT, 'POST', {
      title: newEvent.title,
      description: newEvent.description,
      day: newEvent.day,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
    });

    if (response) {
      const newEventData = response.data;
      setEvents([
        ...events,
        {
          id: newEventData._id,
          title: newEventData.title,
          start: newEventData.startDate,
          end: newEventData.endDate,
          allDay: newEventData.startDate === newEventData.endDate,
        },
      ]);
      setAddCurriculumOpen(false);
      setNewEvent({ title: "", description: "", day: "", startDate: "", endDate: "" });
      setSuccessMessage("Event created successfully");
      setSuccessModalOpen(true);
      setApiError(null);
    } else {
      const errorMessage = error || "Failed to create event";
      if (errorMessage.includes("Authentication required") || errorMessage.includes("No token provided") || errorMessage.includes("Invalid or expired token")) {
        setApiError("Please log in again to add events");
      } else if (errorMessage.includes("admin only")) {
        setApiError("Only admins can add events");
      } else {
        setApiError(errorMessage);
      }
    }
  };

  // Open modal with Edit/Delete buttons when clicking an existing event
  const handleEventClick = (selected) => {
    const event = events.find(e => e.id === selected.event.id);
    if (!event) return;

    const apiEvent = {
      _id: selected.event.id,
      title: selected.event.title,
      description: "", // Fetch from GET /api/events/:id if needed
      day: formatDate(selected.event.start, { weekday: "long" }),
      startDate: selected.event.start.toISOString(),
      endDate: selected.event.end ? selected.event.end.toISOString() : selected.event.start.toISOString(),
    };

    console.log('Selected event:', apiEvent); // Debug log
    setSelectedEvent(apiEvent);
    setEventActionModalOpen(true);
  };

  // Handle Edit button click
  const handleEditEvent = () => {
    setEventActionModalOpen(false);
    setEditEvent(selectedEvent);
    setEditEventOpen(true);
  };

  // Handle Delete button click
  const handleDeleteEventInitiate = () => {
    setEventActionModalOpen(false);
    setDeleteConfirmModalOpen(true);
  };

  // Update event via API
  const handleUpdateEvent = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      setApiError("Please log in to update events");
      return;
    }

    if (!editEvent.title || !editEvent.description || !editEvent.day || !editEvent.startDate || !editEvent.endDate) {
      setApiError("All fields are required");
      return;
    }

    const response = await callApi(`${endpoints.EVENT}/${editEvent._id}`, 'PATCH', {
      title: editEvent.title,
      description: editEvent.description,
      day: editEvent.day,
      startDate: editEvent.startDate,
      endDate: editEvent.endDate,
    });

    if (response) {
      const updatedEventData = response.data;
      setEvents(
        events.map(event =>
          event.id === updatedEventData._id
            ? {
                id: updatedEventData._id,
                title: updatedEventData.title,
                start: updatedEventData.startDate,
                end: updatedEventData.endDate,
                allDay: updatedEventData.startDate === updatedEventData.endDate,
              }
            : event
        )
      );
      setEditEventOpen(false);
      setEditEvent(null);
      setSuccessMessage("Event edited successfully");
      setSuccessModalOpen(true);
      setApiError(null);
    } else {
      const errorMessage = error || "Failed to update event";
      if (errorMessage.includes("Authentication required") || errorMessage.includes("No token provided") || errorMessage.includes("Invalid or expired token")) {
        setApiError("Please log in again to update events");
      } else if (errorMessage.includes("admin only")) {
        setApiError("Only admins can update events");
      } else {
        setApiError(errorMessage);
      }
    }
  };

  // Delete event via API
  const handleDeleteEvent = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      setApiError("Please log in to delete events");
      return;
    }

    const response = await callApi(`${endpoints.EVENT}/${selectedEvent._id}`, 'DELETE');
    if (response) {
      setEvents(events.filter(event => event.id !== selectedEvent._id));
      setDeleteConfirmModalOpen(false);
      setSelectedEvent(null);
      setSuccessMessage("Event deleted successfully");
      setSuccessModalOpen(true);
      setApiError(null);
    } else {
      const errorMessage = error || "Failed to delete event";
      if (errorMessage.includes("Authentication required") || errorMessage.includes("No token provided") || errorMessage.includes("Invalid or expired token")) {
        setApiError("Please log in again to delete events");
      } else if (errorMessage.includes("admin only")) {
        setApiError("Only admins can delete events");
      } else {
        setApiError(errorMessage);
      }
    }
  };

  // Close modals
  const closeAddCurriculumModal = () => {
    setAddCurriculumOpen(false);
    setNewEvent({ title: "", description: "", day: "", startDate: "", endDate: "" });
    setApiError(null);
  };

  const closeEditEventModal = () => {
    setEditEventOpen(false);
    setEditEvent(null);
    setApiError(null);
  };

  const closeEventActionModal = () => {
    setEventActionModalOpen(false);
    setSelectedEvent(null);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModalOpen(false);
    setSelectedEvent(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setSuccessMessage("");
  };

  // Toggle events visibility
  const toggleEventList = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <Box my="10px">
      {/* Error Display */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      <Box display="flex" justifyContent="center" flexDirection="column">
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
            <Typography variant="h6" sx={{ marginLeft: "10px", fontWeight: '800' }}>
              {showEvents ? "Hide Events" : "Show Events"}
            </Typography>
          </Box>

          {showEvents && (
            <Typography variant="h4" sx={{ marginBottom: "10px" }}>
              Events
            </Typography>
          )}

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
        <Box flex="1 1 100%" sx={{ width: '100%' }}>
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
        confirmText="Create"
        cancelText="Cancel"
        showCancel={true}
      >
        <Box p="20px">
          <TextField
            label="Event Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Day"
            fullWidth
            value={newEvent.day}
            InputProps={{ readOnly: true }}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={newEvent.startDate.slice(0, 16)}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: new Date(e.target.value).toISOString() })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            value={newEvent.endDate.slice(0, 16)}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: new Date(e.target.value).toISOString() })}
            sx={{ marginBottom: "20px" }}
          />
        </Box>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        open={editEventOpen}
        onClose={closeEditEventModal}
        title="Edit Event"
        onConfirm={handleUpdateEvent}
        confirmText="Save"
        cancelText="Cancel"
        showCancel={true}
      >
        <Box p="20px">
          <TextField
            label="Event Title"
            fullWidth
            value={editEvent?.title || ""}
            onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Description"
            fullWidth
            value={editEvent?.description || ""}
            onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Day"
            fullWidth
            value={editEvent?.day || ""}
            onChange={(e) => setEditEvent({ ...editEvent, day: e.target.value })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={editEvent?.startDate.slice(0, 16) || ""}
            onChange={(e) => setEditEvent({ ...editEvent, startDate: new Date(e.target.value).toISOString() })}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            value={editEvent?.endDate.slice(0, 16) || ""}
            onChange={(e) => setEditEvent({ ...editEvent, endDate: new Date(e.target.value).toISOString() })}
            sx={{ marginBottom: "20px" }}
          />
        </Box>
      </Modal>

      {/* Event Action Modal (Edit/Delete) */}
      <Modal
        open={eventActionModalOpen}
        onClose={closeEventActionModal}
        title={`Manage Event: ${selectedEvent?.title || ""}`}
        onConfirm={handleEditEvent}
        confirmText="Edit"
        onCancel={handleDeleteEventInitiate}
        cancelText="Delete"
        showCancel={true}
      >
        <Box p="20px">
          <Typography>Select an action for the event "{selectedEvent?.title}".</Typography>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        title="Confirm Delete"
        onConfirm={handleDeleteEvent}
        confirmText="Confirm"
        cancelText="Cancel"
        showCancel={true}
      >
        <Box p="20px">
          <Typography>Do you want to delete the event "{selectedEvent?.title}"?</Typography>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        onClose={closeSuccessModal}
        title="Success"
        onConfirm={closeSuccessModal}
        confirmText="OK"
        showCancel={false}
      >
        <Box p="20px">
          <Typography>{successMessage}</Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default SchoolActivities;