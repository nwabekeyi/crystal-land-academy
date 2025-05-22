import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markNotificationAsRead, removeNotification, markAllAsRead } from '../../../reduxStore/slices/notificationSlice'; 
import { Box, Typography, IconButton, Popover, useTheme, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColorModeContext, tokens } from '../theme';
import Modal from './modal'; 

const NotificationsPopover = ({ anchorEl, handleClose, userId, role }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications); 
  const unreadCount = useSelector((state) => state.notifications.unreadCount); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const open = Boolean(anchorEl); 

  // State for modal open/close and selected notification
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Handle clicking on a notification
  const handleNotificationClick = (notification) => {
    console.log(notification.id)
    if (!notification.readStatus) {
      dispatch(markNotificationAsRead({ 
        notificationId: notification.id, 
        userId,
        userRole: role, 
      }));
    }
    // Set the selected notification and open the modal
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNotification(null);
  };

  // Handle deleting a notification
  const handleDeleteNotification = (id) => {
    dispatch(removeNotification(id)); 
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead()); 
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: { width: '30vw', padding: '10px' }, 
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>

          {notifications.length === 0 ? (
            <Typography variant="body2">No notifications available</Typography>
          ) : (
            <>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    button
                    onClick={() => handleNotificationClick(notification)} 
                    style={{
                      backgroundColor: notification.readStatus ? colors.grey[300] : colors.primary[400],
                      borderRadius: '8px',
                      marginBottom: '8px',
                      position: 'relative',
                    }}
                  >
                    {!notification.readStatus && (
                      <Box
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: colors.redAccent[500], 
                          borderRadius: '50%',
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    )}

                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.timestamp).toLocaleString()} 
                      style={{ paddingLeft: notification.readStatus ? '0px' : '20px' }} 
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteNotification(notification.id)} 
                      >
                        <DeleteIcon style={{ color: colors.redAccent[500] }} /> 
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {unreadCount > 0 && (
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                  You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}.
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleMarkAllAsRead} 
                fullWidth
                style={{
                  marginTop: '10px',
                  backgroundColor: colors.blueAccent[500], 
                  color: colors.grey[900], 
                }}
              >
                Mark All as Read
              </Button>
            </>
          )}
        </Box>
      </Popover>

      {/* Modal to display notification details */}
      {selectedNotification && (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          title="Notification Details"
          styleProps={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
          noConfirm
        >
          <Typography variant="body1">{selectedNotification.message}</Typography>
          <Typography variant="body2" color="textSecondary">
            Timestamp: {new Date(selectedNotification.timestamp).toLocaleString()}
          </Typography>
          {selectedNotification.actionLink && (
            <Button
              variant="contained"
              color="primary"
              href={selectedNotification.actionLink}
              target="_blank"
              style={{ marginTop: '10px' }}
            >
              View Details
            </Button>
          )}
        </Modal>
      )}
    </>
  );
};

export default NotificationsPopover;
