// components/Dashboard.jsx
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
import ActionButton from '../../components/actionButton';

const Component = ({ home }) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useSelector((state) => state.users.user);

  // Fallback if user is not loaded
  if (!user || !user.firstName) {
    return (
      <Box>
        <Typography>Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header home title={user.firstName} subtitle="Welcome to your dashboard" />
        <Box sx={{ display: 'flex', gap: '10px' }}>
          {/* Admin-specific buttons */}
          {user.role === 'admin' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <ActionButton
                icon={<DownloadOutlinedIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Download Reports"
              />
              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Make announcement"
                onClick={() => setOpenAnnouncementModal(true)}
              />
            </Box>
          )}

          {/* Teacher-specific buttons */}
          {user.role === 'teacher' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Make announcement"
                onClick={() => setOpenAnnouncementModal(true)}
              />
              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Submit Feedback"
                onClick={() => setOpenFeedbackModal(true)}
              />
              <Box>
                <Rating sx={{ fontSize: { xs: '1em', sm: '1.2em' } }} value={user.rating} readOnly precision={0.1} />
                <Typography variant="h6" sx={{ fontSize: { xs: '0.8em', sm: '1em' } }}>
                  Rating: {user.rating}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Student-specific buttons */}
          {user.role === 'student' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <ActionButton
                icon={<AnnouncementIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' } }} />}
                content="Submit Feedback"
                onClick={() => setOpenFeedbackModal(true)}
              />
            </Box>
          )}

          {/* Announcement and Feedback modals */}
          <MakeAnnouncement
            openAnnouncementModal={openAnnouncementModal}
            setModalOpen={setOpenAnnouncementModal}
          />
          <SubmitFeedback
            openFeedbackModal={openFeedbackModal}
            setModalOpen={setOpenFeedbackModal}
          />
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {user.role === 'admin' || user.role === 'superadmin' ? (
        <Admin user={user} />
      ) : user.role === 'student' ? (
        <Student user={user} />
      ) : user.role === 'teacher' ? (
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