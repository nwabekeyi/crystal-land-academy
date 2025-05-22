import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage
import { combineReducers } from 'redux';
// import logger from 'redux-logger'; // Import redux-logger
import adminDataReducer from './slices/adminDataSlice';
import messageReducer from './slices/messageSlice';
import streamReducer from './slices/videoCallSlice';
import apiCallCheckReducer from './slices/apiCallCheck';
import notificationReducer from './slices/notificationSlice';
import studentReducer from './slices/studentdataSlice';



// Persist config for other slices that use sessionStorage
const persistConfig = {
  key: 'root',
  storage: sessionStorage, // Using sessionStorage for other slices
  whitelist: ['users', 'adminData', 'apiCallCheck'], // Only persist these slices in sessionStorage
};

// Combine reducers
const rootReducer = combineReducers({
  users: usersReducer,
  ui: uiReducer,
  adminData: adminDataReducer,
  message: messageReducer,
  stream: streamReducer,
  apiCallCheck: apiCallCheckReducer,
  notifications: notificationReducer,
  student: studentReducer,
});

// Wrap reducers with persistReducer for sessionStorage
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }) // Add redux-logger
});

const persistor = persistStore(store); // Create persistor

export { store, persistor };
