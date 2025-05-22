import { Box, useTheme, Rating, Typography } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header';
import Admin from './admin';
import Student from './student';
import Instructor from './instructor';
import { useSelector } from 'react-redux';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';
import { useState } from 'react';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { MakeAnnouncement, SubmitFeedback } from './modals';
import ActionButton from '../../components/actionButton'; // Import the ActionButton component

const Component = ({home}) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);
  const [openAnouncementModal, setOpenAnouncementModal] = useState(false);

  return (
    <Box >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header home title={user.firstName} subtitle="Welcome to your Beks virtual learning dashboard" />
        <Box sx={{ display: 'flex' }}>
          {user.role === 'superadmin' && (
            <Box 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // Column layout on small and medium screens, row on larger screens
                alignItems: 'center',  // Align center
                justifyContent: 'center',  // Justify center
                gap: '10px', // Optional: Adds some space between items
              }}
            >
              <ActionButton
                icon={<DownloadOutlinedIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Download Reports"
              />

              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Make announcement"
                onClick={() => setOpenAnouncementModal(true)}
              />

              {/* Make Announcement modal */}
              <MakeAnnouncement
                openAnnoucementModal={openAnouncementModal}
                setModalOpen={setOpenAnouncementModal}
              />
            </Box>
          )}

          {/* student feedbacks button */}
          {user.role === ('student' || 'admin' || 'instructor') && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // Column layout on small and medium screens, row on larger screens
                alignItems: 'center',  // Align center
                justifyContent: 'center',  // Justify center
                gap: '10px', // Optional: Adds some space between items
              }}
            >
              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px' } }} />}
                content="Submit Feedback"
                onClick={() => setOpenFeedbackModal(true)}
              />
              
              {/* send feedback modal */}
              <SubmitFeedback
                openFeedbackModal={openFeedbackModal}
                setModalOpen={setOpenFeedbackModal}
              />
            </Box>
          )}

          {user.role === 'instructor' && (
            <Box>
              <Rating sx={{ fontSize: { xs: '1em', sm: '1.2em' } }} value={user.rating} readOnly precision={0.1} />
              <Typography variant="h6" sx={{ fontSize: { xs: '0.8em', sm: '1em' } }}>
                Rating: {user.rating}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {user.role === 'admin' || user.role === 'superadmin' ? (
        <Admin user={user} />
      ) : user.role === 'student' ? (
        <Student user={user} />
      ) : user.role === 'instructor' ? (
        <Instructor user={user} />
      ) : null}
    </Box>
  );
};

const MainComponent = withDashboardWrapper(Component);

const Dashboard = () => {
  return (
    <div>
      <MainComponent home />
    </div>
  );
};

export default Dashboard;
