import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import { tokens } from "../../../theme";
import SchoolIcon from "@mui/icons-material/School";
import ProgressCircle from "../../../components/ProgressCircle";
import useStudentData from "./useStudentData";
import PerfromanceLineChart from "./performanceChart";
import {
  RowGrid,
  RowContainer,
  ResponsiveContainer,
  DashboardDataBox
} from '../../../components/dashbaordDataBox'
import { endpoints } from "../../../../../utils/constants";
import useApi from "../../../../../hooks/useApi";

const Student = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {callApi } = useApi();
  const {
    progressPercentage,
    attendanceRate,
    missedClasses,
    outstandings,
    nextClass,
    allResources,
    formatDateToDDMMYYYY
  } = useStudentData();

  const [announcements, setAnnouncements] = useState(null);

  useEffect(async() => {
    const response = await callApi(endpoints.ANNOUNCEMENT, "GET");
    if(response){
      setAnnouncements(response);
    }
  }, []);


  const progressData = [
    { title: "Course Progress", value: progressPercentage, details: "Current course completion" },
    { title: "Attendance Level", value: attendanceRate, details: "Attendance percentage" },
  ];


  const conBg = `${
    theme.palette.mode === "light" ? colors.blueAccent[800] : colors.greenAccent[600]
  } !important`;
const paymentProgress = 100 - outstandings.percentageDifference
  return (
    <Box
    >
      <RowGrid>
        {/* FIRST ROW */}
        <RowContainer>
          {progressData.map((progress, index) => (
            <ResponsiveContainer sm={6} md={3} key={index}>
              <DashboardDataBox>
                <Typography variant="h6" fontWeight="600" mb="5px">
                  {progress.title}
                </Typography>
                <ProgressCircle size="125" progress={progress.value} />
                <Typography variant="body2" mt="10px">
                  {progress.details}: {progress.value}%
                </Typography>
              </DashboardDataBox>
            </ResponsiveContainer>
          ))}

          <ResponsiveContainer sm={6} md={3}>
            <DashboardDataBox>
              <Typography variant="h6" fontWeight="600" mb="5px">
                Payment Rate ({parseInt(100 - outstandings.percentageDifference)}%)
              </Typography>
              <ProgressCircle
                size="125"
                progress={paymentProgress / 100}
              />
              <Typography variant="body2" mt="10px">
                Outstanding Payents: {outstandings.totalOutstanding}
              </Typography>
            </DashboardDataBox>
          </ResponsiveContainer>

          <ResponsiveContainer sm={6} md={3} >
            <DashboardDataBox noFlex>
              <Typography variant="h6" fontWeight="600" mb="5px">
                Next Class
              </Typography>
              {nextClass ? (
                <Box textAlign="center">
                  <SchoolIcon sx={{ fontSize: "30px", color: colors.blueAccent[400] }} />
                  <Typography variant="h6">{nextClass.topic}</Typography>
                  <Typography>{nextClass.date}</Typography>
                  <Typography>{nextClass.time}</Typography>
                  <Typography>Location: {nextClass.location}</Typography>
                </Box>
              ) : (
                <Typography>No upcoming lectures.</Typography>
              )}
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* SECOND ROW */}
        <RowContainer>
          <ResponsiveContainer md={8}>
            <DashboardDataBox height='350px' noFlex>
              <PerfromanceLineChart />
            </DashboardDataBox>
          </ResponsiveContainer>
          <ResponsiveContainer md={4}>
            <DashboardDataBox noFlex
            >
              <Typography variant="h5" fontWeight="600" mb="15px">
                Missed Schedules
              </Typography>
              {missedClasses.length > 0 ? (
                missedClasses.map((schedule) => (
                  <Card key={schedule.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
                      <Typography variant="h6">{schedule.topic}</Typography>
                      <Typography>{formatDateToDDMMYYYY(schedule.date)}</Typography>
                      <Typography>{schedule.time}</Typography>
                      <Typography>Location: {schedule.location}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>You attended all classes</Typography>
              )}
            </DashboardDataBox>
          </ResponsiveContainer>
        </RowContainer>

        {/* THIRD ROW */}
        <RowContainer>
        <ResponsiveContainer md={6}>
            <DashboardDataBox
              noFlex
              moreStyles={{
                height: '400px',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h5" fontWeight="600" mb="15px">
                Announcements
              </Typography>
              {announcements && announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <Card key={announcement.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Typography variant="body2">{announcement.message}</Typography>
                      <Typography variant="caption" color="gray">
                        {announcement.date}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No announcements available</Typography>
              )}
            </DashboardDataBox>
          </ResponsiveContainer>


          <ResponsiveContainer md={6} >
          <DashboardDataBox noFlex moreStyles={{ height: '400px', overflowY: 'auto' }}>
              <Typography variant="h5" fontWeight="600" mb="15px">
                Useful Resources
              </Typography>

              {allResources.length > 0 ? (
                allResources.map((res, i) => (
                  <Card key={i} sx={{ mb: 2 }}>
                    <CardContent sx={{ backgroundColor: conBg, textAlign: 'left' }}>
                      <Typography variant="h6">{res.title}</Typography>
                      <a href={res} target="_blank" rel="noopener noreferrer">
                        {res}
                      </a>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="h6" fontWeight="500" mb="15px">
                  No Resources Available
                </Typography>
              )}
            </DashboardDataBox>

          </ResponsiveContainer>
        </RowContainer>
      </RowGrid>
    </Box>
  );
};

export default Student;
