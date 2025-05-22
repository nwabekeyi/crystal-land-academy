import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  saveMessage, 
  isDBFull, 
  removeOldestMessage, 
  getMessagesFromIndexedDB, 
  updateDeliveredToIndexedDB,
  updateChatroomDeliveredTo,
  updateChatroomReadby
} from '../../utils/indexedDBService';

// Thunk for loading messages from IndexedDB
export const loadMessagesFromIndexedDB = createAsyncThunk(
  'message/loadFromIndexedDB',
  async (payload) => {
    try {
      const messages = await getMessagesFromIndexedDB(payload.dbName, payload.storeName, payload.chatroomName);
      return { chatroomName: payload.chatroomName, messages }; // Return chatroom name and messages
    } catch (error) {
      console.error('Failed to load messages from IndexedDB:', error);
      return { error: error.message };
    }
  }
);

// Thunk to update the readBy array in IndexedDB
export const updateChatroomReadbyThunk = createAsyncThunk(
  'chatroom/updateChatroomReadby',
  async ({ chatroomName, messageId, recipientDetails}, { rejectWithValue }) => {
    try {
      // Call the function to update the readBy array
      await updateChatroomReadby(chatroomName, messageId, recipientDetails);
    } catch (error) {
      // Reject the thunk in case of an error
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update the deliveredTo array in IndexedDB
export const updateChatroomDeliveredToThunk = createAsyncThunk(
  'chatroom/updateChatroomDeliveredTo',
  async ({ chatroomName, messageId, recipientDetails }, { rejectWithValue }) => {
    try {
      // Call the function to update the deliveredTo array
      await updateChatroomDeliveredTo(chatroomName, messageId, recipientDetails);
    } catch (error) {
      // Reject the thunk in case of an error
      return rejectWithValue(error.message);
    }
  }
);

export const updateDeliveredToDB = createAsyncThunk(
  'message/updateDeliveredTo',
  async ({ chatroomName, messageId, recipientDetails }, { rejectWithValue }) => {
    try {
      console.log('called update thunk');
      // Ensure that you await the promise resolution from `updateDeliveredToIndexedDB`
      const updatedDeliveredTo = await updateDeliveredToIndexedDB(chatroomName, messageId, recipientDetails);

      // Return the resolved value, not the Promise
      return { chatroomName, messageId, updatedDeliveredTo };
    } catch (error) {
      console.error('Failed to update deliveredTo:', error);
      return rejectWithValue({ error: error.message });
    }
  }
);


// Thunk for saving messages to IndexedDB
const saveMessageToIndexedDB = createAsyncThunk(
  'message/saveToIndexedDB',
  async (payload, { rejectWithValue }) => {
    const { chatroomName, message } = payload;
    console.log(chatroomName);

    try {
      await saveMessage(chatroomName, message);
      return { success: true, chatroomName, message }; // Removed `storeName` as it wasn't passed
    } catch (error) {
      console.error('Failed to save message to IndexedDB:', error);
      return rejectWithValue({ error: error.message });
    }
  }
);


// Thunk for checking DB fullness and saving the message
export const checkDBFullnessAndSave = createAsyncThunk(
  'message/checkDBFullnessAndSave',
  async (payload, { dispatch }) => {
    const { storeName, chatroomName, message } = payload;

    try {
      const isFull = await isDBFull(storeName);
      if (isFull) {
        await removeOldestMessage(storeName);
      }

      // Pass the payload as a single object to saveMessageToIndexedDB
      return await dispatch(saveMessageToIndexedDB({ chatroomName, message }));
    } catch (error) {
      console.error('Error in checkDBFullnessAndSave:', error);
      throw error;
    }
  }
);


const initialState = {
  privateMessages: [],
  chatroomMessages: {}, // This will store chatroom messages
  messageLoading: false,
  error: null,
  chatrooms: [],
  unreadChatroomMessages: [],
  replyToMessage: null, // Initial state for replyToMessage
  selectedView: null, // Initial state for selectedView
  message: null, // Initial state for single message
  messages: [] // Initial state for multiple messages
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addPrivateMessage: (state, action) => {
      state.privateMessages.push(action.payload);
    },

    addChatroomMessages: (state, action) => {
      const { chatroomName, messages } = action.payload;
      if (state.chatroomMessages[chatroomName]) {
        state.chatroomMessages[chatroomName] = [
          ...state.chatroomMessages[chatroomName],
          ...messages,
        ];
      } else {
        state.chatroomMessages[chatroomName] = messages;
      }

      console.log('Added chatroom messages for:', chatroomName, messages);
    },

    addChatroomMessage: (state, action) => {
      const { chatroomName, message } = action.payload;
      state.messageLoading = true;
      console.log(message)

      if (!state.chatroomMessages[chatroomName]) {
        state.chatroomMessages[chatroomName] = [];
      }
      state.chatroomMessages[chatroomName].push(message);
    },


     // New reducer to push recipientDetails into the deliveredTo array
     updateDeliveredTo: (state, action) => {
      const { chatroomName, messageId, recipientDetails } = action.payload;
      console.log(recipientDetails);

      const data = { chatroomName, messageId, recipientDetails }

      // Find the message by messageId (_id) in the given chatroom
      const messages = state.chatroomMessages[chatroomName];
      if (messages) {
        const messageIndex = messages.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          // Push recipientDetails into the deliveredTo array for the found message
          state.chatroomMessages[chatroomName][messageIndex].deliveredTo.push(recipientDetails);
        }
      }
    },

    // New reducer to push recipientDetails into the readBy array
    updateReadby: (state, action) => {
      const { chatroomName, messageId, recipientDetails} = action.payload;
      console.log(recipientDetails);

      const data = { chatroomName, messageId, recipientDetails}

      // Find the message by messageId (_id) in the given chatroom
      const messages = state.chatroomMessages[chatroomName];
      if (messages) {
        const messageIndex = messages.findIndex(msg => msg._id === messageId);
        if (messageIndex !== -1) {
          // Push recipientDetails into the deliveredTo array for the found message
          state.chatroomMessages[chatroomName][messageIndex].readBy.push(recipientDetails);
        }
      }
    },

    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    },
    // New reducers for managing chatrooms
    setAdminChatrooms: (state, action) => {
      state.chatrooms = action.payload; // Set chatrooms from an external source
    },

    // New reducer to set unread chatroom messages
    setUnreadChatroomMessages: (state, action) => {
       state.unreadChatroomMessages = action.payload;
        },

    addChatroom: (state, action) => {
      state.chatrooms.push(action.payload); // Add a new chatroom to the list
    },

    // New reducer for setting replyToMessage
    setReplyToMessage: (state, action) => {
      state.replyToMessage = action.payload;
    },

    // New reducer for setting selectedView
    setSelectedView: (state, action) => {
      state.selectedView = action.payload;
    },

    // New reducer for setting a single message
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    // New reducer for setting multiple messages
    setMessages: (state, action) => {
      if (typeof action.payload === 'function') {
        // If payload is a function, apply it to the current state.messages
        state.messages = action.payload(state.messages);
      } else {
        // If payload is a value (e.g., an array), set it directly
        state.messages = action.payload;
      }
    },

    
    // Rest of the reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveMessageToIndexedDB.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(saveMessageToIndexedDB.fulfilled, (state) => {
        state.messageLoading = false;
      })
      .addCase(saveMessageToIndexedDB.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload.error;
      })
      .addCase(loadMessagesFromIndexedDB.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(loadMessagesFromIndexedDB.fulfilled, (state, action) => {
        state.messageLoading = false;
        const { chatroomName, messages } = action.payload;
        state.chatroomMessages[chatroomName] = messages;
      })
      .addCase(loadMessagesFromIndexedDB.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload.error;
      });
  },
});

// Export the actions for the newly added reducers
export const {
  addPrivateMessage,
  addChatroomMessages,
  addChatroomMessage,
  setMessageLoading,
  updateDeliveredTo,
  addChatroom,
  setAdminChatrooms,
  setUnreadChatroomMessages,
  updateReadby,
  setReplyToMessage,
  setSelectedView,
  setMessage,
  setMessages
} = messageSlice.actions;

// Export the reducer
export default messageSlice.reducer;
