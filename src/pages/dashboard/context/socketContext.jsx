import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import socket.io-client

// Create WebSocket Context
const WebSocketContext = createContext();

// WebSocket Provider
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // State to hold the socket connection

  useEffect(() => {
    // Establish socket connection when the provider is mounted
    const socketConnection = io("ws://localhost:4000", {
      cors: {
        origin: "http://localhost:5174", // Your React frontend URL
        credentials: true,
      },
    });

    // Save socket connection to state
    setSocket(socketConnection);

    // Cleanup function when the provider unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
