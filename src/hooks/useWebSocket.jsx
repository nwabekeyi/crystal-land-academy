import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatroomMessage, updateDeliveredTo } from '../reduxStore/slices/messageSlice';
import io from 'socket.io-client';
import {
  checkDBFullnessAndSave,
  updateDeliveredToDB,
  updateReadby,
  updateChatroomReadbyThunk
} from '../reduxStore/slices/messageSlice';
import { createSelector } from 'reselect';

const selectUnreadMessages = createSelector(
  (state) => state.message.unreadChatroomMessages,
  (unreadChatroomMessages) => unreadChatroomMessages
);

const useWebSocket = (actionToSend = null) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userId, role, profilePictureUrl, lastName, firstName } = useSelector((state) => state.users.user) || {};
  const dispatch = useDispatch();
  const chatroomNames = useSelector((state) => state.message.chatrooms);
  const unreadMessages = useSelector(selectUnreadMessages);
  console.log(unreadMessages.length)

  // Memoize recipientDetails to prevent unnecessary re-renders
  const recipientDetails = useMemo(() => ({
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    profilePictureUrl: profilePictureUrl,
  }), [userId, firstName, lastName, profilePictureUrl]);

  // Initialize socket connection and event listeners
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(import.meta.env.VITE_MESSAGING_ENDPOINT, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Handle 'chatroom message' event
      const handleChatroomMessage = ({ chatroomName, message }) => {
        console.log('Message received:', message);
        dispatch(checkDBFullnessAndSave({
          storeName: 'ChatroomMessages',
          chatroomName: chatroomName,
          message: message,
        }));
        dispatch(addChatroomMessage({ chatroomName, message }));

        // Emit deliveredTo event to notify the other client
        socket.current.emit('chatroomMessage deliveredTo', { chatroomName, recipientDetails, messageId: message._id, senderId: message.sender.id });
      };

      socket.current.on('chatroom message', handleChatroomMessage);

      // Handle 'delivered to' event
      const handleDeliveredTo = async ({ chatroomName, messageId, recipientDetails }) => {
        console.log('Message delivered to:', recipientDetails);
        const resolvedRecipientDetails = await recipientDetails;

        dispatch(updateDeliveredTo({
          chatroomName,
          messageId,
          recipientDetails: resolvedRecipientDetails,
        }));

        dispatch(updateDeliveredToDB({
          chatroomName,
          messageId,
          recipientDetails: resolvedRecipientDetails,
        }));
      };

      socket.current.on('chatroomMessage delivered', handleDeliveredTo);

      // Handle 'connect' event
      socket.current.on('connect', () => {
        setIsConnected(true);
        console.log('Socket Connected:', socket.current.id);
        if (userId && role) {
          socket.current.emit('userConnect', { userId, userRole: role });
        }
        if (actionToSend) {
          socket.current.emit('sendMessage', actionToSend);
        }
      });

      // Handle 'disconnect' event
      socket.current.on('disconnect', (reason) => {
        console.log('Socket disconnected due to', reason);
        setIsConnected(false);
      });

      

      return () => {
        if (socket.current) {
          socket.current.off('chatroom message', handleChatroomMessage);
          socket.current.off('chatroomMessage delivered', handleDeliveredTo);
          socket.current.disconnect();
          console.log('Socket disconnected and cleaned up');
        }
      };
    }
  }, [userId, role, actionToSend, dispatch, recipientDetails]);

  //request for offline readby and deliveredTo array
  // useEffect(() => {
  //   chatroomNames.forEach((chatroomName) => {

  //   })
  // }, [])

  // Handle message read logic
  useEffect(() => {
    const handleMessageRead = ({ chatroomName, messageId, recipientDetails }) => {
        console.log(recipientDetails )
      dispatch(updateReadby({ chatroomName, messageId, recipientDetails }));
      dispatch(updateChatroomReadbyThunk({ chatroomName, messageId, recipientDetails }));
    };

    socket.current.on('messageRead', handleMessageRead);

    return () => {
      socket.current.off('messageRead', handleMessageRead);
    };
  }, []);

  // Fetch undelivered messages when chatroomNames are populated
  useEffect(() => {
    if (isConnected && chatroomNames.length > 0 && recipientDetails.userId) {
      console.log('Fetching undelivered messages for chatrooms:', chatroomNames);
      socket.current.emit('get undelivered chatroomMessages', { chatroomNames, recipientDetails });
    }
  }, [chatroomNames, recipientDetails, isConnected]);


  // Emit function for socket events
  const emit = (event, messageBody) => {
    if (socket.current && isConnected) {
      socket.current.emit(event, messageBody);
    } else {
      console.error('WebSocket is not connected or ready.');
    }
  };

  // Listen function for socket events
  const listen = useCallback((event, handler) => {
    if (socket.current) {
      socket.current.on(event, (messageData) => {
        console.log('Message received in listen:', messageData);
        handler(messageData);
      });
      return () => {
        if (socket.current) {
          socket.current.off(event, handler);
        }
      };
    } else {
      console.error('Socket is not initialized.');
      return () => {};
    }
  }, []);

  return { emit, isConnected, listen };
};

export default useWebSocket;
