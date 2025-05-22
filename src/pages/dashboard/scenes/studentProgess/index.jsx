import React from "react";
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useStudentData from "../dashboard/student/useStudentData"; // Import your custom hook
import withDashboardWrapper from "../../../../components/dasboardPagesContainer";

const StudentProgress = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Get the student progress data from the custom hook
  const { completedCourses, remainingCourses, progressPercentage } = useStudentData();
  console.log({ completedCourses, remainingCourses, progressPercentage })
  return (
    <Box>
      <Header title="Student Progress" subtitle="Track Your Learning Progress" />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        backgroundColor={colors.primary[400]}
        p="20px"
        borderRadius="4px"
      >
        <Box gridColumn="span 12" mb="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Progress Overview
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: "10px",
              borderRadius: "5px",
              mt: "10px",
              backgroundColor: colors.primary[300],
              "& .MuiLinearProgress-bar": { backgroundColor: colors.greenAccent[500] },
            }}
          />
          <Typography variant="h6" mt="10px">
            Completion Level: {progressPercentage.toFixed(2)}%
          </Typography>
        </Box>

        <Box gridColumn="span 6">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Topics Covered
          </Typography>
          {completedCourses.length > 0 ? (
            completedCourses.map((course, index) => (
              <Typography key={index} mb="10px">
                - {course.topic}
              </Typography>
            ))
          ) : (
            <Typography>No topics completed yet.</Typography>
          )}
        </Box>

        <Box gridColumn="span 6">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Remaining Topics to Cover
          </Typography>
          {remainingCourses.length > 0 ? (
            remainingCourses.map((course, index) => (
              <Typography key={index} mb="10px">
                - {course.topic}
              </Typography>
            ))
          ) : (
            <Typography>All topics are covered.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default withDashboardWrapper(StudentProgress);
