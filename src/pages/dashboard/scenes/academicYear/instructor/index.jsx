import { Box, Typography, List, Paper, Avatar, useTheme } from "@mui/material";
import useInstructorCourse from "./useIntructorCourse";
import Header from "../../../components/Header";
import { tokens } from '../../../theme';
import Loader from "../../../../../utils/loader"; // Assuming you have a Loader component

const Instructors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    courseDuration,
    courseName,
    curriculum,
    loading // Capture the loading state here
  } = useInstructorCourse();

  return (
    <Box >
      <Header
        title={courseName || "Course Name"} // Fallback to default text if courseName is undefined
        subtitle={`${courseDuration || 0} months`} // Fallback for courseDuration
      />

      {/* Show loader if data is being fetched */}
      {loading ? (
        <Loader /> // Ensure Loader is a valid component rendering JSX
      ) : (
        // If the curriculum is available, display the mapped content
        curriculum && curriculum.length > 0 ? (
          <Box >
            <Typography variant="h2" gutterBottom>
              Curriculum
            </Typography>

            <Box sx={{ width: '100%',  }}>
              {curriculum.map((item, index) => (
                <Paper
                  key={item._id || index} // Provide a valid key, fallback to index if _id is missing
                  elevation={3}
                  sx={{
                    backgroundColor : colors.primary[400], color: colors.blueAccent[500],
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    borderRadius: '12px',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Avatar with index number */}
                  <Avatar
                    sx={{
                      bgcolor: colors.primary[500],
                      width: 40,
                      height: 40,
                      fontSize: '18px',
                      color: 'white'
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  <Box>
                    <Typography variant="h3"   sx={{color: colors.blueAccent[200]}}>
                      {item.topic || "No topic available"} {/* Ensure item.topic exists */}
                    </Typography>

                    <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                      {item.description || "No description available"} {/* Ensure item.description exists */}
                    </Typography>

                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      Duration: {item.duration || "Unknown"} {/* Ensure item.duration exists */}
                    </Typography>

                    <Typography variant="h6" sx={{color: colors.blueAccent[200]}}>
                      Resources: {Array.isArray(item.resources) ? item.resources.join(', ') : "No resources available"}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ) : (
          // If no curriculum is available, show a message
          <Typography variant="body1" color="textSecondary">
            No curriculum available.
          </Typography>
        )
      )}
    </Box>
  );
};

export default Instructors;
