import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage
import { combineReducers } from 'redux';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';
import adminDataReducer from './slices/adminDataSlice';
import messageReducer from './slices/messageSlice';
import apiCallCheckReducer from './slices/apiCallCheck';
import notificationReducer from './slices/notificationSlice';
import studentReducer from './slices/studentdataSlice';
import enquiriesReducer from './slices/enquiriesSlice'; // Import enquiries slice

// Persist config for other slices that use sessionStorage
const persistConfig = {
  key: 'root',
  storage: sessionStorage, // Using sessionStorage for other slices
  whitelist: ['users', 'adminData', 'apiCallCheck', 'enquiries'], // Add enquiries to the whitelist
};

// Combine reducers
const rootReducer = combineReducers({
  users: usersReducer,
  ui: uiReducer,
  adminData: adminDataReducer,
  message: messageReducer,
  apiCallCheck: apiCallCheckReducer,
  notifications: notificationReducer,
  student: studentReducer,
  enquiries: enquiriesReducer, // Add enquiries reducer
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
    }),
});

const persistor = persistStore(store); // Create persistor

export { store, persistor };