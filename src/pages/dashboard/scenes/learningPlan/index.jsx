import React, { useState, useEffect } from "react";
import "@fullcalendar/react/dist/vdom";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const LearningPlan = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isTabletOrMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 375px)");

  const [currentEvents, setCurrentEvents] = useState([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents =
      JSON.parse(localStorage.getItem("learningPlanEvents")) || [];
    setCurrentEvents(savedEvents);
  }, []);

  // Save events to localStorage whenever currentEvents changes
  useEffect(() => {
    localStorage.setItem(
      "learningPlanEvents",
      JSON.stringify(currentEvents)
    );
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");

    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };

      setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
    }

    selected.view.calendar.unselect(); // Unselect the date
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      const updatedEvents = currentEvents.filter(
        (event) => event.id !== selected.event.id
      );
      setCurrentEvents(updatedEvents);
    }
  };

  return (
    <Box 
    >
      <Header
        title="Learning Plan"
        subtitle="Manage Your Learning Schedule"
        sx={{
          "& h1": {
            fontSize: isSmallScreen ? "20px" : "24px",
          },
          "& h2": {
            fontSize: isSmallScreen ? "14px" : "16px",
          },
        }}
      />

      <Box
        display="flex"
        flexDirection={isTabletOrMobile ? "column" : "row"}
        justifyContent="space-between"
        gap={isTabletOrMobile ? "20px" : "15px"}
      >
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1"
          maxWidth={isTabletOrMobile ? "100%" : "20%"}
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: isSmallScreen ? "16px" : "18px",
              whiteSpace: "nowrap",
            }}
          >
            Scheduled Plans
          </Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                  fontSize: isSmallScreen ? "12px" : "14px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box
          flex="1"
          width={isTabletOrMobile ? "100%" : "75%"}
          ml={isTabletOrMobile ? "0" : "15px"}
        >
          <FullCalendar
            height={isSmallScreen ? "45vh" : isTabletOrMobile ? "50vh" : "75vh"}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: isTabletOrMobile
                ? "dayGridMonth,listMonth"
                : "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView={isTabletOrMobile ? "listMonth" : "dayGridMonth"}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents} // Use state to populate calendar events
          />
        </Box>
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(LearningPlan);
